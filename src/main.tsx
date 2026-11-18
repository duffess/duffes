import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Só começa a animação do título quando a fonte já chegou, para não trocar
// de fonte no meio do movimento. Se demorar, segue mesmo assim.
const root = document.documentElement;
const ready = () => root.classList.add('fonts-ready');
if (document.fonts?.load) {
  Promise.race([
    Promise.all([
      document.fonts.load('800 1em "Big Shoulders Display Variable"'),
      document.fonts.load('400 1em "Instrument Sans Variable"'),
    ]),
    new Promise((r) => setTimeout(r, 1200)),
  ]).then(ready, ready);
} else {
  ready();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
