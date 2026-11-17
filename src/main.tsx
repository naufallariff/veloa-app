import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';
import App from '@/app/App';
import { registerVeloaServiceWorker } from './shared/pwa/usePwaOffline';

registerVeloaServiceWorker();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root tidak ditemukan di index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);