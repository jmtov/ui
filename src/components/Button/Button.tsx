// Botón con texto (y opcional ícono). Tonto. Copiado de ha-pwa
// (components/Button) — mismo look (pastilla con borde), mismas variantes.
import type { JSX } from 'solid-js';
import { createSignal, Show } from 'solid-js';
import { useTooltip } from '../../hooks/useTooltip/useTooltip';
import styles from './Button.module.css';

type Props = {
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit'; // default "button"
  children?: JSX.Element;
  variant?: 'outline' | 'text' | 'solid'; // text = look de tab (transparente, sin borde)
  // significado del botón, aparte de su estilo: 'danger' (rojo) para lo que
  // elimina o descarta. Se combina con cualquier `variant`.
  tone?: 'default' | 'danger'; // default "default"
  size?: 'xs' | 'sm' | 'md'; // default "md"
  icon?: JSX.Element; // al inicio
  active?: boolean; // estado sostenido (toggle) — tinta el botón
  disabled?: boolean;
  // nombre accesible y tooltip para un botón que es solo ícono
  label?: string;
};

export default function Button(props: Props) {
  const [button, setButton] = createSignal<HTMLButtonElement>();
  const tooltip = useTooltip(button, () => props.label ?? '');

  return (
    <button
      ref={setButton}
      type={props.type ?? 'button'}
      class={`${styles.btn} ${styles[`btn--${props.variant ?? 'outline'}`]} ${styles[`btn--${props.size ?? 'md'}`]} ${props.className || ''}`}
      classList={{
        [styles['btn--active']]: !!props.active,
        [styles['btn--danger']]: props.tone === 'danger',
      }}
      aria-pressed={props.active}
      aria-label={props.label}
      disabled={props.disabled}
      onClick={() => props.onClick?.()}
      onPointerEnter={tooltip.onPointerEnter}
      onPointerLeave={tooltip.onPointerLeave}
      onPointerDown={tooltip.onPointerDown}
      onFocus={tooltip.onFocus}
      onBlur={tooltip.onBlur}
      onContextMenu={tooltip.onContextMenu}
      onTouchStart={tooltip.onTouchStart}
      onTouchMove={tooltip.onTouchMove}
      onTouchEnd={(event) => {
        // un long-press abrió el tooltip: se cancela el click que vendría después
        if (tooltip.endTouch() && event.cancelable) event.preventDefault();
      }}
      onTouchCancel={tooltip.onTouchCancel}
    >
      <Show when={props.icon}>
        <span class={styles.btn__icon} aria-hidden="true">
          {props.icon}
        </span>
      </Show>
      <Show when={props.children}>
        <span class={styles.btn__label}>{props.children}</span>
      </Show>
    </button>
  );
}
