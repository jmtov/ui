// Botón redondo con un solo ícono. Único lugar donde se gestiona el tamaño y el
// estado activo de los botones-ícono.
import { createSignal } from 'solid-js';
import { useTap } from '../../hooks/useTap/useTap';
import { useTooltip } from '../../hooks/useTooltip/useTooltip';
import styles from './IconButton.module.css';
import type { IconButtonProps } from './IconButton.types';

export default function IconButton(props: IconButtonProps) {
  // La acción corre en el `touchend` (ver useTap): en el celular el `click` a
  // veces no llega.
  const tap = useTap({
    onTap: () => props.onClick?.(),
    handleTouch: () => true,
    disabled: () => !!props.disabled,
  });

  // Su `label` también es su tooltip: con el mouse al dejarlo encima, en el
  // celular con un long-press (que no ejecuta la acción del botón).
  const [button, setButton] = createSignal<HTMLButtonElement>();
  const tooltip = useTooltip(button, () => props.label);

  return (
    <button
      ref={setButton}
      type="button"
      class={`${styles['icon-btn']} ${styles[`icon-btn--${props.size ?? 'md'}`]} ${styles[`icon-btn--${props.variant ?? 'filled'}`]} ${props.className ?? ''}`}
      classList={{
        [styles['icon-btn--on']]: !!props.on,
        [styles['icon-btn--auto-width']]:
          props.autoSize === 'width' || props.autoSize === 'both',
        [styles['icon-btn--auto-height']]:
          props.autoSize === 'height' || props.autoSize === 'both',
      }}
      aria-label={props.label}
      aria-pressed={props.on}
      disabled={props.disabled}
      onClick={tap.onClick}
      onPointerEnter={tooltip.onPointerEnter}
      onPointerLeave={tooltip.onPointerLeave}
      onPointerDown={tooltip.onPointerDown}
      onFocus={tooltip.onFocus}
      onBlur={tooltip.onBlur}
      onContextMenu={tooltip.onContextMenu}
      onTouchStart={(event) => {
        tap.onTouchStart(event);
        tooltip.onTouchStart(event);
      }}
      onTouchMove={tooltip.onTouchMove}
      onTouchEnd={(event) => {
        // un long-press abrió el tooltip: no es un tap, y se cancela el click
        // que vendría después
        if (tooltip.endTouch()) {
          if (event.cancelable) event.preventDefault();
          return;
        }
        tap.onTouchEnd(event);
      }}
      onTouchCancel={(event) => {
        tap.onTouchCancel(event);
        tooltip.onTouchCancel();
      }}
    >
      {props.children}
    </button>
  );
}
