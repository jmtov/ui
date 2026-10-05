/** |vy| (px/ms) por encima del cual soltar descarta el sheet sin importar
 *  cuánto se arrastró — un flick. */
export const SHEET_FLING_VELOCITY = 0.4;

/** Fracción de la altura del sheet que hay que arrastrar hacia abajo (en un
 *  release lento) para descartar en vez de volver a su sitio. */
export const SHEET_DISMISS_FRACTION = 0.28;

/** Resistencia aplicada a cualquier arrastre hacia arriba pasado el reposo. */
export const SHEET_RUBBER_BAND = 0.2;
