import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  recordStoreEvent,
  STORE_ANALYTICS_EVENTS,
} from "../services/storeAnalyticsService";
import { Search, MapPin, Tag, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────── helpers ─────────────── */

const normalizeCategory = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const CATEGORY_ALIAS_TOKENS = {
  "hotels resorts": ["hotel", "resort", "stay"],
  "restaurants fine dining": ["restaurant", "dining", "food", "cafe"],
  "travel tourism": ["tourism", "travel", "trip"],
  "fashion apparel": ["fashion", "apparel", "shop"],
  "jewelry watches": ["jewelry", "jewellery", "watch", "shop"],
  automobiles: ["auto", "car", "vehicle"],
  "beauty wellness": ["beauty", "wellness", "spa", "salon"],
  "art collectibles": ["art", "collectible", "museum"],
  "event management": ["event", "wedding", "party"],
  "private clubs lifestyle": ["club", "lifestyle"],
  "technology gadgets": ["technology", "gadget", "tech"],
  "pet care services": ["pet", "animal"],
  "gifting luxury services": ["gift", "gifting", "concierge"],
};

const categoryMatches = (selectedCategory, storeCategory) => {
  if (!selectedCategory) return true;
  if (!storeCategory) return false;
  const sn = normalizeCategory(selectedCategory);
  const cn = normalizeCategory(storeCategory);
  if (sn === cn || cn.includes(sn) || sn.includes(cn)) return true;
  if (sn.split(" ").some((t) => cn.split(" ").includes(t))) return true;
  const aliasKey = Object.keys(CATEGORY_ALIAS_TOKENS).find(
    (k) => sn.includes(k) || k.includes(sn),
  );
  if (!aliasKey) return false;
  return CATEGORY_ALIAS_TOKENS[aliasKey].some((t) => cn.includes(t));
};

/* ─────────────── styles ─────────────── */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .str-root {
    --gold: #B8924A;
    --gold-light: #D0B887;
    --gold-faint: rgba(184,146,74,0.07);
    --gold-border: rgba(184,146,74,0.22);
    --bg: #FAFAF8;
    --bg2: #F4F3EF;
    --surface: #FFFFFF;
    --border: rgba(0,0,0,0.07);
    --border2: rgba(0,0,0,0.11);
    --text: #1A1916;
    --text2: #6B6860;
    --muted: rgba(106,104,100,0.8);
    --muted2: rgba(126,14,126,0.8);
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .str-display { font-family: 'Cormorant Garamond', serif; }

  @keyframes str-ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .str-ticker-track {
    animation: str-ticker 24s linear infinite;
    display: inline-flex;
    white-space: nowrap;
  }

  @keyframes str-ping {
    75%,100% { transform: scale(2.2); opacity: 0; }
  }
  .str-ping { animation: str-ping 1.5s cubic-bezier(0,0,0.2,1) infinite; }

  @keyframes str-spin { to { transform: rotate(360deg); } }
  .str-spin { animation: str-spin 0.85s linear infinite; }

  .str-card-img { transition: transform 0.85s cubic-bezier(0.25,0.1,0.25,1); }
  .str-card:hover .str-card-img { transform: scale(1.05); }

  .str-arrow-circle {
    width: 34px; height: 34px; border-radius: 50%;
    border: 0.5px solid var(--border2);
    background: var(--bg2);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.3s, border-color 0.3s;
    flex-shrink: 0;
  }
  .str-card:hover .str-arrow-circle {
    background: var(--gold);
    border-color: var(--gold);
  }
  .str-card:hover .str-arrow-circle svg { color: #fff !important; }

  .str-input {
    width: 100%;
    background: var(--bg2);
    border: 0.5px solid var(--border2);
    border-radius: 12px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    padding: 12px 16px 12px 44px;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    -webkit-appearance: none;
  }
  .str-input::placeholder { color: var(--muted2); }
  .str-input:focus {
    border-color: rgba(184,146,74,0.4);
    box-shadow: 0 0 0 3px rgba(184,146,74,0.07);
    background: var(--surface);
  }

  /* Filters: single column on narrow viewports */
  .str-filters-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .str-filters-grid > div {
    min-width: 0;
  }
  @media (min-width: 768px) {
    .str-filters-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
  }

  /* Store cards: one per row on mobile */
  .str-stores-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .str-stores-grid > * {
    min-width: 0;
  }
  @media (min-width: 768px) {
    .str-stores-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
`;

/* ─────────────── store card ─────────────── */

const StoreCard = React.forwardRef(({ store }, ref) => (
  <Link
    ref={ref}
    to={`/store/${store.id}`}
    className="str-card"
    style={{ display: "block", textDecoration: "none", opacity: 0 }}
    onClick={() =>
      recordStoreEvent(store.id, STORE_ANALYTICS_EVENTS.STORE_LISTING_CLICK)
    }
  >
    <article
      style={{
        background: "var(--surface)",
        borderRadius: "20px",
        overflow: "hidden",
        border: "0.5px solid var(--border)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(184,146,74,0.25)";
        e.currentTarget.style.boxShadow =
          "0 8px 28px rgba(0,0,0,0.08), 0 0 0 1px rgba(184,146,74,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
      }}
    >
      {/* Image */}
      <div
        style={{
          position: "relative",
          height: "210px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {store.bannerUrl ? (
          <img
            src={store.bannerUrl}
            alt={store.storeName}
            className="str-card-img"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "var(--bg2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="str-display"
              style={{
                fontSize: "64px",
                fontWeight: 300,
                color: "rgba(26,25,22,0.1)",
              }}
            >
              {store.storeName?.[0] || "?"}
            </span>
          </div>
        )}
        {/* Soft bottom fade to white */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(255,255,255,0.55) 0%, transparent 55%)",
          }}
        />
        {/* Category pill */}
        {store.storeCategory && (
          <span
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              padding: "4px 11px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(6px)",
              border: "0.5px solid rgba(0,0,0,0.07)",
              fontSize: "9px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text2)",
            }}
          >
            {store.storeCategory}
          </span>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "0 22px 22px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo + city */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: "-22px",
            marginBottom: "14px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "13px",
              background: "var(--surface)",
              border: "0.5px solid var(--border2)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                className="str-display"
                style={{
                  fontSize: "20px",
                  fontWeight: 300,
                  color: "var(--muted2)",
                }}
              >
                {store.storeName?.[0] || "?"}
              </span>
            )}
          </div>
          {store.storeCity && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "var(--muted)",
                fontSize: "11px",
              }}
            >
              <MapPin size={10} />
              {store.storeCity}
            </div>
          )}
        </div>

        <h3
          className="str-display"
          style={{
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            color: "var(--text)",
            margin: "0 0 7px",
          }}
        >
          {store.storeName}
        </h3>

        <p
          style={{
            fontSize: "15px",
            color: "var(--muted)",
            lineHeight: 1.75,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            margin: "0 0 auto",
          }}
        >
          {store.storeDescription || "Premium establishment."}
        </p>

        <div
          style={{
            marginTop: "18px",
            paddingTop: "14px",
            borderTop: "0.5px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--muted2)",
            }}
          >
            View Store
          </span>
          <div className="str-arrow-circle">
            <ArrowUpRight size={14} color="var(--text2)" />
          </div>
        </div>
      </div>
    </article>
  </Link>
));
StoreCard.displayName = "StoreCard";

/* ─────────────── main ─────────────── */

const TICKER_ITEMS = [
  "Luxury Curated",
  "Premium Brands",
  "Exclusive Access",
  "Verified Stores",
  "500+ Listings",
  "India & Global",
];

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const snap = await getDocs(collection(db, "stores"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setStores(data);
        setCities(
          [...new Set(data.map((s) => s.storeCity).filter(Boolean))].sort(),
        );
        setCategories(
          [...new Set(data.map((s) => s.storeCategory).filter(Boolean))].sort(),
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // Apply query string → filters (only when the URL itself changes, not when city lists load)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cp = params.get("city")?.trim();
    const cat = params.get("category")?.trim();
    if (cp) setSelectedCity(cp);
    else setSelectedCity("");
    if (cat) setSelectedCategory(cat);
    else setSelectedCategory("");
  }, [location.search]);

  // Once stores are loaded, match URL city/category to the canonical casing used in data
  useEffect(() => {
    if (!selectedCity || cities.length === 0) return;
    const match = cities.find(
      (c) => c.toLowerCase() === selectedCity.toLowerCase(),
    );
    if (match && match !== selectedCity) setSelectedCity(match);
  }, [cities, selectedCity]);

  useEffect(() => {
    if (!selectedCategory || categories.length === 0) return;
    const match = categories.find(
      (c) => c.toLowerCase() === selectedCategory.toLowerCase(),
    );
    if (match && match !== selectedCategory) setSelectedCategory(match);
  }, [categories, selectedCategory]);

  const filteredStores = stores.filter((s) => {
    if (s.disabled) return false;
    const ms = s.storeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const mc =
      !selectedCity ||
      s.storeCity?.toLowerCase() === selectedCity.toLowerCase();
    const mk = categoryMatches(selectedCategory, s.storeCategory);
    return ms && mc && mk;
  });

  const cityOptions =
    selectedCity &&
    !cities.some((c) => c.toLowerCase() === selectedCity.toLowerCase())
      ? [...cities, selectedCity].sort((a, b) =>
          a.localeCompare(b, undefined, { sensitivity: "base" }),
        )
      : cities;

  const categoryOptions =
    selectedCategory &&
    !categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())
      ? [selectedCategory, ...categories]
      : categories;

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const ctx = gsap.context(() => {
        if (headerRef.current) {
          gsap.from(headerRef.current.querySelectorAll(".anim-hero"), {
            y: 36,
            opacity: 0,
            duration: 0.9,
            stagger: 0.11,
            ease: "power3.out",
          });
        }
        if (filtersRef.current) {
          gsap.from(filtersRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.7,
            delay: 0.3,
            ease: "power3.out",
          });
        }
        const cards = cardsRef.current.filter(Boolean);
        if (cards.length) {
          gsap.set(cards, { y: 40, opacity: 0 });
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: cards[0], start: "top 88%", once: true },
          });
        }
      }, containerRef);
      return () => ctx.revert();
    },
    { scope: containerRef, dependencies: [loading] },
  );

  const resultCount = filteredStores.length;

  return (
    <>
      <style>{STYLES}</style>
      <div ref={containerRef} className="str-root">
        {/* Subtle warm blobs */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-8%",
              right: "-4%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(208,184,135,0.14) 0%, transparent 70%)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              left: "-6%",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(208,184,135,0.09) 0%, transparent 70%)",
              filter: "blur(100px)",
            }}
          />
        </div>

        {/* ── Hero ── */}
        <header
          ref={headerRef}
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "clamp(80px, 10vw, 130px) 48px clamp(48px, 6vw, 72px)",
          }}
        >
          {/* Badge */}
          <div
            className="anim-hero"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "28px",
              padding: "7px 16px",
              borderRadius: "100px",
              border: "0.5px solid var(--border2)",
              background: "var(--surface)",
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ position: "relative", width: "7px", height: "7px" }}>
              <span
                className="str-ping"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "var(--gold)",
                  opacity: 0.45,
                }}
              />
              <span
                style={{
                  position: "relative",
                  display: "block",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "var(--gold)",
                }}
              />
            </span>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--text2)",
                fontWeight: 500,
              }}
            >
              Discover — Luxury Stores
            </span>
          </div>

          {/* Headline */}
          <h1
            className="anim-hero str-display"
            style={{
              fontSize: "clamp(52px, 9vw, 108px)",
              fontWeight: 300,
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              margin: "0 0 24px",
              color: "var(--text)",
            }}
          >
            Curated
            <span style={{ fontStyle: "italic", color: "var(--gold)" }}>
              {" "}
              Boutiques
            </span>
            <br />
            <span style={{ color: "var(--muted)" }}>&amp; Brands.</span>
          </h1>

          {/* Sub + live count */}
          <div
            className="anim-hero"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <p
              style={{
                fontSize: "15px",
                color: "black",
                lineHeight: 1.8,
                maxWidth: "380px",
                margin: 0,
              }}
            >
              Handpicked premium brands and boutiques chosen for quality,
              heritage, and distinction.
            </p>
            {!loading && (
              <div
                style={{ display: "flex", alignItems: "baseline", gap: "5px" }}
              >
                <span
                  className="str-display"
                  style={{
                    fontSize: "42px",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {resultCount}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--muted2)",
                  }}
                >
                  {resultCount === 1 ? "Store" : "Stores"}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* ── Ticker ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderTop: "0.5px solid var(--border)",
            borderBottom: "0.5px solid var(--border)",
            padding: "13px 0",
            overflow: "hidden",
            background: "var(--bg2)",
          }}
        >
          <div className="str-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "20px",
                  marginRight: "48px",
                  fontSize: "12px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                }}
              >
                <span
                  style={{
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "var(--gold)",
                    opacity: 0.55,
                    flexShrink: 0,
                  }}
                />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Main ── */}
        <main
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(16px, 5vw, 48px) clamp(64px, 8vw, 100px)",
          }}
        >
          {/* Filters */}
          <div
            ref={filtersRef}
            style={{
              marginTop: "clamp(36px, 5vw, 56px)",
              marginBottom: "clamp(28px, 4vw, 44px)",
              background: "var(--surface)",
              border: "0.5px solid var(--border)",
              borderRadius: "20px",
              padding: "clamp(18px, 4vw, 24px) clamp(16px, 4vw, 28px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                  fontWeight: 500,
                }}
              >
                Filter
              </span>
              <div
                style={{
                  flex: 1,
                  height: "0.5px",
                  background: "var(--border)",
                }}
              />
              {(searchTerm || selectedCity || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCity("");
                    setSelectedCategory("");
                  }}
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="str-filters-grid">
              {/* Search */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--muted2)",
                    marginBottom: "7px",
                  }}
                >
                  Search
                </label>
                <div style={{ position: "relative" }}>
                  <Search
                    size={13}
                    color="var(--muted2)"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    className="str-input"
                    placeholder="Store name…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--muted2)",
                    marginBottom: "7px",
                  }}
                >
                  City
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin
                    size={13}
                    color="var(--muted2)"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  <select
                    className="str-input"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="">All Cities</option>
                    {cityOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: "13px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted2)",
                      fontSize: "9px",
                      pointerEvents: "none",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--muted2)",
                    marginBottom: "7px",
                  }}
                >
                  Category
                </label>
                <div style={{ position: "relative" }}>
                  <Tag
                    size={13}
                    color="var(--muted2)"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  <select
                    className="str-input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span
                    style={{
                      position: "absolute",
                      right: "13px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--muted2)",
                      fontSize: "9px",
                      pointerEvents: "none",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active chips */}
          {(selectedCity || selectedCategory) && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "24px",
                flexWrap: "wrap",
              }}
            >
              {selectedCity && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px",
                    borderRadius: "100px",
                    border: "0.5px solid var(--gold-border)",
                    background: "var(--gold-faint)",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                  }}
                >
                  <MapPin size={9} />
                  {selectedCity}
                  <button
                    onClick={() => setSelectedCity("")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--gold)",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "13px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 12px",
                    borderRadius: "100px",
                    border: "0.5px solid var(--gold-border)",
                    background: "var(--gold-faint)",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                  }}
                >
                  <Tag size={9} />
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--gold)",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "13px",
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "100px 0",
              }}
            >
              <div
                className="str-spin"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--border2)",
                  borderTopColor: "var(--gold)",
                  marginBottom: "20px",
                }}
              />
              <span
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--muted2)",
                }}
              >
                Curating stores…
              </span>
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredStores.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "clamp(48px, 8vw, 80px) 32px",
                background: "var(--surface)",
                borderRadius: "24px",
                border: "0.5px solid var(--border)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "var(--bg2)",
                  border: "0.5px solid var(--border2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                <Search size={20} color="var(--muted2)" />
              </div>
              <h3
                className="str-display"
                style={{
                  fontSize: "26px",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  margin: "0 0 7px",
                  color: "var(--text)",
                }}
              >
                No stores found
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  margin: "0 0 24px",
                }}
              >
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCity("");
                  setSelectedCategory("");
                }}
                style={{
                  padding: "11px 26px",
                  borderRadius: "100px",
                  border: "0.5px solid var(--border2)",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--gold-border)";
                  e.currentTarget.style.background = "var(--gold-faint)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border2)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && filteredStores.length > 0 && (
            <div className="str-stores-grid">
              {filteredStores.map((store, idx) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  ref={(el) => (cardsRef.current[idx] = el)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Stores;
