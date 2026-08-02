importScripts(
  'https://www.gstatic.com/firebasejs/12.17.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/12.17.0/firebase-messaging-compat.js',
);

// 서비스 워커는 정적 파일이라 .env 값을 읽을 수 없어 설정을 직접 명시합니다.
// src/lib/firebase.ts의 값과 동일하게 유지해야 합니다.
firebase.initializeApp({
  apiKey: 'AIzaSyCik4VEBMoPZVwvNd4ij_5Em596DW0sutA',
  authDomain: 'fc-neunggok.firebaseapp.com',
  projectId: 'fc-neunggok',
  storageBucket: 'fc-neunggok.firebasestorage.app',
  messagingSenderId: '411269228791',
  appId: '1:411269228791:web:fb49297a37d46552658bf2',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'FC 능곡', {
    body,
    icon: icon || '/favicon/web-app-manifest-192x192.png',
  });
});
