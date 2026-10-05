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

## Reglas

- Tokens y qué variable va en cada cosa: [`DESIGN.md`](DESIGN.md).
- Imports **relativos** dentro del paquete (nada de `@/`: chocaría con el alias de la app).
- Un componente entra acá solo si lo usan las dos apps. Nada de dominio (finanzas, media).
- Cambio visual → tag nuevo → bump en cada app.

## Chequeos

```
bun run lint && bun run typecheck && bun test
```

## Licencia

[AGPL-3.0-or-later](LICENSE), igual que finanzas.
