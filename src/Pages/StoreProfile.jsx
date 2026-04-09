import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { storeService } from "../services/storeService";
import { db } from "../firebase";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
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
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPlanLimits } from "../constants/subscriptionPlans";

gsap.registerPlugin(ScrollTrigger);

const StoreProfile = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [conciergeModalOpen, setConciergeModalOpen] = useState(false);
  const [conciergeSubmitting, setConciergeSubmitting] = useState(false);
  const [conciergeSubmitted, setConciergeSubmitted] = useState(false);
  const [conciergeForm, setConciergeForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [ratings, setRatings] = useState([]);
  const [ratingForm, setRatingForm] = useState({
    name: "",
    rating: 5,
    review: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSort, setReviewSort] = useState("latest");
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
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

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await storeService.getStoreById(id);
        setStore(data);
      } catch (error) {
        console.error("Error loading store profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchRatings = async () => {
      try {
        const q = query(collection(db, "storeRatings"), where("storeId", "==", id));
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setRatings(rows);
      } catch (error) {
        console.error("Error loading ratings", error);
      }
    };
    fetchRatings();
  }, [id]);

    // Record profile view when store is loaded (once per visit)
    useEffect(() => {
      if (!store?.id) return;
      recordStoreEvent(store.id, STORE_ANALYTICS_EVENTS.STORE_PROFILE_VIEW);
      logStoreEventToFirebase("store_profile_view", { store_id: store.id });
    }, [store?.id]);

  const handleConciergeChange = (e) => {
    setConciergeForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleConciergeSubmit = async (e) => {
    e.preventDefault();
    if (!store?.id || conciergeSubmitting) return;
    setConciergeSubmitting(true);
    try {
      await submitConciergeRequest(store.id, conciergeForm);
      recordStoreEvent(store.id, STORE_ANALYTICS_EVENTS.STORE_REQUEST_CONCIERGE_CLICK);
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

  useGSAP(() => {
    if (!store || !containerRef.current) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Hero image subtle parallax
    if (!reduceMotion && heroRef.current) {
      gsap.to(heroRef.current.querySelector("img"), {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }

    // Floating card entrance
    gsap.from(cardRef.current, {
      y: 60,
      opacity: 0,
      duration: reduceMotion ? 0.3 : 1,
      ease: "power3.out",
      delay: reduceMotion ? 0 : 0.3,
    });

    // Content stagger
    gsap.from(contentRefs.current.filter(Boolean), {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: contentRefs.current[0],
        start: "top 85%",
        once: true,
      },
    });
  }, [store]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-gray-900">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-[#D0B887] rounded-full animate-spin mb-6" />
        <p className="font-[ABC] text-xs uppercase tracking-widest text-gray-500">
          Curating Experience...
        </p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen mt-10 w-full flex flex-col items-center justify-center bg-white text-gray-900">
        <h2 className="text-3xl font-[Albra] mb-4">Store not found</h2>
        <Link
          to="/stores"
          className="font-[ABC]  text-sm uppercase tracking-widest text-[#D0B887] hover:underline decoration-2 underline-offset-4"
        >
          Back to Stores
        </Link>
      </div>
    );
  }

  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, row) => sum + Number(row.rating || 0), 0) / ratings.length
      : 0;
  const profilePlan = getPlanLimits(store.planId || 1);
  const visibleGallery = (store.galleryUrls || []).slice(0, profilePlan.maxImages);
  const whatsappNumber = store.whatsappNumber || store.storePhone;

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
      const snap = await getDocs(
        query(collection(db, "storeRatings"), where("storeId", "==", id)),
      );
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRatings(rows);
    } catch (error) {
      console.error("Error submitting rating", error);
    } finally {
      setRatingSubmitting(false);
    }
  };

  const tabItems = [
    { key: "overview", label: "Overview" },
    { key: "services", label: "Services" },
    { key: "photos", label: "Photos" },
    { key: "reviews", label: "Reviews" },
    { key: "contact", label: "Contact" },
  ];

  const scrollToSection = (key) => {
    const target =
      sectionRefs.current[key] ||
      sectionRefs.current.overview ||
      null;
    if (!target) return;
    setActiveTab(key);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ratingLabel =
    ratingForm.rating === 5
      ? "Excellent"
      : ratingForm.rating === 4
        ? "Very Good"
        : ratingForm.rating === 3
          ? "Good"
          : ratingForm.rating === 2
            ? "Fair"
            : "Poor";

  const sortedRatings = [...ratings].sort((a, b) => {
    if (reviewSort === "high") return Number(b.rating || 0) - Number(a.rating || 0);
    if (reviewSort === "relevant") return String(a.review || "").length - String(b.review || "").length;
    return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
  });

  const recentTrend = sortedRatings.slice(0, 8).map((item) => Number(item.rating || 0));

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white text-gray-900 overflow-x-hidden"
    >
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden"
      >
        <img
          src={
            store.bannerUrl ||
            "https://images.unsplash.com/photo-1497366216548-37526070a712?auto=format&fit=crop&q=80"
          }
          alt={store.storeName}
          className="absolute inset-0 w-full h-[120%] object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-white" />

        <div className="absolute top-8 mt-10 left-6 md:left-12 z-20">
          <Link
            to="/stores"
            className="group flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all font-[ABC] text-xs uppercase tracking-widest"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Stores
          </Link>
        </div>

        <div className="absolute top-8 right-6 md:right-12 z-20 flex gap-3">
          <button
            type="button"
            onClick={() => {
              recordStoreEvent(
                store.id,
                STORE_ANALYTICS_EVENTS.STORE_SHARE_CLICK,
              );
              if (navigator.share) {
                navigator
                  .share({ title: store.storeName, url: window.location.href })
                  .catch(() => {});
              } else {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
            className="p-3 mt-10 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-gray-900 transition-all"
          >
            <Share2 size={20} />
          </button>
        </div>
      </section>

      {/* Identity Card */}
      <div className="relative z-30 px-6 md:px-12 -mt-24 md:-mt-32 pb-12">
        <div
          ref={cardRef}
          className="bg-white border border-gray-100 p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center md:items-end gap-10"
        >
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 -mt-20 md:-mt-36">
            <img
              src={store.logoUrl || "https://via.placeholder.com/200"}
              alt={store.storeName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 flex-wrap">
              <span className="bg-[#D0B887] text-[#0a0a0a] text-[10px] px-4 py-1 rounded-full font-[ABC] uppercase tracking-widest">
                {store.storeCategory}
              </span>
              {store.priceRange && (
                <span className="text-gray-600 font-[ABC] text-sm tracking-widest">
                  {store.priceRange}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-[Albra] text-gray-900 mb-4 tracking-tight">
              {store.storeName}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                <Star size={14} className="text-amber-500 fill-amber-400" />
                <span className="font-[ABC] text-xs text-gray-700">
                  {avgRating ? avgRating.toFixed(1) : "New"}
                </span>
                <span className="font-[ABC] text-xs text-gray-400">
                  ({ratings.length} ratings)
                </span>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100 font-[ABC] text-xs">
                {store.availabilityStatus || "Available Now"}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-600 font-[ABC] text-sm">
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-[#D0B887]" />{" "}
                {store.storeCity}
                {store.storeState && `, ${store.storeState}`}
              </span>
              {store.openingHours && (
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-[#D0B887]" />{" "}
                  {store.openingHours}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {store.storePhone && (
                <a
                  href={`tel:${store.storePhone}`}
                  className="bg-green-600 text-white px-4 py-3 rounded-xl font-[ABC] text-xs uppercase tracking-widest hover:bg-green-500 transition-colors flex items-center gap-2"
                >
                  <Phone size={14} /> Call
                </a>
              )}
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${String(whatsappNumber).replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-[ABC] text-xs uppercase tracking-widest hover:bg-emerald-500 transition-colors flex items-center gap-2"
                >
                  <MessageCircle size={14} /> WhatsApp
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
                className="bg-gray-900 text-white px-4 py-3 rounded-xl font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Enquire <ArrowRight size={14} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-6">
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
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <Instagram size={20} />
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
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <Globe size={20} />
                </a>
              )}
              {store.storePhone && (
                <a
                  href={`tel:${store.storePhone}`}
                  onClick={() =>
                    recordStoreEvent(
                      store.id,
                      STORE_ANALYTICS_EVENTS.STORE_PHONE_CLICK,
                    )
                  }
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <Phone size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {(visibleGallery.length > 0 || store.bannerUrl) && (
        <section className="px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[store.bannerUrl, ...visibleGallery].filter(Boolean).slice(0, 4).map((url, idx) => (
              <div key={idx} className="h-28 md:h-36 rounded-xl overflow-hidden border border-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto pb-8">
        <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => scrollToSection(tab.key)}
              className={`px-3 py-2 rounded-lg text-xs font-[ABC] uppercase tracking-wider transition-colors ${
                activeTab === tab.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-10 pb-24">
        <div className="xl:col-span-8 space-y-16">
          <div
            ref={(el) => {
              contentRefs.current[0] = el;
              sectionRefs.current.overview = el;
            }}
          >
            <span className="font-[ABC] text-xs uppercase tracking-[0.3em] text-[#D0B887] block mb-6">
              The Perspective
            </span>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light italic">
              {store.storeDescription ||
                "This establishment defines the pinnacle of luxury, offering a curated experience that transcends the ordinary. Every detail is meticulously crafted to ensure the highest standards of excellence."}
            </p>
          </div>

          {store.storeServices && store.storeServices.length > 0 && (
            <div
              ref={(el) => {
                contentRefs.current[1] = el;
                sectionRefs.current.services = el;
              }}
            >
              <span className="font-[ABC] text-xs uppercase tracking-[0.3em] text-[#D0B887] block mb-8">
                Services & Amenities
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.storeServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#D0B887]/10 flex items-center justify-center text-[#D0B887] group-hover:bg-[#D0B887]/20 transition-colors">
                      <Tag size={18} />
                    </div>
                    <span className="font-[ABC] text-sm tracking-wide">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {store.galleryUrls && store.galleryUrls.length > 0 && (
            <div
              ref={(el) => {
                contentRefs.current[2] = el;
                sectionRefs.current.photos = el;
              }}
            >
              <span className="font-[ABC] text-xs uppercase tracking-[0.3em] text-[#D0B887] block mb-8">
                Visual Catalog
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {visibleGallery.map((url, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-gray-100 group h-[260px] sm:h-[300px]"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            ref={(el) => {
              sectionRefs.current.reviews = el;
            }}
            className="p-6 md:p-8 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 space-y-6"
          >
            <h4 className="text-2xl font-[Albra]">Reviews & Ratings</h4>

            <div className="flex flex-wrap items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center text-4xl font-[Albra]">
                {avgRating ? avgRating.toFixed(1) : "—"}
              </div>
              <div>
                <p className="font-[Albra] text-3xl text-gray-900">
                  {ratings.length || 0} Ratings
                </p>
                <p className="text-sm text-gray-500 font-[ABC]">
                  Rating index based on submitted reviews.
                </p>
              </div>
            </div>

            <div>
              <p className="font-[Albra] text-3xl mb-3">Start your Review</p>
              <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => {
                      setRatingForm((prev) => ({ ...prev, rating: value }));
                      setShowReviewForm(true);
                    }}
                    className="w-11 h-11 rounded-lg border border-gray-300 bg-white hover:border-orange-400 flex items-center justify-center"
                    aria-label={`Rate ${value} stars`}
                  >
                    <Star
                      size={18}
                      className={
                        (hoveredRating || ratingForm.rating) >= value
                          ? "text-orange-500 fill-orange-400"
                          : "text-gray-400"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {showReviewForm && (
              <form onSubmit={submitRating} className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                <input
                  type="text"
                  required
                  value={ratingForm.name}
                  onChange={(e) => setRatingForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none font-[ABC] text-sm"
                  placeholder="Your name"
                />
                <p className="text-xs font-[ABC] text-gray-500">
                  Selected: {ratingForm.rating}/5 · {ratingLabel}
                </p>
                <textarea
                  required
                  rows={4}
                  maxLength={400}
                  value={ratingForm.review}
                  onChange={(e) => setRatingForm((prev) => ({ ...prev, review: e.target.value }))}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none font-[ABC] text-sm resize-none"
                  placeholder="Share your experience..."
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-[ABC]">
                    {ratingForm.review.length}/400
                  </span>
                  <button
                    type="submit"
                    disabled={ratingSubmitting}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  >
                    {ratingSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            )}

            {recentTrend.length > 0 && (
              <div>
                <p className="font-[Albra] text-3xl mb-3">Recent rating trend</p>
                <div className="flex flex-wrap gap-2">
                  {recentTrend.map((r, i) => (
                    <span
                      key={`${r}-${i}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 text-sm text-gray-700 bg-white"
                    >
                      {r.toFixed(1)} <Star size={12} className="text-orange-500 fill-orange-400" />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="font-[Albra] text-3xl mb-3">User Reviews</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setReviewSort("relevant")}
                  className={`px-4 py-2 rounded-md text-sm font-[ABC] ${reviewSort === "relevant" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-white text-gray-600 border border-gray-200"}`}
                >
                  Relevant
                </button>
                <button
                  type="button"
                  onClick={() => setReviewSort("latest")}
                  className={`px-4 py-2 rounded-md text-sm font-[ABC] ${reviewSort === "latest" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-white text-gray-600 border border-gray-200"}`}
                >
                  Latest
                </button>
                <button
                  type="button"
                  onClick={() => setReviewSort("high")}
                  className={`px-4 py-2 rounded-md text-sm font-[ABC] ${reviewSort === "high" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-white text-gray-600 border border-gray-200"}`}
                >
                  High to Low
                </button>
              </div>
            </div>

            {sortedRatings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="font-[Albra] text-2xl text-gray-900 mb-2">No reviews yet</p>
                <p className="text-sm text-gray-500 font-[ABC]">
                  Be the first one to rate this brand and share your experience.
                </p>
              </div>
            )}

            {sortedRatings.slice(0, 8).map((row, index) => (
              <article
                key={row.id}
                className={`${index === 0 ? "" : "border-t border-gray-200 pt-5"} pb-2`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-md bg-gray-200 text-gray-700 font-[ABC] text-sm flex items-center justify-center shrink-0 overflow-hidden">
                      {(row.name || "A").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-[Albra] text-2xl text-gray-900">{row.name || "Anonymous"}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <Star
                            key={value}
                            size={14}
                            className={
                              Number(row.rating || 0) >= value
                                ? "text-orange-500 fill-orange-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 font-[ABC] whitespace-nowrap">
                    {row.createdAt?.seconds
                      ? new Date(row.createdAt.seconds * 1000).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>
                <p className="text-base text-gray-700 mt-3 leading-relaxed">{row.review}</p>
                <div className="flex flex-wrap items-center gap-7 mt-4 text-sm text-gray-700 font-[ABC]">
                  <button type="button" className="inline-flex items-center gap-2 hover:text-gray-900">
                    <ThumbsUp size={14} />
                    Helpful
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 hover:text-gray-900">
                    <MessageCircle size={14} />
                    Comment
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 hover:text-gray-900">
                    <Share2 size={14} />
                    Share
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <div
            ref={(el) => {
              contentRefs.current[3] = el;
              sectionRefs.current.contact = el;
            }}
            className="p-8 rounded-2xl border border-gray-100 space-y-8 bg-gray-50"
          >
            <div>
              <span className="font-[ABC] text-[10px] uppercase tracking-widest text-gray-500 block mb-3">
                Established In
              </span>
              <p className="text-xl font-[Albra] text-gray-900">
                {store.establishedYear || "Not specified"}
              </p>
            </div>

            <div>
              <span className="font-[ABC] text-[10px] uppercase tracking-widest text-gray-500 block mb-3">
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
                className="flex items-center gap-2 font-[ABC] text-xs text-[#D0B887] mt-4 hover:gap-3 transition-all"
              >
                View on Map <ExternalLink size={12} />
              </button>
            </div>

            <div>
              <span className="font-[ABC] text-[10px] uppercase tracking-widest text-gray-500 block mb-3">
                Safety & Privacy
              </span>
              <ul className="space-y-3">
                {[
                  "Premium Verification",
                  "Priority Support",
                  "Exclusive Access",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 font-[ABC] text-xs text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D0B887]" />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            ref={(el) => {
              contentRefs.current[4] = el;
            }}
            className="p-8 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 space-y-6"
          >
            <ShoppingBag size={28} className="text-gray-700" />
            <h4 className="text-xl font-[Albra]">Interested in this Brand?</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get priority access to their upcoming collections and seasonal
              experiences.
            </p>
            <button
              type="button"
              onClick={() => setConciergeModalOpen(true)}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Request Concierge
            </button>
          </div>

        </div>
      </section>

      {/* Concierge request modal */}
      {conciergeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeConciergeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="concierge-modal-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 id="concierge-modal-title" className="text-xl font-[Albra] text-gray-900">
                  Request Concierge
                </h3>
                <button
                  type="button"
                  onClick={closeConciergeModal}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {conciergeSubmitted ? (
                <div className="py-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} />
                  </div>
                  <p className="text-lg font-[Albra] text-gray-900 mb-2">Request sent</p>
                  <p className="text-gray-600 text-sm font-[ABC] mb-6">
                    {store?.storeName} will get in touch with you soon.
                  </p>
                  <button
                    type="button"
                    onClick={closeConciergeModal}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConciergeSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="concierge-name" className="block text-sm font-[ABC] font-medium text-gray-700 mb-1.5">
                      Name *
                    </label>
                    <input
                      id="concierge-name"
                      type="text"
                      name="name"
                      required
                      value={conciergeForm.name}
                      onChange={handleConciergeChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none font-[ABC] text-gray-900"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="concierge-email" className="block text-sm font-[ABC] font-medium text-gray-700 mb-1.5">
                      Email *
                    </label>
                    <input
                      id="concierge-email"
                      type="email"
                      name="email"
                      required
                      value={conciergeForm.email}
                      onChange={handleConciergeChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none font-[ABC] text-gray-900"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="concierge-phone" className="block text-sm font-[ABC] font-medium text-gray-700 mb-1.5">
                      Phone
                    </label>
                    <input
                      id="concierge-phone"
                      type="tel"
                      name="phone"
                      value={conciergeForm.phone}
                      onChange={handleConciergeChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none font-[ABC] text-gray-900"
                      placeholder="+91 ..."
                    />
                  </div>
                  <div>
                    <label htmlFor="concierge-message" className="block text-sm font-[ABC] font-medium text-gray-700 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="concierge-message"
                      name="message"
                      required
                      rows={4}
                      value={conciergeForm.message}
                      onChange={handleConciergeChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none font-[ABC] text-gray-900 resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeConciergeModal}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={conciergeSubmitting}
                      className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                    >
                      {conciergeSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Submit"
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

export default StoreProfile;
