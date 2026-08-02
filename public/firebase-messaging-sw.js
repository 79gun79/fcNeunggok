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

// 새 버전이 배포되면 대기 없이 바로 활성화되도록 함 (안 그러면 탭을 모두
// 닫았다 열어야 새 서비스 워커 코드가 적용됨)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const messaging = firebase.messaging();

// notification 필드 대신 data만 받습니다 — notification을 쓰면 브라우저가
// 자동으로 한 번 띄우고, 아래 코드가 또 한 번 띄워서 알림이 중복으로 발송됩니다.
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.data || {};
  self.registration.showNotification(title || 'FC 능곡', {
    body,
    icon: icon || '/favicon/web-app-manifest-192x192.png',
  });
});
