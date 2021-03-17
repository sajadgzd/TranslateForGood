self.addEventListener('push', function(event) {
    event.waitUntil(self.registration.showNotification('TranslateForGood', {
      body: 'You have a new matching request.'
    }));
  });