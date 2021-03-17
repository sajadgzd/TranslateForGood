// self.addEventListener('push', function(event) {
//     event.waitUntil(self.registration.showNotification('TranslateForGood', {
//       body: 'You have a new matching request.'
//     }));
//   });

self.addEventListener('push', function(event) {
  event.waitUntil(
 
    self.clients.matchAll().then(function(clientList) {
 
      return self.registration.showNotification('TranslateForGood', {
        body: 'You have a new matching request. Click to see it.',
      });
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(
 
    self.clients.matchAll().then(function(clientList) {

      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      console.log('I am here');
      return self.clients.openWindow('http://localhost:3000/home'); // change this for deployed version
    })
  );
});