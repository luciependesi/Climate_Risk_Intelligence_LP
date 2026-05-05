//theme context to provide theme to the app
import { createContext, useContext, useState } from "react";
import { darkTheme, lightTheme } from "../theme";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: any) {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setTheme((t) => (t.mode === "dark" ? lightTheme : darkTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ background: theme.bg, color: theme.text, minHeight: "100vh" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);