// frontend/src/components/PublicSubscriptionForm.tsx
//UI 

import { useState } from "react";

export function PublicSubscriptionForm() {
  const [endpoint, setEndpoint] = useState("");
  const [location, setLocation] = useState("");
  const [threshold, setThreshold] = useState(0.7);
  const [status, setStatus] = useState<string | null>(null);

  async function submit() {
    const res = await fetch("/api/subscriptions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, location, high_risk_threshold: threshold }),
    });
    setStatus(res.ok ? "Subscribed" : "Error");
  }

  return (
    <div className="card">
      <div className="card-title">Public Subscription</div>
      <div className="subscriber-settings">
        <input
          placeholder="Webhook URL or token"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />
        <input
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="number"
          min={0}
          max={1}
          step={0.05}
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
        />
        <button onClick={submit}>Subscribe</button>
        {status && <div style={{ fontSize: "0.8rem" }}>{status}</div>}
      </div>
    </div>
  );
}