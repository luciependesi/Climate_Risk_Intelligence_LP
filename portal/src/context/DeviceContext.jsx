// src/context/DeviceContext.jsx
// src/context/DeviceContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";

const DeviceContext = createContext();

export function DeviceProvider({ children }) {
  const { subscribe } = useWebSocket();
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      try {
        console.log("📥 WS DATA:", data);

        // Ignore handshake messages
        if (!data.device_id) return;

        setDevices((prev) => {
          const existing = prev.find((d) => d.id === data.device_id);

          const updated = {
            id: data.device_id,
            reading: data.reading,
            health: data.health,
            online: data.online,
            last_seen: data.last_seen,
            is_virtual: data.is_virtual,
          };

          if (existing) {
            return prev.map((d) =>
              d.id === data.device_id ? updated : d
            );
          }

          return [...prev, updated];
        });
      } catch (err) {
        console.error("❌ DeviceContext error:", err);
      }
    });

    return () => unsubscribe();
  }, [subscribe]);

  return (
    <DeviceContext.Provider value={{ devices }}>
      {children}
    </DeviceContext.Provider>
  );
}

// ⭐ THIS MUST EXIST — otherwise imports fail
export function useDeviceContext() {
  return useContext(DeviceContext);
}