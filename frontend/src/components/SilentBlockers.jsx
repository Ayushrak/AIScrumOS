import React from "react";

export default function SilentBlockers({ data }) {
  const { silentBlockers } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-card highlight-amber">
        <h3 className="card-title">
          <span>“Silent Blocker” Detection Systems</span>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>Behavioral Scanner v3.0</span>
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Developers rarely say "I am blocked" explicitly. AI observes local compilations, repeated debugging commits, failed PR pipeline loops, and chat patterns to uncover hidden blockers.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {silentBlockers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-muted)" }}>
            No silent blockers detected. The team is operating smoothly.
          </div>
        ) : (
          silentBlockers.map((blocker) => (
            <div key={blocker.id} className="glass-card" style={{ borderLeft: "4px solid var(--accent-red)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-red)", fontWeight: "600", textTransform: "uppercase", background: "rgba(239, 68, 68, 0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                    CRITICAL BLOCKER PROJECTED
                  </span>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "8px" }}>{blocker.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Developer: <strong>{blocker.developer}</strong> • Detected {blocker.detectedTime}
                  </p>
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>AI CONFIDENCE</span>
                  <div style={{ fontSize: "1.5rem", fontWeight: "800", color: blocker.confidence > 85 ? "var(--accent-red)" : "var(--accent-amber)", fontFamily: "var(--font-display)" }}>
                    {blocker.confidence}%
                  </div>
                </div>
              </div>

              {/* Signals and Experts info */}
              <div className="two-col-grid" style={{ background: "rgba(0,0,0,0.15)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.02)" }}>
                <div>
                  <h5 style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                    BEHAVIORAL SIGNALS DETECTED
                  </h5>
                  <ul style={{ listStyle: "none", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {blocker.signals.map((sig, idx) => (
                      <li key={idx} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ color: "var(--accent-red)" }}>↳</span>
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ borderLeft: "1px solid var(--border-color)", paddingLeft: "20px" }}>
                  <h5 style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                    RECOMMENDED ACTIONS
                  </h5>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      Suggested Collaborator: <strong>{blocker.suggestedExpert}</strong> (Identified as team expert on this codebase module)
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                        Assign JIRA & Slack Sync
                      </button>
                      <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                        Ignore Alert
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Behind the AI logic details */}
      <div className="glass-card">
        <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "12px" }}>Why this feels magical in demo:</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          <div>
            <p style={{ fontWeight: "600", color: "#fff", marginBottom: "4px" }}>Context-Aware Logic</p>
            <p>Instead of relying on developer surveys, ScrumOS constantly audits activity vectors (Git diff sizes, commit annotations, and PR reopening counts) to assess friction levels.</p>
          </div>
          <div>
            <p style={{ fontWeight: "600", color: "#fff", marginBottom: "4px" }}>Expert Mapping Graph</p>
            <p>Our organization twin matches code blocks to developer git-blame histories. When Ayush has a Redis issue, the graph points to Rahul because he committed 80% of the Redis connection libraries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
