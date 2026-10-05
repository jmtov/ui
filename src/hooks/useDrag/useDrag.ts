import { createEffect, on, onCleanup } from 'solid-js';
import {
  DRAG_LOCK_THRESHOLD_PX,
  DRAG_VELOCITY_SAMPLES,
} from './useDrag.constants';

// Portado de sonos-pwa (src/shared/hooks/useDrag). Primitivo de arrastre
// con un puntero: reporta desplazamiento + velocidad + eje bloqueado, y
// deja la interpretación del gesto al que lo consume.

export interface DragState {
  dx: number;
  dy: number;
  vx: number; // px/ms
  vy: number;
  axis: 'x' | 'y';
  origin: EventTarget | null;
}

export interface UseDragOptions {
  onStart?: (e: PointerEvent) => boolean | undefined;
  onMove?: (s: DragState, e: PointerEvent) => void;
  onEnd?: (s: DragState, e: PointerEvent) => void;
  axis?: 'x' | 'y';
  lockThreshold?: number;
}

interface Sample {
  t: number;
  x: number;
  y: number;
}

export function useDrag(
  ref: () => HTMLElement | undefined,
  options: UseDragOptions,
) {
  createEffect(
    on(ref, (maybeEl) => {
      if (!maybeEl) return;
      // const con tipo ya sin undefined: los handlers de abajo son funciones
      // declaradas y TS no les propaga el narrowing del guard.
      const el: HTMLElement = maybeEl;

      const lockThreshold = options.lockThreshold ?? DRAG_LOCK_THRESHOLD_PX;
      let pointerId: number | null = null;
      let startX = 0;
      let startY = 0;
      let locked: 'x' | 'y' | null = null;
      let origin: EventTarget | null = null;
      let samples: Sample[] = [];

      function velocity() {
        if (samples.length < 2) return { vx: 0, vy: 0 };
        const a = samples[0];
        const b = samples[samples.length - 1];
        const dt = b.t - a.t || 1;
        return { vx: (b.x - a.x) / dt, vy: (b.y - a.y) / dt };
      }

      function stateFrom(e: PointerEvent): DragState {
        const { vx, vy } = velocity();
        return {
          dx: e.clientX - startX,
          dy: e.clientY - startY,
          vx,
          vy,
          axis: locked ?? 'y',
          origin,
        };
      }

      function onDown(e: PointerEvent) {
        if (pointerId !== null || (e.button !== 0 && e.pointerType === 'mouse'))
          return;
        if (options.onStart?.(e) === false) return;
        pointerId = e.pointerId;
        origin = e.target;
        startX = e.clientX;
        startY = e.clientY;
        locked = null;
        samples = [{ t: e.timeStamp, x: e.clientX, y: e.clientY }];
        // Sin capturar acá todavía — capturar en pointerdown retargetea
        // también el `click` sintético con mouse (no con touch) al elemento
        // capturado, y un tap simple (sin mover) nunca llega al <button> de
        // adentro. Se captura recién en onMove, una vez confirmado el axis
        // (línea de abajo) — un click sin movimiento nunca llega a capturar
        // nada, así que el evento sigue su curso normal hasta el botón.
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);
      }

      function onMove(e: PointerEvent) {
        if (e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        samples.push({ t: e.timeStamp, x: e.clientX, y: e.clientY });
        if (samples.length > DRAG_VELOCITY_SAMPLES) samples.shift();

        if (!locked) {
          if (Math.hypot(dx, dy) < lockThreshold) return;
          const axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
          if (options.axis && axis !== options.axis) {
            detach();
            return;
          }
          locked = axis;
          el.setPointerCapture(e.pointerId);
        }

        e.preventDefault();
        options.onMove?.(stateFrom(e), e);
      }

      function onUp(e: PointerEvent) {
        if (e.pointerId !== pointerId) return;
        const wasLocked = locked !== null;
        const s = stateFrom(e);
        detach();
        if (wasLocked) options.onEnd?.(s, e);
      }

      function detach() {
        if (pointerId !== null) {
          try {
            if (el.hasPointerCapture(pointerId))
              el.releasePointerCapture(pointerId);
          } catch {
            /* pointer already gone */
          }
        }
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointercancel', onUp);
        pointerId = null;
        locked = null;
      }

      el.addEventListener('pointerdown', onDown);
      onCleanup(() => {
        el.removeEventListener('pointerdown', onDown);
        detach();
      });
    }),
  );
}
