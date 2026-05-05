export function SafeCard({ children }) {
  try {
    return children;
  } catch (err) {
    console.error("Component crashed:", err);
    return (
      <div className="card error-card">
        <h3>Error loading component</h3>
        <p>Check console for details.</p>
      </div>
    );
  }
}
<SafeCard>
  <DeviceHealthTimeline deviceId={primaryDeviceId} />
</SafeCard>