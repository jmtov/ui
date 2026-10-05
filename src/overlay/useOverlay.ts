import { useContext } from 'solid-js';
import { OverlayContext } from './overlay.context';

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error('useOverlay debe usarse dentro de <OverlayProvider>');
  }
  return ctx;
}
