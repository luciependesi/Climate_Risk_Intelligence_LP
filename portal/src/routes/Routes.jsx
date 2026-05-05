// defines the routes for the application.
// src/routes/Routes.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}