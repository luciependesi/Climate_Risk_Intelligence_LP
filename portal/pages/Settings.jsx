export default function Settings() {
  return (
    <div className="card fade" style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <div className="card-title">Settings</div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Notification Preferences
        </label>
        <select className="input">
          <option>Email</option>
          <option>Push Notifications</option>
          <option>None</option>
        </select>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Data Refresh Interval
        </label>
        <select className="input">
          <option>30 seconds</option>
          <option>1 minute</option>
          <option>5 minutes</option>
        </select>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Theme
        </label>
        <select className="input">
          <option>Dark</option>
          <option>Light</option>
        </select>
      </div>
    </div>
  );
}