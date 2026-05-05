import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export function MobileBottomNav() {
  const { theme } = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: theme.card,
        borderTop: `1px solid ${theme.border}`,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 200,
      }}
      className="mobile-only"
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          color: isActive ? theme.primary : theme.textMuted,
          fontWeight: isActive ? 600 : 400,
        })}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/compare"
        style={({ isActive }) => ({
          color: isActive ? theme.primary : theme.textMuted,
          fontWeight: isActive ? 600 : 400,
        })}
      >
        Compare
      </NavLink>

      <NavLink
        to="/heatmap"
        style={({ isActive }) => ({
          color: isActive ? theme.primary : theme.textMuted,
          fontWeight: isActive ? 600 : 400,
        })}
      >
        Map
      </NavLink>
    </div>
  );
}