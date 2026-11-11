// Cuánto sigue montada una capa tras cerrarse, para que se vea su salida: lo
// que dura la salida del BottomSheet (`--sheet-duration` por
// `--sheet-exit-ratio`, en tokens.css, son la única fuente) más un margen. Se lee del CSS en cada cierre, así que
// tunearla ahí basta, y con «reducir movimiento» (0ms) se desmonta al instante.
const CLOSE_GRACE_MS = 40;
const DEFAULT_SHEET_MS = 400;
const DEFAULT_EXIT_RATIO = 0.5;

export function closeMs(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--sheet-duration')
    .trim();
  const value = Number.parseFloat(raw);
  const ms = raw.endsWith('ms') ? value : value * 1000;
  const duration = Number.isFinite(ms) ? ms : DEFAULT_SHEET_MS;
  const ratio = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--sheet-exit-ratio',
    ),
  );
  const exit = duration * (Number.isFinite(ratio) ? ratio : DEFAULT_EXIT_RATIO);
  return exit > 0 ? exit + CLOSE_GRACE_MS : 0;
}

// El menú cuelga de su botón con CSS anchor positioning: el botón recibe un
// `anchor-name` y el menú lo referencia. Uno por capa: una capa que se está
// cerrando no debe competir con la siguiente por el mismo nombre.
export const menuAnchorName = (layerId: number) => `--overlay-menu-${layerId}`;
