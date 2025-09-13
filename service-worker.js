// ========================================
// CHESSARCADE SERVICE WORKER v2.0.0
// Soporte offline para máxima jugabilidad retro
// ========================================

const CACHE_NAME = 'chessarcade-v2.0.0';
const CACHE_STATIC_NAME = 'chessarcade-static-v2.0.0';
const CACHE_DYNAMIC_NAME = 'chessarcade-dynamic-v2.0.0';

// ===== RECURSOS CRÍTICOS PARA CACHE =====
const STATIC_ASSETS = [
  // Páginas principales
  '/',
  '/index.html',
  
  // Juegos
  '/games/knight-quest/',
  '/games/knight-quest/index.html',
  
  // Recursos compartidos
  '/shared/arcade-shared.css',
  '/shared/shared-utils.js',
  '/shared/hub-main.js',
  
  // PWA
  '/manifest.json',
  
  // Fuentes externas (críticas)
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
  
  // Offline fallback
  '/offline.html'
];

// ===== RECURSOS DINÁMICOS =====
const DYNAMIC_ASSETS = [
  // Imágenes de iconos
  '/assets/icons/',
  
  // Screenshots
  '/assets/screenshots/',
  
  // Archivos de configuración
  '/assets/config/',
  
  // Audio (futuro)
  '/assets/audio/'
];

// ===== INSTALACIÓN DEL SERVICE WORKER =====
self.addEventListener('install', event => {
  console.log('🚀 [SW] Instalando ChessArcade Service Worker v2.0.0...');
  
  event.waitUntil(
    Promise.all([
      // Cache recursos estáticos críticos
      caches.open(CACHE_STATIC_NAME).then(cache => {
        console.log('📦 [SW] Cacheando recursos estáticos...');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
          cache: 'reload' // Forzar recarga para última versión
        })));
      }),
      
      // Crear cache dinámico vacío
      caches.open(CACHE_DYNAMIC_NAME).then(cache => {
        console.log('📁 [SW] Cache dinámico creado');
        return cache;
      })
    ]).then(() => {
      console.log('✅ [SW] Instalación completada - ChessArcade listo offline!');
      // Forzar activación inmediata
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ [SW] Error durante instalación:', error);
    })
  );
});

// ===== ACTIVACIÓN DEL SERVICE WORKER =====
self.addEventListener('activate', event => {
  console.log('⚡ [SW] Activando ChessArcade Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_STATIC_NAME && 
                cacheName !== CACHE_DYNAMIC_NAME && 
                cacheName.startsWith('chessarcade-')) {
              console.log('🗑️ [SW] Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control de todas las páginas
      self.clients.claim()
    ]).then(() => {
      console.log('✅ [SW] Activación completada - Modo retro offline activo!');
    }).catch(error => {
      console.error('❌ [SW] Error durante activación:', error);
    })
  );
});

// ===== INTERCEPTAR REQUESTS (ESTRATEGIA CACHE-FIRST) =====
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Solo manejar requests HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Estrategia basada en tipo de recurso
  if (isStaticAsset(request.url)) {
    // Recursos estáticos: Cache First
    event.respondWith(cacheFirst(request));
  } else if (isGameAsset(request.url)) {
    // Recursos del juego: Cache First con fallback
    event.respondWith(cacheFirstWithFallback(request));
  } else if (isExternalResource(request.url)) {
    // Recursos externos (fuentes, CDN): Cache First
    event.respondWith(cacheFirstExternal(request));
  } else {
    // Otros recursos: Network First con fallback a cache
    event.respondWith(networkFirstWithCache(request));
  }
});

// ===== ESTRATEGIAS DE CACHE =====

// Cache First - Para recursos estáticos
async function cacheFirst(request) {
  try {
    const cacheResponse = await caches.match(request);
    if (cacheResponse) {
      console.log('💾 [SW] Sirviendo desde cache:', request.url);
      return cacheResponse;
    }
    
    console.log('🌐 [SW] Descargando y cacheando:', request.url);
    const networkResponse = await fetch(request);
    
    // Cachear solo respuestas exitosas
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_STATIC_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ [SW] Error en cacheFirst:', error);
    return getOfflineFallback(request);
  }
}

// Cache First con Fallback - Para recursos del juego
async function cacheFirstWithFallback(request) {
  try {
    const cacheResponse = await caches.match(request);
    if (cacheResponse) {
      return cacheResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_DYNAMIC_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🎮 [SW] Sirviendo fallback para juego');
    return getGameFallback(request);
  }
}

// Cache First para recursos externos
async function cacheFirstExternal(request) {
  try {
    const cacheResponse = await caches.match(request);
    if (cacheResponse) {
      return cacheResponse;
    }
    
    const networkResponse = await fetch(request, {
      mode: 'cors',
      cache: 'default'
    });
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_STATIC_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 [SW] Recurso externo no disponible offline');
    return new Response('', { status: 204 }); // No Content
  }
}

// Network First con Cache - Para recursos dinámicos
async function networkFirstWithCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_DYNAMIC_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('📱 [SW] Red no disponible, buscando en cache...');
    const cacheResponse = await caches.match(request);
    
    if (cacheResponse) {
      return cacheResponse;
    }
    
    return getOfflineFallback(request);
  }
}

// ===== FUNCIONES DE UTILIDAD =====

function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('manifest.json');
}

function isGameAsset(url) {
  return url.includes('/games/') ||
         url.includes('/assets/') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.svg');
}

function isExternalResource(url) {
  return url.includes('fonts.googleapis.com') ||
         url.includes('fonts.gstatic.com') ||
         !url.includes(self.location.origin);
}

// Fallback offline genérico
async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Para páginas HTML
  if (request.destination === 'document') {
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Para imágenes
  if (request.destination === 'image') {
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">' +
      '<rect width="200" height="200" fill="#1a1a2e"/>' +
      '<text x="100" y="100" text-anchor="middle" fill="#00ffff" font-family="monospace" font-size="12">' +
      'Imagen no disponible offline' +
      '</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
  
  // Respuesta genérica
  return new Response('Recurso no disponible offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Fallback específico para juegos
async function getGameFallback(request) {
  // Intentar servir la página principal del juego desde cache
  const mainGamePage = await caches.match('/games/knight-quest/index.html');
  if (mainGamePage) {
    return mainGamePage;
  }
  
  return getOfflineFallback(request);
}

// ===== EVENTOS DE MENSAJE =====
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      console.log('⚡ [SW] Forzando activación...');
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_NAME,
        status: 'active'
      });
      break;
      
    case 'CACHE_GAME_DATA':
      // Cachear datos específicos del juego
      cacheGameData(data).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('📨 [SW] Mensaje desconocido:', type);
  }
});

// Cachear datos específicos del juego
async function cacheGameData(gameData) {
  const cache = await caches.open(CACHE_DYNAMIC_NAME);
  const response = new Response(JSON.stringify(gameData), {
    headers: { 'Content-Type': 'application/json' }
  });
  
  await cache.put('/api/game-data', response);
  console.log('💾 [SW] Datos del juego cacheados');
}

// Limpiar todos los caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName.startsWith('chessarcade-')) {
        console.log('🗑️ [SW] Limpiando cache:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

// ===== EVENTOS DE SINCRONIZACIÓN (FUTURO) =====
self.addEventListener('sync', event => {
  if (event.tag === 'sync-scores') {
    console.log('🔄 [SW] Sincronizando puntuaciones...');
    event.waitUntil(syncScores());
  }
});

async function syncScores() {
  // Implementación futura para sincronizar puntuaciones
  console.log('🏆 [SW] Sync de puntuaciones completado');
}

// ===== LOGGING DE EVENTOS =====
self.addEventListener('fetch', event => {
  if (event.request.destination === 'document') {
    console.log('📄 [SW] Navegando a:', event.request.url);
  }
});

console.log('🎮 ChessArcade Service Worker v2.0.0 inicializado - ¡Modo retro offline activo!');
