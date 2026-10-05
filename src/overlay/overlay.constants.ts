// Lo que dura la animación de salida del BottomSheet (ver BottomSheet.module.css:
// `display 260ms`). La capa sigue montada ese rato tras cerrarse, para que se
// vea la salida, y recién después se desmonta.
export const CLOSE_MS = 300;

// El menú cuelga de su botón con CSS anchor positioning: el botón recibe un
// `anchor-name` y el menú lo referencia. Uno por capa: una capa que se está
// cerrando no debe competir con la siguiente por el mismo nombre.
export const menuAnchorName = (layerId: number) => `--overlay-menu-${layerId}`;
