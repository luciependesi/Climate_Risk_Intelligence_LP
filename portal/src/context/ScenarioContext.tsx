import React, { createContext, useContext, useState } from "react";

export type ScenarioMode = "mock" | "live" | "forecast" | "demo";

type ScenarioContextType = {
  mode: ScenarioMode;
  setMode: (m: ScenarioMode) => void;
};

const ScenarioContext = createContext<ScenarioContextType>({
  mode: "live",
  setMode: () => {}
});

export function ScenarioProvider({ children }) {
  const [mode, setMode] = useState<ScenarioMode>("live");

  return (
    <ScenarioContext.Provider value={{ mode, setMode }}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  return useContext(ScenarioContext);
}