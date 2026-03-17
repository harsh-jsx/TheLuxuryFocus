import React, { useRef, useState, useEffect } from "react";
import {
  ArrowDown,
  Search,
  Moon,
  BedDouble,
  Landmark,
  Trees,
  Compass,
  HandMetal,
  CornerRightDown,
  MoreHorizontal,
  MapPin,
  Tag,
  Phone,
  Mail,
} from "lucide-react";
import SplitText from "./SplitText";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { storeService } from "../services/storeService";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = {
  amber: "#C9A227",
  amberLight: "#E8D5A3",
  amberBg: "rgba(201, 162, 39, 0.12)",
};

const Hero = () => {
  const containerRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stores, setStores] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setIsSearching(false);
      }
    };
    if (isSearching) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearching]);

  useEffect(() => {
    const fetchAllStores = async () => {
      try {
        const data = await storeService.getAllStores();
        setStores(data);
      } catch (error) {
        console.error("Error loading stores for search", error);
      }
    };
    fetchAllStores();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const results = stores.filter(
        (store) =>
          store.storeName?.toLowerCase().includes(q) ||
          store.storeCategory?.toLowerCase().includes(q) ||
          store.storeCity?.toLowerCase().includes(q) ||
          store.storeState?.toLowerCase().includes(q) ||
          store.storeAddress?.toLowerCase().includes(q) ||
          store.storeEmail?.toLowerCase().includes(q) ||
          store.storeDescription?.toLowerCase().includes(q),
      );
      setFilteredResults(results);
      setIsSearching(true);
    } else {
      setFilteredResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, stores]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial setup
      gsap.set(".hero-element", { y: 40, opacity: 0 });
      gsap.set(".search-container", { y: 30, opacity: 0 });
      gsap.set(".category-icon", { y: 20, opacity: 0 });

      // Sequence
      tl.to(".hero-video-bg", {
        opacity: 0.78,
        scale: 1,
        duration: 2,
        ease: "power2.inOut",
      })
        .to(
          ".hero-element",
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 1,
          },
          "-=1.2",
        )
        .to(
          ".search-container",
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
          },
          "-=0.5",
        )
        .to(
          ".category-icon",
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 1,
          },
          "-=1",
        )
        .to(
          ".scroll-indicator",
          {
            opacity: 0.6,
            y: 0,
            duration: 1,
          },
          "-=0.5",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative pt-28 md:pt-24 min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {/* Overlays (vignette + subtle accent) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
        <div
          className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full blur-[110px] opacity-25 z-10"
          style={{
            background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute top-1/2 -left-40 w-[520px] h-[520px] rounded-full blur-[120px] opacity-20 z-10"
          style={{
            background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 70%)`,
          }}
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video-bg w-full h-full object-cover opacity-0 scale-110"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full">
        <div
          className="hero-element inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          style={{ boxShadow: "0 0 0 1px rgba(201,162,39,0.12) inset" }}
        >
          <SparklesBadge />
          <span className="font-[ABC] text-[11px] uppercase tracking-[0.2em] text-white/75">
            Curated luxury brands & services
          </span>
        </div>

        <h1 className="hero-element font-[Albra] text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
          <SplitText delay={0.2}>
            Your gateway to{" "}
            <span style={{ color: ACCENT.amber }} className="italic">
              premium
            </span>{" "}
            experiences
          </SplitText>
        </h1>

        <p className="capitalize hero-element max-w-2xl font-[ABC] text-sm md:text-lg leading-relaxed text-white/70 tracking-wide mb-10">
          Discover verified luxury brands, boutiques, and services — crafted for
          people who don’t compromise on quality.
        </p>

        {/* Search Bar */}
        <div
          ref={searchWrapperRef}
          className="search-container relative w-full max-w-2xl mx-auto mb-10 group"
        >
          {/* Glow (CSS-driven) */}
          <div
            className="absolute -inset-1 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 60%)`,
            }}
          />

          <div className="relative w-full bg-white/95 backdrop-blur-xl rounded-full p-2 flex items-center shadow-2xl shadow-black/30 border border-white/30">
            <div className="flex-1 flex items-center px-4 md:px-6 border-r border-gray-200/80">
              <Compass className="text-gray-400 mr-3 w-5 h-5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setIsSearching(true)}
                className="search-input w-full bg-transparent text-black text-lg placeholder:text-gray-500 focus:outline-none font-[ABC]"
                placeholder="Search brands, categories, city…"
              />
            </div>

            <div className="hidden md:flex items-center px-6">
              <span className="text-gray-600 font-[ABC] font-medium text-sm whitespace-nowrap">
                All locations
              </span>
            </div>

            <button
              type="button"
              className="text-white p-3 md:p-4 rounded-full transition-all duration-300 shrink-0 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(90deg, ${ACCENT.amber}, #111)`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-50 top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 z-50 max-h-[400px] overflow-y-auto"
              >
                {filteredResults.length > 0 ? (
                  <div className="p-4 grid grid-cols-1 gap-2">
                    {filteredResults.map((store) => (
                      <Link
                        key={store.id}
                        to={`/store/${store.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-black/5 rounded-2xl transition-all group/item text-left"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                          <img
                            src={
                              store.logoUrl || "https://via.placeholder.com/48"
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="grow">
                          <h4 className="text-black font-bold text-lg leading-none mb-1">
                            {store.storeName}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {store.storeCity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag size={12} /> {store.storeCategory}
                            </span>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <ArrowDown
                            className="-rotate-90 text-black"
                            size={20}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-black font-bold text-xl">
                      No results found
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      We couldn't find anything matching your search.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick actions */}
        <div className="hero-element flex flex-wrap items-center justify-center gap-4 mb-12 -z-1">
          <Link
            to="/stores"
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-colors font-[ABC] text-[11px] uppercase tracking-[0.2em]"
          >
            Browse stores
          </Link>
          <Link
            to="/packages"
            className="px-6 py-3 rounded-full transition-colors font-[ABC] text-[11px] uppercase tracking-[0.2em]"
            style={{
              backgroundColor: ACCENT.amberBg,
              border: `1px solid ${ACCENT.amber}40`,
              color: ACCENT.amberLight,
            }}
          >
            Advertising packages
          </Link>
        </div>

        {/* Hand / Highlight link */}
        {/* <div className="hero-element flex items-center gap-3 text-white/80 mb-16 cursor-pointer hover:text-white transition-colors">
                    <HandMetal className="w-5 h-5 -rotate-45" />
                    <div className="text-left">
                        <div className="text-xs uppercase tracking-wider text-white/50">Need a Hand?</div>
                        <div className="text-sm font-medium">Click & Browse Highlights...</div>
                    </div>
                    <CornerRightDown className="w-4 h-4 ml-2 text-white/50" />
                </div> */}

        {/* Categories */}
        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap  -z-1">
          <CategoryIcon icon={Moon} label="Nightlife" />
          <CategoryIcon icon={BedDouble} label="Stay" />
          <CategoryIcon icon={Landmark} label="Heritage" />
          <CategoryIcon icon={Trees} label="Wellness" />
          {/* <div className="category-icon w-12 h-12 rounded-full bg-white text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <MoreHorizontal className="w-5 h-5" />
                    </div> */}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator flex flex-col items-center gap-2 opacity-0 z-20">
        <span className="font-[ABC] text-[10px] uppercase tracking-widest">
          Scroll
        </span>
        <ArrowDown size={16} />
      </div>
    </section>
  );
};

const SparklesBadge = () => (
  <span
    className="inline-flex items-center justify-center w-7 h-7 rounded-full"
    style={{ backgroundColor: ACCENT.amberBg, color: ACCENT.amberLight }}
    aria-hidden="true"
  >
    <Moon className="w-4 h-4" />
  </span>
);

const CategoryIcon = ({ icon: Icon, label }) => (
  <div className="category-icon flex flex-col items-center gap-2 group cursor-pointer">
    <div className="w-14 h-14 rounded-full border border-white/15 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-300">
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-xs font-[ABC] tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
      {label}
    </span>
  </div>
);

export default Hero;
