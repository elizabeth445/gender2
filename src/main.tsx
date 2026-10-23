import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/global.css';
import './styles/chapters.css';
import App from './App';

const Agentation = import.meta.env.DEV ? lazy(() => import('./dev/AgentationTools')) : null;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    {Agentation ? (
      <Suspense fallback={null}>
        <Agentation />
      </Suspense>
    ) : null}
  </React.StrictMode>,
);
