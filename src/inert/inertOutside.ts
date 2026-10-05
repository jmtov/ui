// Mientras un sheet está abierto, el resto del documento queda inerte: sin
// foco, sin clic y fuera de los lectores de pantalla. Sin esto, Tab sale del
// sheet hacia lo que tiene detrás (otro sheet, la página) — un popover no es un
// <dialog>, no atrapa el foco solo.
//
// Se marcan los hermanos de `target` y de cada uno de sus ancestros, nunca los
// ancestros mismos: así un sheet dentro de otro (ej. el picker de SelectSheet)
// sigue funcionando, y deja inerte solo lo de su alrededor.

// Cuántos sheets piden inerte a cada elemento: si dos lo piden y uno se cierra,
// el otro sigue necesitándolo.
const requests = new Map<HTMLElement, number>();

export function inertOutside(target: HTMLElement): () => void {
  const marked: HTMLElement[] = [];

  let node: HTMLElement | null = target;
  while (node && node !== document.body) {
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) break;
    for (const sibling of Array.from(parent.children)) {
      if (sibling === node || !(sibling instanceof HTMLElement)) continue;
      requests.set(sibling, (requests.get(sibling) ?? 0) + 1);
      sibling.inert = true;
      marked.push(sibling);
    }
    node = parent;
  }

  return () => {
    for (const element of marked) {
      const left = (requests.get(element) ?? 1) - 1;
      if (left > 0) {
        requests.set(element, left);
      } else {
        requests.delete(element);
        element.inert = false;
      }
    }
  };
}
