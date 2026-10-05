export interface MenuOption {
  label: string;
  icon?: import('solid-js').JSX.Element;
  active?: boolean;
  disabled?: boolean;
  onSelect: () => void;
  // separador ANTES de esta opción — para agrupar, no para el primer ítem.
  divider?: boolean;
}

export interface PopoverMenuProps {
  label: string; // aria-label del botón "..."
  options: MenuOption[];
}
