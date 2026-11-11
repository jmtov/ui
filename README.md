# @enrique/ui

Componentes y tokens compartidos entre `finanzas` y `ha-pwa`. Solid + CSS Modules.
Se consume como **fuente** (sin build): la app que lo instala lo compila con su Vite.

## Usar

```
# package.json de la app
"@enrique/ui": "github:<usuario>/ui#v0.1.0"   # o "file:../ui" mientras se desarrolla
```

```ts
import '@enrique/ui/tokens.css'; // una vez, en el entry
import { Button, BottomSheet } from '@enrique/ui';
```

Montar `<TooltipHost />` una vez en `App` (lo usan `Button` e `IconButton` con `label`).

## Qué hay

- **Componentes:** BottomSheet, Button, Chip (toggle), ConfirmDialog, IconButton, NavBar (sin router: recibe los tabs), PopoverMenu, ScreenHeader (título + volver + derecha, sticky con blur), SearchInput, StatusChip (lectura, con tonos), SwipeRow, TooltipHost.
- **Capas:** `OverlayProvider` + `useOverlay()` (menús, confirmaciones, sheets).
- **Hooks:** `useDrag`, `useTap`.
- **Íconos:** no hay; se usa `@tabler/icons-solidjs` directo (peer dependency). `tokens.css` fija su grosor en 1.5.

## Tema

Todo lo que cambia de una app a otra es una variable CSS de `tokens.css`; se cambian en el `:root` de la app, **después** de importar el archivo. Tres capas, de lo más general a lo más puntual:

1. **Roles** (toda la app). Forma: `--radius-action` (botones, chips, campo de búsqueda, ítems de menú), `--radius-menu`, `--radius-surface` (hojas inferiores, barra de navegación), `--radius-pill`. Espaciado: la escala `--space-1…6` (múltiplos de 0.25rem) más `--space-scale` para estirarla o comprimirla. Texto: `--font-size-*` y `--text-scale`. Movimiento: `--sheet-duration`, `--sheet-exit-ratio`, `--sheet-ease`, `--sheet-ease-exit`, `--menu-duration`.
2. **Variable de un componente** (solo ese): cada uno lee `var(--<componente>-<propiedad>, <rol>)`, así que basta definirla para salirse del rol sin tocar el resto.
3. **Un alcance concreto**: las variables heredan, así que se pueden poner en cualquier contenedor (`<div style="--button-radius: 0">`).

```css
@import "@enrique/ui/tokens.css";

/* app con todo cuadrado */
:root { --radius-action: 0; --radius-menu: 0; --radius-surface: 0; }

/* app redonda salvo los botones de texto de la barra */
.toolbar { --button-radius: 0.5rem; }
```

Variables por componente: `--button-radius`, `--button-padding-x`, `--button-padding-y` (solo `md`), `--icon-button-radius`, `--chip-radius`, `--status-chip-radius`, `--search-radius`, `--menu-radius`, `--menu-item-radius`, `--menu-padding`, `--sheet-radius`, `--sheet-icon-radius`, `--sheet-close-radius`, `--navbar-radius`, `--tooltip-radius`.

`--space-scale` y `--text-scale` se resuelven en `:root` (las escalas `--space-N` ya salen calculadas de ahí): cámbialas en `:root`, no en un contenedor. Los radios y las variables de componente sí funcionan en cualquier alcance.

Regla al escribir un componente: ningún `border-radius`, `padding`, `margin` ni `gap` con un número suelto; sale de la escala (`var(--space-N)`, o `calc(var(--space-1) * 1.5)` para un paso intermedio) y el radio de un rol (con su variable de componente si tiene sentido sobreescribirlo).

## Playground

```
bun install
bun run dev      # http://localhost:5173 (o el puerto libre que siga)
```

Compila directo desde `src/` (no pasa por `node_modules` de ninguna app, así que no hay caché de Vite que engañe ni hace falta publicar un tag para probar). Una página por familia en `playground/scenarios/`: componentes (todos los botones, chips, campo, barra, encabezado y fila deslizable, para ver el efecto del tema), sheets (simple, pantalla completa, con campo, contenido que se vacía al cerrar, montado solo mientras está abierto, anidado, abrir/cerrar rápido, `overlay.sheet`), menús y confirmaciones. Arriba hay controles para tunear en vivo la forma (radios, texto, espaciado, o cualquier variable por nombre, para probar el override de un componente), el movimiento (duración y curvas), un preset «Cuadrado», cámara lenta y simular «reducir movimiento». Cuando un comportamiento tenga un caso nuevo (algo que falló en una app), súmalo como escenario. No se publica (`files` solo incluye `src`).

## Reglas

- Tokens y qué variable va en cada cosa: [`DESIGN.md`](DESIGN.md).
- `package.json` lleva la condición `solid` en `exports`: es lo que le avisa a `vite-plugin-solid` que este paquete trae JSX para compilar con Solid (sin eso, el dev server lo trata como React y falla con «React is not defined»).
- Los tests no pueden importar Tabler (Solid en servidor): lo que se testea no debe importar íconos.
- Imports **relativos** dentro del paquete (nada de `@/`: chocaría con el alias de la app).
- Un componente entra acá solo si lo usan las dos apps. Nada de dominio (finanzas, media).
- Cambio visual → tag nuevo → bump en cada app.

## Chequeos

```
bun run lint && bun run typecheck && bun test
```

## Licencia

[AGPL-3.0-or-later](LICENSE), igual que finanzas.
