export type IconButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'filled' | 'ghost';
// Saca el tamaño fijo de `size` en ese eje (`width`/`height`: auto). No fuerza a
// ocupar el contenedor: lo decide el padre (flex/grid). `width: 100%` pisaría
// mal en una fila con más de un IconButton "auto".
export type IconButtonAutoSize = 'width' | 'height' | 'both';

export interface IconButtonProps {
  label: string; // aria-label — el contenido es solo un ícono
  onClick?: () => void;
  children: import('solid-js').JSX.Element;
  size?: IconButtonSize; // default "md"
  variant?: IconButtonVariant; // default "filled"
  autoSize?: IconButtonAutoSize; // default: ninguno, tamaño fijo por `size`
  on?: boolean; // estado activo (tab actual, toggle) — omitir si no aplica
  disabled?: boolean;
  className?: string;
}
