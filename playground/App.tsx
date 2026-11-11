import { createSignal, For, type JSX } from 'solid-js';
import { Button } from '../src';
import { log } from './log';
import Components from './scenarios/components';
import Confirms from './scenarios/confirms';
import Menus from './scenarios/menus';
import Sheets from './scenarios/sheets';
import Tuning from './Tuning';

const PAGES: Record<string, () => JSX.Element> = {
  componentes: Components,
  sheets: Sheets,
  menús: Menus,
  confirmaciones: Confirms,
};

const fromHash = () => {
  const name = decodeURIComponent(window.location.hash.slice(1));
  return name in PAGES ? name : 'componentes';
};

export default function App() {
  const [page, setPage] = createSignal(fromHash());
  window.addEventListener('hashchange', () => setPage(fromHash()));
  return (
    <div class="pg">
      <h1>@enrique/ui · playground</h1>
      <p class="pg__muted">
        Compila directo desde src/. Los cambios se ven al guardar.
      </p>

      <h2>Tuning</h2>
      <Tuning />

      <nav class="pg__nav">
        <For each={Object.keys(PAGES)}>
          {(name) => (
            <Button
              size="sm"
              active={page() === name}
              onClick={() => {
                window.location.hash = encodeURIComponent(name);
              }}
            >
              {name}
            </Button>
          )}
        </For>
      </nav>

      {PAGES[page()]?.()}

      <h2>Bitácora</h2>
      <ul class="pg__log">
        <For each={log()}>{(line) => <li>{line}</li>}</For>
      </ul>
    </div>
  );
}
