import React from "react";

export default function DashboardOverview({ data }) {
  const { activeSprint, activityFeed } = data;
  const isHighRisk = activeSprint.riskLevel === "HIGH";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Risk Alert Indicator & Sprint Info */}
      <div className="dashboard-grid">
        {/* Sprint Failure Prediction Box */}
        <div className={`glass-card risk-indicator-box risk-${activeSprint.riskLevel}`}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "0.05em" }}>
            AI SPRINT FAILURE RISK
          </span>
          <div className={`risk-score-value risk-${activeSprint.riskLevel}`}>
            {activeSprint.riskScore}%
          </div>
          <div className="risk-label" style={{ color: isHighRisk ? "var(--accent-red)" : "var(--accent-emerald)" }}>
            {activeSprint.riskLevel} RISK LEVEL
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "8px" }}>
            Real-time projection based on current bottlenecks
          </p>
        </div>

        {/* Sprint Profile */}
        <div className="glass-card highlight-cyan">
          <div className="card-title">
            <span>Active Sprint Profile</span>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", background: "rgba(6, 182, 212, 0.1)", padding: "4px 8px", borderRadius: "6px" }}>
              {activeSprint.daysRemaining} Days Left
            </span>
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "4px" }}>{activeSprint.name}</h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            Timeline: {activeSprint.startDate} to {activeSprint.endDate}
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600" }}>
              AI RISK FACTOR CORRELATIONS:
            </span>
            <ul style={{ listStyle: "none", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              {activeSprint.riskReasons.map((reason, idx) => (
                <li key={idx} style={{ marginBottom: "6px", display: "flex", gap: "8px", alignItems: "start" }}>
                  <span style={{ color: isHighRisk ? "var(--accent-red)" : "var(--accent-cyan)" }}>•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="three-col-grid">
        <div className="glass-card">
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase" }}>
            Sprint Workload
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "12px" }}>
            <span style={{ fontSize: "2rem", fontWeight: "700", fontFamily: "var(--font-display)" }}>
              {activeSprint.statistics.completedPoints}/{activeSprint.statistics.totalPoints}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-emerald)" }}>
              {Math.round((activeSprint.statistics.completedPoints / activeSprint.statistics.totalPoints) * 100)}% Done
            </span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(activeSprint.statistics.completedPoints / activeSprint.statistics.totalPoints) * 100}%`, background: "var(--accent-emerald)" }}></div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase" }}>
            Unresolved PRs & QA load
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
            <div>
              <span style={{ fontSize: "2rem", fontWeight: "700", fontFamily: "var(--font-display)", color: isHighRisk ? "var(--accent-red)" : "inherit" }}>
                {activeSprint.statistics.openPRs}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "4px" }}>PRs Open</span>
            </div>
            <div>
              <span style={{ fontSize: "2rem", fontWeight: "700", fontFamily: "var(--font-display)", color: isHighRisk ? "var(--accent-amber)" : "inherit" }}>
                {activeSprint.statistics.qaTickets}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "4px" }}>QA Queue</span>
            </div>
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "8px" }}>
            PR wait times avg: {isHighRisk ? "19.2 hrs (High)" : "4.8 hrs (Optimal)"}
          </p>
        </div>

        <div className="glass-card">
          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase" }}>
            Blocked Story Points
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "12px" }}>
            <span style={{ fontSize: "2rem", fontWeight: "700", fontFamily: "var(--font-display)", color: activeSprint.statistics.blockedPoints > 12 ? "var(--accent-red)" : "var(--accent-amber)" }}>
              {activeSprint.statistics.blockedPoints} pts
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Velocity: {activeSprint.statistics.velocity}
            </span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(activeSprint.statistics.blockedPoints / activeSprint.statistics.totalPoints) * 100}%`, background: isHighRisk ? "var(--accent-red)" : "var(--accent-amber)" }}></div>
          </div>
        </div>
      </div>

      {/* Two Column details: Live Activity Streaming & Sprint Progress Overview */}
      <div className="two-col-grid">
        {/* Live streaming activity */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="card-title">
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="status-dot pulsate" style={{ background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }}></span>
              Event Streaming Feed (Live)
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Kafka Core</span>
          </div>
          
          <div className="event-feed">
            {activityFeed.map((item, idx) => (
              <div key={idx} className={`feed-item feed-${item.type}`}>
                <span className="feed-time">{item.time}</span>
                <span className="feed-message">{item.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Guide / AI Sprint Insights */}
        <div className="glass-card highlight-violet" style={{ display: "flex", flexDirection: "column", justifySelf: "stretch" }}>
          <div className="card-title">
            <span>Sprint Health Insights</span>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-violet)", fontWeight: "600" }}>Autopilot AI</span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1, justifyContent: "center" }}>
            {isHighRisk ? (
              <>
                <div style={{ display: "flex", gap: "12px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)", padding: "16px", borderRadius: "10px" }}>
                  <div style={{ color: "var(--accent-red)", fontSize: "1.5rem", lineHeight: "1" }}>⚠️</div>
                  <div>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#fff" }}>Critical Path Bottleneck Detected</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                      The delay in the Payment Gateway is blocking Checkout API endpoints, which prevents Frontend testing. Sprint closure timeline is currently compromised.
                    </p>
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <strong>Suggested Mitigation:</strong> Assist Ayush with Redis connectivity. David or Rahul (experts) should inspect port mappings.
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", gap: "12px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)", padding: "16px", borderRadius: "10px" }}>
                  <div style={{ color: "var(--accent-emerald)", fontSize: "1.5rem", lineHeight: "1" }}>✓</div>
                  <div>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#fff" }}>Sprint Delivery On Track</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                      No critical dependency blocking found. Average code review cycles are under 5 hours. Release readiness is projected at 94%.
                    </p>
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <strong>Sprint Tip:</strong> Ensure Neha's Docker container config logs are reviewed during the daily standup.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
