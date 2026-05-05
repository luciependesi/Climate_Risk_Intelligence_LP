// frontend/src/components/DriftPanel.tsx
//UI 

export function DriftPanel({
  driftScore,
  flag,
  loading,
}: {
  driftScore: number | null;
  flag: boolean | null;
  loading: boolean;
}) {
  const v = driftScore ?? 0;
  return (
    <div className="card">
      <div className="card-title">Model Drift</div>
      {loading ? (
        <div className="skeleton" style={{ height: "2rem", width: "40%" }} />
      ) : (
        <>
          <div style={{ fontSize: "1.6rem", fontWeight: 600 }}>
            {(v * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: "0.85rem" }}>
            {flag ? "Significant drift detected" : "No significant drift"}
          </div>
        </>
      )}
    </div>
  );
}