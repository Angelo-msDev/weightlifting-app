const CACHE_NAME = 'weightlifting-v2'; // Mudei para v2 para forçar o navegador a atualizar
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './img/192.png',
  './img/512.png',
  './img/screenshot-mobile.png',
  './img/screenshot-desktop.png'
];

// Instalação: Cacheia os arquivos
self.addEventListener('install', event => {
  self.skipWaiting(); // Força o SW a se tornar o ativo imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Ativação: Limpa caches antigos (Isso dá muitos pontos no PWABuilder)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Estratégia de busca: Cache First, falling back to Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Se a rede falhar e não estiver no cache, você poderia retornar uma página offline.html aqui
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
