import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const getDateValue = (item) => {
  if (item.createdAt?.toMillis) return item.createdAt.toMillis();
  if (typeof item.createdAt === 'string') return new Date(item.createdAt).getTime() || 0;
  return 0;
};

const sortByCreatedAt = (items) => {
  return [...items].sort((a, b) => getDateValue(b) - getDateValue(a));
};

export const ensureUserProfile = async (user) => {
  if (!user) return;

  await setDoc(
    doc(db, 'users', user.uid),
    {
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const getUserProfile = async (userId) => {
  const snapshot = await getDoc(doc(db, 'users', userId));
  return snapshot.exists() ? snapshot.data() : null;
};

export const markWelcomeNotificationSeen = async (user) => {
  if (!user) return;

  return setDoc(
    doc(db, 'users', user.uid),
    {
      welcomeNotificationSeen: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const markNotificationsRead = async (user, notificationIds) => {
  const ids = [...new Set((notificationIds || []).filter(Boolean))];
  if (!user || ids.length === 0) return null;

  return setDoc(
    doc(db, 'users', user.uid),
    {
      readNotificationIds: arrayUnion(...ids),
      notificationsReadAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const hideNotifications = async (user, notificationIds) => {
  const ids = [...new Set((notificationIds || []).filter(Boolean))];
  if (!user || ids.length === 0) return null;

  return setDoc(
    doc(db, 'users', user.uid),
    {
      hiddenNotificationIds: arrayUnion(...ids),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const saveUserMessagingToken = async (user, token) => {
  if (!user || !token) return null;

  return setDoc(
    doc(db, 'fcmTokens', token),
    {
      token,
      userId: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const subscribeGlobalNotifications = (callback, onError) => {
  const q = query(collection(db, 'notifications'));

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      callback(sortByCreatedAt(notifications).slice(0, 20));
    },
    (error) => {
      console.warn('Notifications subscription failed:', error);
      onError?.(error);
    }
  );
};

export const saveGeneratedPost = async ({ user, content, prompt, templateTitle, source, model }) => {
  if (!user) return null;

  ensureUserProfile(user).catch(err => console.warn('Profile sync failed:', err));

  const ref = await addDoc(collection(db, 'posts'), {
    userId: user.uid,
    content,
    prompt,
    templateTitle: templateTitle || null,
    source: source || 'unknown',
    model: model || null,
    createdAt: serverTimestamp(),
  });

  return { id: ref.id, storage: 'firebase' };
};

export const subscribeUserPosts = (userId, callback, onError) => {
  const q = query(
    collection(db, 'posts'),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const posts = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      callback(sortByCreatedAt(posts));
    },
    (error) => {
      console.warn('Posts subscription failed:', error);
      onError?.(error);
    }
  );
};

export const deleteUserPost = (postId) => {
  return deleteDoc(doc(db, 'posts', postId));
};

export const getUserDraft = async (userId) => {
  const snapshot = await getDoc(doc(db, 'drafts', userId));
  return snapshot.exists() ? snapshot.data() : null;
};

export const saveUserDraft = async (userId, draft) => {
  return setDoc(
    doc(db, 'drafts', userId),
    {
      ...draft,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const getUserSettings = async (userId) => {
  const snapshot = await getDoc(doc(db, 'settings', userId));
  return snapshot.exists() ? snapshot.data() : null;
};

export const saveUserSettings = async (userId, settings) => {
  return setDoc(
    doc(db, 'settings', userId),
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const subscribeUserFavorites = (userId, callback, onError) => {
  const q = query(
    collection(db, 'favorites'),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const favorites = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      callback(sortByCreatedAt(favorites));
    },
    (error) => {
      console.warn('Favorites subscription failed:', error);
      onError?.(error);
    }
  );
};

export const addUserFavorite = async (userId, favorite) => {
  return addDoc(collection(db, 'favorites'), {
    userId,
    ...favorite,
    createdAt: serverTimestamp(),
  });
};

export const deleteUserFavorite = (favoriteId) => {
  return deleteDoc(doc(db, 'favorites', favoriteId));
};
