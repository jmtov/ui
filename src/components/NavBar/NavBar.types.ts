import type { Component } from 'solid-js';

export interface NavBarTab {
  label: string; // nombre accesible y tooltip
  icon: Component;
  active: boolean;
  onSelect: () => void;
}

export interface NavBarProps {
  tabs: readonly NavBarTab[];
  // para que la app ubique la barra (margen, alineación) sin tocar su CSS
  className?: string;
}
