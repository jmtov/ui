import {
  children,
  createComputed,
  createEffect,
  createSignal,
  type JSX,
  onCleanup,
  Show,
  untrack,
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

const KEYBOARD_MIN_PX = 100;

// Lo último que la hoja mostró estando abierta. Al cerrarse, quien la usa suele
// vaciar de golpe título, íconos y contenido (porque ya no hay nada
// seleccionado); sin esto la hoja saldría vacía y encogida. Con esto sale tal
// como estaba. Se actualiza solo mientras `open` es true.
function retainWhileOpen<T>(open: () => boolean, value: () => T): () => T {
  const [kept, setKept] = createSignal<T>(untrack(value));
  createComputed(() => {
    if (open()) {
      const next = value();
      setKept(() => next);
    }
  });
  return kept;
}

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

  const isOpen = () => props.open;
  const title = retainWhileOpen(isOpen, () => props.title);
  const subtitle = retainWhileOpen(isOpen, () => props.subtitle);
  const fullScreen = retainWhileOpen(isOpen, () => props.fullScreen);
  const icon = retainWhileOpen(
    isOpen,
    children(() => props.icon),
  );
  const headerRight = retainWhileOpen(
    isOpen,
    children(() => props.headerRight),
  );
  const body = retainWhileOpen(
    isOpen,
    children(() => props.children),
  );

  const drag = useBottomSheet({
    handle: handleRef,
    height: () => panelRef()?.offsetHeight ?? 0,
    onDismiss: () => props.onClose(),
    onStart: (e) =>
      !(e.target as HTMLElement).closest(`.${styles.bsheet__aside}`),
  });

  // Cuánto tapa el teclado en pantalla: la diferencia entre el viewport de
  // layout y el visual. iOS no achica el layout al abrirlo, pero sí el visual.
  // Solo se mide con el sheet abierto; por debajo de KEYBOARD_MIN_PX es ruido
  // (barra de URL, zoom), no un teclado.
  const [keyboard, setKeyboard] = createSignal(0);
  createEffect(() => {
    const vv = window.visualViewport;
    if (!props.open || !vv) return;
    const update = () => {
      const covered = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboard(covered > KEYBOARD_MIN_PX ? Math.round(covered) : 0);
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    onCleanup(() => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      setKeyboard(0);
    });
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
      aria-label={title()}
      data-keyboard={keyboard() > 0 ? '' : undefined}
      style={keyboard() > 0 ? { '--kb': `${keyboard()}px` } : undefined}
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
          [styles['bsheet--fullscreen']]: fullScreen(),
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
            <Show when={icon()}>
              <span class={styles.bsheet__icon}>{icon()}</span>
            </Show>
            <div class={styles.bsheet__titles}>
              <Show when={title()}>
                <h3 class={styles.bsheet__title}>{title()}</h3>
              </Show>
              <Show when={subtitle()}>
                <p class={styles.bsheet__subtitle}>{subtitle()}</p>
              </Show>
            </div>
            <Show when={headerRight()}>
              <span class={styles.bsheet__aside}>{headerRight()}</span>
            </Show>
          </div>
        </div>
        <div class={styles.bsheet__body}>{body()}</div>
      </div>
    </section>
  );
}
