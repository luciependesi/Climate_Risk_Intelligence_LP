// frontend/src/components/VerificationPanel.tsx
//UI 

export function VerificationPanel() {
  return (
    <div className="card">
      <div className="card-title">Verification</div>
      <p style={{ fontSize: "0.85rem" }}>
        All ingested payloads are signed and verified using HMAC-SHA256.
        Model versions and schema versions are logged for auditability.
      </p>
    </div>
  );
}