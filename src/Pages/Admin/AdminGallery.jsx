import React, { useMemo, useState } from "react";
import { Image as ImageIcon, Video as VideoIcon, Upload } from "lucide-react";
import { uploadToCloudinary } from "../../services/cloudinaryService";
import { createGalleryItem } from "../../services/galleryService";
import { useAuth } from "../../context/AuthContext";

function guessType(file) {
  if (!file?.type) return "image";
  return file.type.startsWith("video/") ? "video" : "image";
}

export default function AdminGallery() {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [file, setFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");

  const type = useMemo(() => guessType(file), [file]);
  const tags = useMemo(() => {
    return tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [tagsText]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessId("");

    if (!file) {
      setError("Please choose an image or video file.");
      return;
    }

    try {
      setBusy(true);

      const uploaded = await uploadToCloudinary(file, {
        resourceType: type,
      });

      let posterUrl = null;
      if (type === "video" && posterFile) {
        const uploadedPoster = await uploadToCloudinary(posterFile, {
          resourceType: "image",
        });
        posterUrl = uploadedPoster?.secureUrl ?? null;
      }

      const id = await createGalleryItem({
        type,
        src: uploaded?.secureUrl,
        poster: posterUrl,
        title,
        description,
        tags,
        createdByUid: currentUser?.uid ?? null,
      });

      setSuccessId(id);
      setTitle("");
      setDescription("");
      setTagsText("");
      setFile(null);
      setPosterFile(null);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to add gallery item.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Gallery
        </h1>
        <p className="text-gray-500 mt-1">
          Upload photos or videos (Cloudinary) and publish to the public gallery
          (Firestore).
        </p>
      </header>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gray-50 rounded-2xl">
            {type === "video" ? (
              <VideoIcon className="text-gray-900" />
            ) : (
              <ImageIcon className="text-gray-900" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">
              Add new gallery item
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">
              {type === "video" ? "Video" : "Photo"}
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {successId ? (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Published. Firestore ID: <span className="font-mono">{successId}</span>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Media file (image or video)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm"
                disabled={busy}
              />
              <div className="text-xs text-gray-400 mt-2">
                Uses your unsigned Cloudinary preset <span className="font-mono">tlfimages</span>.
              </div>
            </div>

            {type === "video" ? (
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Poster (optional image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm"
                  disabled={busy}
                />
                <div className="text-xs text-gray-400 mt-2">
                  If provided, this will be used as the video thumbnail in the feed.
                </div>
              </div>
            ) : null}

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Handmade crochet pieces"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
                disabled={busy}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short caption / context"
                rows={4}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400 resize-none"
                disabled={busy}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Tags (comma-separated)
              </label>
              <input
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="crochet, winter, handmade"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-gray-400"
                disabled={busy}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-900 transition-colors disabled:opacity-60"
          >
            <Upload size={18} />
            {busy ? "Publishing…" : "Publish to gallery"}
          </button>
        </form>
      </div>
    </div>
  );
}

