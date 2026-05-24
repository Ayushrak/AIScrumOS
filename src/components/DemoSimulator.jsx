import React from "react";
import { simulatorSteps } from "../mockData";

export default function DemoSimulator({ currentStep, setStep, resetSimulator, activeTab, setActiveTab }) {
  const currentStepData = simulatorSteps.find((s) => s.step === currentStep);

  const handleNext = () => {
    if (currentStep < 6) {
      const next = currentStep + 1;
      setStep(next);
      
      // Auto switch tabs based on step to make the demo feel extremely reactive
      if (next === 1 || next === 2) {
        setActiveTab("dashboard");
      } else if (next === 3) {
        setActiveTab("silent-blockers");
      } else if (next === 4) {
        setActiveTab("dashboard");
      } else if (next === 5) {
        setActiveTab("standups");
      } else if (next === 6) {
        setActiveTab("digital-twin");
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    if (resetSimulator) {
      resetSimulator();
    } else {
      setStep(1);
    }
    setActiveTab("dashboard");
  };

  return (
    <div className="simulator-panel">
      <div className="simulator-header">
        <div className="simulator-title">
          <div className="simulator-pulse"></div>
          <span>JUDGE DEMO CONTROL</span>
        </div>
        <button onClick={handleReset} className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: "0.7rem" }}>
          Reset Demo
        </button>
      </div>

      <div className="simulator-body">
        <div className="simulator-step-info">
          <span>STEP {currentStep} OF 6</span>
          <span style={{ color: "var(--accent-cyan)", fontWeight: "600" }}>
            {currentStep === 6 ? "DEMO COMPLETE" : "IN PROGRESS"}
          </span>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>

        <div>
          <h3 className="simulator-step-title">{currentStepData?.title}</h3>
          <p className="simulator-desc" style={{ marginTop: "8px" }}>
            {currentStepData?.description}
          </p>
        </div>

        <div className="simulator-controls">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            ← Back
          </button>
          {currentStep < 6 ? (
            <button onClick={handleNext} className="btn btn-primary" style={{ flex: 2 }}>
              Advance Step →
            </button>
          ) : (
            <button onClick={handleReset} className="btn btn-primary" style={{ flex: 2 }}>
              Restart Walkthrough
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
