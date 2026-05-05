export function spatialCluster(devicesMap, cellSizeDeg = 0.05) {
  const cells = new Map();

  Object.values(devicesMap).forEach((event) => {
    const r = event.reading;
    if (r.latitude == null || r.longitude == null) return;

    const latKey = Math.floor(r.latitude / cellSizeDeg);
    const lonKey = Math.floor(r.longitude / cellSizeDeg);
    const key = `${latKey}:${lonKey}`;

    if (!cells.has(key)) {
      cells.set(key, {
        latKey,
        lonKey,
        devices: [],
      });
    }
    cells.get(key).devices.push(event);
  });

  return Array.from(cells.values());
}