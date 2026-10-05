// Cuántos px (horizontal) correr algo que ocupa de `left` a `right` para que
// quede a `margin` del borde de una pantalla de `viewportWidth`. 0 si ya cabe.
export function shiftToFit(
  left: number,
  right: number,
  viewportWidth: number,
  margin: number,
): number {
  const overLeft = margin - left;
  if (overLeft > 0) return overLeft;
  const overRight = right - (viewportWidth - margin);
  return overRight > 0 ? -overRight : 0;
}
