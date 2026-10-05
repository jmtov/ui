// Dibuja las capas abiertas y maneja lo que es común a todas: Esc cierra la
// de arriba (los popovers "manual" no lo hacen solos).
import {
  type Accessor,
  For,
  Match,
  onCleanup,
  onMount,
  Switch,
} from 'solid-js';
import ConfirmLayerView from './layers/ConfirmLayerView/ConfirmLayerView';
import MenuLayerView from './layers/MenuLayerView/MenuLayerView';
import SheetLayerView from './layers/SheetLayerView/SheetLayerView';
import type { Layer } from './overlay.types';

export default function OverlayHost(props: { layers: Accessor<Layer[]> }) {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    const top = props.layers().findLast((layer) => layer.open());
    top?.cancel();
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <For each={props.layers()}>
      {(layer) => (
        <Switch>
          <Match when={layer.kind === 'confirm' && layer}>
            {(confirm) => <ConfirmLayerView layer={confirm()} />}
          </Match>
          <Match when={layer.kind === 'menu' && layer}>
            {(menu) => <MenuLayerView layer={menu()} />}
          </Match>
          <Match when={layer.kind === 'sheet' && layer}>
            {(sheet) => <SheetLayerView layer={sheet()} />}
          </Match>
        </Switch>
      )}
    </For>
  );
}
