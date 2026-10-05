// Botón "..." que abre un menú. El menú en sí no vive acá: lo dibuja el
// OverlayHost (uno solo para toda la app, colgado del botón que se toque) — así
// una lista de 50 filas no monta 50 menús. Este componente es solo el trigger.

import { IconDots } from '@tabler/icons-solidjs';
import { useOverlay } from '../../overlay/useOverlay';
import IconButton from '../IconButton/IconButton';
import styles from './PopoverMenu.module.css';
import type { PopoverMenuProps } from './PopoverMenu.types';

export default function PopoverMenu(props: PopoverMenuProps) {
  const overlay = useOverlay();
  let anchorRef: HTMLSpanElement | undefined;

  return (
    // Envoltorio como ancla: IconButton no expone su <button>.
    <span ref={anchorRef} class={styles.anchor}>
      <IconButton
        label={props.label}
        variant="ghost"
        size="sm"
        onClick={() => {
          if (anchorRef) overlay.menu(anchorRef, () => props.options);
        }}
      >
        <IconDots />
      </IconButton>
    </span>
  );
}
