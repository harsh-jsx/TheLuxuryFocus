import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGalleryItems } from "../services/galleryService";

function Thumb({ item }) {
  const isVideo = item?.type === "video";
  return (
    <div className="relative overflow-hidden rounded-2xl bg-black/5 border border-black/10">
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
        <div className="absolute top-3 left-3 rounded-full bg-black/50 backdrop-blur px-3 py-1 text-black font-[ABC] text-[10px] tracking-widest uppercase">
          Video
        </div>
      ) : null}
    </div>
  );
}

const Gallery = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getGalleryItems({ pageSize: 10 });
        if (!alive) return;
        setItems(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="py-20 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-5xl md:text-6xl  tracking-tight">Gallery</h2>
            <p className="font-[ABC]  text-xs uppercase tracking-widest mt-3">
              A Pinterest-style feed of photos & videos
            </p>
          </div>

          <Link
            to="/gallery"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-white text-[#0a0a0a] font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors w-fit"
          >
            Explore all →
          </Link>
        </div>

        <div className="mt-10 columns-2 md:columns-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid">
              <Link to={`/gallery/${item.id}`} className="block group">
                <Thumb item={item} />
                <div className="mt-3 px-1">
                  <div className="font-[Albra] text-lg  leading-tight group-hover:opacity-90">
                    {item.title ?? "Untitled"}
                  </div>
                  <div className="mt-2 font-[ABC] text-xs  flex items-center justify-between">
                    <span>{item.type === "video" ? "Video" : "Photo"}</span>
                    <span className="tabular-nums">
                      {Number(item.likesCount ?? 0)} likes
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {/* {items.length === 0 ? (
            <div className="font-[ABC] text-sm ">
              Add documents in Firestore collection{" "}
              <span className="text-black">galleryItems</span> to populate this
              section.
            </div>
          ) : null} */}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
