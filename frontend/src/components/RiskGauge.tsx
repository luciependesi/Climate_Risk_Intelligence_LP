//Risk‑Score Animation Component (Gauge, Bar, Color Transitions)
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  score: number | null;
  previous: number | null;
  loading: boolean;
};

export function RiskGauge({ score, previous, loading }: Props) {
  const display = score ?? previous ?? 0;

  const color =
    display >= 0.8
      ? "var(--critical)"
      : display >= 0.6
      ? "var(--warning)"
      : "var(--accent)";

      const arrow = getTrendArrow(previous, score);

<div className="trend-arrow" style={{ fontSize: "1.4rem" }}>
  {arrow}
</div>
  return (
    <div className="risk-gauge card">
      <div className="card-title">Unified Risk Score</div>

      {loading ? (
        <div className="skeleton" style={{ height: "3rem", width: "40%" }} />
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={display}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: "2.8rem",
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
          animate={{ width: `${(score ?? previous ?? 0) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}