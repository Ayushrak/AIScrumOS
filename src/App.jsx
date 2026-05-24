import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import DemoSimulator from "./components/DemoSimulator";
import DashboardOverview from "./components/DashboardOverview";
import DigitalTwinGraph from "./components/DigitalTwinGraph";
import SilentBlockers from "./components/SilentBlockers";
import StandupMeetings from "./components/StandupMeetings";
import MemorySystem from "./components/MemorySystem";
import TechDebt from "./components/TechDebt";
import TeamWellness from "./components/TeamWellness";
import RetroGenerator from "./components/RetroGenerator";
import { initialData, simulatorSteps, memoryDatabase } from "./mockData";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
const WS_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000/ws/events";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentStep, setStep] = useState(1);
  const [voiceStandup, setVoiceStandup] = useState(null);
  const [sprintData, setSprintData] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsLogs, setWsLogs] = useState([]);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const wsRef = useRef(null);

  // ─── Try connecting to backend on mount ───
  useEffect(() => {
    fetch(`${API_BASE}/api/sprint-data`)
      .then((res) => res.json())
      .then((data) => {
        setSprintData(data);
        setBackendAvailable(true);
      })
      .catch(() => {
        setBackendAvailable(false);
      });
  }, []);

  // ─── WebSocket connection ───
  useEffect(() => {
    if (!backendAvailable) return;

    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        setWsLogs((prev) => [`[WS] Connected to ScrumOS API server`, ...prev].slice(0, 20));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.sprint_data) {
            setSprintData(msg.sprint_data);
          }
          if (msg.log) {
            setWsLogs((prev) => [`[WS] ${msg.log}`, ...prev].slice(0, 20));
          }
        } catch (e) {
          // Ignore parse errors
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        // Auto-reconnect after 3 seconds
        setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [backendAvailable]);

  // ─── Step change handler ───
  const handleSetStep = useCallback(
    async (step) => {
      setStep(step);
      if (backendAvailable) {
        try {
          const res = await fetch(`${API_BASE}/api/simulator/step`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ step }),
          });
          const result = await res.json();
          if (result.data) {
            setSprintData(result.data);
          }
        } catch {
          // Fall back to local state processing
        }
      }
    },
    [backendAvailable]
  );

  // ─── Reset handler ───
  const handleReset = useCallback(async () => {
    setStep(1);
    setVoiceStandup(null);
    if (backendAvailable) {
      try {
        const res = await fetch(`${API_BASE}/api/simulator/reset`, {
          method: "POST",
        });
        const result = await res.json();
        if (result.data) {
          setSprintData(result.data);
        }
      } catch {
        // Fall back
      }
    }
  }, [backendAvailable]);

  // ─── Voice standup handler ───
  const addVoiceStandup = useCallback(
    async (newStandup) => {
      setVoiceStandup(newStandup);
      if (backendAvailable) {
        try {
          const res = await fetch(`${API_BASE}/api/standup/voice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStandup),
          });
          const result = await res.json();
          if (result.data) {
            setSprintData(result.data);
          }
        } catch {
          // Fall back
        }
      }
    },
    [backendAvailable]
  );

  // ─── Fallback: local state computation when backend is unavailable ───
  const getLocalDbForStep = (step) => {
    let state = JSON.parse(JSON.stringify(initialData));
    for (let i = 0; i < step; i++) {
      if (simulatorSteps[i] && simulatorSteps[i].changes) {
        state = simulatorSteps[i].changes(state);
      }
    }
    if (voiceStandup) {
      const exists = state.standups.some(
        (s) => s.developer === voiceStandup.developer
      );
      if (!exists) {
        state.standups = [voiceStandup, ...state.standups];
      }
    }
    return state;
  };

  // Use backend data if available, otherwise compute locally
  const currentDb =
    backendAvailable && sprintData ? sprintData : getLocalDbForStep(currentStep);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview data={currentDb} />;
      case "digital-twin":
        return <DigitalTwinGraph data={currentDb} />;
      case "silent-blockers":
        return <SilentBlockers data={currentDb} />;
      case "standups":
        return (
          <StandupMeetings data={currentDb} updateStandups={addVoiceStandup} />
        );
      case "memory":
        return <MemorySystem backendAvailable={backendAvailable} />;
      case "tech-debt":
        return <TechDebt data={currentDb} />;
      case "retro":
        return <RetroGenerator />;
      case "wellness":
        return <TeamWellness data={currentDb} />;
      default:
        return <DashboardOverview data={currentDb} />;
    }
  };

  const getHeaderMeta = () => {
    switch (activeTab) {
      case "dashboard":
        return {
          title: "ScrumOS Overview Dashboard",
          subtitle:
            "Live predictions, sprint scores, and event logging streams.",
        };
      case "digital-twin":
        return {
          title: "Digital Twin & Dependency Chaos Mapper",
          subtitle:
            "Audit relationship nodes and critical software delivery paths.",
        };
      case "silent-blockers":
        return {
          title: "Silent Blocker Detector",
          subtitle: "AI patterns analysis on repeated local build halts.",
        };
      case "standups":
        return {
          title: "Automated Standups & Meeting Sync",
          subtitle:
            "Speech-to-text integration and meeting transcription decoders.",
        };
      case "memory":
        return {
          title: "Engineering Memory System",
          subtitle:
            "RAG temporal query console search over org knowledge histories.",
        };
      case "tech-debt":
        return {
          title: "AI Technical Debt Radar",
          subtitle:
            "Identify risky repository folders and bus factor bottleneck components.",
        };
      case "retro":
        return {
          title: "Autonomous Retrospective Generator",
          subtitle:
            "Sprint-end review with AI-generated insights and action plans.",
        };
      case "wellness":
        return {
          title: "Team Wellness Optimizer",
          subtitle:
            "Observe context switching indexes and workload ratios ethically.",
        };
      default:
        return {
          title: "AI ScrumOS Dashboard",
          subtitle: "An AI-native Engineering Operating System.",
        };
    }
  };

  const { title, subtitle } = getHeaderMeta();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel Content */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <div className="header-meta">
            {backendAvailable ? (
              <span
                style={{
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  className="status-dot pulsate"
                  style={{
                    background: wsConnected
                      ? "var(--accent-emerald)"
                      : "var(--accent-amber)",
                    boxShadow: wsConnected
                      ? "0 0 8px var(--accent-emerald)"
                      : "0 0 8px var(--accent-amber)",
                  }}
                ></span>
                <span style={{ color: "var(--text-muted)" }}>
                  Backend API {wsConnected ? "& WebSocket" : "(HTTP only)"}{" "}
                  Connected
                </span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  className="status-dot"
                  style={{
                    background: "var(--accent-amber)",
                    boxShadow: "0 0 6px var(--accent-amber)",
                  }}
                ></span>
                <span style={{ color: "var(--text-muted)" }}>
                  Running in Local Simulation Mode
                </span>
              </span>
            )}
          </div>
        </header>

        {/* WebSocket log banner */}
        {backendAvailable && wsLogs.length > 0 && (
          <div
            className="notification-banner"
            style={{
              background: "rgba(6, 182, 212, 0.06)",
              borderColor: "rgba(6, 182, 212, 0.2)",
              boxShadow: "var(--glow-cyan)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ color: "var(--accent-cyan)" }}>
              {wsLogs[0]}
            </span>
          </div>
        )}

        {/* Feature Specific Content */}
        {renderActiveTabContent()}
      </main>

      {/* Interactive Hackathon Simulator Control Panel */}
      <DemoSimulator
        currentStep={currentStep}
        setStep={handleSetStep}
        resetSimulator={handleReset}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
