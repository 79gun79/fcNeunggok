import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type Messaging,
  type MessagePayload,
} from 'firebase/messaging';
import { firebaseApp } from '@/lib/firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

let messagingPromise: Promise<Messaging | null> | null = null;

const getMessagingInstance = (): Promise<Messaging | null> => {
  if (!messagingPromise) {
    messagingPromise = isSupported().then((supported) =>
      supported ? getMessaging(firebaseApp) : null,
    );
  }
  return messagingPromise;
};

// 등록 직후에는 서비스 워커가 installing/waiting 상태라 PushManager 구독이 실패할 수 있어,
// activated 상태가 될 때까지 기다립니다.
const waitForActivation = (registration: ServiceWorkerRegistration) =>
  new Promise<void>((resolve) => {
    if (registration.active) {
      resolve();
      return;
    }
    const worker = registration.installing ?? registration.waiting;
    if (!worker) {
      resolve();
      return;
    }
    worker.addEventListener('statechange', function onStateChange() {
      if (worker.state === 'activated') {
        worker.removeEventListener('statechange', onStateChange);
        resolve();
      }
    });
  });

// iOS Safari는 홈 화면에 추가된 PWA(standalone)가 아니면 웹 푸시 권한 요청 자체가
// 브라우저 레벨에서 막혀 있어, 토큰 발급을 시도하기 전에 미리 안내가 필요하다.
export const isIosNonStandalonePwa = (): boolean => {
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  return isIos && !isStandalone;
};

export const requestFcmToken = async (): Promise<string | null> => {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    console.warn('이 브라우저는 푸시 알림을 지원하지 않습니다.');
    return null;
  }

  if (!VAPID_KEY) {
    console.warn('VAPID 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return null;
  }

  const messaging = await getMessagingInstance();
  if (!messaging) {
    console.warn('이 브라우저는 Firebase 메시징을 지원하지 않습니다.');
    return null;
  }

  try {
    // PWA 오프라인 캐싱용 서비스 워커(vite-plugin-pwa)와 스코프가 겹치지 않도록 분리 등록합니다.
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/firebase-cloud-messaging-push-scope' },
    );
    await waitForActivation(registration);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token || null;
  } catch (error) {
    console.error('FCM 토큰 발급 실패:', error);
    return null;
  }
};

// 앱을 열 때마다 호출해서 서비스 워커 스크립트가 최신인지 확인/갱신합니다.
// register()를 다시 호출하는 것 자체가 브라우저의 바이트 비교 업데이트 체크를
// 트리거하며, 알림 권한과 무관하므로 로그인/권한 여부와 상관없이 호출 가능합니다.
export const ensureFcmServiceWorkerUpToDate = async () => {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/firebase-cloud-messaging-push-scope' },
    );
    await registration.update();
  } catch (error) {
    console.error('서비스 워커 업데이트 확인 실패:', error);
  }
};

export const onForegroundMessage = async (
  callback: (payload: MessagePayload) => void,
) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};
