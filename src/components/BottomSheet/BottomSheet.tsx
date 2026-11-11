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

/** Duración de la transición del elemento según el CSS (0 si no hay o se pidió menos movimiento). */
function transitionMs(element: HTMLElement): number {
  const first =
    getComputedStyle(element).transitionDuration.split(',')[0]?.trim() ?? '';
  const value = Number.parseFloat(first);
  if (!Number.isFinite(value)) return 0;
  return first.endsWith('ms') ? value : value * 1000;
}

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

  // La entrada y la salida las lleva `data-state` (open | closing), no
  // `:popover-open`: el popover se queda abierto (en la capa superior) mientras
  // dura la salida y recién después (al terminar su `transitionend`) se oculta. Así no depende de animar
  // `display`/`overlay` con `allow-discrete`, que Safari/WebKit no soporta
  // igual y el sheet desaparecía de golpe al cerrar.
  let frame = 0;
  createEffect(() => {
    const el = rootRef();
    if (!el) return;
    cancelAnimationFrame(frame);
    try {
      const isOpen = el.matches(':popover-open');
      if (props.open) {
        if (!isOpen) {
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
        }
        // Se fuerza el cálculo de estilo con el panel fuera de pantalla y recién
        // después se pide el estado final, para que haya transición.
        el.getBoundingClientRect();
        frame = requestAnimationFrame(() => {
          if (props.open) el.dataset.state = 'open';
        });
      } else if (isOpen && el.dataset.state !== 'closing') {
        const panel = untrack(panelRef);
        // Sin movimiento que esperar (nunca llegó a entrar, o «reducir
        // movimiento» deja la duración en 0): no habría `transitionend`.
        const animated =
          el.dataset.state === 'open' && !!panel && transitionMs(panel) > 0;
        el.dataset.state = 'closing';
        const finish = () => {
          if (props.open) return; // se volvió a abrir mientras salía
          if (el.matches(':popover-open')) el.hidePopover();
          delete el.dataset.state;
        };
        if (!animated || !panel) {
          finish();
        } else {
          const onEnd = (event: TransitionEvent) => {
            if (event.target !== panel || event.propertyName !== 'transform')
              return;
            finish();
          };
          panel.addEventListener('transitionend', onEnd);
          // Si se vuelve a abrir (o se desmonta) antes de terminar, deja de escuchar.
          onCleanup(() => panel.removeEventListener('transitionend', onEnd));
        }
      }
    } catch {
      /* popover no soportado (Safari viejo) */
    }
  });
  onCleanup(() => cancelAnimationFrame(frame));

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
