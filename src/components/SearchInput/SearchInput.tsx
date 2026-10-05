// Campo de búsqueda con lupa y botón para limpiar. Tonto.

import { IconSearch, IconX } from '@tabler/icons-solidjs';
import { createEffect, Show } from 'solid-js';
import styles from './SearchInput.module.css';
import type { SearchInputProps } from './SearchInput.types';

export default function SearchInput(props: SearchInputProps) {
  let input: HTMLInputElement | undefined;
  createEffect(() => {
    if (props.focused) input?.focus();
  });

  return (
    <div class={styles.field}>
      <span class={styles.icon}>
        <IconSearch />
      </span>
      <input
        class={styles.input}
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        aria-label={props.label ?? 'Buscar'}
        placeholder={props.placeholder}
        ref={input}
        value={props.value}
        onInput={(event) => props.onInput(event.currentTarget.value)}
      />
      <Show when={props.value !== ''}>
        <button
          type="button"
          class={styles.clear}
          aria-label={`Limpiar ${(props.label ?? 'búsqueda').toLowerCase()}`}
          onClick={() => props.onInput('')}
        >
          <IconX />
        </button>
      </Show>
    </div>
  );
}
