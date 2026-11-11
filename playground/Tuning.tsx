import { createSignal, For } from 'solid-js';
import { Button } from '../src';

// Ajusta las variables del tema en vivo (en `:root`), sin tocar el CSS: lo que se
// deja bien acá se pasa a tokens.css (o al `:root` de la app que lo quiera así).
const root = document.documentElement;
const read = (name: string) =>
  getComputedStyle(root).getPropertyValue(name).trim();
const set = (name: string, value: string) =>
  root.style.setProperty(name, value);

// Lo que dice el CSS ("2rem", "400ms", "0.5") como número en la unidad del control.
function toNumber(raw: string, unit: string): number {
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return 0;
  if (unit === 'px' && raw.endsWith('rem')) return value * 16;
  return value;
}

const MOTION = [
  '--sheet-duration',
  '--sheet-exit-ratio',
  '--menu-duration',
  '--sheet-ease',
  '--sheet-ease-exit',
];
const SHAPE = [
  '--radius-action',
  '--radius-menu',
  '--radius-surface',
  '--text-scale',
  '--space-scale',
];

function Row(props: {
  label: string;
  name: string;
  min: number;
  max: number;
  step: number;
  unit: 'ms' | 'px' | '×';
}) {
  const [value, setValue] = createSignal(
    toNumber(read(props.name), props.unit),
  );
  const css = (n: number) =>
    props.unit === '×' ? String(n) : `${n}${props.unit}`;
  return (
    <>
      <label for={props.name}>{props.label}</label>
      <input
        id={props.name}
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={value()}
        onInput={(e) => {
          const n = Number(e.currentTarget.value);
          setValue(n);
          set(props.name, css(n));
        }}
      />
      <output>
        {props.unit === '×'
          ? `×${value().toFixed(2)}`
          : `${value()}${props.unit}`}
      </output>
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

// Cualquier variable, para probar el override de un componente
// (`--button-radius`, `--menu-padding`…) sin escribir CSS.
function FreeVar() {
  const [name, setName] = createSignal('--button-radius');
  const [value, setValue] = createSignal('0');
  return (
    <div class="pg__row">
      <input
        aria-label="Variable"
        type="text"
        value={name()}
        onInput={(e) => setName(e.currentTarget.value)}
        style={{ flex: '2 1 10rem' }}
      />
      <input
        aria-label="Valor"
        type="text"
        value={value()}
        onInput={(e) => setValue(e.currentTarget.value)}
        style={{ flex: '1 1 5rem' }}
      />
      <Button size="sm" onClick={() => set(name(), value())}>
        Aplicar
      </Button>
    </div>
  );
}

export default function Tuning() {
  const [slow, setSlow] = createSignal(false);
  const [reduced, setReduced] = createSignal(false);
  // Al restablecer o aplicar un preset se vuelven a montar los controles para que lean el valor actual.
  const [epoch, setEpoch] = createSignal(0);
  const remount = () => setEpoch(epoch() + 1);
  const clear = (names: string[]) => {
    for (const name of names) root.style.removeProperty(name);
  };
  return (
    <div class="pg__card">
      <For each={[epoch()]}>
        {() => (
          <>
            <strong>Forma</strong>
            <div class="pg__tuning">
              <Row
                label="Radio acción"
                name="--radius-action"
                min={0}
                max={32}
                step={2}
                unit="px"
              />
              <Row
                label="Radio menú"
                name="--radius-menu"
                min={0}
                max={32}
                step={2}
                unit="px"
              />
              <Row
                label="Radio superficie"
                name="--radius-surface"
                min={0}
                max={40}
                step={2}
                unit="px"
              />
              <Row
                label="Texto"
                name="--text-scale"
                min={0.8}
                max={1.4}
                step={0.05}
                unit="×"
              />
              <Row
                label="Espaciado"
                name="--space-scale"
                min={0.5}
                max={2}
                step={0.05}
                unit="×"
              />
            </div>
            <FreeVar />
            <strong>Movimiento</strong>
            <div class="pg__tuning">
              <Row
                label="Sheet"
                name="--sheet-duration"
                min={0}
                max={1500}
                step={10}
                unit="ms"
              />
              <Row
                label="Salida"
                name="--sheet-exit-ratio"
                min={0.1}
                max={1.5}
                step={0.05}
                unit="×"
              />
              <Row
                label="Menú"
                name="--menu-duration"
                min={0}
                max={600}
                step={10}
                unit="ms"
              />
              <EaseRow label="Entrada" name="--sheet-ease" />
              <EaseRow label="Salida" name="--sheet-ease-exit" />
            </div>
          </>
        )}
      </For>
      <div class="pg__row">
        <Button
          size="sm"
          onClick={() => {
            for (const name of [
              '--radius-action',
              '--radius-menu',
              '--radius-surface',
            ]) {
              set(name, '0px');
            }
            remount();
          }}
        >
          Cuadrado
        </Button>
        <Button
          size="sm"
          onClick={() => {
            clear(SHAPE);
            remount();
          }}
        >
          Redondo (de fábrica)
        </Button>
        <Button
          size="sm"
          active={slow()}
          onClick={() => {
            setSlow(!slow());
            if (slow()) clear(['--sheet-duration']);
            else set('--sheet-duration', '3000ms');
            remount();
          }}
        >
          Cámara lenta (3 s)
        </Button>
        <Button
          size="sm"
          active={reduced()}
          onClick={() => {
            setReduced(!reduced());
            if (reduced()) clear(['--sheet-duration', '--menu-duration']);
            else {
              set('--sheet-duration', '0ms');
              set('--menu-duration', '0ms');
            }
            remount();
          }}
        >
          Simular «reducir movimiento»
        </Button>
        <Button
          size="sm"
          onClick={() => {
            clear([...MOTION, ...SHAPE]);
            root.removeAttribute('style');
            setSlow(false);
            setReduced(false);
            remount();
          }}
        >
          Restablecer todo
        </Button>
      </div>
    </div>
  );
}
