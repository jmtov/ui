// API pública del paquete. Cada componente es un default export en su carpeta;
// acá se re-exportan con nombre. Los estilos viajan con el componente
// (`.module.css`); los tokens se importan aparte: `@enrique/ui/tokens.css`.
export { default as BottomSheet } from './components/BottomSheet/BottomSheet';
export { default as Button } from './components/Button/Button';
export { default as Chip } from './components/Chip/Chip';
export { default as ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog';
export { default as IconButton } from './components/IconButton/IconButton';
export { default as NavBar } from './components/NavBar/NavBar';
export type {
  NavBarProps,
  NavBarTab,
} from './components/NavBar/NavBar.types';
export { default as PopoverMenu } from './components/PopoverMenu/PopoverMenu';
export type {
  MenuOption,
  PopoverMenuProps,
} from './components/PopoverMenu/PopoverMenu.types';
export { default as ScreenHeader } from './components/ScreenHeader/ScreenHeader';
export type {
  ScreenHeaderProps,
  ScreenHeaderSize,
} from './components/ScreenHeader/ScreenHeader.types';
export { default as SearchInput } from './components/SearchInput/SearchInput';
export { default as StatusChip } from './components/StatusChip/StatusChip';
export type {
  StatusChipProps,
  StatusChipTone,
} from './components/StatusChip/StatusChip.types';
export { default as SwipeRow } from './components/SwipeRow/SwipeRow';
export { default as TooltipHost } from './components/TooltipHost/TooltipHost';
export { useDrag } from './hooks/useDrag/useDrag';
export { useTap } from './hooks/useTap/useTap';
export { default as OverlayProvider } from './overlay/OverlayProvider';
export type {
  ConfirmOptions,
  OverlayApi,
  SheetLayerProps,
} from './overlay/overlay.types';
export { useOverlay } from './overlay/useOverlay';
