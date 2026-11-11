import { render } from 'solid-js/web';
import { OverlayProvider, TooltipHost } from '../src';
import '../src/styles/tokens.css';
import './playground.css';
import App from './App';

const root = document.getElementById('root');
if (root) {
  render(
    () => (
      <OverlayProvider>
        <App />
        <TooltipHost />
      </OverlayProvider>
    ),
    root,
  );
}
