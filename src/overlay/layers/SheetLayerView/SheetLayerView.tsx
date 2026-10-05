// Monta el componente de un sheet abierto con `overlay.sheet`. Le pasa sus
// props más `open`/`onClose`/`close`; el dibujo (BottomSheet) es del componente.
import { Dynamic } from 'solid-js/web';
import type { SheetLayer } from '../../overlay.types';

export default function SheetLayerView(props: { layer: SheetLayer }) {
  return (
    <Dynamic
      component={props.layer.component}
      {...props.layer.props}
      open={props.layer.open()}
      onClose={props.layer.cancel}
      close={props.layer.close}
    />
  );
}
