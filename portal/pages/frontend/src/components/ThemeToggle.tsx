import React, { useState, useEffect } from "react";
import { applyTheme } from "../theme";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button className="theme-toggle" onClick={toggle}>
      {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>

    <button
  className="mode-toggle"
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
>
  {theme === "dark" ? "Light Mode" : "Dark Mode"}
</button>
  );
};
