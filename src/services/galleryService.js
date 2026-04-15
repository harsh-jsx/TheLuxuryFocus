import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const GALLERY_COLLECTION = "galleryItems";

export async function getGalleryItems({ pageSize = 40 } = {}) {
  const q = query(
    collection(db, GALLERY_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getGalleryItemById(id) {
  const ref = doc(db, GALLERY_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export function listenGalleryItem(id, cb) {
  const ref = doc(db, GALLERY_COLLECTION, id);
  return onSnapshot(ref, (snap) => {
    cb(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export function listenComments(itemId, cb, { pageSize = 50 } = {}) {
  const commentsRef = collection(db, GALLERY_COLLECTION, itemId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "desc"), limit(pageSize));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function addComment(itemId, { text, user }) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) return null;
  if (!user?.uid) throw new Error("Must be signed in to comment.");

  const commentsRef = collection(db, GALLERY_COLLECTION, itemId, "comments");
  await addDoc(commentsRef, {
    text: trimmed,
    uid: user.uid,
    authorName: user.displayName ?? "Anonymous",
    authorPhotoURL: user.photoURL ?? null,
    createdAt: serverTimestamp(),
  });
  return true;
}

export async function getLikeState(itemId, uid) {
  if (!uid) return { liked: false };
  const likeRef = doc(db, GALLERY_COLLECTION, itemId, "likes", uid);
  const snap = await getDoc(likeRef);
  return { liked: snap.exists() };
}

export async function toggleLike(itemId, { uid }) {
  if (!uid) throw new Error("Must be signed in to like.");

  const itemRef = doc(db, GALLERY_COLLECTION, itemId);
  const likeRef = doc(db, GALLERY_COLLECTION, itemId, "likes", uid);

  return await runTransaction(db, async (tx) => {
    const [itemSnap, likeSnap] = await Promise.all([
      tx.get(itemRef),
      tx.get(likeRef),
    ]);

    if (!itemSnap.exists()) throw new Error("Item not found.");

    const currentCount = Number(itemSnap.data()?.likesCount ?? 0);
    const liked = likeSnap.exists();

    if (liked) {
      tx.delete(likeRef);
      tx.update(itemRef, { likesCount: Math.max(0, currentCount - 1) });
      return { liked: false, likesCount: Math.max(0, currentCount - 1) };
    }

    tx.set(likeRef, { createdAt: serverTimestamp() });
    tx.update(itemRef, { likesCount: currentCount + 1 });
    return { liked: true, likesCount: currentCount + 1 };
  });
}

// Optional helper for admin seeding or future uploads.
export async function createGalleryItem(data) {
  const payload = {
    type: data?.type === "video" ? "video" : "image",
    src: data?.src ?? "",
    poster: data?.poster ?? null,
    title: data?.title ?? "",
    description: data?.description ?? "",
    createdAt: serverTimestamp(),
    createdByUid: data?.createdByUid ?? null,
    likesCount: 0,
    tags: Array.isArray(data?.tags) ? data.tags : [],
  };

  const docRef = await addDoc(collection(db, GALLERY_COLLECTION), payload);
  return docRef.id;
}

