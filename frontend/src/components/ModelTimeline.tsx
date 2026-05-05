// frontend/src/components/ModelTimeline.tsx
//UI 

export function ModelTimeline({ versions }: { versions: any[] }) {
  return (
    <div className="card">
      <div className="card-title">Model Evolution</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {versions.map((v) => (
          <li key={v.version} style={{ marginBottom: "0.4rem", fontSize: "0.85rem" }}>
            <strong>{v.version}</strong> — {v.description} ({v.drift_score?.toFixed(2) ?? "–"} drift)
          </li>
        ))}
      </ul>
    </div>
  );
}