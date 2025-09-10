// public/sw.js
const CACHE_VERSION = 'v1.0.5'; // Incremente esta versão a cada deploy
const CACHE_NAME = `devoty-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `devoty-data-${CACHE_VERSION}`;

// URLs para cache (recursos estáticos)
const STATIC_URLS = [
  '/',
  '/manifest.json',
  '/globals.css',
  '/animations/Fire.lottie',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Adicione outros recursos estáticos aqui
];

// URLs da API que devem usar cache com fallback
const API_URLS = [
  '/api/auth/profile',
  '/api/devocionais',
  '/api/bible',
];

// URLs que devem sempre vir da rede (sem cache)
const NETWORK_ONLY_URLS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/devocionais/gerar',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log(`[SW] Installing version ${CACHE_VERSION}`);
  
  event.waitUntil(
    Promise.all([
      // Cache de recursos estáticos
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_URLS);
      }),
      // Cache de dados da API
      caches.open(DATA_CACHE_NAME).then((cache) => {
        console.log('[SW] Data cache created');
        return cache;
      })
    ]).then(() => {
      // Força a ativação imediata do novo SW
      return self.skipWaiting();
    })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log(`[SW] Activating version ${CACHE_VERSION}`);
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('devoty-') && 
                cacheName !== CACHE_NAME && 
                cacheName !== DATA_CACHE_NAME) {
              console.log(`[SW] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar controle de todas as abas abertas
      self.clients.claim()
    ]).then(() => {
      console.log(`[SW] Version ${CACHE_VERSION} is now active`);
      
      // Notificar todas as abas sobre a atualização
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

// Interceptação de requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Apenas interceptar requests do mesmo origin
  if (url.origin !== location.origin) {
    return;
  }

  // Network-only URLs (sempre da rede)
  if (NETWORK_ONLY_URLS.some(pattern => url.pathname.includes(pattern))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // API requests (cache com fallback para rede)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Recursos estáticos (cache first)
  event.respondWith(handleStaticRequest(event.request));
});

// Handler para requests de API
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Tentar buscar da rede primeiro
    const networkResponse = await fetch(request);
    
    // Se for um GET request bem-sucedido, cachear a resposta
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`[SW] Network failed for ${url.pathname}, trying cache`);
    
    // Se a rede falhar, tentar buscar do cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Se não houver cache, retornar resposta de erro
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Sem conexão. Tente novamente quando estiver online.',
        offline: true 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handler para recursos estáticos
async function handleStaticRequest(request) {
  // Cache first strategy
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Se não estiver no cache, buscar da rede
    const networkResponse = await fetch(request);
    
    // Cachear recursos estáticos bem-sucedidos
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback para página offline ou erro 404
    if (request.destination === 'document') {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Limpeza periódica de cache antigo
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAN_OLD_CACHES') {
    event.waitUntil(cleanOldCaches());
  }
});

async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('devoty-') && 
    name !== CACHE_NAME && 
    name !== DATA_CACHE_NAME
  );
  
  return Promise.all(oldCaches.map(name => caches.delete(name)));
}

// Sincronização em background (para quando voltar online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('[SW] Performing background sync');
  // Aqui você pode implementar lógica para sincronizar dados
  // quando o usuário voltar a ficar online
}

// Push notifications (para futuras implementações)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        data: data.url
      })
    );
  }
});

// Click em notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});