// Barra fija con los tabs de la app: una pastilla flotante de IconButtons ghost,
// con el activo resaltado. No sabe de rutas: cada app dice qué tab está activo
// y qué pasa al elegirlo. Tonta.
import { For } from 'solid-js';
import IconButton from '../IconButton/IconButton';
import styles from './NavBar.module.css';
import type { NavBarProps } from './NavBar.types';

export default function NavBar(props: NavBarProps) {
  return (
    <nav class={`${styles.navbar} ${props.className ?? ''}`}>
      <For each={props.tabs}>
        {(tab) => (
          <IconButton
            label={tab.label}
            variant="ghost"
            on={tab.active}
            onClick={tab.onSelect}
          >
            <tab.icon />
          </IconButton>
        )}
      </For>
    </nav>
  );
}
