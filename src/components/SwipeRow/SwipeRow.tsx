// Envuelve una fila para agregar swipe izq/der -> una acción (ej. borrar).
// Simétrico: cualquiera de los dos lados dispara lo mismo. Revela un ícono
// detrás mientras se arrastra; soltar pasado el umbral dispara y la fila
// vuelve a su lugar (no queda "abierta"). Portado de ha-pwa.
import { createSignal, type JSX } from 'solid-js';
import { useSwipeAction } from '../../hooks/useSwipeAction/useSwipeAction';
import {
  SWIPE_REVEAL_MAX_PX,
  SWIPE_TRIGGER_FRACTION,
} from '../../hooks/useSwipeAction/useSwipeAction.constants';
import styles from './SwipeRow.module.css';

export default function SwipeRow(props: {
  onTrigger: () => void;
  icon: JSX.Element;
  children: JSX.Element;
}) {
  const [ref, setRef] = createSignal<HTMLDivElement>();
  const { offset, dragging } = useSwipeAction(ref, props.onTrigger);

  // Visible recién cerca del umbral de disparo, no desde el primer px.
  const iconOpacity = () =>
    Math.min(
      Math.abs(offset()) / (SWIPE_REVEAL_MAX_PX * SWIPE_TRIGGER_FRACTION),
      1,
    );

  return (
    <div class={styles.wrap}>
      <div
        class={styles.action}
        style={{ 'justify-content': offset() >= 0 ? 'flex-start' : 'flex-end' }}
      >
        <span class={styles.action__icon} style={{ opacity: iconOpacity() }}>
          {props.icon}
        </span>
      </div>
      <div
        ref={setRef}
        class={styles.row}
        classList={{ [styles['row--dragging']]: dragging() }}
        style={{ transform: `translateX(${offset()}px)` }}
      >
        {props.children}
      </div>
    </div>
  );
}
