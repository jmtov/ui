import type { JSX } from 'solid-js';

export type StatusChipTone = 'default' | 'subtle' | 'ok' | 'warn' | 'bad';

export interface StatusChipProps {
  children: JSX.Element;
  icon?: JSX.Element; // al inicio
  // etiqueta secundaria antes del valor (ej. el nombre de un sensor); con ella,
  // `children` se lee como el valor y se destaca
  label?: string;
  // 'subtle': un dato que acompaña y no pide atención (sin borde, fondo tenue).
  // 'ok' / 'warn' / 'bad': el estado de algo (éxito, atención, error).
  tone?: StatusChipTone; // default "default"
}
