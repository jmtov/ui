# Diseño: qué variable va en cada cosa

Tokens en `src/styles/tokens.css`. Origen: finanzas.

Todo color, margen y capa sale de una variable de `src/index.css` (`:root`).
**Un componente no escribe un color suelto**: elige la variable que corresponde a
lo que es. Cambiar una variable cambia la app entera, y para eso está.

Una regla general vale para todo lo de abajo: los estilos viven en el
`.module.css` del componente que los usa y
el valor sale de una de estas variables.

## Superficies (fondos)

Un fondo es de una de estas clases, según lo que es. Pregúntate en este orden:

1. ¿Flota y deja ver lo de abajo? → **glass**.
2. ¿Va dentro de otra superficie (un mosaico, una chapa)? → **inset**.
3. ¿Se levanta de la página (tarjeta, campo, grupo de filas)? → **surface**.
4. ¿Tiene que fundirse con la página? → **surface-page**.
5. ¿Es la reacción a un hover o a un toque? → **hover**.

| Variable | Qué es |
|---|---|
| `--surface-page` | La página (`--bg`). Lo que debe verse «como el fondo» |
| `--surface` | Lo que se levanta de la página |
| `--surface-glass` | Lo que flota, translúcido, con `--default-blur` |
| `--surface-glass-strong` | Lo mismo, casi opaco |
| `--surface-inset` | Lo que va dentro de una superficie |
| `--surface-hover` | Hover o toque, sutil |
| `--surface-hover-strong` | Hover o toque, marcado |

Si hace falta una superficie nueva, se agrega acá y en `index.css`, no en el
componente.

## Texto y color con significado

| Variable | Para qué |
|---|---|
| `--fg` | Texto principal |
| `--muted` | Texto secundario: etiquetas, ayudas, subtítulos |
| `--accent` | Lo activo o elegido: chips y filas seleccionadas, badges, enlaces como «Quitar filtros» |
| `--success` | Lo positivo: ingresos, lo pagado |
| `--warning` | Lo que sale o se debe: gastos, deudas, «Debes» |
| `--danger` | Errores y acciones que destruyen (borrar) |

No se usa un color para decorar: cada uno dice algo. El tamaño del texto sale de
`--font-size-xxs / xs / sm / md / lg / xl` (rem) y, para texto que escala con su
entorno, `--font-scale-detail / secondary / code` (em).

## Bordes y líneas

- `--line`: divisores y bordes suaves sobre la página (entre filas, bajo el
  header, el borde de una tabla).
- `--border`: el borde de un control con contorno (`Button` outline, `Chip`,
  `InfoTip`).
- Entre filas de una tarjeta no hay borde en cada fila: lo pone el grupo (el 1px
  de `gap`), así ni la primera ni la última lo llevan.

## Espaciado

- **`--page-padding-x`**: el margen a los lados de toda pantalla. Lo usan los
  encabezados, listas, tarjetas, la tabla, la Distribución y la pila de cards.
  Cambiarlo ahí lo cambia en todas las pantallas. Un componente que va de punta
  a punta pone el margen en sí mismo con esta variable, no su padre.
- `--bottom-padding`: lo que separa el NavBar fijo del borde de abajo.
- `--app-width`: ancho máximo de la app en pantallas grandes.

## Capas

Todo lo que flota sobre la página usa una variable `--z-*` de `index.css`, nunca
un número suelto (hoy `--z-fixed`). Huecos de a 10 para meter una nueva en medio.

## Movimiento

- `--transition-fn`: la curva de las animaciones de la app.
- Se respeta `prefers-reduced-motion`.

