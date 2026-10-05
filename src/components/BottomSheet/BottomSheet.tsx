import {
  createEffect,
  createSignal,
  type JSX,
  onCleanup,
  Show,
} from 'solid-js';
import { useBottomSheet } from '../../hooks/useBottomSheet/useBottomSheet';
import { inertOutside } from '../../inert/inertOutside';
import styles from './BottomSheet.module.css';

// Bottom sheet parcial sobre native popover ("manual": top layer, pero el
// navegador no lo cierra solo ni cierra otros al abrirse — varias capas
// conviven apiladas y las cierra el OverlayHost: Esc, scrim y arrastre).
// Siempre se monta dentro del OverlayHost (ver `overlay.sheet`). Dentro del
// popover van scrim + panel propios: el ::backdrop del popover no captura
// clics fiable en WebKit.
// Copiado de ha-pwa (components/BottomSheet), mismo patrón base.

export default function BottomSheet(props: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: JSX.Element;
  headerRight?: JSX.Element;
  fullScreen?: boolean;
  // foca el primer input/select/textarea del contenido al abrir — default
  // true. Apagar en sheets donde no es el foco natural (ej. editar algo
  // donde el primer campo ya viene precargado, molesta abrir teclado).
  autofocus?: boolean;
  children: JSX.Element;
}) {
  const [rootRef, setRootRef] = createSignal<HTMLElement>();
  const [panelRef, setPanelRef] = createSignal<HTMLElement>();
  const [handleRef, setHandleRef] = createSignal<HTMLElement>();

  const drag = useBottomSheet({
    handle: handleRef,
    height: () => panelRef()?.offsetHeight ?? 0,
    onDismiss: () => props.onClose(),
    onStart: (e) =>
      !(e.target as HTMLElement).closest(`.${styles.bsheet__aside}`),
  });

  // Con el sheet abierto, Tab no puede salir hacia lo que hay detrás.
  createEffect(() => {
    const el = rootRef();
    if (!el || !props.open) return;
    onCleanup(inertOutside(el));
  });

  createEffect(() => {
    const el = rootRef();
    if (!el) return;
    try {
      const isOpen = el.matches(':popover-open');
      if (props.open && !isOpen) {
        el.showPopover();
        if (props.autofocus ?? true) {
          // recién visible ahora (display:none hasta showPopover) — el
          // focus antes de esto no agarra. Primer campo enfocable del
          // contenido, sea lo que sea: no hace falta pasar un ref.
          // `preventScroll`: el sheet recién abre con scrollTop 0, así que
          // el primer campo ya es visible sin scrollear — el
          // scroll-into-view automático de iOS no sabe cuánto tapa el
          // teclado (el panel no se achica al abrirse, mismo motivo que el
          // comentario sobre vh/dvh más abajo) y sobrestima cuánto
          // scrollear, terminando por esconder el campo en vez de
          // mostrarlo.
          panelRef()
            ?.querySelector<HTMLElement>('input, select, textarea')
            ?.focus({ preventScroll: true });
        }
      } else if (!props.open && isOpen) el.hidePopover();
    } catch {
      /* popover no soportado (Safari viejo) */
    }
  });

  // el navegador lo cierra solo (Esc / light-dismiss) -> sincronizar estado
  createEffect(() => {
    const el = rootRef();
    if (!el) return;
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === 'closed' && props.open)
        props.onClose();
    };
    el.addEventListener('toggle', onToggle);
    onCleanup(() => el.removeEventListener('toggle', onToggle));
  });

  return (
    <section
      ref={setRootRef}
      popover="manual"
      class={styles['bsheet-root']}
      aria-label={props.title}
    >
      <button
        type="button"
        class={styles.bsheet__scrim}
        aria-label="Cerrar"
        onClick={() => props.onClose()}
      />
      <div
        ref={setPanelRef}
        class={styles.bsheet}
        classList={{
          [styles['bsheet--dragging']]: drag.dragging(),
          [styles['bsheet--fullscreen']]: props.fullScreen,
        }}
        style={
          drag.dragging()
            ? { transform: `translateY(${drag.offset()}px)` }
            : undefined
        }
      >
        <div ref={setHandleRef} class={styles.bsheet__handle}>
          <div class={styles.bsheet__grabber} />
          <div class={styles.bsheet__bar}>
            <Show when={props.icon}>
              <span class={styles.bsheet__icon}>{props.icon}</span>
            </Show>
            <div class={styles.bsheet__titles}>
              <Show when={props.title}>
                <h3 class={styles.bsheet__title}>{props.title}</h3>
              </Show>
              <Show when={props.subtitle}>
                <p class={styles.bsheet__subtitle}>{props.subtitle}</p>
              </Show>
            </div>
            <Show when={props.headerRight}>
              <span class={styles.bsheet__aside}>{props.headerRight}</span>
            </Show>
          </div>
        </div>
        <div class={styles.bsheet__body}>{props.children}</div>
      </div>
    </section>
  );
}
