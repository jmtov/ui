// Confirmación genérica para una acción destructiva — envuelve BottomSheet
// (reusa su mecánica de popover/drag) en vez de armar un modal propio. No se
// monta a mano: se pide con `useOverlay().confirm(...)` y lo dibuja el
// OverlayHost (que maneja Esc).
import { Show } from 'solid-js';
import BottomSheet from '../BottomSheet/BottomSheet';
import Button from '../Button/Button';
import styles from './ConfirmDialog.module.css';
import type { ConfirmDialogProps } from './ConfirmDialog.types';

export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <BottomSheet open={props.open} onClose={props.onClose} title={props.title}>
      <div class={styles.dialog}>
        <Show when={props.message}>
          <p class={styles.message}>{props.message}</p>
        </Show>
        <div class={styles.actions}>
          <Button
            variant="outline"
            className={styles.actionButton}
            disabled={props.pending}
            onClick={props.onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="solid"
            tone="danger"
            className={styles.actionButton}
            disabled={props.pending}
            onClick={props.onConfirm}
          >
            {props.pending
              ? (props.pendingLabel ?? 'Eliminando…')
              : (props.confirmLabel ?? 'Eliminar')}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
