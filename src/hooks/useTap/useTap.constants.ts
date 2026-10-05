// Cuánto puede moverse el dedo (px) y cuánto puede durar un toque (ms) para
// seguir contando como toque y no como el final de un scroll o un arrastre.
export const TAP_MAX_MOVE_PX = 10;
export const TAP_MAX_DURATION_MS = 500;

// Tras un toque, un `click` que llegue dentro de esta ventana (ms) se ignora:
// es el que el navegador genera solo después del `touchend`, y la acción ya
// corrió.
export const CLICK_AFTER_TAP_MS = 500;
