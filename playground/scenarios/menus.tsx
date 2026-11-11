import { IconDots } from '@tabler/icons-solidjs';
import { createSignal } from 'solid-js';
import { Button, PopoverMenu, useOverlay } from '../../src';
import { logLine } from '../log';

export default function Menus() {
  const overlay = useOverlay();
  const [counter, setCounter] = createSignal(0);
  let anchor!: HTMLDivElement;
  return (
    <div class="pg__long">
      <div class="pg__card">
        <strong>PopoverMenu</strong>
        <p class="pg__muted">
          Fade + escala desde la esquina del botón. Mira la duración con el
          control de arriba (Menú).
        </p>
        <div class="pg__row">
          <PopoverMenu
            label="Opciones"
            options={[
              {
                label: 'Agregar a favoritos',
                onSelect: () => logLine('favorito'),
              },
              { label: 'Compartir', onSelect: () => logLine('compartir') },
              {
                label: 'Eliminar',
                tone: 'danger',
                divider: true,
                onSelect: () => logLine('eliminar'),
              },
            ]}
          />
        </div>
      </div>

      <div class="pg__card">
        <strong>overlay.menu (anclado a un elemento)</strong>
        <p class="pg__muted">
          Las opciones son un getter: el contador cambia con el menú abierto.
        </p>
        <div class="pg__row" ref={anchor}>
          <Button
            icon={<IconDots />}
            onClick={() =>
              overlay.menu(anchor, () => [
                {
                  label: `Sumar (van ${counter()})`,
                  onSelect: () => setCounter(counter() + 1),
                },
                {
                  label: 'Opción deshabilitada',
                  disabled: true,
                  onSelect: () => {},
                },
              ])
            }
          >
            Menú
          </Button>
        </div>
      </div>
    </div>
  );
}
