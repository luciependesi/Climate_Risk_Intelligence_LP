// frontend/src/components/ConfidenceCard.tsx

export function ConfidenceCard({
  confidence,
  loading,
}: {
  confidence: number | null;
  loading: boolean;
}) {
  const value = confidence ?? 0;
  return (
    <div className="card">
      <div className="card-title">Climate Confidence Index</div>
      {loading ? (
        <div className="skeleton" style={{ height: "2.5rem", width: "40%" }} />
      ) : (
        <div style={{ fontSize: "2rem", fontWeight: 600 }}>
          {(value * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}