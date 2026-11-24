// Versão anterior: troque as duas linhas abaixo por
//   import './index.css';
//   import { Site } from './v2/Site';
import { lazy, Suspense } from 'react';
import './v3/v3.css';
import { Site } from './v3/Site';

// Sites de demonstração por nicho, cada um no seu endereço (ex.: /navalha).
const Navalha = lazy(() => import('./navalha/Navalha'));

function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/navalha') {
    return (
      <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#15130f' }} />}>
        <Navalha />
      </Suspense>
    );
  }
  return <Site />;
}

export default App;
