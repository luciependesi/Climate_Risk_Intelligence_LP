// frontend/src/components/ClusterRiskCard.tsx
//Shows the aggregated risk score for a cluster of devices

import { motion, AnimatePresence } from "framer-motion";

export function ClusterRiskCard({
  score,
  previous,
  loading,
}: {
  score: number | null;
  previous: number | null;
  loading: boolean;
}) {
  const display = score ?? previous ?? 0;

  const color =
    display >= 0.8
      ? "var(--critical)"
      : display >= 0.6
      ? "var(--warning)"
      : "var(--accent)";

  return (
    <div className="card cluster-risk-card">
      <div className="card-title">Cluster Risk</div>

      {loading ? (
        <div className="skeleton" style={{ height: "2.5rem", width: "40%" }} />
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={display}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: "2.4rem",
              fontWeight: 600,
              color,
              transition: "color 0.3s ease",
            }}
          >
            {(display * 100).toFixed(0)}
          </motion.div>
        </AnimatePresence>
      )}

      <div className="risk-bar">
        <motion.div
          className="risk-bar-fill"
          initial={{ width: `${(previous ?? 0) * 100}%` }}
          animate={{ width: `${display * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}