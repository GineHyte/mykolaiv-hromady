// Deterministic fallback position for hromady without saved coordinates,
// so every entry still gets a stable marker on the map instead of jumping
// to a new random spot on every render.
export function resolveCoords(hromada) {
  if (hromada.coords) return hromada.coords;
  const seed = hromada.id || 0;
  const jitter = (n) => ((Math.sin(seed * n) + 1) / 2);
  return [47.0 + jitter(12.9898) * 0.6, 31.5 + jitter(78.233) * 0.9];
}
