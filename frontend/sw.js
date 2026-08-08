/* ==========================================================================
   G. Saravana Agro Clinic - Progressive Web App Service Worker
   Features: Offline Shell Caching, Cache-First Static Assets, Network Fallback
   ========================================================================== */

const CACHE_NAME = 'agri-app-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/products.html',
  '/cart.html',
  '/checkout.html',
  '/wishlist.html',
  '/offers.html',
  '/about.html',
  '/contact.html',
  '/faq.html',
  '/testimonials.html',
  '/gallery.html',
  '/blog.html',
  '/profile.html',
  '/login.html',
  '/register.html',
  '/css/style.css',
  '/css/admin.css',
  '/js/app.js',
  '/js/lang.js',
  '/js/admin.js',
  '/js/chat.js',
  '/js/pwa-installer.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event - Cache Static Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell & static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean Up Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve from Cache or Fetch from Network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests or API calls (let API calls go to network/API)
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset and update cache in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Ignore network errors for background update */});

        return cachedResponse;
      }

      // Fetch from network if not in cache
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline Fallback for HTML pages
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
