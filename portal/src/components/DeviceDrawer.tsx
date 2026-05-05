//divices details drawer with charts and risk gauge
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { HourlyAQIChart } from "./HourlyAQIChart";
import { DailyEnvChart } from "./DailyEnvChart";
import { RiskGauge } from "./RiskGauge";

export function DeviceDrawer({ deviceId, onClose }: any) {
  const { theme } = useTheme();

  if (!deviceId) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "380px",
        height: "100vh",
        background: theme.card,
        borderLeft: `1px solid ${theme.border}`,
        padding: 16,
        overflowY: "auto",
        zIndex: 300,
      }}
    >
      <button
        onClick={onClose}
        style={{
          marginBottom: 16,
          background: theme.card,
          border: `1px solid ${theme.border}`,
          padding: "6px 10px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Close ✕
      </button>

      <h2>Device {deviceId}</h2>

      <RiskGauge deviceId={deviceId} />
      <HourlyAQIChart deviceId={deviceId} />
      <DailyEnvChart deviceId={deviceId} />
    </motion.div>
  );
}