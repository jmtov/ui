export type ScreenHeaderSize = 'lg' | 'sm';

export interface ScreenHeaderProps {
  title: string;
  // "lg": pantallas de nivel superior. "sm": el detalle al que se navega desde
  // ahí. Default "sm". Ver --title-size-* en tokens.css.
  size?: ScreenHeaderSize;
  // con esto aparece la flecha de volver a la izquierda del título; la ruta ya
  // sabe adónde va, el header no navega
  onBack?: () => void;
  // contenido libre a la derecha (ej. un dot de estado)
  right?: import('solid-js').JSX.Element;
  // se queda pegado arriba, con fondo/blur que aparece al scrollear (sin fondo
  // en el tope). Scroll a nivel window.
  sticky?: boolean;
  className?: string; // el <header>
  contentClassName?: string; // la fila interna (ej. ancho máximo centrado)
}
