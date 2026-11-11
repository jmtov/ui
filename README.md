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

## Playground

```
bun install
bun run dev      # http://localhost:5173 (o el puerto libre que siga)
```

Compila directo desde `src/` (no pasa por `node_modules` de ninguna app, así que no hay caché de Vite que engañe ni hace falta publicar un tag para probar). Una página por familia de componentes en `playground/scenarios/`: sheets (simple, pantalla completa, con campo, contenido que se vacía al cerrar, montado solo mientras está abierto, anidado, abrir/cerrar rápido, `overlay.sheet`), menús y confirmaciones. Arriba hay controles para tunear en vivo las variables de duración y curva (`--sheet-duration`, `--sheet-ease`, `--sheet-ease-exit`, `--menu-duration`), cámara lenta y simular «reducir movimiento». Cuando un comportamiento tenga un caso nuevo (algo que falló en una app), súmalo como escenario. No se publica (`files` solo incluye `src`).

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
