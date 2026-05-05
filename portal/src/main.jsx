// entry point of the applicatation.
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { WebSocketProvider } from "./context/WebSocketContext";
import { DeviceProvider } from "./context/DeviceContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
  <WebSocketProvider>
    <DeviceProvider>
      <App />
    </DeviceProvider>
  </WebSocketProvider>
</QueryClientProvider>
);