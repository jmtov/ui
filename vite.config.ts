import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

// Solo para el playground (`bun run dev`): la librería se publica como fuente y
// las apps la compilan; acá se compila directo desde `src/`, así que un cambio
// se ve al instante, sin tag ni `bun install` en ninguna app.
export default defineConfig({
  plugins: [solid()],
  server: { host: true }, // accesible desde el celular en la LAN
});
