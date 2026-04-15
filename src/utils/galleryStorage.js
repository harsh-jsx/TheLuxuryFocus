const STORAGE_KEY = "tlf_gallery_state_v1";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback;
  } catch {
    return fallback;
  }
}

function readAll() {
  if (typeof window === "undefined") return {};
  return safeParse(window.localStorage.getItem(STORAGE_KEY), {});
}

function writeAll(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getItemState(id, fallback = {}) {
  const state = readAll();
  return state?.[id] ?? fallback;
}

export function toggleLike(id, initialLikes = 0) {
  const state = readAll();
  const prev = state?.[id] ?? {};
  const liked = !prev.liked;
  const likes = typeof prev.likes === "number" ? prev.likes : initialLikes;
  const nextLikes = liked ? likes + 1 : Math.max(0, likes - 1);

  const next = {
    ...prev,
    liked,
    likes: nextLikes,
  };

  state[id] = next;
  writeAll(state);
  return next;
}

export function addComment(id, text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return null;

  const state = readAll();
  const prev = state?.[id] ?? {};
  const comments = Array.isArray(prev.comments) ? prev.comments : [];

  const comment = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    text: trimmed,
    createdAt: new Date().toISOString(),
  };

  const next = {
    ...prev,
    comments: [comment, ...comments],
  };

  state[id] = next;
  writeAll(state);
  return comment;
}
