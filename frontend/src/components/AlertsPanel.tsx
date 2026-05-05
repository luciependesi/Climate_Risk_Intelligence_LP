// frontend/src/components/AlertsPanel.tsx
//Displays subscriber‑filtered alerts with severity colors

export function AlertsPanel({
  alerts,
  loading,
}: {
  alerts: string[];
  loading: boolean;
}) {
  return (
    <div className="card alerts-panel">
      <div className="card-title">Alerts</div>

      {loading ? (
        <>
          <div className="skeleton" style={{ height: "1.2rem", width: "80%" }} />
          <div className="skeleton" style={{ height: "1.2rem", width: "60%" }} />
        </>
      ) : alerts.length === 0 ? (
        <div className="no-alerts">No alerts</div>
      ) : (
        <ul className="alerts-list">
          {alerts.map((a, i) => (
            <li key={i} className="alert-item">
              {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}