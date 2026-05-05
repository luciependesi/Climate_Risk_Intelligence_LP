//header actions component with search and filter options.
import { useTheme } from "@mui/material/styles";

export function HeaderActions({ onSearch, onFilter }: any) {
  const theme = useTheme();

  return (
    <div
      className="card"
      style={{
        padding: 12,
        marginBottom: 16,
        display: "flex",
        gap: 12,
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Search devices..."
        onChange={(e) => onSearch(e.target.value)}
        style={{
          flex: 1,
          padding: "8px 10px",
          borderRadius: 6,
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      />

      <select
        onChange={(e) => onFilter(e.target.value)}
        style={{
          padding: "8px 10px",
          borderRadius: 6,
          border: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <option value="">All</option>
        <option value="high">High Risk</option>
        <option value="medium">Medium Risk</option>
        <option value="low">Low Risk</option>
      </select>
    </div>
  );
}