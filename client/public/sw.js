//import { response } from "express";

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
    caches.open("static")
    .then(function(cache){
      console.log("SW: Precaching app shell");
      return cache.addAll(
        [
          "offlineAbout.js"
        ]
      );
    })
    )
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    (async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        // Always try the network first.
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log("Fetch failed; returning offline page instead.", error);

        const cache = await caches.open("static");
        const cachedResponse = await cache.match("/offlineAbout.js"); 
        return cachedResponse;
      }
    })()
  );
});