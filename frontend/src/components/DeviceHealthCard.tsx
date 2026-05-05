// frontend/src/components/DeviceHealthCard.tsx
//Shows device reliability (battery, GNSS, sensor validity)

import { motion } from "framer-motion";

export function DeviceHealthCard({
  score,
  loading,
}: {
  score: number | null;
  loading: boolean;
}) {
  const display = score ?? 0;

  const color =
    display >= 0.8
      ? "var(--good)"
      : display >= 0.5
      ? "var(--warning)"
      : "var(--critical)";

  return (
    <div className="card device-health-card">
      <div className="card-title">Device Health</div>

      {loading ? (
        <div className="skeleton" style={{ height: "2.5rem", width: "40%" }} />
      ) : (
        <motion.div
          key={display}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: "2.2rem",
            fontWeight: 600,
            color,
            transition: "color 0.3s ease",
          }}
        >
          {(display * 100).toFixed(0)}%
        </motion.div>
      )}

      <div className="health-bar">
        <motion.div
          className="health-bar-fill"
          initial={{ width: "0%" }}
          animate={{ width: `${display * 100}%` }}
          transition={{ duration: 0.6 }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}