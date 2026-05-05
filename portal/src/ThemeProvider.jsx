// theme provider component ro manage the theme state and provide it to the rest of the app.
import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme === "dark" ? "dark bg-gray-900" : "bg-gray-50"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}