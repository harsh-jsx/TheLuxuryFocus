import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { storeService } from "../services/storeService";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  recordStoreEvent,
  logStoreEventToFirebase,
  STORE_ANALYTICS_EVENTS,
} from "../services/storeAnalyticsService";
import { submitConciergeRequest } from "../services/conciergeRequestService";
import {
  MapPin,
  Instagram,
  Globe,
  Phone,
  Clock,
  Tag,
  ChevronLeft,
  Loader2,
  ArrowRight,
  ShoppingBag,
  Star,
  MessageCircle,
  Share2,
  ExternalLink,
  X,
  CheckCircle,
  ThumbsUp,
  Sparkles,
  Award,
  Users,
  TrendingUp,
  Heart,
  Send,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPlanLimits } from "../constants/subscriptionPlans";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────── helpers ─────────────────────────── */
const getRatingColor = (r) => {
  if (r >= 4.5) return "bg-emerald-500";
  if (r >= 3.5) return "bg-green-500";
  if (r >= 2.5) return "bg-yellow-500";
  if (r >= 1.5) return "bg-orange-500";
  return "bg-red-500";
};

const getRatingLabel = (r) => {
  if (r >= 4.5) return "Outstanding";
  if (r >= 4.0) return "Excellent";
  if (r >= 3.5) return "Very Good";
  if (r >= 3.0) return "Good";
  if (r >= 2.0) return "Fair";
  return "Poor";
};

const StarRow = ({
  value,
  max = 5,
  size = 14,
  interactive = false,
  hovered = 0,
  onHover,
  onClick,
}) =>
  Array.from({ length: max }).map((_, i) => {
    const filled = (interactive ? hovered || value : value) > i;
    return (
      <button
        key={i}
        type={interactive ? "button" : undefined}
        disabled={!interactive}
        onMouseEnter={interactive ? () => onHover?.(i + 1) : undefined}
        onMouseLeave={interactive ? () => onHover?.(0) : undefined}
        onClick={interactive ? () => onClick?.(i + 1) : undefined}
        style={
          interactive
            ? { cursor: "pointer" }
            : {
                cursor: "default",
                background: "none",
                border: "none",
                padding: 0,
              }
        }
        className={
          interactive ? "p-0.5 hover:scale-110 transition-transform" : ""
        }
        aria-label={interactive ? `Rate ${i + 1} stars` : undefined}
      >
        <Star
          size={size}
          className={
            filled
              ? "text-amber-400 fill-amber-400"
              : "text-gray-300 fill-gray-100"
          }
        />
      </button>
    );
  });

/* ───────────────── RatingBar ───────────────── */
const RatingBar = ({ label, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-gray-500 w-4 text-right">
        {label}
      </span>
      <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
    </div>
  );
};

/* ─────────────────────── main component ─────────────────────── */
const StoreProfile = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  // concierge
  const [conciergeModalOpen, setConciergeModalOpen] = useState(false);
  const [conciergeSubmitting, setConciergeSubmitting] = useState(false);
  const [conciergeSubmitted, setConciergeSubmitted] = useState(false);
  const [conciergeForm, setConciergeForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // ratings / reviews
  const [ratings, setRatings] = useState([]);
  const [ratingForm, setRatingForm] = useState({
    name: "",
    rating: 5,
    review: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSort, setReviewSort] = useState("latest");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  // tabs / lightbox
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const contentRefs = useRef([]);
  const sectionRefs = useRef({
    overview: null,
    services: null,
    photos: null,
    reviews: null,
    contact: null,
  });

  /* fetch store */
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await storeService.getStoreById(id);
        setStore(data);
      } catch (err) {
        console.error("Error loading store profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
    window.scrollTo(0, 0);
  }, [id]);

  /* fetch ratings */
  useEffect(() => {
    if (!id) return;
    const fetchRatings = async () => {
      try {
        const q = query(
          collection(db, "storeRatings"),
          where("storeId", "==", id),
        );
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        rows.sort(
          (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
        );
        setRatings(rows);
      } catch (err) {
        console.error("Error loading ratings", err);
      }
    };
    fetchRatings();
  }, [id]);

  /* analytics: profile view */
  useEffect(() => {
    if (!store?.id) return;
    recordStoreEvent(store.id, STORE_ANALYTICS_EVENTS.STORE_PROFILE_VIEW);
    logStoreEventToFirebase("store_profile_view", { store_id: store.id });
  }, [store?.id]);

  /* GSAP animations */
  useGSAP(() => {
    if (!store || !containerRef.current) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion && heroRef.current) {
      gsap.to(heroRef.current.querySelector("img"), {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }

    if (cardRef.current) {
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: reduceMotion ? 0.3 : 1.1,
        ease: "power4.out",
        delay: reduceMotion ? 0 : 0.2,
      });
    }

    const els = contentRefs.current.filter(Boolean);
    if (els.length) {
      gsap.from(els, {
        y: 36,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: els[0], start: "top 88%", once: true },
      });
    }
  }, [store]);

  /* ── concierge ── */
  const handleConciergeChange = (e) =>
    setConciergeForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleConciergeSubmit = async (e) => {
    e.preventDefault();
    if (!store?.id || conciergeSubmitting) return;
    setConciergeSubmitting(true);
    try {
      await submitConciergeRequest(store.id, conciergeForm);
      recordStoreEvent(
        store.id,
        STORE_ANALYTICS_EVENTS.STORE_REQUEST_CONCIERGE_CLICK,
      );
      setConciergeSubmitted(true);
      setConciergeForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Concierge request failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setConciergeSubmitting(false);
    }
  };

  const closeConciergeModal = () => {
    setConciergeModalOpen(false);
    setConciergeSubmitted(false);
  };

  /* ── share ── */
  const handleShare = () => {
    recordStoreEvent(store.id, STORE_ANALYTICS_EVENTS.STORE_SHARE_CLICK);
    if (navigator.share) {
      navigator
        .share({ title: store.storeName, url: window.location.href })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ── submit review ── */
  const submitRating = async (e) => {
    e.preventDefault();
    if (!ratingForm.name || !ratingForm.review) return;
    setRatingSubmitting(true);
    try {
      await addDoc(collection(db, "storeRatings"), {
        storeId: store.id,
        name: ratingForm.name.trim(),
        rating: Number(ratingForm.rating),
        review: ratingForm.review.trim(),
        createdAt: serverTimestamp(),
      });
      setRatingForm({ name: "", rating: 5, review: "" });
      setShowReviewForm(false);
      const snap = await getDocs(
        query(collection(db, "storeRatings"), where("storeId", "==", id)),
      );
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
      );
      setRatings(rows);
    } catch (err) {
      console.error("Error submitting rating", err);
    } finally {
      setRatingSubmitting(false);
    }
  };

  /* ── scroll to section ── */
  const scrollToSection = (key) => {
    const target = sectionRefs.current[key];
    if (!target) return;
    setActiveTab(key);
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  /* ── loading / not-found ── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8]">
        <div className="relative w-14 h-14 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#D0B887]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#D0B887] animate-spin" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.35em] text-gray-400 font-medium">
          Curating Experience
        </p>
      </div>
    );
  }

  if (!store || store.disabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8]">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
          <ShoppingBag size={28} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Store not found
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          This store may have moved or no longer exists.
        </p>
        <Link
          to="/stores"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Stores
        </Link>
      </div>
    );
  }

  /* ── computed values ── */
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((s, r) => s + Number(r.rating || 0), 0) / ratings.length
      : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => Math.round(Number(r.rating)) === star).length,
  }));

  const profilePlan = getPlanLimits(store.planId || 1);
  const visibleGallery = (store.galleryUrls || []).slice(
    0,
    profilePlan.maxImages,
  );
  const whatsappNumber = store.whatsappNumber || store.storePhone;

  const sortedRatings = [...ratings].sort((a, b) => {
    if (reviewSort === "high")
      return Number(b.rating || 0) - Number(a.rating || 0);
    if (reviewSort === "low")
      return Number(a.rating || 0) - Number(b.rating || 0);
    if (reviewSort === "relevant")
      return (b.review?.length || 0) - (a.review?.length || 0);
    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
  });

  const visibleReviews = reviewsExpanded
    ? sortedRatings
    : sortedRatings.slice(0, 5);

  const tabItems = [
    { key: "overview", label: "Overview" },
    { key: "services", label: "Services" },
    { key: "photos", label: "Photos" },
    { key: "reviews", label: `Reviews (${ratings.length})` },
    { key: "contact", label: "Contact" },
  ];

  const currentRatingLabel =
    ratingForm.rating === 5
      ? "Excellent"
      : ratingForm.rating === 4
        ? "Very Good"
        : ratingForm.rating === 3
          ? "Good"
          : ratingForm.rating === 2
            ? "Fair"
            : "Poor";

  /* ════════════════════════════ render ════════════════════════════ */
  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#fafaf8] text-gray-900 overflow-x-hidden"
    >
      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        className="relative h-[56vh] md:h-[68vh] w-full overflow-hidden"
      >
        <img
          src={
            store.bannerUrl ||
            "https://images.unsplash.com/photo-1497366216548-37526070a712?auto=format&fit=crop&q=80"
          }
          alt={store.storeName}
          className="absolute inset-0 w-full h-[130%] object-cover object-center"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-[#fafaf8]" />
        {/* subtle texture */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* back button */}
        <div className="absolute top-6 mt-10 left-5 md:left-10 z-20">
          <Link
            to="/stores"
            className="group inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-md text-white text-[11px] uppercase tracking-widest font-medium rounded-full border border-white/20 hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Stores
          </Link>
        </div>

        {/* action buttons */}
        <div className="absolute top-6 mt-10 right-5 md:right-10 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="relative p-2.5 bg-white/15 backdrop-blur-md text-white rounded-full border border-white/20 hover:bg-white hover:text-gray-900 transition-all duration-300"
            title="Share"
          >
            <Share2 size={18} />
            {copied && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-md whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
        </div>

        {/* plan badge */}
        {store.planId && store.planId > 1 && (
          <div className="absolute bottom-16 left-5 md:left-10 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D0B887] text-[#0a0a0a] text-[10px] uppercase tracking-widest font-semibold rounded-full">
              <Award size={11} /> Premium Listing
            </span>
          </div>
        )}
      </section>

      {/* ─── Identity Card ─── */}
      <div className="relative z-30 px-4 sm:px-6 lg:px-10 -mt-20 md:-mt-28 pb-8 max-w-[1500px] mx-auto">
        <div
          ref={cardRef}
          className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-6 md:p-10"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* logo */}
            <div className="shrink-0 self-start -mt-16 md:-mt-24 ml-2">
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden">
                <img
                  src={store.logoUrl || "https://via.placeholder.com/200"}
                  alt={store.storeName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D0B887]/12 text-[#b89755] text-[10px] uppercase tracking-widest font-semibold rounded-full border border-[#D0B887]/30">
                  <Sparkles size={10} />
                  {store.storeCategory}
                </span>
                {store.priceRange && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] uppercase tracking-widest font-medium rounded-full">
                    {store.priceRange}
                  </span>
                )}
                <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] uppercase tracking-widest font-medium rounded-full border border-green-100">
                  {store.availabilityStatus || "Available Now"}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight leading-none mb-4">
                {store.storeName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#D0B887]" />
                  {store.storeCity}
                  {store.storeState && `, ${store.storeState}`}
                </span>
                {store.openingHours && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#D0B887]" />
                    {store.openingHours}
                  </span>
                )}
                {store.establishedYear && (
                  <span className="flex items-center gap-1.5">
                    <Award size={14} className="text-[#D0B887]" />
                    Est. {store.establishedYear}
                  </span>
                )}
              </div>

              {/* stats row */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <div
                    className={`w-8 h-8 rounded-lg ${getRatingColor(avgRating)} flex items-center justify-center`}
                  >
                    <Star size={14} className="text-white fill-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 leading-none">
                      {avgRating ? avgRating.toFixed(1) : "New"}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {avgRating ? getRatingLabel(avgRating) : "No ratings yet"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Users size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 leading-none">
                      {ratings.length}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Reviews
                    </div>
                  </div>
                </div>
                {store.storeServices?.length > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                      <TrendingUp size={14} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-none">
                        {store.storeServices.length}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Services
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* actions */}
            <div className="shrink-0 flex flex-col gap-3 items-stretch md:items-end md:justify-between">
              <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                {store.storePhone && (
                  <a
                    href={`tel:${store.storePhone}`}
                    onClick={() =>
                      recordStoreEvent(
                        store.id,
                        STORE_ANALYTICS_EVENTS.STORE_PHONE_CLICK,
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white text-[11px] uppercase tracking-widest font-semibold rounded-xl hover:bg-green-500 transition-colors"
                  >
                    <Phone size={13} /> Call
                  </a>
                )}
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${String(whatsappNumber).replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-[11px] uppercase tracking-widest font-semibold rounded-xl hover:bg-emerald-500 transition-colors"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    recordStoreEvent(
                      store.id,
                      STORE_ANALYTICS_EVENTS.STORE_CONNECT_CLICK,
                    );
                    window.location.href = `mailto:${store.storeEmail || ""}`;
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-[11px] uppercase tracking-widest font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Enquire <ArrowRight size={13} />
                </button>
              </div>

              {/* social icons */}
              <div className="flex items-center gap-1">
                {store.storeInstagram && (
                  <a
                    href={`https://instagram.com/${store.storeInstagram}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      recordStoreEvent(
                        store.id,
                        STORE_ANALYTICS_EVENTS.STORE_INSTAGRAM_CLICK,
                      )
                    }
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                    title="Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                )}
                {store.storeWebsite && (
                  <a
                    href={store.storeWebsite}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      recordStoreEvent(
                        store.id,
                        STORE_ANALYTICS_EVENTS.STORE_WEBSITE_CLICK,
                      )
                    }
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
                    title="Website"
                  >
                    <Globe size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mini Gallery Strip ─── */}
      {(visibleGallery.length > 0 || store.bannerUrl) && (
        <section className="px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[store.bannerUrl, ...visibleGallery]
              .filter(Boolean)
              .slice(0, 6)
              .map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxUrl(url)}
                  className="shrink-0 h-20 w-28 rounded-xl overflow-hidden border border-gray-100 hover:border-[#D0B887] transition-colors group"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
          </div>
        </section>
      )}

      {/* ─── Sticky Tab Bar ─── */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => scrollToSection(tab.key)}
                className={`shrink-0 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-10 py-10 pb-24">
        {/* left column */}
        <div className="xl:col-span-8 space-y-14">
          {/* overview */}
          <div
            ref={(el) => {
              contentRefs.current[0] = el;
              sectionRefs.current.overview = el;
            }}
          >
            <SectionLabel>About</SectionLabel>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mt-4">
              {store.storeDescription ||
                "This establishment defines the pinnacle of luxury, offering a curated experience that transcends the ordinary. Every detail is meticulously crafted to ensure the highest standards of excellence."}
            </p>
          </div>

          {/* services */}
          {store.storeServices && store.storeServices.length > 0 && (
            <div
              ref={(el) => {
                contentRefs.current[1] = el;
                sectionRefs.current.services = el;
              }}
            >
              <SectionLabel>Services & Amenities</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {store.storeServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#D0B887]/40 hover:shadow-sm transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#D0B887]/10 flex items-center justify-center text-[#D0B887] group-hover:bg-[#D0B887]/20 transition-colors shrink-0">
                      <Tag size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* gallery */}
          {visibleGallery.length > 0 && (
            <div
              ref={(el) => {
                contentRefs.current[2] = el;
                sectionRefs.current.photos = el;
              }}
            >
              <SectionLabel>Visual Catalog</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {visibleGallery.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxUrl(url)}
                    className="rounded-2xl overflow-hidden group h-48 sm:h-56 border border-gray-100 hover:border-[#D0B887]/40 hover:shadow-md transition-all duration-300"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* reviews */}
          <div
            ref={(el) => {
              sectionRefs.current.reviews = el;
            }}
          >
            <SectionLabel>Reviews & Ratings</SectionLabel>

            {/* rating summary */}
            <div className="mt-4 p-6 bg-white rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-6">
              {/* big score */}
              <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                <div
                  className={`w-20 h-20 rounded-2xl ${getRatingColor(avgRating)} flex flex-col items-center justify-center text-white`}
                >
                  <span className="text-3xl font-bold leading-none">
                    {avgRating ? avgRating.toFixed(1) : "—"}
                  </span>
                  <span className="text-[10px] mt-0.5 opacity-80">/ 5.0</span>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {ratings.length} ratings
                </span>
                {avgRating > 0 && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${getRatingColor(avgRating)}`}
                  >
                    {getRatingLabel(avgRating)}
                  </span>
                )}
              </div>

              {/* breakdown bars */}
              <div className="flex-1 space-y-2 justify-center flex flex-col">
                {ratingBreakdown.map(({ star, count }) => (
                  <RatingBar
                    key={star}
                    label={star}
                    count={count}
                    total={ratings.length}
                  />
                ))}
              </div>
            </div>

            {/* write review CTA */}
            {!showReviewForm ? (
              <div className="mt-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    Share your experience
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Help others discover this brand
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => {
                        setRatingForm((p) => ({ ...p, rating: v }));
                        setShowReviewForm(true);
                      }}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        size={24}
                        className="text-gray-200 hover:text-amber-400 hover:fill-amber-400 transition-colors"
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(true)}
                  className="shrink-0 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors"
                >
                  Write a Review
                </button>
              </div>
            ) : (
              <form
                onSubmit={submitRating}
                className="mt-4 p-6 bg-white rounded-2xl border border-gray-200 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">Your Review</p>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="p-1 text-gray-400 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* star selector */}
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onMouseEnter={() => setHoveredRating(v)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() =>
                          setRatingForm((p) => ({ ...p, rating: v }))
                        }
                        className="p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={28}
                          className={
                            (hoveredRating || ratingForm.rating) >= v
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200 fill-gray-100"
                          }
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs text-gray-500">
                      {currentRatingLabel}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">
                    Your name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ratingForm.name}
                    onChange={(e) =>
                      setRatingForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                    placeholder="e.g. Priya S."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">
                    Your review *
                  </label>
                  <textarea
                    required
                    rows={4}
                    maxLength={400}
                    value={ratingForm.review}
                    onChange={(e) =>
                      setRatingForm((p) => ({ ...p, review: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 outline-none text-sm bg-gray-50 focus:bg-white transition-colors resize-none"
                    placeholder="Share what you loved (or didn't)…"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-gray-400">
                      {ratingForm.review.length}/400
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={ratingSubmitting}
                    className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                  >
                    {ratingSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />{" "}
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send size={13} /> Submit
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* sort controls */}
            {ratings.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-medium mr-1">
                  Sort by:
                </span>
                {[
                  { value: "latest", label: "Latest" },
                  { value: "high", label: "Highest" },
                  { value: "low", label: "Lowest" },
                  { value: "relevant", label: "Most Detailed" },
                ].map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setReviewSort(s.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      reviewSort === s.value
                        ? "bg-gray-900 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* review list */}
            <div className="mt-4 space-y-0">
              {sortedRatings.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-gray-200 rounded-2xl bg-white">
                  <Heart size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="font-semibold text-gray-700 mb-1">
                    No reviews yet
                  </p>
                  <p className="text-sm text-gray-400">
                    Be the first to share your experience.
                  </p>
                </div>
              ) : (
                <>
                  {visibleReviews.map((row, index) => (
                    <article
                      key={row.id}
                      className={`py-5 ${index < visibleReviews.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 text-sm font-bold flex items-center justify-center shrink-0">
                            {(row.name || "A")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {row.name || "Anonymous"}
                            </p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map((v) => (
                                <Star
                                  key={v}
                                  size={12}
                                  className={
                                    Number(row.rating || 0) >= v
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-gray-200 fill-gray-100"
                                  }
                                />
                              ))}
                              <span className="ml-1.5 text-[10px] text-gray-400 font-medium">
                                {getRatingLabel(Number(row.rating || 0))}
                              </span>
                            </div>
                          </div>
                        </div>
                        {row.createdAt?.seconds && (
                          <span className="text-[11px] text-gray-400 shrink-0">
                            {new Date(
                              row.createdAt.seconds * 1000,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-3 leading-relaxed pl-13">
                        {row.review}
                      </p>
                      <div className="flex items-center gap-5 mt-3 pl-13">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors font-medium"
                        >
                          <ThumbsUp size={12} /> Helpful
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-700 transition-colors font-medium"
                        >
                          <Share2 size={12} /> Share
                        </button>
                      </div>
                    </article>
                  ))}

                  {sortedRatings.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setReviewsExpanded((p) => !p)}
                      className="w-full mt-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                      {reviewsExpanded
                        ? "Show less"
                        : `Show all ${sortedRatings.length} reviews`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* right sidebar */}
        <div className="xl:col-span-4 space-y-6">
          {/* contact info */}
          <div
            ref={(el) => {
              contentRefs.current[3] = el;
              sectionRefs.current.contact = el;
            }}
            className="p-7 rounded-2xl border border-gray-100 bg-white space-y-6"
          >
            <h3 className="font-bold text-gray-900 text-base">Store Details</h3>

            <InfoRow
              label="Established"
              value={store.establishedYear || "Not specified"}
            />
            <InfoRow label="Category" value={store.storeCategory} />
            {store.openingHours && (
              <InfoRow label="Hours" value={store.openingHours} />
            )}

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-1.5">
                Location
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">
                {store.storeAddress ||
                  `${store.storeCity}, ${store.storeState}`}
              </p>
              <button
                type="button"
                onClick={() => {
                  recordStoreEvent(
                    store.id,
                    STORE_ANALYTICS_EVENTS.STORE_MAP_CLICK,
                  );
                  const addr = encodeURIComponent(
                    store.storeAddress ||
                      `${store.storeCity}, ${store.storeState}`,
                  );
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${addr}`,
                    "_blank",
                  );
                }}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#D0B887] hover:text-[#b89755] transition-colors group"
              >
                View on Google Maps
                <ExternalLink
                  size={11}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              {[
                "Premium Verification",
                "Priority Support",
                "Exclusive Access",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-xs text-gray-600"
                >
                  <CheckCircle size={14} className="text-[#D0B887] shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* concierge CTA */}
          <div
            ref={(el) => {
              contentRefs.current[4] = el;
            }}
            className="p-7 rounded-2xl bg-gray-900 text-white space-y-4 relative overflow-hidden"
          >
            {/* decorative */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#D0B887]/10" />

            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <ShoppingBag size={20} className="text-[#D0B887]" />
              </div>
              <h4 className="font-bold text-lg leading-tight mb-2">
                Interested in this Brand?
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get priority access to upcoming collections and exclusive
                seasonal experiences.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConciergeModalOpen(true)}
              className="relative w-full py-3.5 bg-[#D0B887] text-[#0a0a0a] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#c4a876] transition-colors"
            >
              Request Concierge
            </button>
          </div>

          {/* quick contact links */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-white">
            <h4 className="font-semibold text-gray-900 text-sm mb-4">
              Quick Contact
            </h4>
            <div className="space-y-2">
              {store.storePhone && (
                <a
                  href={`tel:${store.storePhone}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Phone size={14} className="text-green-600" />
                  </div>
                  <span className="font-medium">{store.storePhone}</span>
                  <ExternalLink
                    size={12}
                    className="ml-auto text-gray-300 group-hover:text-gray-500"
                  />
                </a>
              )}
              {store.storeEmail && (
                <a
                  href={`mailto:${store.storeEmail}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Send size={14} className="text-blue-600" />
                  </div>
                  <span className="font-medium truncate">
                    {store.storeEmail}
                  </span>
                  <ExternalLink
                    size={12}
                    className="ml-auto text-gray-300 group-hover:text-gray-500 shrink-0"
                  />
                </a>
              )}
              {store.storeWebsite && (
                <a
                  href={store.storeWebsite}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    recordStoreEvent(
                      store.id,
                      STORE_ANALYTICS_EVENTS.STORE_WEBSITE_CLICK,
                    )
                  }
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Globe size={14} className="text-purple-600" />
                  </div>
                  <span className="font-medium truncate">
                    {store.storeWebsite.replace(/^https?:\/\//, "")}
                  </span>
                  <ExternalLink
                    size={12}
                    className="ml-auto text-gray-300 group-hover:text-gray-500 shrink-0"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Lightbox ─── */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setLightboxUrl(null)}
          >
            <X size={20} />
          </button>
          <img
            src={lightboxUrl}
            alt=""
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* ─── Concierge Modal ─── */}
      {conciergeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeConciergeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="concierge-modal-title"
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* drag handle (mobile) */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    id="concierge-modal-title"
                    className="text-xl font-bold text-gray-900"
                  >
                    Concierge Request
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {store.storeName} will respond shortly
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeConciergeModal}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {conciergeSubmitted ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    Request Sent!
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    {store.storeName} will get in touch with you soon.
                  </p>
                  <button
                    type="button"
                    onClick={closeConciergeModal}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConciergeSubmit} className="space-y-4">
                  <FormField id="concierge-name" label="Name" required>
                    <input
                      id="concierge-name"
                      type="text"
                      name="name"
                      required
                      value={conciergeForm.name}
                      onChange={handleConciergeChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                      placeholder="Your full name"
                    />
                  </FormField>

                  <FormField id="concierge-email" label="Email" required>
                    <input
                      id="concierge-email"
                      type="email"
                      name="email"
                      required
                      value={conciergeForm.email}
                      onChange={handleConciergeChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                      placeholder="you@example.com"
                    />
                  </FormField>

                  <FormField id="concierge-phone" label="Phone">
                    <input
                      id="concierge-phone"
                      type="tel"
                      name="phone"
                      value={conciergeForm.phone}
                      onChange={handleConciergeChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </FormField>

                  <FormField id="concierge-message" label="Message" required>
                    <textarea
                      id="concierge-message"
                      name="message"
                      required
                      rows={4}
                      value={conciergeForm.message}
                      onChange={handleConciergeChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none text-sm bg-gray-50 focus:bg-white transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </FormField>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeConciergeModal}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={conciergeSubmitting}
                      className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                      {conciergeSubmitting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />{" "}
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={14} /> Submit
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── small sub-components ─── */
const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D0B887]">
      {children}
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-[#D0B887]/30 to-transparent" />
  </div>
);

const InfoRow = ({ label, value }) => (
  <div>
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 block mb-0.5">
      {label}
    </span>
    <span className="text-sm text-gray-800 font-medium">{value}</span>
  </div>
);

const FormField = ({ id, label, required, children }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-semibold text-gray-600 mb-1.5"
    >
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

export default StoreProfile;
