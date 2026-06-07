const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-writedin.onrender.com';
const EMOJI_REGEX = /\p{Extended_Pictographic}/gu;
const MIN_EMOJIS = 2;
const MAX_EMOJIS = 5;
const FALLBACK_EMOJIS = ['\u2728', '\u{1F4A1}', '\u{1F680}', '\u2705', '\u{1F525}'];
const WRITEDIN_HASHTAG = '#WritedIn';
const WRITEDIN_HASHTAG_REGEX = /(^|\s)#writedin(?![\p{L}\p{N}_-])/iu;
const WRITEDIN_HASHTAG_GLOBAL_REGEX = /(^|\s)#writedin(?![\p{L}\p{N}_-])/giu;
const HASHTAG_REGEX = /(^|\s)#[\p{L}\p{N}_-]+/u;

const ensureWritedInHashtag = (post) => {
  const normalizedPost = String(post || '').trim().replace(
    WRITEDIN_HASHTAG_GLOBAL_REGEX,
    (_, prefix) => `${prefix}${WRITEDIN_HASHTAG}`
  );

  if (!normalizedPost || WRITEDIN_HASHTAG_REGEX.test(normalizedPost)) {
    return normalizedPost;
  }

  const separator = HASHTAG_REGEX.test(normalizedPost) ? ' ' : '\n\n';
  return `${normalizedPost}${separator}${WRITEDIN_HASHTAG}`;
};

const removeExtraEmojis = (post, maxEmojis) => {
  let count = 0;

  return String(post || '').replace(EMOJI_REGEX, (emoji) => {
    count += 1;
    return count <= maxEmojis ? emoji : '';
  });
};

const countEmojis = (post) => post.match(EMOJI_REGEX)?.length || 0;

const ensureEmojiRange = (post, requestedMaxEmojis) => {
  const allowedMaxEmojis = Math.min(Math.max(requestedMaxEmojis || MAX_EMOJIS, MIN_EMOJIS), MAX_EMOJIS);
  const cleanPost = removeExtraEmojis(post, allowedMaxEmojis);
  const emojiCount = countEmojis(cleanPost);

  if (emojiCount >= MIN_EMOJIS) {
    return cleanPost.trim();
  }

  const missingEmojis = FALLBACK_EMOJIS
    .slice(0, Math.min(MIN_EMOJIS - emojiCount, allowedMaxEmojis - emojiCount))
    .join(' ');

  return `${cleanPost.trimEnd()} ${missingEmojis}`.trim();
};

export const generatePost = async ({ text, options, idea, preferences, template, model }) => {
  const payload = text
    ? { text, options }
    : { idea, preferences, template, model };

  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Serveur non disponible');
  }

  if (!data.post && !data.text) {
    throw new Error('Réponse invalide du serveur');
  }

  if (options?.useEmojis || options?.useHashtags) {
    let post = data.post || data.text;

    if (options?.useEmojis) {
      post = ensureEmojiRange(post, options.maxEmojis);
    }

    if (options?.useHashtags) {
      post = ensureWritedInHashtag(post);
    }

    data.post = post;
    data.text = post;
  }

  return data;
};

export const getApiHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return response.json();
};

export const syncUserToResend = async (user, { marketingOptIn = true } = {}) => {
  if (!user?.getIdToken) return null;

  const token = await user.getIdToken();
  const response = await fetch(`${API_BASE_URL}/api/contacts/resend-sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ marketingOptIn }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Synchronisation Resend impossible');
  }

  return data;
};
