import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getGalleryItems } from "../services/galleryService";

function MediaThumb({ item }) {
  const isVideo = item?.type === "video";

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-white/5">
      {isVideo ? (
        <video
          className="w-full h-auto object-cover"
          src={item.src}
          poster={item.poster ?? undefined}
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src={item.src}
          alt={item.title ?? "Gallery item"}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      )}

      {isVideo ? (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="rounded-full bg-black/50 backdrop-blur px-3 py-2 text-white font-[ABC] text-xs tracking-widest uppercase">
            Video
          </div>
        </div>
      ) : null}

      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
    </div>
  );
}

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [queryText, setQueryText] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getGalleryItems({ pageSize: 60 });
        if (!alive) return;
        setItems(data);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Failed to load gallery.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const hay = `${it.title ?? ""} ${it.description ?? ""} ${(it.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, queryText]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#E4E0D9] pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl md:text-6xl tracking-tight">Gallery</h1>
            <p className="font-[ABC] text-white/55 text-xs uppercase tracking-widest mt-3">
              Powered by Firestore + Cloudinary
            </p>
          </div>

          <div className="w-full md:w-[420px]">
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Search pins…"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 font-[ABC] text-sm outline-none focus:border-white/25"
            />
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <div className="font-[ABC] text-sm text-white/55">Loading…</div>
          ) : error ? (
            <div className="font-[ABC] text-sm text-red-400">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="font-[ABC] text-sm text-white/55">
              No items found. Add docs in Firestore collection{" "}
              <span className="text-white/80">galleryItems</span>.
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:balance]">
              {filtered.map((item) => (
                <div key={item.id} className="mb-4 break-inside-avoid">
                  <Link
                    to={`/gallery/${item.id}`}
                    className="block group"
                    aria-label={item.title ?? "Open item"}
                  >
                    <MediaThumb item={item} />
                    <div className="mt-3 px-1">
                      <div className="font-[Albra] text-lg leading-tight group-hover:opacity-90">
                        {item.title ?? "Untitled"}
                      </div>
                      {item.description ? (
                        <div className="font-[ABC] text-xs uppercase tracking-widest text-white/40 mt-1 line-clamp-2">
                          {item.description}
                        </div>
                      ) : null}
                      <div className="mt-2 font-[ABC] text-xs text-white/55 flex items-center justify-between">
                        <span>{item.type === "video" ? "Video" : "Photo"}</span>
                        <span className="tabular-nums">{Number(item.likesCount ?? 0)} likes</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

