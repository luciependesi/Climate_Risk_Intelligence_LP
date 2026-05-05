//Navigator bar component with links to different pages and a theme toggle button.
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

export function NavBar() {
  const { theme } = useTheme();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: theme.card,
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div style={{ display: "flex", gap: 20 }}>
        <NavLink
          to="/"
          className="nav-link"
          style={({ isActive }) => ({
            color: isActive ? theme.primary : theme.text,
            fontWeight: isActive ? 600 : 400,
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/compare"
          className="nav-link"
          style={({ isActive }) => ({
            color: isActive ? theme.primary : theme.text,
            fontWeight: isActive ? 600 : 400,
          })}
        >
          Compare Devices
        </NavLink>

        <NavLink
          to="/heatmap"
          className="nav-link"
          style={({ isActive }) => ({
            color: isActive ? theme.primary : theme.text,
            fontWeight: isActive ? 600 : 400,
          })}
        >
          Global Risk Map
        </NavLink>
      </div>

      <ThemeToggle />
    </nav>
  );
}