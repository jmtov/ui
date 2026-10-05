import type { Accessor, Component, JSX } from 'solid-js';
import type { MenuOption } from '../components/PopoverMenu/PopoverMenu.types';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string; // default "Eliminar"
  pendingLabel?: string; // default "Eliminando…"
  // Lo que pasa al confirmar. Si viene, el diálogo queda abierto en estado
  // "pendiente" hasta que termine, y `confirm` resuelve true recién ahí; si
  // falla (lanza, o devuelve `false` tras avisar el error por su cuenta), el
  // diálogo sigue abierto para reintentar o cancelar.
  action?: () => unknown;
}

interface LayerBase {
  id: number;
  // false desde que se pide cerrar hasta que termina la animación de salida
  open: Accessor<boolean>;
  // lo que pasa con Esc, el scrim o el gesto de cerrar
  cancel: () => void;
}

export interface ConfirmLayer extends LayerBase {
  kind: 'confirm';
  options: ConfirmOptions;
  pending: Accessor<boolean>;
  accept: () => Promise<void>;
}

export interface MenuLayer extends LayerBase {
  kind: 'menu';
  anchor: HTMLElement;
  options: Accessor<MenuOption[]>;
}

// Lo que recibe el componente de un sheet abierto con `overlay.sheet`, además
// de sus propias props. El componente dibuja su propio BottomSheet usando
// `open` y `onClose`, y termina con `close(resultado)`.
export interface SheetLayerProps<Result = void> {
  open: boolean;
  onClose: () => void;
  close: (result?: Result) => void;
}

export interface SheetLayer extends LayerBase {
  kind: 'sheet';
  // tipos borrados: el store no sabe de cada sheet, `sheet()` los ata por fuera
  // biome-ignore lint/suspicious/noExplicitAny: heterogéneo por diseño
  component: Component<any>;
  props: object;
  close: (result?: unknown) => void;
}

export type Layer = ConfirmLayer | MenuLayer | SheetLayer;

export interface OverlayApi {
  // Resuelve true si se confirmó, false si se canceló.
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  // Abre el menú colgado de `anchor` (o lo cierra, si ya estaba abierto ahí).
  // `options` es un getter: el menú refleja cambios mientras está abierto.
  menu: (anchor: HTMLElement, options: Accessor<MenuOption[]>) => void;
  // Abre un sheet y resuelve con lo que pase a `close(resultado)`, o con
  // undefined si se cierra sin resultado (Esc, scrim, arrastre). El estado del
  // sheet vive en su componente: se monta al abrir y se desmonta al cerrar, así
  // que cada apertura arranca limpia y nadie le resetea el estado desde afuera.
  // `props` son las del componente. Lo reactivo se pasa como getters del
  // objeto (`{ get filters() { return filters(); } }`) o como funciones, según
  // la prop. Los callbacks con parámetros se anotan (`async (x: Tipo) => …`):
  // sin tipo, TypeScript infiere mal las props desde el componente.
  sheet: <Result, Props extends object>(
    component: (props: Props & SheetLayerProps<Result>) => JSX.Element,
    props: Props,
  ) => Promise<Result | undefined>;
}

export interface OverlayStore extends OverlayApi {
  layers: Accessor<Layer[]>;
}
