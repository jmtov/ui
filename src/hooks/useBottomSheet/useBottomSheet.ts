import { type Accessor, createSignal } from 'solid-js';
import { useDrag } from '../useDrag/useDrag';
import {
  SHEET_DISMISS_FRACTION,
  SHEET_FLING_VELOCITY,
  SHEET_RUBBER_BAND,
} from './useBottomSheet.constants';

// Portado de ha-pwa: arrastre-para-descartar en eje Y para un bottom sheet
// parcial. El snap-back / slide-out son transiciones CSS del componente;
// este hook solo reporta `offset` mientras el dedo está abajo.

export interface UseBottomSheetOptions {
  handle: () => HTMLElement | undefined;
  height: () => number;
  onDismiss: () => void;
  // ver useDrag — para excluir controles interactivos dentro del handle de
  // arrancar el drag.
  onStart?: (e: PointerEvent) => boolean | undefined;
}

export interface BottomSheet {
  offset: Accessor<number>;
  dragging: Accessor<boolean>;
}

export function useBottomSheet(options: UseBottomSheetOptions): BottomSheet {
  const [offset, setOffset] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);

  useDrag(options.handle, {
    axis: 'y',
    onStart: options.onStart,
    onMove: (s) => {
      setDragging(true);
      setOffset(s.dy >= 0 ? s.dy : s.dy * SHEET_RUBBER_BAND);
    },
    onEnd: (s) => {
      const dismiss =
        s.vy > SHEET_FLING_VELOCITY ||
        (s.vy > -SHEET_FLING_VELOCITY &&
          offset() > options.height() * SHEET_DISMISS_FRACTION);
      setDragging(false);
      setOffset(0);
      if (dismiss) options.onDismiss();
    },
  });

  return { offset, dragging };
}
