import { Button, useOverlay } from '../../src';
import { logLine } from '../log';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Confirms() {
  const overlay = useOverlay();
  return (
    <div class="pg__long">
      <div class="pg__card">
        <strong>confirm</strong>
        <p class="pg__muted">Resuelve true al confirmar y false al cancelar.</p>
        <div class="pg__row">
          <Button
            tone="danger"
            onClick={async () =>
              logLine(
                `confirm → ${await overlay.confirm({
                  title: '¿Eliminar la playlist?',
                  message: 'No se puede deshacer.',
                })}`,
              )
            }
          >
            Simple
          </Button>
          <Button
            tone="danger"
            onClick={async () =>
              logLine(
                `confirm con acción → ${await overlay.confirm({
                  title: '¿Eliminar?',
                  action: () => wait(1500),
                })}`,
              )
            }
          >
            Con acción (1,5 s pendiente)
          </Button>
          <Button
            tone="danger"
            onClick={async () =>
              logLine(
                `confirm que falla → ${await overlay.confirm({
                  title: '¿Eliminar?',
                  message: 'La acción falla: el diálogo debe seguir abierto.',
                  action: async () => {
                    await wait(800);
                    throw new Error('falló');
                  },
                })}`,
              )
            }
          >
            Con acción que falla
          </Button>
        </div>
      </div>
    </div>
  );
}
