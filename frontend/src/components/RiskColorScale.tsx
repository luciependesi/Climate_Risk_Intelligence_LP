import React from "react";
import "./RiskColorScale.css";

export const RiskColorScale: React.FC = () => {
  return (
    <div className="risk-scale">
      <div className="scale-item">
        <span className="color low"></span> Low Risk
      </div>
      <div className="scale-item">
        <span className="color med"></span> Moderate Risk
      </div>
      <div className="scale-item">
        <span className="color high"></span> High Risk
      </div>
      <div className="scale-item">
        <span className="color extreme"></span> Extreme Risk
      </div>
    </div>
  );
};