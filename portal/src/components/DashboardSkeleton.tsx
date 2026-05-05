export function DashboardSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card skeleton" style={{ height: 200 }} />
        <div className="card skeleton" style={{ height: 120 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="card skeleton" style={{ height: 260 }} />
        <div className="card skeleton" style={{ height: 260 }} />
      </div>
    </div>
  );
}
export default DashboardSkeleton;

