export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  pending?: boolean;
  pendingLabel?: string; // default "Eliminando…"
  onConfirm: () => void;
  onClose: () => void;
}
