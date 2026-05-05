// provides a context for the theme and a provider to wrap the app with.
// src/theme/ThemeProvider.jsx
import React, { createContext, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

function ThemeProviderComponent({ children }) {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}

// ⭐ Stable exports — Vite Fast Refresh compatible
export const ThemeProvider = ThemeProviderComponent;
export default ThemeProviderComponent;