// Header de pantalla: título + flecha atrás opcional a la izquierda y contenido
// libre a la derecha. Tonto — `onBack` ya viene resuelto. Sticky, el fondo/blur
// aparece recién al scrollear.
import { IconArrowLeft } from '@tabler/icons-solidjs';
import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import IconButton from '../IconButton/IconButton';
import { SCROLLED_THRESHOLD_PX } from './ScreenHeader.constants';
import styles from './ScreenHeader.module.css';
import type { ScreenHeaderProps } from './ScreenHeader.types';

export default function ScreenHeader(props: ScreenHeaderProps) {
  const size = () => props.size ?? 'sm';

  const [scrolled, setScrolled] = createSignal(false);
  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => window.removeEventListener('scroll', onScroll));
  });

  return (
    <header
      class={`${styles.header} ${styles[`header--${size()}`]} ${props.className ?? ''}`}
      classList={{
        [styles['header--sticky']]: props.sticky,
        [styles['header--transparent']]: !scrolled(),
      }}
    >
      <div class={`${styles.content} ${props.contentClassName ?? ''}`}>
        <Show when={props.onBack}>
          {(onBack) => (
            <IconButton label="Volver" size="sm" onClick={() => onBack()()}>
              <IconArrowLeft />
            </IconButton>
          )}
        </Show>
        <h2 class={`${styles.title} ${styles[`title--${size()}`]}`}>
          {props.title}
        </h2>
        {props.right}
      </div>
    </header>
  );
}
