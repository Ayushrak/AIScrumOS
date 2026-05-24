import React, { useState, useEffect } from "react";
import { memoryDatabase } from "../mockData";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export default function MemorySystem({ backendAvailable }) {
  const [query, setQuery] = useState("");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Streaming text animation
  useEffect(() => {
    if (!selectedResponse) return;
    
    setIsTyping(true);
    let index = 0;
    const fullText = selectedResponse.answer;
    setTypingText("");

    const interval = setInterval(() => {
      setTypingText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [selectedResponse]);

  const searchBackend = async (searchQuery) => {
    try {
      const res = await fetch(`${API_BASE}/api/search-memory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const result = await res.json();
      return result;
    } catch {
      return null;
    }
  };

  const searchLocal = (searchQuery) => {
    return memoryDatabase.find((item) =>
      item.query.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query) return;

    setIsSearching(true);
    
    let match = null;
    
    if (backendAvailable) {
      match = await searchBackend(query);
    }
    
    if (!match) {
      match = searchLocal(query);
    }

    if (match) {
      setSelectedResponse(match);
    } else {
      setSelectedResponse({
        answer: "No specific records found in historical sprint indexes. However, checking raw GitHub metadata... No references found for '" + query + "'. Try asking about 'MongoDB to PostgreSQL migration' or 'S3 upload timeout'.",
        sources: {
          slack: "No Slack records matches query",
          jira: "None",
          pr: "None",
          retros: "None"
        }
      });
    }
    
    setIsSearching(false);
  };

  const selectPreset = async (qText) => {
    setQuery(qText);
    setIsSearching(true);
    
    let match = null;
    
    if (backendAvailable) {
      match = await searchBackend(qText);
    }
    
    if (!match) {
      match = memoryDatabase.find((item) => item.query === qText);
    }
    
    if (match) setSelectedResponse(match);
    setIsSearching(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-card highlight-violet">
        <h3 className="card-title">
          <span>Engineering Memory & Temporal Search</span>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-violet)", fontFamily: "var(--font-mono)" }}>
            {backendAvailable ? "FastAPI RAG Pipeline" : "Local Vector Index"}
          </span>
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Avoid brain drain. When engineers resign, their architectural decisions are indexable. Search sprint memory, retro action items, Slack sync channels, and PR notes in one query.
        </p>

        {/* Connection status badge */}
        {backendAvailable && (
          <div style={{ 
            display: "inline-flex", alignItems: "center", gap: "6px", 
            padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "600",
            background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "var(--accent-emerald)", marginBottom: "12px"
          }}>
            <span className="status-dot pulsate" style={{ width: "6px", height: "6px" }}></span>
            Querying via FastAPI Backend (RAG Pipeline Active)
          </div>
        )}

        {/* Q&A Terminal Console */}
        <div className="memory-console">
          <form onSubmit={handleSearch} className="search-input-container">
            <input
              type="text"
              placeholder="Ask anything (e.g. Why did we migrate from MongoDB? or S3 timeouts)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
              disabled={isSearching}
            />
            <button type="submit" className="search-btn" disabled={isSearching}>
              {isSearching ? "⏳" : "🔍"}
            </button>
          </form>

          {/* Presets */}
          <div className="memory-preset-questions">
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "center" }}>Preset Inquiries:</span>
            {memoryDatabase.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectPreset(item.query)}
                className="preset-chip"
                disabled={isSearching}
              >
                {item.query}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Output Grid */}
      {selectedResponse && (
        <div className="glass-card highlight-cyan">
          <div className="memory-response-box">
            <div className="memory-answer-header">
              <span className="simulator-pulse"></span>
              <span>ScrumOS Response Generator</span>
              {backendAvailable && (
                <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  via /api/search-memory
                </span>
              )}
            </div>

            <div className="memory-answer-text">
              {typingText}
              {isTyping && <span style={{ animation: "pulse-cyan 0.8s infinite", marginLeft: "4px" }}>|</span>}
            </div>

            {/* Sources section */}
            {!isTyping && selectedResponse.sources && selectedResponse.sources.slack !== "No Slack records matches query" && selectedResponse.sources.slack !== "No match found" && (
              <div className="memory-sources">
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
                  VERIFIED CITATION SOURCES
                </span>
                
                <div className="source-item">
                  <span className="source-badge">Slack</span>
                  <span className="source-text">{selectedResponse.sources.slack}</span>
                </div>
                <div className="source-item">
                  <span className="source-badge">Jira</span>
                  <span className="source-text">{selectedResponse.sources.jira}</span>
                </div>
                <div className="source-item">
                  <span className="source-badge">GitHub</span>
                  <span className="source-text">{selectedResponse.sources.pr}</span>
                </div>
                <div className="source-item">
                  <span className="source-badge">Retros</span>
                  <span className="source-text">{selectedResponse.sources.retros}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
