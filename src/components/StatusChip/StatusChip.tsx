// Pastilla de estado, de solo lectura (ej. «Oculta», «Crédito», un nivel de
// batería): un dato corto al lado de un nombre. No se toca (para eso está
// Chip). Tonta.
import { Show } from 'solid-js';
import styles from './StatusChip.module.css';
import type { StatusChipProps } from './StatusChip.types';

export default function StatusChip(props: StatusChipProps) {
  const toneClass = () =>
    props.tone && props.tone !== 'default' ? styles[`chip--${props.tone}`] : '';

  return (
    <span class={styles.chip} classList={{ [toneClass()]: !!toneClass() }}>
      <Show when={props.icon}>
        <span class={styles.icon} aria-hidden="true">
          {props.icon}
        </span>
      </Show>
      <Show when={props.label} fallback={props.children}>
        <span class={styles.label}>{props.label}</span>
        <span class={styles.value}>{props.children}</span>
      </Show>
    </span>
  );
}
