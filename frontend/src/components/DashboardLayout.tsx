import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./DashboardLayout.css";

export const DashboardLayout = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Climate Risk</h2>
        <nav>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            Overview
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>
            Map
          </NavLink>
        </nav>
      </aside>

      <div className="main">
        <header className="header">
          <h1>Climate Risk Intelligence Portal</h1>
           <ThemeToggle />
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};