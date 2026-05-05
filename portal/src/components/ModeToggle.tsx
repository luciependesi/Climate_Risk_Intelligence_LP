/* live mode toggle */
/* live mode toggle */
import { MODE } from "../config/mode";

function ModeToggle() {
  return (
    <div className="card" style={{ padding: "12px" }}>
      <strong>Mode:</strong> {MODE.toUpperCase()}
      <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
        (Change in src/config/mode.ts)
      </div>
    </div>
  );
}

export default ModeToggle;