// Pastilla seleccionable — un valor que se prende o se apaga. Tonta.
import type { JSX } from 'solid-js';
import styles from './Chip.module.css';

type Props = {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: JSX.Element;
};

export default function Chip(props: Props) {
  return (
    <button
      type="button"
      class={styles.chip}
      classList={{ [styles['chip--active']]: !!props.active }}
      aria-pressed={props.active}
      disabled={props.disabled}
      onClick={() => props.onClick?.()}
    >
      {props.children}
    </button>
  );
}
