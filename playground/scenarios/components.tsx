import {
  IconHome,
  IconMusic,
  IconSearch,
  IconSettings,
  IconTrash,
} from '@tabler/icons-solidjs';
import { createSignal, type JSX } from 'solid-js';
import {
  Button,
  Chip,
  IconButton,
  NavBar,
  ScreenHeader,
  SearchInput,
  StatusChip,
  SwipeRow,
} from '../../src';
import { logLine } from '../log';

function Group(props: { title: string; children: JSX.Element }) {
  return (
    <div class="pg__card">
      <strong>{props.title}</strong>
      <div class="pg__row">{props.children}</div>
    </div>
  );
}

export default function Components() {
  const [chip, setChip] = createSignal(true);
  const [query, setQuery] = createSignal('');
  const [tab, setTab] = createSignal(0);
  const tabs = [
    { label: 'Inicio', icon: IconHome },
    { label: 'Música', icon: IconMusic },
    { label: 'Ajustes', icon: IconSettings },
  ];
  return (
    <div class="pg__long">
      <Group title="Button · variantes">
        <Button>Outline</Button>
        <Button variant="solid">Solid</Button>
        <Button variant="text">Text</Button>
        <Button variant="text" active>
          Text activo
        </Button>
        <Button tone="danger" icon={<IconTrash />}>
          Eliminar
        </Button>
        <Button disabled>Deshabilitado</Button>
      </Group>
      <Group title="Button · tamaños">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
      </Group>
      <Group title="IconButton · tamaños y variantes">
        <IconButton label="xxs" size="xxs">
          <IconSearch />
        </IconButton>
        <IconButton label="xs" size="xs">
          <IconSearch />
        </IconButton>
        <IconButton label="sm" size="sm">
          <IconSearch />
        </IconButton>
        <IconButton label="md" size="md">
          <IconSearch />
        </IconButton>
        <IconButton label="lg" size="lg">
          <IconSearch />
        </IconButton>
        <IconButton label="ghost" variant="ghost">
          <IconSearch />
        </IconButton>
        <IconButton label="activo" on>
          <IconSearch />
        </IconButton>
      </Group>
      <Group title="Chip y StatusChip">
        <Chip active={chip()} onClick={() => setChip(!chip())}>
          Seleccionable
        </Chip>
        <Chip>Apagado</Chip>
        <StatusChip>default</StatusChip>
        <StatusChip tone="subtle">subtle</StatusChip>
        <StatusChip tone="ok">ok</StatusChip>
        <StatusChip tone="warn">warn</StatusChip>
        <StatusChip tone="bad" label="Sensor">
          bad
        </StatusChip>
      </Group>
      <Group title="SearchInput">
        <SearchInput value={query()} onInput={setQuery} placeholder="Buscar…" />
      </Group>
      <Group title="NavBar">
        <NavBar
          tabs={tabs.map((t, i) => ({
            ...t,
            active: tab() === i,
            onSelect: () => setTab(i),
          }))}
        />
      </Group>
      <Group title="SwipeRow (arrastra a un lado)">
        <SwipeRow icon={<IconTrash />} onTrigger={() => logLine('swipe')}>
          <div class="pg__card" style={{ width: '100%' }}>
            Fila deslizable
          </div>
        </SwipeRow>
      </Group>
      <Group title="ScreenHeader">
        <div style={{ width: '100%' }}>
          <ScreenHeader title="Detalle" onBack={() => logLine('volver')} />
          <ScreenHeader title="Biblioteca" size="lg" />
        </div>
      </Group>
    </div>
  );
}
