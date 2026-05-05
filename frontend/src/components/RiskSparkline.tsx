import { motion } from "framer-motion";

export function RiskSparkline({ values }: { values: number[] }) {
  if (!values || values.length === 0) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);

  const normalized = values.map(v => (v - min) / (max - min || 1));

  return (
    <svg width="100%" height="40" style={{ overflow: "visible" }}>
      {normalized.map((v, i) => {
        const x = (i / (normalized.length - 1)) * 100;
        const y = 40 - v * 40;

        return (
          <motion.circle
            key={i}
            cx={`${x}%`}
            cy={y}
            r={2}
            fill="var(--accent)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
          />
        );
      })}
    </svg>
  );
}