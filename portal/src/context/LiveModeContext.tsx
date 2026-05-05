//This file defines a react context for managing the live mode state in the application.
import { createContext, useContext, useState } from "react";

const LiveModeContext = createContext<any>(null);

export function LiveModeProvider({ children }: any) {
  const [live, setLive] = useState(true);
  return (
    <LiveModeContext.Provider value={{ live, setLive }}>
      {children}
    </LiveModeContext.Provider>
  );
}

export function useLiveMode() {
  return useContext(LiveModeContext);
}