
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
        return self.clients.openWindow('https://translateforgood.herokuapp.com/home'); // change this for deployed version
      } else {
        return self.clients.openWindow('http://localhost:3000/home');
      }
    })
  );
});