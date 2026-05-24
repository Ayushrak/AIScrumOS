import React from "react";

export default function TechDebt({ data }) {
  const { techDebt } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="glass-card highlight-red">
        <h3 className="card-title">
          <span>AI Technical Debt Detector</span>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-red)", fontFamily: "var(--font-mono)" }}>Refactor Radar v1.0</span>
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          Automated auditing of repository commit patterns, bug logs, and PR conversations. ScrumOS maps architectural rot and high-complexity modules prone to release rollbacks.
        </p>
      </div>

      <div className="glass-card">
        <h4 style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "16px" }}>Codebase Hotspots & Architecture Risks</h4>
        
        <div className="hotspot-grid">
          {/* Header Row */}
          <div className="hotspot-row header">
            <span>Repository Module</span>
            <span>Complexity Risk</span>
            <span>Rollback Rate</span>
            <span>Bus Factor Risk</span>
          </div>

          {/* Data Rows */}
          {techDebt.map((debt, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="hotspot-row">
                <span className="hotspot-name">{debt.module}</span>
                <span className={`hotspot-score ${debt.riskScore > 75 ? "high" : "medium"}`}>
                  {debt.riskScore}%
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: "500" }}>{debt.rollbacks}</span>
                <span style={{ color: debt.busFactor.includes("1 Developer") ? "var(--accent-red)" : "var(--accent-amber)", fontSize: "0.85rem" }}>
                  {debt.busFactor}
                </span>
              </div>
              
              {/* Extra details about warnings */}
              <div style={{ padding: "10px 16px", background: "rgba(0,0,0,0.1)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-secondary)", borderLeft: "2px solid rgba(255,255,255,0.05)", marginLeft: "12px", marginBottom: "12px" }}>
                <strong style={{ color: "var(--accent-cyan)" }}>AI Diagnostics:</strong> {debt.issues}
                <div style={{ display: "flex", gap: "16px", marginTop: "8px", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  <span>Commits Audited: {debt.commitsCount}</span>
                  <span>•</span>
                  <span>Hotfixes: {debt.hotfixes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rationale explanation */}
      <div className="two-col-grid">
        <div className="glass-card">
          <h4 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "6px" }}>Single Developer Dependencies</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            The "Bus Factor" indicator alerts you if a key repository folder is only modified by one developer. If Vikram takes leaves or leaves the company, support costs and refactoring overhead for the "Authentication Gateway" spike significantly.
          </p>
        </div>
        <div className="glass-card">
          <h4 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "6px" }}>Rollback & Hotfix correlation</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
            High hotfix ratios are direct indicators of structural instability. The Authentication module has seen 34 patch releases in 60 days, signifying poor test coverage and coupled modules.
          </p>
        </div>
      </div>
    </div>
  );
}
