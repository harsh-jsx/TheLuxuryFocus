import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { storeService } from "../services/storeService";
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
  Share2,
  ExternalLink,
  X,
  CheckCircle,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  const contentRefs = useRef([]);

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />

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
            <button
              type="button"
              onClick={() => {
                recordStoreEvent(
                  store.id,
                  STORE_ANALYTICS_EVENTS.STORE_CONNECT_CLICK,
                );
                window.location.href = `mailto:${store.storeEmail || ""}`;
              }}
              className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-3"
            >
              Connect Now <ArrowRight size={16} />
            </button>
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

      {/* Content Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 pb-24">
        <div className="lg:col-span-2 space-y-16">
          <div
            ref={(el) => {
              contentRefs.current[0] = el;
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
              }}
            >
              <span className="font-[ABC] text-xs uppercase tracking-[0.3em] text-[#D0B887] block mb-8">
                Visual Catalog
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {store.galleryUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl overflow-hidden border border-gray-100 group ${
                      idx % 3 === 0 ? "md:col-span-2 h-[420px]" : "h-[320px]"
                    }`}
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
        </div>

        <div className="space-y-8">
          <div
            ref={(el) => {
              contentRefs.current[3] = el;
            }}
            className="p-8 rounded-2xl border border-gray-100 space-y-8 bg-gray-50"
          >
            <div>
              <span className="font-[ABC] text-[10px] uppercase tracking-widest text-gray-500 block mb-3">
                Established In
              </span>
              <p className="text-xl font-[Albra] text-gray-900">
                Bespoke Tradition
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
