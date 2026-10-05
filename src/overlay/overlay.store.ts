// Estado de las capas (diálogos, menús): qué hay abierto y en qué orden. Sin
// JSX — quien lo dibuja es OverlayHost.
import { createSignal } from 'solid-js';
import { CLOSE_MS } from './overlay.constants';
import type {
  ConfirmLayer,
  ConfirmOptions,
  Layer,
  MenuLayer,
  OverlayStore,
  SheetLayer,
} from './overlay.types';

export function createOverlayStore(): OverlayStore {
  const [layers, setLayers] = createSignal<Layer[]>([]);
  let nextId = 0;

  function add(layer: Layer) {
    setLayers((current) => [...current, layer]);
  }

  // La capa deja de estar abierta ya (arranca su animación de salida) y se
  // desmonta cuando esta termina.
  function remove(layer: Layer, setOpen: (open: boolean) => void) {
    setOpen(false);
    setTimeout(
      () => setLayers((current) => current.filter((item) => item !== layer)),
      CLOSE_MS,
    );
  }

  function confirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const [open, setOpen] = createSignal(true);
      const [pending, setPending] = createSignal(false);

      const layer: ConfirmLayer = {
        kind: 'confirm',
        id: nextId++,
        options,
        open,
        pending,
        cancel: () => {
          // mientras corre la acción no se puede abandonar a medias
          if (pending() || !open()) return;
          resolve(false);
          remove(layer, setOpen);
        },
        accept: async () => {
          if (pending() || !open()) return;
          if (options.action) {
            setPending(true);
            try {
              // `false` = no salió bien (y ya se avisó): queda abierto, para
              // reintentar o cancelar. Lo mismo si lanza.
              if ((await options.action()) === false) return;
            } catch (error) {
              console.error(error);
              return;
            } finally {
              setPending(false);
            }
          }
          resolve(true);
          remove(layer, setOpen);
        },
      };
      add(layer);
    });
  }

  function menu(anchor: HTMLElement, options: MenuLayer['options']): void {
    const current = layers().find(
      (layer): layer is MenuLayer => layer.kind === 'menu' && layer.open(),
    );
    // un solo menú a la vez: abrir otro cierra el anterior, y tocar de nuevo
    // el mismo botón lo cierra
    current?.cancel();
    if (current?.anchor === anchor) return;

    const [open, setOpen] = createSignal(true);
    const layer: MenuLayer = {
      kind: 'menu',
      id: nextId++,
      anchor,
      options,
      open,
      cancel: () => {
        if (!open()) return;
        remove(layer, setOpen);
      },
    };
    add(layer);
  }

  const sheet: OverlayStore['sheet'] = (component, props) =>
    new Promise((resolve) => {
      const [open, setOpen] = createSignal(true);
      const close = (result?: unknown) => {
        if (!open()) return;
        resolve(result as never);
        remove(layer, setOpen);
      };
      const layer: SheetLayer = {
        kind: 'sheet',
        id: nextId++,
        component,
        props,
        open,
        close,
        cancel: () => close(),
      };
      add(layer);
    });

  return { layers, confirm, menu, sheet };
}
