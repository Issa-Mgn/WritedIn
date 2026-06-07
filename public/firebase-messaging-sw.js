importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCk8Kv_T2ef3Hm9s9FUof2dwT03786C9Mw',
  authDomain: 'writedin.firebaseapp.com',
  projectId: 'writedin',
  storageBucket: 'writedin.firebasestorage.app',
  messagingSenderId: '761931310018',
  appId: '1:761931310018:web:7b78189c648a86c399ac5b',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || 'WritedIn';
  const options = {
    body: payload.notification?.body || payload.data?.body || '',
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});
