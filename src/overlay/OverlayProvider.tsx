// Punto único de montaje de las capas de la app. Quien quiera abrir un
// diálogo o un menú lo pide con `useOverlay()` (confirm / menu); no monta
// nada por su cuenta.
import type { ParentProps } from 'solid-js';
import OverlayHost from './OverlayHost';
import { OverlayContext } from './overlay.context';
import { createOverlayStore } from './overlay.store';

export default function OverlayProvider(props: ParentProps) {
  const store = createOverlayStore();

  return (
    <OverlayContext.Provider
      value={{
        confirm: store.confirm,
        menu: store.menu,
        sheet: store.sheet,
      }}
    >
      {props.children}
      <OverlayHost layers={store.layers} />
    </OverlayContext.Provider>
  );
}
