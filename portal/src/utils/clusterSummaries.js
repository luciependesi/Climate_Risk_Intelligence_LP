export function computeDeviceTrends(history, windowMinutes = 10) {
  const cutoff = Date.now() - windowMinutes * 60 * 1000;

  const perDevice = new Map();

  history.forEach((event) => {
    const t = new Date(event.reading.timestamp).getTime();
    if (t < cutoff) return;

    const id = event.reading.device_id;
    if (!perDevice.has(id)) {
      perDevice.set(id, []);
    }
    perDevice.get(id).push({ t, risk: event.risk.score });
  });

  const trends = {};
  perDevice.forEach((points, id) => {
    if (points.length < 2) {
      trends[id] = "stable";
      return;
    }
    const sorted = points.sort((a, b) => a.t - b.t);
    const first = sorted[0].risk;
    const last = sorted[sorted.length - 1].risk;
    const delta = last - first;

    if (delta > 10) trends[id] = "up";
    else if (delta < -10) trends[id] = "down";
    else trends[id] = "stable";
  });

  return trends;
}

export function summarizeClusters(devicesMap, history) {
  const trends = computeDeviceTrends(history);

  const summary = {
    high: { total: 0, up: 0, down: 0, stable: 0 },
    medium: { total: 0, up: 0, down: 0, stable: 0 },
    low: { total: 0, up: 0, down: 0, stable: 0 },
    stable: { total: 0, up: 0, down: 0, stable: 0 },
    unknown: { total: 0, up: 0, down: 0, stable: 0 },
  };

  Object.values(devicesMap).forEach((event) => {
    const { reading, risk } = event;
    const id = reading.device_id;
    const level = (risk.level || "Unknown").toLowerCase();
    const trend = trends[id] || "stable";

    const bucket =
      level === "high" ? "high" :
      level === "medium" ? "medium" :
      level === "low" ? "low" :
      level === "stable" ? "stable" :
      "unknown";

    summary[bucket].total += 1;
    summary[bucket][trend] += 1;
  });

  return summary;
}