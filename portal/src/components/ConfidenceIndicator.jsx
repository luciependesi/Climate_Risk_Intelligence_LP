export default function ConfidenceIndicator({ isVirtual }) {
  const level = isVirtual ? "Low" : "High";
  const color = isVirtual ? "#ff9800" : "#4caf50";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: color,
        }}
      />
      <span style={{ fontSize: "0.8rem", color }}>{level} confidence</span>
    </div>
  );
}