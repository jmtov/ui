import type { JSX } from 'solid-js';
import type { TapPoint } from './useTap.types';
import { isEchoOfTap, isTap } from './useTap.utils';

interface UseTapOptions {
  onTap: () => void;
  // sin esto (o con false) no se toca nada del toque y solo queda el click:
  // un botón con `popovertarget` se activa con el `click`, y cancelar el
  // `touchend` lo dejaría sin abrir
  handleTouch?: () => boolean;
  disabled?: () => boolean;
}

type ButtonHandler<E extends Event> = JSX.EventHandler<HTMLElement, E>;

// Dispara la acción en el `touchend` en vez de esperar al `click`. En el celular
// el `click` a veces no llega (por ejemplo, si el dedo se desliza un poco sobre
// un elemento fijo y el navegador lo toma por un arrastre), y `touchend` sí.
// Para no ejecutar dos veces: el `touchend` cancela el `click` que vendría
// después, solo cuenta si fue un toque (poco movimiento, corto) y, por si algún
// navegador lo manda igual, el `click` se ignora si acaba de haber un toque.
// El mouse y el teclado siguen usando el `click`.
export function useTap(options: UseTapOptions) {
  let start: TapPoint | null = null;
  let lastTapTime = 0;

  const active = () =>
    (options.handleTouch?.() ?? true) && !(options.disabled?.() ?? false);

  const onTouchStart: ButtonHandler<TouchEvent> = (event) => {
    if (!active() || event.touches.length !== 1) {
      start = null;
      return;
    }
    const touch = event.touches[0];
    start = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };

  const onTouchEnd: ButtonHandler<TouchEvent> = (event) => {
    if (!active() || !start) return;
    const touch = event.changedTouches[0];
    const end = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    const tapped = isTap(start, end);
    start = null;
    if (!tapped) return;
    // cancela el `click` que el navegador generaría después de este toque
    if (event.cancelable) event.preventDefault();
    lastTapTime = end.time;
    options.onTap();
  };

  const onTouchCancel: ButtonHandler<TouchEvent> = () => {
    start = null;
  };

  const onClick: ButtonHandler<MouseEvent> = () => {
    if (options.disabled?.()) return;
    if (isEchoOfTap(lastTapTime, Date.now())) return;
    options.onTap();
  };

  return { onTouchStart, onTouchEnd, onTouchCancel, onClick };
}
