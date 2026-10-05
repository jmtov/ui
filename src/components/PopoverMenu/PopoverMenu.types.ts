export interface MenuOption {
  label: string;
  icon?: import('solid-js').JSX.Element;
  active?: boolean;
  disabled?: boolean;
  // 'danger' (rojo) para lo que elimina o descarta — mismo `tone` que Button.
  tone?: 'default' | 'danger'; // default "default"
  onSelect: () => void;
  // separador ANTES de esta opción — para agrupar, no para el primer ítem.
  divider?: boolean;
}

export interface PopoverMenuProps {
  label: string; // aria-label del botón "..."
  options: MenuOption[];
}
