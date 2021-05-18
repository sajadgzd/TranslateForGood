let CACHE_STATIC_NAME = 'static';
let CACHE_DYNAMIC_NAME = 'dynamic';

self.addEventListener('push', function(event) {
  event.waitUntil(
 
    self.clients.matchAll().then(function(clientList) {
      let data = {title: 'TranslateForGood', body: 'News from TFG. Click to check it out!'};
      if (event.data){
        data = JSON.parse(event.data.text());
      }
      let options = {
        body: data.body
      };
      return self.registration.showNotification(data.title, options);
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(
 
    self.clients.matchAll().then(function(clientList) {

      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      if (process.env.NODE_ENV === 'production') {
        return self.clients.openWindow('https://translateforgood.herokuapp.com/chatList'); // change this for deployed version
      } else {
        return self.clients.openWindow('http://localhost:3000/chatList');
      }
    })
  );
});

self.addEventListener('install', function(event) {
  console.log("SW: Installing service worker...", event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(function(cache){
      console.log("SW: Precaching app shell");
      return cache.addAll(
        [
          "offlineAbout.html"
        ]
      );
    })
    )
});
self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {
              return caches.open(CACHE_STATIC_NAME)
                .then(function(cache) {
                  return cache.match('/offlineAbout.html');
                });
            });
        }
      })
  );
});