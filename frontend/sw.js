// Service Worker usando a estratégia StaleWhileRevalidate do Workbox
const CACHE = "weightlifting-cache-v1";

// Importa o Workbox do CDN do Google
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Estratégia: StaleWhileRevalidate
// Ele entrega o que está no cache rápido (pro app abrir instantaneamente) 
// e atualiza o cache em segundo plano se houver internet.
workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);
