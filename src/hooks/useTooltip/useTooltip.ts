import { onCleanup } from 'solid-js';
import {
  HOVER_DELAY_MS,
  LONG_PRESS_MAX_MOVE_PX,
  LONG_PRESS_MS,
  TOUCH_LINGER_MS,
} from './useTooltip.constants';
import { hideTooltip, showTooltip } from './useTooltip.store';

// Tooltip de un botón: con el mouse, al dejarlo encima un momento (o con el foco
// del teclado); en el celular, con un long-press. Devuelve los handlers para
// ponerle al elemento y `endTouch`, que el botón llama en su `touchend`: dice si
// ese toque fue un long-press (y entonces no es un tap: no hay que ejecutar la
// acción del botón).
export function useTooltip(
  element: () => HTMLElement | undefined,
  text: () => string,
) {
  let hoverTimer: ReturnType<typeof setTimeout> | undefined;
  let pressTimer: ReturnType<typeof setTimeout> | undefined;
  let lingerTimer: ReturnType<typeof setTimeout> | undefined;
  let pressStart: { x: number; y: number } | null = null;
  let longPressed = false;

  const clearTimers = () => {
    clearTimeout(hoverTimer);
    clearTimeout(pressTimer);
    clearTimeout(lingerTimer);
  };
  onCleanup(() => {
    clearTimers();
    const el = element();
    if (el) hideTooltip(el);
  });

  const show = () => {
    const el = element();
    const label = text();
    // un botón sin nombre (Button con texto visible) no tiene tooltip
    if (el && label) showTooltip(el, label);
  };
  const hide = () => {
    clearTimers();
    const el = element();
    if (el) hideTooltip(el);
  };

  return {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(show, HOVER_DELAY_MS);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hide();
    },
    // el mouse que aprieta ya sabe lo que hace el botón
    onPointerDown: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hide();
    },
    onFocus: (event: FocusEvent) => {
      if ((event.currentTarget as HTMLElement).matches(':focus-visible'))
        show();
    },
    onBlur: hide,

    onTouchStart: (event: TouchEvent) => {
      longPressed = false;
      clearTimers();
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      pressStart = { x: touch.clientX, y: touch.clientY };
      pressTimer = setTimeout(() => {
        longPressed = true;
        show();
      }, LONG_PRESS_MS);
    },
    onTouchMove: (event: TouchEvent) => {
      if (!pressStart || longPressed) return;
      const touch = event.touches[0];
      const moved = Math.hypot(
        touch.clientX - pressStart.x,
        touch.clientY - pressStart.y,
      );
      if (moved > LONG_PRESS_MAX_MOVE_PX) {
        clearTimeout(pressTimer);
        pressStart = null;
      }
    },
    onTouchCancel: () => {
      clearTimeout(pressTimer);
      pressStart = null;
      if (longPressed) hide();
      longPressed = false;
    },
    // Android abre su menú contextual en un long-press: acá no
    onContextMenu: (event: Event) => {
      if (pressStart || longPressed) event.preventDefault();
    },
    endTouch: (): boolean => {
      clearTimeout(pressTimer);
      pressStart = null;
      if (!longPressed) return false;
      longPressed = false;
      clearTimeout(lingerTimer);
      lingerTimer = setTimeout(hide, TOUCH_LINGER_MS);
      return true;
    },
  };
}
