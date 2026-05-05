import React from "react";
import { useScenario } from "../context/ScenarioContext";

export default function ScenarioToggle() {
  const { mode, setMode } = useScenario();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {["mock", "live", "forecast", "demo"].map((m) => (
        <button
          key={m}
          onClick={() => setMode(m as any)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ddd",
            background: mode === m ? "#eee" : "#fff"
          }}
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}