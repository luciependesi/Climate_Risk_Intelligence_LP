//maintains a liveste str
// Maintains a live state of all devices (poll + WebSocket)
// src/hooks/useLiveDevices.js
import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------
   Helper: offline detection
   A device is offline if last_seen is older than threshold
------------------------------------------------------- */
function isOffline(lastSeenIso, thresholdMinutes = 5) {
  if (!lastSeenIso) return true;
  const last = new Date(lastSeenIso).getTime();
  const now = Date.now();
  const diffMin = (now - last) / 60000;
  return diffMin > thresholdMinutes;
}

/* -------------------------------------------------------
   Helper: classify device health
   (Used when backend doesn't provide health)
------------------------------------------------------- */
function classifyHealth(latest) {
  if (!latest) return "unknown";

  const aqi = latest.air_quality_raw ?? null;
  if (aqi == null) return "unknown";

  return aqi > 400 ? "offline" : aqi > 200 ? "warning" : "healthy";
}

/* -------------------------------------------------------
   Main Hook
------------------------------------------------------- */
export function useLiveDevices(mode = "live") {
  const [devices, setDevices] = useState({});
  const wsRef = useRef(null);

  const base = mode === "live"
    ? "http://localhost:8000/api"
    : "/mock";

  /* -------------------------------------------------------
     1. Poll device list
  ------------------------------------------------------- */
  async function fetchDevices() {
    try {
      const res = await fetch(`${base}/devices`);
      if (!res.ok) return;

      const data = await res.json();

      const mapped = {};
      data.forEach((d) => {
        mapped[d.device_id] = {
          ...d,
          // ensure last_seen is always a valid ISO string
          last_seen: d.last_seen || null,
        };
      });

      setDevices((prev) => {
        const merged = { ...prev };

        // merge new device list with existing live fields
        for (const id of Object.keys(mapped)) {
          merged[id] = {
            ...mapped[id],
            latest_reading: prev[id]?.latest_reading || null,
            health:
              prev[id]?.health ||
              classifyHealth(prev[id]?.latest_reading),
          };
        }

        return merged;
      });
    } catch (err) {
      console.error("Failed to fetch devices:", err);
    }
  }

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, [mode]);

  /* -------------------------------------------------------
     2. Subscribe to live readings (WebSocket)
  ------------------------------------------------------- */
  useEffect(() => {
    if (mode !== "live") return;

   new WebSocket("ws://localhost:8000/ws");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type !== "reading") return;

      const id = data.device_id;

      setDevices((prev) => {
        const existing = prev[id] || {};

        const updated = {
          ...existing,
          latest_reading: data,
          last_seen: new Date().toISOString(),
          health: classifyHealth(data),
        };

        return {
          ...prev,
          [id]: updated,
        };
      });
    };

    ws.onclose = () => {
      console.warn("WebSocket closed — attempting reconnect in 2s");
      setTimeout(() => {
        if (wsRef.current === ws) wsRef.current = null;
      }, 2000);
    };

    return () => ws.close();
  }, [mode]);

  /* -------------------------------------------------------
     3. Offline detection (runs every 30s)
  ------------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices((prev) => {
        const updated = { ...prev };

        for (const id of Object.keys(updated)) {
          const d = updated[id];
          const offline = isOffline(d.last_seen);

          if (offline && d.health !== "offline") {
            updated[id] = {
              ...d,
              health: "offline",
            };
          }
        }

        return updated;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  /* -------------------------------------------------------
     4. Return live device dictionary
  ------------------------------------------------------- */
  return { devices };
}