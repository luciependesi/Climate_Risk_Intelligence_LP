export function SkeletonChart() {
  return (
    <div
      className="card"
      style={{
        height: 260,
        background: "linear-gradient(90deg, #1f242b 25%, #2a3038 50%, #1f242b 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        borderRadius: 10,
      }}
    />
  );
}