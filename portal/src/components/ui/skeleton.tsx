// this compoment is a simple skeleton loader for the ui when data is being fetched.
export function Skeleton({ width = "100%", height = "1rem" }) {
  return (
    <div
      style={{
        width,
        height,
        background: "#eee",
        borderRadius: "4px",
        animation: "pulse 1.5s infinite",
      }}
    />
  );
}