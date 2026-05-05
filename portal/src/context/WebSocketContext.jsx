// src/context/WebSocketContext.jsx
// src/context/WebSocketContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const wsRef = useRef(null);
  const listeners = useRef(new Set());
  const [isConnected, setIsConnected] = useState(false);

  // Allow DeviceContext to subscribe to incoming messages
  const subscribe = (callback) => {
    listeners.current.add(callback);
    return () => listeners.current.delete(callback);
  };

  const notifyAll = (data) => {
    for (const cb of listeners.current) cb(data);
  };

  useEffect(() => {
    let ws;

    function connect() {
     ws = new WebSocket("ws://localhost:8000/ws/live/devices");
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          notifyAll(data);
        } catch (err) {
          console.error("WS parse error:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WS error:", err);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connect, 2000); // auto‑reconnect
      };
    }

    connect();
    return () => wsRef.current?.close();
  }, []);

  return (
    <WebSocketContext.Provider value={{ subscribe, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);