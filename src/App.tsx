// Site principal: v4 ("A Assinatura", com 3D). Para voltar ao anterior, troque a linha
// do Site por:  const Site = lazy(() => import('./v3/Site').then((m) => ({ default: m.Site })));
// e importe './v3/v3.css' lá dentro (o v3 importa o CSS aqui no App).
import { lazy, Suspense } from 'react';

// Cada página carrega só o próprio código e CSS: a Navalha não recebe os estilos do site principal.
const Site = lazy(() => import('./v4/Site').then((m) => ({ default: m.Site })));
// Sites de demonstração por nicho, cada um no seu endereço (ex.: /navalha).
const Navalha = lazy(() => import('./navalha/Navalha'));
// Página de links para a bio do Instagram.
const Links = lazy(() => import('./links/Links'));

function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/navalha') {
    return (
      <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#15130f' }} />}>
        <Navalha />
      </Suspense>
    );
  }
  if (path === '/links') {
    return (
      <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#590907' }} />}>
        <Links />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#0d0b0a' }} />}>
      <Site />
    </Suspense>
  );
}

export default App;
