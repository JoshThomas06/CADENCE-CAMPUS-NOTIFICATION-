import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// AC-1: Register Service Worker for native PWA Web Push
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker successfully registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration error:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
