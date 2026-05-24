import React, { useState } from "react";

export default function DigitalTwinGraph({ data }) {
  const { digitalTwin } = data;
  const [selectedNode, setSelectedNode] = useState(null);

  // Hardcode SVG positions for a clean, deterministic canvas layout
  const nodePositions = {
    fe_login: { x: 120, y: 80, team: "Frontend Core", desc: "Auth portals and login forms" },
    auth_api: { x: 360, y: 80, team: "Platform API", desc: "OAuth validation and JWT token claims" },
    db_migr: { x: 600, y: 80, team: "Platform API", desc: "PostgreSQL schemas and migrations" },
    k8s_infra: { x: 820, y: 150, team: "DevOps & SRE", desc: "Helm charts and Kubernetes clusters" },
    payment_gw: { x: 360, y: 220, team: "Platform API", desc: "Stripe and Redis transactions" },
    qa_regress: { x: 120, y: 220, team: "Quality Assurance", desc: "E2E testing regression pipelines" }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "error": return "var(--accent-red)";
      case "warning": return "var(--accent-amber)";
      case "pending": return "var(--accent-violet)";
      case "healthy":
      default:
        return "var(--accent-emerald)";
    }
  };

  const getLineStatus = (fromId, toId) => {
    const fromNode = digitalTwin.services.find(s => s.id === fromId);
    const toNode = digitalTwin.services.find(s => s.id === toId);
    
    if (fromNode?.status === "error" || toNode?.status === "error") return "is-error";
    if (fromNode?.status === "warning" || toNode?.status === "warning") return "is-warning";
    return "is-healthy";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Title block */}
      <div className="glass-card highlight-cyan">
        <h3 className="card-title">
          <span>Digital Twin & Dependency Chaos Mapper</span>
          <span style={{ fontSize: "0.75rem", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>OrgGraph Engine v1.2</span>
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
          AI maps live software delivery streams. Hover or click nodes to audit ownership, active files, and blocked dependencies. Pulsating links show risk propagation.
        </p>

        {/* SVG Canvas */}
        <div className="twin-graph-container">
          <svg width="100%" height="100%" viewBox="0 0 960 320" style={{ overflow: "visible" }}>
            {/* Defs for grid and glowing lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Dependency Connectors (Lines) */}
            {digitalTwin.dependencies.map((dep, idx) => {
              const fromPos = nodePositions[dep.from];
              const toPos = nodePositions[dep.to];
              if (!fromPos || !toPos) return null;

              const lineStatus = getLineStatus(dep.from, dep.to);
              let strokeColor = "rgba(255,255,255,0.15)";
              if (lineStatus === "is-error") strokeColor = "var(--accent-red)";
              else if (lineStatus === "is-warning") strokeColor = "var(--accent-amber)";

              return (
                <g key={idx}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={strokeColor}
                    strokeWidth={lineStatus === "is-healthy" ? "2" : "3.5"}
                    className={`dependency-line ${lineStatus}`}
                  />
                  {/* Visual moving particle for critical paths */}
                  {dep.isCritical && lineStatus === "is-healthy" && (
                    <circle r="3" fill="var(--accent-cyan)">
                      <animateMotion
                        dur="4s"
                        repeatCount="indefinite"
                        path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Service Nodes (Circles/Rectangles) */}
            {digitalTwin.services.map((service) => {
              const pos = nodePositions[service.id];
              if (!pos) return null;

              const color = getStatusColor(service.status);
              const isSelected = selectedNode?.id === service.id;

              return (
                <g
                  key={service.id}
                  className="dependency-node"
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedNode({ ...service, ...pos })}
                >
                  {/* Outer pulsating circle if warning/error */}
                  {(service.status === "error" || service.status === "warning") && (
                    <circle
                      r="28"
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      style={{
                        transformOrigin: "center",
                        animation: "pulse-cyan 1.5s infinite",
                        strokeDasharray: "4 2"
                      }}
                    />
                  )}
                  {/* Main Circle */}
                  <circle
                    r="20"
                    fill="var(--bg-secondary)"
                    stroke={color}
                    strokeWidth={isSelected ? "3.5" : "2"}
                    style={{ filter: isSelected ? "drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))" : "none" }}
                  />
                  {/* Inside Symbol */}
                  <circle r="6" fill={color} />
                  
                  {/* Node Label Text */}
                  <text
                    y="-30"
                    textAnchor="middle"
                    fill="#fff"
                    style={{ fontSize: "0.75rem", fontWeight: "600", fontFamily: "var(--font-display)" }}
                  >
                    {service.name}
                  </text>
                  <text
                    y="32"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {pos.team}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode ? (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="status-dot" style={{ background: getStatusColor(selectedNode.status) }}></span>
                <strong style={{ fontSize: "1rem" }}>{selectedNode.name}</strong>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: "4px" }}>
                  {selectedNode.team}
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                {selectedNode.desc}
              </p>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Service Status</span>
              <div style={{ fontSize: "0.9rem", fontWeight: "700", textTransform: "uppercase", color: getStatusColor(selectedNode.status) }}>
                {selectedNode.status === "error" ? "BLOCKED (Redis issue)" : selectedNode.status}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "16px", color: "var(--text-muted)", fontSize: "0.8rem", border: "1px dashed var(--border-color)", borderRadius: "12px", marginTop: "20px" }}>
            Click a graph node to inspect ownership, dependencies, and diagnostic metrics.
          </div>
        )}
      </div>

      {/* Dependency propagation explanation */}
      <div className="two-col-grid">
        <div className="glass-card">
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>Critical Release Pipeline</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--accent-cyan)" }}>Frontend Login</span>
            <span>→</span>
            <span style={{ color: "var(--accent-cyan)" }}>Auth API</span>
            <span>→</span>
            <span style={{ color: "var(--accent-cyan)" }}>Postgres Migration</span>
            <span>→</span>
            <span style={{ color: "var(--accent-cyan)" }}>K8s Deploy</span>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "12px" }}>
            This sequence forms the critical delivery path. AI continuously checks commit rates, automated test outputs, and server health to forecast delays.
          </p>
        </div>

        <div className="glass-card">
          <h4 style={{ fontSize: "0.95rem", fontWeight: "600", marginBottom: "8px" }}>Risk Chain Propagation</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            If a node turns <span style={{ color: "var(--accent-red)", fontWeight: "600" }}>RED</span> (blocked), downstream services automagically report risk warnings. For example, a delay in payment endpoints blocks checkout scenarios on Frontend testing, slowing down QA velocity.
          </p>
        </div>
      </div>
    </div>
  );
}
