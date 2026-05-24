import React from "react";

export default function RetroGenerator() {
  const sprintInsights = [
    { text: "PR review wait times averaged 19.2 hours (Escalated by 35% this sprint)", type: "warning" },
    { text: "QA queue bottleneck has repeated for 3 consecutive sprints", type: "warning" },
    { text: "Backend team estimation accuracy improved by 14% (Velocity matches prediction)", type: "success" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-card highlight-cyan">
        <h3 className="card-title">
          <span>Autonomous Retrospective Generator</span>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>Sprint Retro Agent v2</span>
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          After the sprint closes, ScrumOS evaluates delivery velocity, code review logs, build errors, and ticket cycle times to construct retrospective action logs.
        </p>

        {/* Sprint Insights Alert Bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
          {sprintInsights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "8px",
                background: insight.type === "warning" ? "rgba(245, 158, 11, 0.05)" : "rgba(16, 185, 129, 0.05)",
                border: insight.type === "warning" ? "1px solid rgba(245, 158, 11, 0.15)" : "1px solid rgba(16, 185, 129, 0.15)",
                fontSize: "0.8rem",
                color: "var(--text-secondary)"
              }}
            >
              <span>{insight.type === "warning" ? "⚠️" : "✓"}</span>
              <span>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Retro Columns */}
      <div className="three-col-grid">
        {/* What Went Well */}
        <div className="glass-card highlight-emerald">
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--accent-emerald)", marginBottom: "12px" }}>
            What Went Well
          </h4>
          <ul style={{ listStyle: "none", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>ACID Database schemas:</strong> Vikram and Ayush closed Postgres transaction cards in under 3 days.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Meeting Overhead Reduction:</strong> Sync compression eliminated 2 architecture meetings, saving 6 hours.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Auth Middleware Stability:</strong> Regressions on session tokens dropped by 40% after refactoring.
            </li>
          </ul>
        </div>

        {/* Friction & Bottlenecks */}
        <div className="glass-card highlight-amber">
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--accent-amber)", marginBottom: "12px" }}>
            Repeated Bottlenecks
          </h4>
          <ul style={{ listStyle: "none", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>QA Awaiting Releases:</strong> Deployment to staging environments was blocked multiple times due to configuration errors.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Code Review Cycles:</strong> Non-critical PRs are sitting in "Awaiting Review" state for over a day.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Silent Port Conflicts:</strong> Redis and container port overlaps caused 3 local testing halts.
            </li>
          </ul>
        </div>

        {/* Actions & Suggestions */}
        <div className="glass-card highlight-cyan">
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--accent-cyan)", marginBottom: "12px" }}>
            AI Action Items
          </h4>
          <ul style={{ listStyle: "none", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>Refactor local dockerfiles:</strong> Set up automated config verification on local build steps (David).
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Split PR sizes:</strong> Limit PRs to &lt;250 lines of diffs to boost review velocities by 50%.
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Introduce Mock Service:</strong> Unblock QA regression by building a payment sandbox service (QA Team).
            </li>
          </ul>
        </div>
      </div>

      {/* Button to sync or download */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button className="btn btn-secondary">Download PDF retro summaries</button>
        <button className="btn btn-primary">Publish reports to Slack Retro Channel</button>
      </div>
    </div>
  );
}
