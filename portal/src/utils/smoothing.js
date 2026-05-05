export function rollingAverage(data, window = 5) {
  return data.map((d, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    const avg =
      slice.reduce((sum, p) => sum + (p.value ?? 0), 0) / slice.length;

    return { ...d, smoothed: avg };
  });
}