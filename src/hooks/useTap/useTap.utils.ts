import {
  CLICK_AFTER_TAP_MS,
  TAP_MAX_DURATION_MS,
  TAP_MAX_MOVE_PX,
} from './useTap.constants';
import type { TapPoint } from './useTap.types';

// ¿Fue un toque? El dedo casi no se movió y no se quedó apoyado: si no, es el
// final de un scroll o de un arrastre y no debe disparar la acción.
export function isTap(start: TapPoint, end: TapPoint): boolean {
  const moved = Math.hypot(end.x - start.x, end.y - start.y);
  return (
    moved <= TAP_MAX_MOVE_PX && end.time - start.time <= TAP_MAX_DURATION_MS
  );
}

// El `click` que el navegador genera solo tras un `touchend` (si no se
// canceló) no debe repetir la acción que el toque ya ejecutó.
export function isEchoOfTap(lastTapTime: number, now: number): boolean {
  return now - lastTapTime < CLICK_AFTER_TAP_MS;
}
