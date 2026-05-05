//sidebar layer for navigation with links to dashboard.
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export function Sidebar({ mobile, onClose }: any) {
  const { theme } = useTheme();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/compare", label: "Compare Devices" },
    { to: "/heatmap", label: "Global Risk Map" },
  ];

  return (
    <aside
      style={{
        width: 240,
        padding: 16,
        background: theme.card,
        borderRight: `1px solid ${theme.border}`,
        height: "100vh",
        position: mobile ? "absolute" : "relative",
        zIndex: 100,
      }}
    >
      {mobile && (
        <button
          onClick={onClose}
          style={{
            marginBottom: 16,
            background: theme.card,
            border: `1px solid ${theme.border}`,
            padding: "6px 10px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Close ✕
        </button>
      )}

      <h2 style={{ marginBottom: 16 }}>Menu</h2>

      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          onClick={mobile ? onClose : undefined}
          style={({ isActive }) => ({
            display: "block",
            padding: "10px 12px",
            marginBottom: 8,
            borderRadius: 8,
            background: isActive ? theme.primary + "22" : "transparent",
            color: isActive ? theme.primary : theme.text,
            border: isActive ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`,
            textDecoration: "none",
          })}
        >
          {l.label}
        </NavLink>
      ))}
    </aside>
  );
}