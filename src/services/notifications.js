import { getToken, onMessage } from 'firebase/messaging';
import { messagingPromise } from '../firebase/config';
import { saveUserMessagingToken } from './userData';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const registerMessagingForUser = async (user) => {
  if (!user) return { ok: false, reason: 'missing-user' };

  if (!VAPID_KEY) {
    return { ok: false, reason: 'missing-vapid-key' };
  }

  if (!window.isSecureContext) {
    return { ok: false, reason: 'insecure-context' };
  }

  if (!('Notification' in window)) {
    return { ok: false, reason: 'unsupported-browser' };
  }

  if (!('serviceWorker' in navigator)) {
    return { ok: false, reason: 'missing-service-worker' };
  }

  if (Notification.permission === 'denied') {
    return { ok: false, reason: 'blocked-site-permission' };
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { ok: false, reason: `permission-${permission}` };
  }

  const messaging = await messagingPromise;
  if (!messaging) {
    return { ok: false, reason: 'messaging-unsupported' };
  }

  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    return { ok: false, reason: 'missing-token' };
  }

  try {
    await saveUserMessagingToken(user, token);
  } catch (error) {
    return {
      ok: false,
      reason: 'firestore-token-save-failed',
      detail: error?.code || error?.message || 'Erreur Firestore',
    };
  }

  return { ok: true, token };
};

export const subscribeForegroundMessages = async (callback) => {
  const messaging = await messagingPromise;
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    callback({
      id: `fcm-${Date.now()}`,
      title: payload.notification?.title || payload.data?.title || 'Notification WritedIn',
      body: payload.notification?.body || payload.data?.body || '',
      source: 'fcm',
      createdAt: new Date().toISOString(),
    });
  });
};
