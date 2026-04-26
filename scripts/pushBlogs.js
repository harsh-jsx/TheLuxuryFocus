/**
 * Push blogs to Firestore.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=*** node scripts/pushBlogs.js
 *
 * Optional flags:
 *   --dry            Print what would be inserted, don't write.
 *   --force          Insert even if a blog with the same title already exists.
 *
 * Schema (matches src/services/blogService.js + src/seedBlogs.js):
 *   title, category, date, image, excerpt, content (HTML string),
 *   author, readingTime, createdAt (serverTimestamp)
 *
 * Firestore rules require an authenticated write for /blogs/{id}, so this
 * script signs in via Firebase Auth (email/password) before pushing.
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { BLOGS } from "./blogsData.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKiPH6nUey_D-GLRFr30mcaxFc6oHuHJM",
  authDomain: "theluxuryfocus-4b88e.firebaseapp.com",
  projectId: "theluxuryfocus-4b88e",
  storageBucket: "theluxuryfocus-4b88e.firebasestorage.app",
  messagingSenderId: "193866996368",
  appId: "1:193866996368:web:f278eb7ad843abde4c9615",
  measurementId: "G-YZ0ET43KFZ",
};

const flags = new Set(process.argv.slice(2));
const DRY = flags.has("--dry");
const FORCE = flags.has("--force");

const die = (msg, code = 1) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(code);
};

const main = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!DRY && (!email || !password)) {
    die(
      "Missing ADMIN_EMAIL / ADMIN_PASSWORD env vars.\n" +
        "  These are required because Firestore rules block unauthenticated writes to /blogs.\n" +
        "  Use an existing admin account that can write to the blogs collection.",
    );
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  if (DRY) {
    console.log(`(dry-run) would push ${BLOGS.length} blog(s):`);
    BLOGS.forEach((b, i) =>
      console.log(`  [${i + 1}] ${b.title}  —  ${b.category}`),
    );
    process.exit(0);
  }

  console.log(`→ Signing in as ${email}…`);
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    die(`Sign-in failed: ${err.code || err.message}`);
  }
  console.log("✓ Authenticated.\n");

  const blogsCol = collection(db, "blogs");

  // Build a set of existing titles to avoid duplicates (unless --force).
  let existingTitles = new Set();
  if (!FORCE) {
    console.log("→ Fetching existing blog titles to dedupe…");
    const snap = await getDocs(blogsCol);
    existingTitles = new Set(
      snap.docs.map((d) => (d.data().title || "").trim().toLowerCase()),
    );
    console.log(`  found ${existingTitles.size} existing blog(s).\n`);
  }

  let inserted = 0;
  let skipped = 0;

  for (const blog of BLOGS) {
    const key = blog.title.trim().toLowerCase();
    if (!FORCE && existingTitles.has(key)) {
      console.log(`↷ Skipped (already exists): ${blog.title}`);
      skipped += 1;
      continue;
    }
    try {
      const ref = await addDoc(blogsCol, {
        ...blog,
        createdAt: serverTimestamp(),
      });
      console.log(`✓ Inserted: ${blog.title}  (id: ${ref.id})`);
      inserted += 1;
    } catch (err) {
      console.error(`✗ Failed: ${blog.title}  —  ${err.code || err.message}`);
    }
  }

  console.log(
    `\nDone. Inserted ${inserted}, skipped ${skipped}, total attempted ${BLOGS.length}.`,
  );

  await signOut(auth).catch(() => {});
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
