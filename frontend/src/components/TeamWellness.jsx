import React from "react";

export default function TeamWellness({ data }) {
  const { burnoutData } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-card highlight-cyan">
        <h3 className="card-title">
          <span>Team Wellness & Workload Optimization</span>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>Wellness Observer v1.1</span>
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Ethical, high-level observation of team work velocities. Rather than tracking keystrokes, ScrumOS measures context-switching indices, late-night commits, and weekend activities to recommend work rebalancing.
        </p>
        
        <div style={{ padding: "12px 16px", background: "rgba(6, 182, 212, 0.05)", border: "1px solid rgba(6, 182, 212, 0.15)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", gap: "10px", alignItems: "center" }}>
          <span>🛡️</span>
          <span><strong>Privacy Guarantee:</strong> Individual key logs or chat texts are NEVER analyzed. ScrumOS audits only metadata patterns to maintain trust.</span>
        </div>
      </div>

      <div className="glass-card">
        <h4 style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "16px" }}>Developer Burnout Risk & Load Balance</h4>

        <div className="burnout-grid">
          {burnoutData.map((member, idx) => (
            <div key={idx} className="burnout-card">
              {/* Profile and general status */}
              <div className="burnout-info">
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>{member.developer}</div>
                <div className={`burnout-status-indicator ${member.riskLevel.replace(" ", "-")}`}>
                  {member.riskLevel}
                </div>
              </div>

              {/* Metrics */}
              <div className="burnout-metrics-row">
                <div className="burnout-metric">
                  <span>Context Switching</span>
                  <span style={{ color: member.indicators.contextSwitching === "Very High" ? "var(--accent-red)" : member.indicators.contextSwitching === "High" ? "var(--accent-amber)" : "var(--accent-emerald)" }}>
                    {member.indicators.contextSwitching}
                  </span>
                </div>
                <div className="burnout-metric">
                  <span>Late Night Commits</span>
                  <span style={{ color: member.indicators.lateNightCommits > 5 ? "var(--accent-red)" : "inherit" }}>
                    {member.indicators.lateNightCommits} commits
                  </span>
                </div>
                <div className="burnout-metric">
                  <span>Weekend Commits</span>
                  <span style={{ color: member.indicators.weekendCommits > 1 ? "var(--accent-red)" : "inherit" }}>
                    {member.indicators.weekendCommits} commits
                  </span>
                </div>
              </div>

              {/* Suggestions */}
              <div className="burnout-rec">
                <strong>Optimization Guideline:</strong> {member.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness tips */}
      <div className="two-col-grid">
        <div className="glass-card">
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>Context Switching Index</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            Calculated when a developer commits code in more than 3 distinct repository folders within 4 hours. High scores indicate fragmented focus, which doubles bug rates.
          </p>
        </div>
        <div className="glass-card">
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>Late-Night Activity Spikes</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            Alerts managers when build checks or local deployments occur between 11 PM and 5 AM. Occasional spikes are normal, but persistent trends signal estimation errors or overloaded schedules.
          </p>
        </div>
      </div>
    </div>
  );
}
