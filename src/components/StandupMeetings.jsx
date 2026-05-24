import React, { useState, useEffect } from "react";

export default function StandupMeetings({ data, updateStandups }) {
  const { standups, meetings } = data;
  
  // Voice Standup Simulator state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Click to record standup");
  const [transcription, setTranscription] = useState("");
  const [showJiraToast, setShowJiraToast] = useState(false);

  // Meeting Compression states
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Audio Playback simulation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Voice recording simulation
  const startVoiceRecording = () => {
    setIsRecording(true);
    setVoiceStatus("Listening... Speak now (Simulating 4s voice standup)");
    setTranscription("");
    
    setTimeout(() => {
      setVoiceStatus("Processing audio with Whisper API...");
      
      setTimeout(() => {
        setTranscription("Ayush: Yesterday, I finalized the database schemas for Stripe transactions. Today, I'm configuring the cache keys in Redis. No blockers, but I might need Rahul to review the key invalidation TTLs.");
        setIsRecording(false);
        setVoiceStatus("Completed! Syncing to Jira...");
        setShowJiraToast(true);

        // Update standup state inside parent to show dynamic updates
        if (updateStandups) {
          updateStandups({
            developer: "Ayush (Voice)",
            avatarColor: "#8b5cf6",
            yesterday: ["Finalized database schemas for Stripe transactions"],
            today: ["Configuring cache keys in Redis", "Syncing invalidation TTLs with Rahul"],
            blockers: ["None"]
          });
        }

        setTimeout(() => {
          setShowJiraToast(false);
          setVoiceStatus("Jira synced! Ready for next standup");
        }, 3000);
      }, 1500);
    }, 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Dynamic standup updater toast */}
      {showJiraToast && (
        <div className="notification-banner" style={{ background: "rgba(16, 185, 129, 0.15)", borderColor: "var(--accent-emerald)" }}>
          <span>🤖 AI Core: Standup parsed. Updated JIRA-429 & Slack summary successfully!</span>
          <button onClick={() => setShowJiraToast(false)} style={{ color: "var(--accent-emerald)" }}>✕</button>
        </div>
      )}

      {/* Row containing Voice Standup and Meeting Compressor */}
      <div className="two-col-grid">
        
        {/* Voice standup block */}
        <div className="glass-card highlight-violet">
          <h3 className="card-title">
            <span>Voice Standup Simulator</span>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-violet)", fontWeight: "600" }}>Beta</span>
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
            Speak for 15-20 seconds. Whisper parses your voice, compiles your standup updates, and updates the Jira dashboard automatically.
          </p>

          <div className="voice-standup-box">
            <div className="voice-standup-controls">
              <button 
                onClick={startVoiceRecording} 
                disabled={isRecording}
                className={`record-btn ${isRecording ? "recording" : ""}`}
              >
                🎙️
              </button>
              <div>
                <span className={`voice-status ${isRecording ? "recording" : ""}`}>
                  {voiceStatus}
                </span>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {isRecording ? "Transcribing live voice..." : "Click microphone to run simulator"}
                </p>
              </div>
            </div>

            <div className="transcription-box">
              {transcription ? (
                <div>
                  <span style={{ color: "var(--accent-cyan)", fontWeight: "600" }}>Transcribed Text:</span>
                  <p style={{ marginTop: "4px", lineHeight: "1.4" }}>{transcription}</p>
                </div>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>Speech-to-text outputs will stream here...</span>
              )}
            </div>
          </div>
        </div>

        {/* Meeting Compressor block */}
        <div className="glass-card highlight-cyan">
          <h3 className="card-title">
            <span>Meeting Compression Engine</span>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: "600" }}>RAG Summarizer</span>
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
            ScrumOS sits in team calls, extracts critical choices and assignments, and syncs task boards.
          </p>

          {meetings.map((meeting) => (
            <div key={meeting.id} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{meeting.title}</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{meeting.date} ({meeting.duration})</span>
              </div>

              {/* Audio player mockup */}
              <div className={`audio-player-mock ${isPlaying ? "playing" : ""}`}>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)} 
                  className="btn btn-primary"
                  style={{ width: "32px", height: "32px", padding: 0, borderRadius: "50%" }}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <div className="audio-bars">
                  {/* Bouncing waves indicator */}
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} className="audio-bar" style={{ height: isPlaying ? `${Math.sin(i + audioProgress) * 10 + 14}px` : "4px" }}></div>
                  ))}
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {isPlaying ? `${Math.floor((audioProgress/100) * 45)}s` : meeting.audioLength}
                </span>
              </div>

              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                <strong>Summary: </strong>{meeting.transcriptSummary}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
                <div>
                  <h4 style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Decisions Approved</h4>
                  <ul style={{ listStyle: "none", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {meeting.decisions.map((dec, idx) => (
                      <li key={idx} style={{ marginBottom: "2px" }}>✓ {dec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Action Items Linked</h4>
                  <ul style={{ listStyle: "none", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {meeting.actions.map((act, idx) => (
                      <li key={idx} style={{ marginBottom: "2px" }}>• {act.owner} → {act.task}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Auto-Standup summaries */}
      <div className="glass-card">
        <h3 className="card-title" style={{ marginBottom: "20px" }}>
          <span>AI Auto-Standup (GitHub & Slack Aggregation)</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Updates hourly</span>
        </h3>
        
        <div className="standup-list">
          {standups.map((standup, idx) => (
            <div key={idx} className="standup-item">
              <div className="standup-header">
                <div className="developer-avatar" style={{ backgroundColor: standup.avatarColor }}>
                  {standup.developer[0]}
                </div>
                <span className="developer-name">{standup.developer}</span>
              </div>

              <div className="standup-body">
                <div className="standup-section">
                  <span className="standup-label">Yesterday:</span>
                  <ul className="standup-bullets">
                    {standup.yesterday.map((y, id) => (
                      <li key={id}>{y}</li>
                    ))}
                  </ul>
                </div>

                <div className="standup-section">
                  <span className="standup-label">Today:</span>
                  <ul className="standup-bullets">
                    {standup.today.map((t, id) => (
                      <li key={id}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="standup-section">
                  <span className="standup-label">Blockers:</span>
                  <ul className="standup-bullets blockers">
                    {standup.blockers.map((b, id) => (
                      <li key={id} style={{ color: b !== "None" ? "var(--accent-red)" : "inherit" }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
