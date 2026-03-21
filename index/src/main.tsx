import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Detect if running in loading mode (PHP cloaking)
const isLoadingMode = import.meta.env.VITE_LOADING_MODE === 'true';
const basename = isLoadingMode ? '/' : '/index';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
