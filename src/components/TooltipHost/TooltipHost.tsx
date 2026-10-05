// Dibuja el tooltip que esté a la vista (ver useTooltip): un solo popover para
// toda la app, en el top layer y colgado de su botón con CSS anchor positioning,
// igual que el menú. Se monta una vez, en App.
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { hideTooltip, tooltip } from '../../hooks/useTooltip/useTooltip.store';
import {
  TOOLTIP_ANCHOR,
  TOP_ZONE_PX,
  VIEWPORT_MARGIN_PX,
} from './TooltipHost.constants';
import styles from './TooltipHost.module.css';
import { shiftToFit } from './TooltipHost.utils';

export default function TooltipHost() {
  let ref: HTMLDivElement | undefined;
  // el texto sigue ahí mientras el tooltip se desvanece
  const [text, setText] = createSignal('');

  createEffect<HTMLElement | undefined>((previous) => {
    const current = tooltip();
    previous?.style.removeProperty('anchor-name');
    if (!current) {
      try {
        ref?.hidePopover();
      } catch {
        /* ya estaba cerrado */
      }
      return undefined;
    }
    setText(current.text);
    current.anchor.style.setProperty('anchor-name', TOOLTIP_ANCHOR);
    if (!ref) return current.anchor;
    ref.style.translate = '';
    ref.dataset.side =
      current.anchor.getBoundingClientRect().top < TOP_ZONE_PX
        ? 'bottom'
        : 'top';
    ref.showPopover();
    // El tooltip va centrado sobre su botón: uno pegado al borde de la pantalla
    // se saldría. Ya posicionado, se corre lo justo para que quepa.
    requestAnimationFrame(() => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const shift = shiftToFit(
        rect.left,
        rect.right,
        window.innerWidth,
        VIEWPORT_MARGIN_PX,
      );
      if (shift) ref.style.translate = `${shift}px 0`;
    });
    return current.anchor;
  });

  // Un scroll o un toque en cualquier lado lo cierra: el botón ya se movió, o
  // el usuario ya vio lo que quería.
  onMount(() => {
    const close = () => hideTooltip();
    window.addEventListener('scroll', close, true);
    onCleanup(() => window.removeEventListener('scroll', close, true));
  });

  return (
    <div ref={ref} popover="manual" role="tooltip" class={styles.tooltip}>
      {text()}
    </div>
  );
}
