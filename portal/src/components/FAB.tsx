// floating action button for adding new devices or alerts
import { useTheme } from "@mui/material/styles";

export function FAB({ icon = "＋", onClick }: any) {
  const theme = useTheme();

  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 80,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: theme.palette.primary.main,
        color: "#fff",
        border: "none",
        fontSize: 28,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 300,
      }}
    >
      {icon}
    </button>
  );
}