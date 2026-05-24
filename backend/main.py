import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from mock_agents import apply_step_updates, initial_data
from config import settings

app = FastAPI(title="AI ScrumOS Backend Server", version="1.0.0")

# Enable CORS dynamically for the React Dev Server / Production URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory state
state_db = {
    "current_step": 1,
    "voice_standup": None
}

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Handle broken connections gracefully
                pass

manager = ConnectionManager()

# Data models
class StepUpdate(BaseModel):
    step: int

class VoiceStandup(BaseModel):
    developer: str
    avatarColor: str
    yesterday: List[str]
    today: List[str]
    blockers: List[str]

class SearchQuery(BaseModel):
    query: str

def get_current_sprint_state():
    """Compiles the dynamic database for the current simulator step and injects voice standups"""
    data = apply_step_updates(state_db["current_step"])
    if state_db["voice_standup"]:
        # Avoid duplicate voice additions
        exists = any(s["developer"] == state_db["voice_standup"]["developer"] for s in data["standups"])
        if not exists:
            data["standups"].insert(0, state_db["voice_standup"])
    return data

@app.get("/api/sprint-data")
async def get_sprint_data():
    return get_current_sprint_state()

@app.post("/api/simulator/step")
async def set_simulator_step(payload: StepUpdate):
    step = payload.step
    if not (1 <= step <= 6):
        raise HTTPException(status_code=400, detail="Step must be between 1 and 6")
    
    state_db["current_step"] = step
    data = get_current_sprint_state()
    
    # Broadcast state change to all listening WebSocket clients
    await manager.broadcast({
        "event": "step_changed",
        "step": step,
        "sprint_data": data,
        "log": f"Simulator shifted to Step {step}"
    })
    return {"status": "success", "current_step": step, "data": data}

@app.post("/api/standup/voice")
async def add_voice_standup(payload: VoiceStandup):
    standup_dict = payload.model_dump()
    state_db["voice_standup"] = standup_dict
    
    data = get_current_sprint_state()
    
    # Broadcast new standup notification via WebSockets
    await manager.broadcast({
        "event": "voice_standup_synced",
        "standup": standup_dict,
        "sprint_data": data,
        "log": "Voice standup synced and loaded into Jira/Slack"
    })
    return {"status": "success", "standup": standup_dict, "data": data}

@app.post("/api/search-memory")
async def search_memory(payload: SearchQuery):
    query_text = payload.query.lower()
    
    # Search memory database
    match = None
    for item in initial_data["memoryDatabase"]:
        if item["query"].lower() in query_text or query_text in item["query"].lower():
            match = item
            break
            
    if match:
        return match
    else:
        return {
            "query": payload.query,
            "answer": f"No specific records found in historical sprint indexes. Checking raw git histories for '{payload.query}' returned 0 matching revisions. Try querying 'PostgreSQL migration' or 'S3 attachments timeout'.",
            "sources": {
                "slack": "No match found",
                "jira": "None",
                "pr": "None",
                "retros": "None"
            }
        }

@app.post("/api/simulator/reset")
async def reset_simulator():
    state_db["current_step"] = 1
    state_db["voice_standup"] = None
    data = get_current_sprint_state()
    
    await manager.broadcast({
        "event": "reset",
        "sprint_data": data,
        "log": "Simulator state reset"
    })
    return {"status": "success", "data": data}

# WebSocket route
@app.websocket("/ws/events")
async def websocket_events(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Keep connection open and send connection handshake
        await websocket.send_json({"event": "connected", "log": "WebSocket channel connected to ScrumOS API server"})
        while True:
            # Receive data if client sends anything (keep-alive)
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
