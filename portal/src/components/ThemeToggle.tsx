//this component is used to toggle between light and dark theme in the app.
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="card"
      style={{
        padding: "8px 12px",
        cursor: "pointer",
        borderRadius: 8,
        border: `1px solid ${theme.border}`,
        background: theme.card,
      }}
    >
      {theme.mode === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}