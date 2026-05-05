//SensorCard Component (with skeleton + transitions)
import { motion } from "framer-motion";

export function SensorCard({
  title,
  value,
  unit,
  loading,
}: {
  title: string;
  value: number | null | undefined;
  unit?: string;
  loading: boolean;
}) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>

      {loading ? (
        <div className="skeleton" style={{ height: "2rem", width: "50%" }} />
      ) : (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: "1.8rem", fontWeight: 500 }}
        >
          {value?.toFixed(1)} {unit}
        </motion.div>
      )}
    </div>
  );
}