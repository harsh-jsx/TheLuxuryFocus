import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  addComment,
  getLikeState,
  getGalleryItemById,
  listenComments,
  listenGalleryItem,
  toggleLike,
} from "../services/galleryService";

function formatDate(ts) {
  const date =
    ts?.toDate?.() ??
    (typeof ts === "string" ? new Date(ts) : ts instanceof Date ? ts : null);
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function GalleryItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    let unsubItem = null;
    let unsubComments = null;
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const initial = await getGalleryItemById(id);
        if (!alive) return;
        setItem(initial);
        if (!initial) {
          setError("Item not found.");
          return;
        }

        unsubItem = listenGalleryItem(id, setItem);
        unsubComments = listenComments(id, setComments, { pageSize: 50 });
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Failed to load item.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      if (unsubItem) unsubItem();
      if (unsubComments) unsubComments();
    };
  }, [id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (!id) return;
        const s = await getLikeState(id, currentUser?.uid);
        if (!alive) return;
        setLiked(Boolean(s?.liked));
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, currentUser?.uid]);

  const isVideo = item?.type === "video";
  const likesCount = Number(item?.likesCount ?? 0);

  const metaLine = useMemo(() => {
    const date = formatDate(item?.createdAt);
    const author = item?.authorName ?? item?.author ?? "TLF Community";
    return [author, date].filter(Boolean).join(" • ");
  }, [item]);

  const requireAuth = () => {
    if (currentUser?.uid) return true;
    navigate("/login", { state: { from: `/gallery/${id}` } });
    return false;
  };

  const onToggleLike = async () => {
    if (!requireAuth()) return;
    if (!id) return;
    try {
      setLikeBusy(true);
      const res = await toggleLike(id, { uid: currentUser.uid });
      setLiked(Boolean(res?.liked));
    } catch (e) {
      console.error(e);
    } finally {
      setLikeBusy(false);
    }
  };

  const onSubmitComment = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!id) return;
    try {
      setCommentBusy(true);
      await addComment(id, { text: commentText, user: currentUser });
      setCommentText("");
    } catch (e2) {
      console.error(e2);
    } finally {
      setCommentBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#E4E0D9] pt-28 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto font-[ABC] text-sm text-white/55">
          Loading…
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#E4E0D9] pt-28 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="font-[ABC] text-sm text-red-400">{error || "Not found."}</div>
          <Link
            to="/gallery"
            className="inline-block mt-6 font-[ABC] text-xs uppercase tracking-widest text-white/70 hover:text-white"
          >
            Back to gallery →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#E4E0D9] pt-24 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            to="/gallery"
            className="font-[ABC] text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            ← Back to gallery
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Media */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl overflow-hidden bg-white/5 border border-white/10">
              {isVideo ? (
                <video
                  className="w-full h-auto object-cover"
                  src={item.src}
                  poster={item.poster ?? undefined}
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.title ?? "Gallery item"}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </div>

          {/* Right: Panel (Pinterest-like) */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl leading-tight">
                    {item.title ?? "Untitled"}
                  </h1>
                  {metaLine ? (
                    <div className="font-[ABC] text-xs uppercase tracking-widest text-white/45 mt-3">
                      {metaLine}
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={onToggleLike}
                  disabled={likeBusy}
                  className={`shrink-0 rounded-2xl px-4 py-2 font-[ABC] text-xs uppercase tracking-widest border transition-colors ${
                    liked
                      ? "bg-white text-[#0a0a0a] border-white"
                      : "bg-transparent text-white border-white/20 hover:border-white/40"
                  }`}
                >
                  {liked ? "Liked" : "Like"} ·{" "}
                  <span className="tabular-nums">{likesCount}</span>
                </button>
              </div>

              {item.description ? (
                <p className="mt-6 text-white/85">{item.description}</p>
              ) : null}

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <div className="font-[ABC] text-xs uppercase tracking-widest text-white/60">
                    Comments
                  </div>
                  <div className="font-[ABC] text-xs text-white/45 tabular-nums">
                    {comments.length}
                  </div>
                </div>

                <form onSubmit={onSubmitComment} className="mt-4 flex gap-3">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={currentUser ? "Add a comment…" : "Sign in to comment…"}
                    className="flex-1 rounded-2xl bg-[#0a0a0a] border border-white/10 px-4 py-3 font-[ABC] text-sm outline-none focus:border-white/25"
                    disabled={commentBusy}
                  />
                  <button
                    type="submit"
                    disabled={commentBusy || !commentText.trim()}
                    className="rounded-2xl px-4 py-3 font-[ABC] text-xs uppercase tracking-widest bg-white text-[#0a0a0a] disabled:opacity-50"
                  >
                    Post
                  </button>
                </form>

                <div className="mt-5 space-y-3 max-h-[360px] overflow-auto pr-1">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-2xl bg-white/5 border border-white/10 p-4"
                    >
                      <div className="flex items-center gap-3">
                        {c.authorPhotoURL ? (
                          <img
                            src={c.authorPhotoURL}
                            alt={c.authorName ?? "User"}
                            className="w-8 h-8 rounded-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/10" />
                        )}
                        <div className="min-w-0">
                          <div className="font-[ABC] text-xs uppercase tracking-widest text-white/70 truncate">
                            {c.authorName ?? "Anonymous"}
                          </div>
                          <div className="font-[ABC] text-[11px] text-white/40">
                            {formatDate(c.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-white/90">{c.text}</div>
                    </div>
                  ))}

                  {comments.length === 0 ? (
                    <div className="font-[ABC] text-sm text-white/45">
                      Be the first to comment.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-6 font-[ABC] text-xs text-white/40">
              Tip: store your Cloudinary URL as <span className="text-white/60">src</span>{" "}
              (and <span className="text-white/60">poster</span> for videos) in Firestore.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

