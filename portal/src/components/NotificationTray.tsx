//notification tray component to show messages to the user.
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export function NotificationTray({ messages }: any) {
  const { theme } = useTheme();

  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 500 }}>
      <AnimatePresence>
        {messages.map((m: any) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              padding: "10px 14px",
              borderRadius: 8,
              marginBottom: 8,
              minWidth: 200,
            }}
          >
            {m.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}