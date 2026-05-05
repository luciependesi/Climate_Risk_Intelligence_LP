//Public portal
// frontend/src/pages/PublicPortal.tsx

import { DeviceMap } from "../components/DeviceMap";
import { ConfidenceCard } from "../components/ConfidenceCard";
import { DriftPanel } from "../components/DriftPanel";
import { ModelTimeline } from "../components/ModelTimeline";
import { PublicSubscriptionForm } from "../components/PublicSubscriptionForm";
import { VerificationPanel } from "../components/VerificationPanel";

export default function PublicPortal() {
  // For demo: static or minimal hooks
  const devices = [
    { id: "esp32_001", lat: 40.44, lon: -79.99, risk: 0.4 },
    { id: "esp32_002", lat: 40.45, lon: -79.97, risk: 0.7 },
  ];

  return (
    <div className="dashboard-grid">
      <div className="left-column">
        <DeviceMap devices={devices} />
        <ConfidenceCard confidence={0.82} loading={false} />
        <DriftPanel driftScore={0.12} flag={false} loading={false} />
        <VerificationPanel />
      </div>

      <div className="right-column">
        <ModelTimeline versions={[]} />
        <PublicSubscriptionForm />
      </div>
    </div>
  );
}