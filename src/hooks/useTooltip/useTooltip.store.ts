// El tooltip que está a la vista: uno solo para toda la app (lo dibuja
// TooltipHost), colgado del botón que lo pidió. Mismo criterio que el menú de
// overlay: una lista con 50 botones no monta 50 tooltips.
import { createSignal } from 'solid-js';

export interface TooltipState {
  anchor: HTMLElement;
  text: string;
}

const [tooltip, setTooltip] = createSignal<TooltipState | null>(null);

export { tooltip };

export function showTooltip(anchor: HTMLElement, text: string) {
  setTooltip({ anchor, text });
}

// Con `anchor`, solo lo cierra si es el de ese botón (otro botón pudo haber
// pedido el suyo mientras tanto).
export function hideTooltip(anchor?: HTMLElement) {
  if (!anchor || tooltip()?.anchor === anchor) setTooltip(null);
}
