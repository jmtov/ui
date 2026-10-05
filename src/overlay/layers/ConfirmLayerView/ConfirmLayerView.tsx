import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import type { ConfirmLayer } from '../../overlay.types';

export default function ConfirmLayerView(props: { layer: ConfirmLayer }) {
  return (
    <ConfirmDialog
      open={props.layer.open()}
      title={props.layer.options.title}
      message={props.layer.options.message}
      confirmLabel={props.layer.options.confirmLabel}
      pendingLabel={props.layer.options.pendingLabel}
      pending={props.layer.pending()}
      onConfirm={props.layer.accept}
      onClose={props.layer.cancel}
    />
  );
}
