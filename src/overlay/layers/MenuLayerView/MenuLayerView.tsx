// Menú "..." nativo: HTML Popover API (top layer) + CSS anchor positioning
// (lo cuelga del botón que lo abrió, sin JS de posicionamiento). Es un popover
// "manual": cierra con tap afuera y Esc a través del store, no del navegador,
// para no cerrar por accidente otras capas abiertas debajo.

import { IconCheck } from '@tabler/icons-solidjs';
import { createEffect, For, onCleanup, onMount, Show } from 'solid-js';
import type { MenuOption } from '../../../components/PopoverMenu/PopoverMenu.types';
import { menuAnchorName } from '../../overlay.constants';
import type { MenuLayer } from '../../overlay.types';
import styles from './MenuLayerView.module.css';

export default function MenuLayerView(props: { layer: MenuLayer }) {
  let menuRef: HTMLDivElement | undefined;
  const anchorName = menuAnchorName(props.layer.id);
  // Reserva el espacio del check solo si ALGUNA opción está activa de
  // verdad ahora — así el ítem activo no corre el ícono propio de los
  // demás, pero el menú queda limpio (sin gutter de más) cuando no hay
  // nada seleccionado.
  const hasCheckColumn = () => props.layer.options().some((o) => o.active);

  const select = (opt: MenuOption) => {
    if (opt.disabled) return;
    opt.onSelect();
    props.layer.cancel();
  };

  onMount(() => {
    const { anchor } = props.layer;
    anchor.style.setProperty('anchor-name', anchorName);
    menuRef?.showPopover();

    // Tap afuera cierra. El propio botón queda excluido: tocarlo de nuevo lo
    // resuelve el store (alterna), no este listener.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef?.contains(target) || anchor.contains(target)) return;
      props.layer.cancel();
    };
    document.addEventListener('pointerdown', onPointerDown, true);

    // Si el botón sale del DOM con el menú abierto (la lista se refrescó y
    // rehízo la fila), el menú perdería su ancla y saltaría a la esquina de la
    // pantalla: mejor cerrarlo.
    const observer = new MutationObserver(() => {
      if (!anchor.isConnected) props.layer.cancel();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    onCleanup(() => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      observer.disconnect();
      // Solo si el nombre sigue siendo el de esta capa: si el mismo botón
      // abrió otro menú mientras este terminaba de cerrarse, el nombre ya es el
      // de ese otro, y quitarlo lo dejaría sin ancla.
      if (anchor.style.getPropertyValue('anchor-name') === anchorName) {
        anchor.style.removeProperty('anchor-name');
      }
    });
  });

  createEffect(() => {
    if (props.layer.open()) return;
    try {
      menuRef?.hidePopover();
    } catch {
      /* ya estaba cerrado */
    }
  });

  return (
    <div
      ref={menuRef}
      popover="manual"
      class={styles.menu}
      style={{ 'position-anchor': anchorName }}
    >
      <For each={props.layer.options()}>
        {(opt, i) => (
          <>
            <Show when={opt.divider && i() > 0}>
              <div class={styles.divider} />
            </Show>
            <button
              type="button"
              class={styles.item}
              classList={{
                [styles['item--active']]: !!opt.active,
                [styles['item--danger']]: opt.tone === 'danger',
              }}
              disabled={opt.disabled}
              onClick={() => select(opt)}
            >
              <Show when={hasCheckColumn()}>
                <span
                  class={styles.item__check}
                  classList={{ [styles['item__check--hidden']]: !opt.active }}
                  aria-hidden="true"
                >
                  <IconCheck />
                </span>
              </Show>
              <Show when={opt.icon}>
                <span class={styles.item__icon} aria-hidden="true">
                  {opt.icon}
                </span>
              </Show>
              {opt.label}
            </button>
          </>
        )}
      </For>
    </div>
  );
}
