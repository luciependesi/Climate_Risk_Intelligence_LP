export function smoothTransition(from: number, to: number, steps = 20) {
  const diff = to - from;
  return Array.from({ length: steps }, (_, i) => from + (diff * i) / steps);
}