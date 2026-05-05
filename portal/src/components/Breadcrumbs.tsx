import { useLocation, Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

export function Breadcrumbs() {
  const theme = useTheme();
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  return (
    <div
      className="card"
      style={{
        padding: "8px 12px",
        marginBottom: 16,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <span>
        <Link to="/" style={{ color: theme.palette.primary.main }}>
          Home
        </Link>
      </span>

      {parts.map((p, i) => {
        const path = "/" + parts.slice(0, i + 1).join("/");
        return (
          <span key={i}>
            {" / "}
            <Link to={path} style={{ color: theme.palette.text.primary }}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Link>
          </span>
        );
      })}
    </div>
  );
}