import { createSignal, For } from 'solid-js';
import { Button } from '../src';

// Ajusta las variables de las capas en vivo (en `:root`), sin tocar el CSS: lo
// que se deja bien acá se pasa a tokens.css.
const root = document.documentElement;
const read = (name: string) =>
  getComputedStyle(root).getPropertyValue(name).trim();
const set = (name: string, value: string) =>
  root.style.setProperty(name, value);

const EASES = {
  'entrada (frena fuerte)': 'cubic-bezier(0.32, 0.72, 0, 1)',
  'salida (estándar)': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'ease-in-out': 'ease-in-out',
  lineal: 'linear',
};

function Row(props: { label: string; name: string; min: number; max: number }) {
  const [value, setValue] = createSignal(Number.parseFloat(read(props.name)));
  return (
    <>
      <label for={props.name}>{props.label}</label>
      <input
        id={props.name}
        type="range"
        min={props.min}
        max={props.max}
        step={10}
        value={value()}
        onInput={(e) => {
          const ms = Number(e.currentTarget.value);
          setValue(ms);
          set(props.name, `${ms}ms`);
        }}
      />
      <output>{value()}ms</output>
    </>
  );
}

function RatioRow() {
  const [value, setValue] = createSignal(
    Number.parseFloat(read('--sheet-exit-ratio')),
  );
  return (
    <>
      <label for="--sheet-exit-ratio">Salida = ×</label>
      <input
        id="--sheet-exit-ratio"
        type="range"
        min={0.1}
        max={1.5}
        step={0.05}
        value={value()}
        onInput={(e) => {
          const ratio = Number(e.currentTarget.value);
          setValue(ratio);
          set('--sheet-exit-ratio', String(ratio));
        }}
      />
      <output>×{value().toFixed(2)}</output>
    </>
  );
}

function EaseRow(props: { label: string; name: string }) {
  const [value, setValue] = createSignal(read(props.name));
  return (
    <>
      <label for={props.name}>{props.label}</label>
      <input
        id={props.name}
        type="text"
        value={value()}
        onChange={(e) => {
          setValue(e.currentTarget.value);
          set(props.name, e.currentTarget.value);
        }}
      />
    </>
  );
}

export default function Tuning() {
  const [slow, setSlow] = createSignal(false);
  const [reduced, setReduced] = createSignal(false);
  // Al restablecer se vuelven a montar los controles para que lean el valor de fábrica.
  const [epoch, setEpoch] = createSignal(0);
  return (
    <div class="pg__card">
      <For each={[epoch()]}>
        {() => (
          <div class="pg__tuning">
            <Row label="Sheet" name="--sheet-duration" min={0} max={1500} />
            <RatioRow />
            <Row label="Menú" name="--menu-duration" min={0} max={600} />
            <EaseRow label="Entrada" name="--sheet-ease" />
            <EaseRow label="Salida" name="--sheet-ease-exit" />
          </div>
        )}
      </For>
      <p class="pg__muted">
        Curvas listas:{' '}
        {Object.entries(EASES)
          .map(([k, v]) => `${k}: ${v}`)
          .join(' · ')}
      </p>
      <div class="pg__row">
        <Button
          size="sm"
          active={slow()}
          onClick={() => {
            setSlow(!slow());
            set('--sheet-duration', slow() ? '500ms' : '3000ms');
          }}
        >
          Cámara lenta (3 s)
        </Button>
        <Button
          size="sm"
          active={reduced()}
          onClick={() => {
            setReduced(!reduced());
            set('--sheet-duration', reduced() ? '500ms' : '0ms');
            set('--menu-duration', reduced() ? '140ms' : '0ms');
          }}
        >
          Simular «reducir movimiento»
        </Button>
        <Button
          size="sm"
          onClick={() => {
            for (const name of [
              '--sheet-duration',
              '--menu-duration',
              '--sheet-ease',
              '--sheet-ease-exit',
              '--sheet-exit-ratio',
            ]) {
              root.style.removeProperty(name);
            }
            setSlow(false);
            setReduced(false);
            setEpoch(epoch() + 1);
          }}
        >
          Restablecer
        </Button>
      </div>
    </div>
  );
}
