export default function VirtualBadge({ isVirtual }) {
  if (!isVirtual) return null;

  return (
    <span
      style={{
        background: "rgba(255, 165, 0, 0.15)",
        color: "#ff9800",
        padding: "2px 8px",
        borderRadius: "6px",
        fontSize: "0.75rem",
        marginLeft: "8px",
      }}
    >
      VIRTUAL
    </span>
  );
}