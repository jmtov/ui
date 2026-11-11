import { createSignal } from 'solid-js';

// Bitácora compartida: cada escenario anota qué pasó (abrió, cerró, resultado),
// para ver si un cierre se disparó cuando no debía.
const [lines, setLines] = createSignal<string[]>([]);

export const log = lines;
export const logLine = (text: string) =>
  setLines((current) =>
    [`${new Date().toLocaleTimeString()} · ${text}`, ...current].slice(0, 12),
  );
