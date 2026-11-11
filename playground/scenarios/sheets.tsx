import { createSignal, For, type JSX, Show } from 'solid-js';
import {
  BottomSheet,
  Button,
  type SheetLayerProps,
  sheetCloseMs,
  useOverlay,
} from '../../src';
import { logLine } from '../log';

const LOREM = Array.from({ length: 24 }, (_, i) => `Fila ${i + 1}`);

function Scenario(props: {
  title: string;
  note: string;
  children: JSX.Element;
}) {
  return (
    <div class="pg__card">
      <strong>{props.title}</strong>
      <p class="pg__muted">{props.note}</p>
      <div class="pg__row">{props.children}</div>
    </div>
  );
}

/** Lo básico: abrir, cerrar con el scrim, Esc, el botón o arrastrando el asa. */
function Simple() {
  const [open, setOpen] = createSignal(false);
  return (
    <Scenario
      title="Simple"
      note="Scrim, Esc y arrastre. Mira la entrada, la salida y que la página de atrás responda al salir."
    >
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <BottomSheet
        open={open()}
        onClose={() => {
          logLine('simple: onClose');
          setOpen(false);
        }}
        title="Hoja simple"
        subtitle="Con subtítulo"
      >
        <p>Contenido corto.</p>
        <Button onClick={() => setOpen(false)}>Cerrar</Button>
      </BottomSheet>
    </Scenario>
  );
}

function FullScreen() {
  const [open, setOpen] = createSignal(false);
  return (
    <Scenario
      title="Pantalla completa + scroll"
      note="Contenido largo: el scroll interno no debe mover la página, y el arrastre del asa sí cierra."
    >
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <BottomSheet
        open={open()}
        onClose={() => setOpen(false)}
        title="Lista larga"
        fullScreen
      >
        <div class="pg__long">
          <For each={LOREM}>{(row) => <div class="pg__card">{row}</div>}</For>
        </div>
      </BottomSheet>
    </Scenario>
  );
}

function WithInput() {
  const [open, setOpen] = createSignal(false);
  return (
    <Scenario
      title="Con campo (teclado)"
      note="Autofoco del primer campo. En el celular: que el teclado no tape el campo ni deje la hoja a medias."
    >
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <BottomSheet open={open()} onClose={() => setOpen(false)} title="Nombre">
        <input
          type="text"
          placeholder="Escribe algo"
          style={{ width: '100%', padding: '0.75rem' }}
        />
        <Button onClick={() => setOpen(false)}>Listo</Button>
      </BottomSheet>
    </Scenario>
  );
}

/** Como EntitySheetOverlay: al cerrar, el padre vacía título y contenido en el mismo instante. */
function Emptied() {
  const [selected, setSelected] = createSignal<string | null>(null);
  return (
    <Scenario
      title="El padre vacía todo al cerrar"
      note="Como EntitySheetOverlay: `selected` pasa a null al cerrar. La hoja debe salir con su contenido, no vacía y encogida."
    >
      <Button onClick={() => setSelected('Luz Espejo')}>Abrir</Button>
      <BottomSheet
        open={selected() != null}
        onClose={() => setSelected(null)}
        title={selected() ?? ''}
        subtitle={selected() ? 'Apagada' : ''}
        icon={selected() ? <span>💡</span> : undefined}
      >
        <Show when={selected()}>
          {(name) => (
            <div class="pg__long">
              <p>Detalle de {name()}</p>
              <For each={LOREM.slice(0, 6)}>
                {(row) => <div class="pg__card">{row}</div>}
              </For>
            </div>
          )}
        </Show>
      </BottomSheet>
    </Scenario>
  );
}

/** Como AddToPlaylistSheet: se monta solo mientras está abierto y espera la salida para desmontarse. */
function MountedOnlyWhileOpen() {
  const [want, setWant] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const open = () => {
    clearTimeout(timer);
    setMounted(true);
    setWant(true);
  };
  const close = () => {
    setWant(false);
    clearTimeout(timer);
    timer = setTimeout(() => setMounted(false), sheetCloseMs());
  };
  return (
    <Scenario
      title="Montada solo mientras está abierta"
      note="Como AddToPlaylistSheet: se monta al abrir y se desmonta `sheetCloseMs()` después de cerrar."
    >
      <Button onClick={open}>Abrir</Button>
      <Show when={mounted()}>
        <BottomSheet open={want()} onClose={close} title="Agregar a playlist">
          <p>Se desmonta tras la salida.</p>
        </BottomSheet>
      </Show>
    </Scenario>
  );
}

/** Como el selector de parlantes dentro de Media Controls. */
function Nested() {
  const [outer, setOuter] = createSignal(false);
  const [inner, setInner] = createSignal(false);
  return (
    <Scenario
      title="Sheet dentro de otro"
      note="Como Parlantes dentro de Media Controls: el de adentro debe animar entrada y salida, y el de afuera seguir abierto."
    >
      <Button onClick={() => setOuter(true)}>Abrir</Button>
      <BottomSheet
        open={outer()}
        onClose={() => setOuter(false)}
        title="Reproductor"
        fullScreen
      >
        <Button onClick={() => setInner(true)}>Parlantes</Button>
        <BottomSheet
          open={inner()}
          onClose={() => setInner(false)}
          title="Parlantes"
        >
          <p>Selecciona parlantes.</p>
        </BottomSheet>
      </BottomSheet>
    </Scenario>
  );
}

/** Abrir y cerrar sin esperar: la hoja no debe quedarse a medias ni invisible. */
function Stress() {
  const [open, setOpen] = createSignal(false);
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  return (
    <Scenario
      title="Abrir y cerrar rápido"
      note="Casos límite. Al terminar la hoja debe quedar cerrada (o abierta, si se indica) y la página de atrás, tocable."
    >
      <Button
        onClick={async () => {
          setOpen(true);
          await wait(30);
          setOpen(false);
        }}
      >
        Abrir → cerrar a los 30 ms
      </Button>
      <Button
        onClick={async () => {
          setOpen(true);
          await wait(250);
          setOpen(false);
          await wait(150);
          setOpen(true);
        }}
      >
        Abrir → cerrar → reabrir (queda abierta)
      </Button>
      <BottomSheet open={open()} onClose={() => setOpen(false)} title="Estrés">
        <p>¿Quedó bien?</p>
      </BottomSheet>
    </Scenario>
  );
}

function ResultSheet(props: { name: string } & SheetLayerProps<'ok' | 'otro'>) {
  return (
    <BottomSheet
      open={props.open}
      onClose={props.onClose}
      title={`overlay.sheet · ${props.name}`}
    >
      <div class="pg__row">
        <Button onClick={() => props.close('ok')}>Resolver «ok»</Button>
        <Button onClick={() => props.close('otro')}>Resolver «otro»</Button>
      </div>
    </BottomSheet>
  );
}

function ViaOverlay() {
  const overlay = useOverlay();
  return (
    <Scenario
      title="overlay.sheet"
      note="Sheet de capas: resuelve con un resultado. Cerrando con scrim o Esc resuelve undefined."
    >
      <Button
        onClick={async () => {
          const result = await overlay.sheet(ResultSheet, { name: 'demo' });
          logLine(`overlay.sheet → ${String(result)}`);
        }}
      >
        Abrir
      </Button>
    </Scenario>
  );
}

export default function Sheets() {
  return (
    <div class="pg__long">
      <Simple />
      <FullScreen />
      <WithInput />
      <Emptied />
      <MountedOnlyWhileOpen />
      <Nested />
      <Stress />
      <ViaOverlay />
    </div>
  );
}
