import { useState } from "react";
import { setUseMock, getUseMock } from "../api/config";
import { useToast } from "../context/ToastProvider";

export default function MockToggle() {
  const [mock, setMock] = useState(getUseMock());
  const { showToast } = useToast();

  function toggle() {
    const next = !mock;
    setMock(next);
    setUseMock(next);
    showToast(next ? "Switched to MOCK backend" : "Switched to LIVE backend", "info");
  }

  return (
    <button
      onClick={toggle}
      className="card fade"
      style={{ cursor: "pointer", padding: "0.5rem 1rem" }}
    >
      Mode: {mock ? "Mock" : "Live"}
    </button>
  );
}