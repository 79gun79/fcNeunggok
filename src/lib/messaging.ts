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

export const onForegroundMessage = async (
  callback: (payload: MessagePayload) => void,
) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};
