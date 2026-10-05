import { createSignal } from 'solid-js';
import { useDrag } from '../useDrag/useDrag';
import {
  SWIPE_REVEAL_MAX_PX,
  SWIPE_RUBBER_BAND,
  SWIPE_TRIGGER_FRACTION,
} from './useSwipeAction.constants';

// Swipe horizontal, cualquiera de los dos lados dispara la misma acción
// (ver SwipeRow) — portado de ha-pwa, mismo primitivo (useDrag) que
// useBottomSheet, eje x en vez de y. `offset` es cuánto correr la fila
// mientras se arrastra.
export function useSwipeAction(
  ref: () => HTMLElement | undefined,
  onTrigger: () => void,
) {
  const [offset, setOffset] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);

  useDrag(ref, {
    axis: 'x',
    onStart: (e) => !(e.target as HTMLElement).closest('[data-swipe-ignore]'),
    onMove: (s) => {
      setDragging(true);
      const abs = Math.abs(s.dx);
      const clamped =
        abs <= SWIPE_REVEAL_MAX_PX
          ? s.dx
          : Math.sign(s.dx) *
            (SWIPE_REVEAL_MAX_PX +
              (abs - SWIPE_REVEAL_MAX_PX) * SWIPE_RUBBER_BAND);
      setOffset(clamped);
    },
    onEnd: () => {
      const triggered =
        Math.abs(offset()) > SWIPE_REVEAL_MAX_PX * SWIPE_TRIGGER_FRACTION;
      setDragging(false);
      setOffset(0);
      if (triggered) onTrigger();
    },
  });

  return { offset, dragging };
}
