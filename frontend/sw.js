const CACHE_NAME = 'weightlifting-v1';

// Arquivos que o app vai salvar para funcionar offline
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// Instalação: Salva os arquivos básicos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto com sucesso');
      return cache.addAll(assets).catch(err => console.log('Aviso: Alguns arquivos não foram cacheados', err));
    })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  console.log('Service Worker ativo!');
});

// Estratégia de Busca: Tenta o Cache primeiro, se não tiver, vai na Rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
