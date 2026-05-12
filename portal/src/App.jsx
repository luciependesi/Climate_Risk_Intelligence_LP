/*
 * © 2026 Lucie Pendesi. All rights reserved.
 * Licensed under the MIT License. See the LICENSE file for details.
 */
//Global Layout + Providers + Routing 
// src/App.jsx
// src/App.jsx

import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { DeviceProvider } from "./context/DeviceContext";
import { WebSocketProvider } from "./context/WebSocketContext";

export default function App() {
  return (
    <BrowserRouter>
      <DeviceProvider>
        <WebSocketProvider>
          <AppRoutes />
        </WebSocketProvider>
      </DeviceProvider>
    </BrowserRouter>
  );
}