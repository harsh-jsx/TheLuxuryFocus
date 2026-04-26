import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Bed,
  Home,
  Utensils,
  Coffee,
  Moon,
  Plane,
  Ship,
  Car,
  ShoppingBag,
  Gem,
  Gift,
  Laptop,
  HeartPulse,
  Sparkles,
  Crown,
  PartyPopper,
  Palette,
  Building2,
  LandPlot,
  Landmark,
  Scale,
  GraduationCap,
  Paintbrush,
  PawPrint,
  ArrowUpRight,
  Search,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#C9A227";
const ACCENT_LIGHT = "#E8D5A3";

/* ──────────────────────────────────────────────────────────────
   Footage library
   - `video` references confirmed-working Pexels CDN URLs already
     used elsewhere in the site (DiscoverCategories).
   - All other entries use carefully curated Unsplash imagery
     that better represents the luxury bracket of each vertical.
   ────────────────────────────────────────────────────────────── */

const FEATURED_VIDEO_A =
  "https://videos.pexels.com/video-files/35083677/14863159_1920_1080_60fps.mp4";
const FEATURED_VIDEO_B =
  "https://videos.pexels.com/video-files/34668838/14694819_1920_1080_30fps.mp4";

const SECTIONS = [
  {
    id: "stay",
    label: "01 — Stay & Spaces",
    title: "Where you rest",
    blurb:
      "Five-star resorts, private villas, branded residences, and architectural homes.",
    items: [
      {
        title: "Hotels & Resorts",
        filter: "Hotels & Resorts",
        icon: Bed,
        desc: "Five-star hotels, boutique stays, and private villas.",
        featured: true,
        video: FEATURED_VIDEO_A,
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Real Estate",
        filter: "Real Estate",
        icon: Home,
        desc: "Luxury properties, private islands, and estates.",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Interior Design & Architecture",
        filter: "Interior Design & Architecture",
        icon: Paintbrush,
        desc: "Bespoke interiors and high-end architecture.",
        image:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "dine",
    label: "02 — Dine",
    title: "What you taste",
    blurb:
      "Chef-driven kitchens, late-night cocktail counters, and quiet morning rituals.",
    items: [
      {
        title: "Restaurants & Fine Dining",
        filter: "Restaurants & Fine Dining",
        icon: Utensils,
        desc: "Michelin-style dining and celebrity-chef concepts.",
        featured: true,
        video: FEATURED_VIDEO_B,
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Cafe",
        filter: "CAFE",
        icon: Coffee,
        desc: "Specialty roasters, slow mornings, quiet afternoons.",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Nightlife",
        filter: "NIGHTLIFE",
        icon: Moon,
        desc: "Speakeasies, listening bars, and rooftop counters.",
        image:
          "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "travel",
    label: "03 — Travel & Mobility",
    title: "How you move",
    blurb:
      "Curated journeys, private aviation, charter yachts, and collector vehicles.",
    items: [
      {
        title: "Travel & Tourism",
        filter: "Travel & Tourism",
        icon: Plane,
        desc: "Luxury travel curation, cruise, and concierge trips.",
        image:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Yachts & Aviation",
        filter: "Yachts & Aviation",
        icon: Ship,
        desc: "Private yachts, jets, and charter experiences.",
        image:
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Automobiles",
        filter: "Automobiles",
        icon: Car,
        desc: "Exotic cars, chauffeurs, and collector vehicles.",
        image:
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "shop",
    label: "04 — Shop & Gifting",
    title: "What you wear, give, hold",
    blurb:
      "Designer ateliers, jewelry houses, premium tech, and bespoke gifting.",
    items: [
      {
        title: "Fashion & Apparel",
        filter: "Fashion & Apparel",
        icon: ShoppingBag,
        desc: "Designer labels, couture, and premium streetwear.",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Jewelry & Watches",
        filter: "Jewelry & Watches",
        icon: Gem,
        desc: "High-end jewelry, watches, and bespoke creations.",
        image:
          "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Technology & Gadgets",
        filter: "Technology & Gadgets",
        icon: Laptop,
        desc: "Premium electronics and bespoke smart tech.",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Gifting & Luxury Services",
        filter: "Gifting & Luxury Services",
        icon: Gift,
        desc: "Premium gifting and bespoke personal shopping.",
        image:
          "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "wellness",
    label: "05 — Wellness & Health",
    title: "How you feel",
    blurb: "Spa retreats, longevity clinics, and personal medical care.",
    items: [
      {
        title: "Beauty & Wellness",
        filter: "Beauty & Wellness",
        icon: Sparkles,
        desc: "Spas, salons, and premium wellness retreats.",
        image:
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Health & Medical",
        filter: "Health & Medical",
        icon: HeartPulse,
        desc: "Premium healthcare and personal doctors.",
        image:
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "lifestyle",
    label: "06 — Lifestyle & Culture",
    title: "How you live",
    blurb:
      "Members-only rooms, gallery openings, weddings, and outdoor escapes.",
    items: [
      {
        title: "Private Clubs & Lifestyle",
        filter: "Private Clubs & Lifestyle",
        icon: Crown,
        desc: "Members-only communities and concierge services.",
        image:
          "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Event Management",
        filter: "Event Management",
        icon: PartyPopper,
        desc: "Luxury weddings, private parties, and elite events.",
        image:
          "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Art & Collectibles",
        filter: "Art & Collectibles",
        icon: Palette,
        desc: "Galleries, auction houses, and rare collectibles.",
        image:
          "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Museum",
        filter: "MUSEUM",
        icon: Building2,
        desc: "Architectural institutions and curated collections.",
        image:
          "https://images.unsplash.com/photo-1544413164-5f1b295eb435?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Outdoor",
        filter: "OUTDOOR",
        icon: LandPlot,
        desc: "Polo, equestrian, golf, sailing, and the wild.",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "services",
    label: "07 — Professional Services",
    title: "What protects what you build",
    blurb: "Wealth, counsel, education, and care that compounds.",
    items: [
      {
        title: "Finance & Wealth Management",
        filter: "Finance & Wealth Management",
        icon: Landmark,
        desc: "Private banking and wealth advisory firms.",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Legal Services",
        filter: "Legal Services",
        icon: Scale,
        desc: "Legal services for high-net-worth clients.",
        image:
          "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Education & Training",
        filter: "Education & Training",
        icon: GraduationCap,
        desc: "Elite schools, tutors, and luxury workshops.",
        image:
          "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Pet Care & Services",
        filter: "Pet Care & Services",
        icon: PawPrint,
        desc: "Luxury pet hotels and exclusive pet products.",
        image:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────
   Card
   ────────────────────────────────────────────────────────────── */

function CategoryCard({ item, featured = false, registerRef }) {
  const Icon = item.icon;
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const glowRef = useRef(null);
  const navigate = useNavigate();

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    const media = mediaRef.current;
    const glow = glowRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (media) {
      gsap.to(media, {
        x: x * 22,
        y: y * 16,
        duration: 0.7,
        ease: "power2.out",
      });
    }
    if (glow) {
      gsap.to(glow, {
        left: `${(x + 0.5) * 100}%`,
        top: `${(y + 0.5) * 100}%`,
        opacity: 0.65,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (mediaRef.current) {
      gsap.to(mediaRef.current, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
    }
  }, []);

  const go = () =>
    navigate(`/stores?category=${encodeURIComponent(item.filter)}`);

  return (
    <a
      ref={(el) => {
        cardRef.current = el;
        registerRef?.(el);
      }}
      href={`/stores?category=${encodeURIComponent(item.filter)}`}
      onClick={(e) => {
        e.preventDefault();
        go();
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`cat-card group relative block overflow-hidden rounded-[22px] cursor-pointer h-full ${
        featured ? "min-h-[460px]" : "min-h-[340px]"
      }`}
    >
      {/* Media */}
      <div
        ref={mediaRef}
        className="cat-card-media absolute inset-[-18px] will-change-transform"
      >
        {item.video ? (
          <video
            src={item.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-[1.1] transition-transform duration-[1.4s] ease-out group-hover:scale-[1.18]"
          />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover scale-[1.1] cat-kenburns transition-transform duration-[1.4s] ease-out group-hover:scale-[1.18]"
          />
        )}
      </div>

      {/* Tonal overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/0" />
      <div className="absolute inset-0 bg-linear-to-br from-black/10 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors duration-700" />

      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="absolute w-[320px] h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0"
        style={{
          background: `radial-gradient(circle, ${ACCENT}30 0%, transparent 70%)`,
          filter: "blur(35px)",
        }}
      />

      {/* Shimmer sweep on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "cat-shimmer 2.6s ease-in-out infinite",
        }}
      />

      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-5 right-5 z-20">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border"
            style={{
              background: "rgba(0,0,0,0.35)",
              borderColor: `${ACCENT}55`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: ACCENT }}
            />
            <span
              className="font-[ABC] text-[9px] tracking-[0.25em] uppercase"
              style={{ color: ACCENT_LIGHT }}
            >
              Featured
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-7">
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center text-white/85 group-hover:bg-white/20 group-hover:text-white transition-all duration-500">
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </div>
        </div>

        <div className="translate-y-1 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="h-px w-8 group-hover:w-14 transition-all duration-700"
              style={{ background: ACCENT }}
            />
            <span
              className="font-[ABC] text-[10px] tracking-[0.28em] uppercase"
              style={{ color: ACCENT_LIGHT }}
            >
              Category
            </span>
          </div>

          <h3
            className={`font-[druk] text-white leading-[0.95] tracking-tight ${
              featured ? "text-[2.2rem] sm:text-[2.6rem]" : "text-[1.5rem] sm:text-[1.7rem]"
            }`}
          >
            {item.title}
          </h3>

          <p
            className={`font-[neue] text-white/55 group-hover:text-white/80 transition-colors duration-700 leading-relaxed mt-3 ${
              featured ? "text-sm sm:text-[15px] max-w-[420px]" : "text-[12.5px] sm:text-[13px] max-w-[300px]"
            }`}
          >
            {item.desc}
          </p>

          <div className="mt-5 flex items-center gap-3 text-white/70 group-hover:text-white transition-colors duration-500">
            <span className="font-[ABC] text-[10.5px] tracking-[0.22em] uppercase">
              View stores
            </span>
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 group-hover:rotate-0 -rotate-45"
              style={{
                borderColor: `${ACCENT}66`,
                background: `${ACCENT}1a`,
              }}
            >
              <ArrowUpRight
                className="w-3.5 h-3.5"
                strokeWidth={1.6}
                style={{ color: ACCENT_LIGHT }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-[22px] border border-white/5 group-hover:border-white/15 transition-colors duration-700 pointer-events-none"
      />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-[10%] right-[10%] h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT}aa, transparent)`,
        }}
      />
    </a>
  );
}

/* ──────────────────────────────────────────────────────────────
   Section
   ────────────────────────────────────────────────────────────── */

function Section({ section, registerCardRef, registerSectionRef }) {
  const headerRef = useRef(null);
  const sectionEl = useRef(null);

  useLayoutEffect(() => {
    const root = sectionEl.current;
    if (!root) return undefined;
    const ctx = gsap.context(() => {
      const els = root.querySelectorAll(".sec-fade");
      gsap.set(els, { autoAlpha: 0, y: 22 });
      ScrollTrigger.create({
        trigger: root,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.08,
          });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const featured = section.items.find((i) => i.featured);
  const rest = section.items.filter((i) => !i.featured);

  return (
    <section
      ref={(el) => {
        sectionEl.current = el;
        registerSectionRef?.(el);
      }}
      className="relative mb-28 sm:mb-36"
    >
      <header ref={headerRef} className="mb-10 sm:mb-14">
        <div className="sec-fade flex items-center gap-4 mb-5">
          <span
            className="h-px w-10"
            style={{ background: ACCENT }}
          />
          <span
            className="font-[ABC] text-[10px] tracking-[0.3em] uppercase font-medium"
            style={{ color: ACCENT }}
          >
            {section.label}
          </span>
        </div>
        <h2 className="sec-fade font-[druk] text-[clamp(2.2rem,5.5vw,4rem)] leading-[0.92] tracking-tight text-[#1a1a1a] max-w-3xl">
          {section.title}
        </h2>
        <p className="sec-fade font-[neue] text-base sm:text-lg text-black/60 max-w-xl mt-5 leading-relaxed">
          {section.blurb}
        </p>
      </header>

      {featured ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-7 sec-fade">
            <CategoryCard
              item={featured}
              featured
              registerRef={registerCardRef}
            />
          </div>
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
            {rest.slice(0, 2).map((it) => (
              <div key={it.title} className="sec-fade">
                <CategoryCard item={it} registerRef={registerCardRef} />
              </div>
            ))}
          </div>
          {rest.length > 2 && (
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {rest.slice(2).map((it) => (
                <div key={it.title} className="sec-fade">
                  <CategoryCard item={it} registerRef={registerCardRef} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {section.items.map((it) => (
            <div key={it.title} className="sec-fade">
              <CategoryCard item={it} registerRef={registerCardRef} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

const Categories = () => {
  const rootRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const lineRef = useRef(null);
  const orbARef = useRef(null);
  const orbBRef = useRef(null);
  const orbCRef = useRef(null);
  const dotsRef = useRef(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const totalCategories = SECTIONS.reduce((n, s) => n + s.items.length, 0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      gsap.set([labelRef.current, headingRef.current, subRef.current], {
        autoAlpha: 0,
        y: prefersReduced ? 0 : 36,
      });
      gsap.set(lineRef.current, {
        transformOrigin: "left center",
        scaleX: 0,
      });
      gsap.set([orbARef.current, orbBRef.current, orbCRef.current], {
        autoAlpha: 0,
        scale: 0.9,
      });
      gsap.set(dotsRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.05,
      });
      tl.to(dotsRef.current, { opacity: 0.04, duration: 0.9 }, 0)
        .to(
          [orbARef.current, orbBRef.current, orbCRef.current],
          { autoAlpha: 1, scale: 1, duration: 1.2, stagger: 0.1 },
          0,
        )
        .to(lineRef.current, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, 0.15)
        .to(labelRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.25)
        .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 1 }, 0.18)
        .to(subRef.current, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.4);

      if (!prefersReduced) {
        const orbs = [orbARef.current, orbBRef.current, orbCRef.current].filter(
          Boolean,
        );
        orbs.forEach((orb, i) => {
          gsap.to(orb, {
            y: `+=${18 + i * 8}`,
            x: `+=${(-1) ** i * (10 + i * 5)}`,
            duration: 6 + i * 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/stores?search=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-[#FAF8F3]">
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(249,246,240,1) 0%, rgba(249,246,240,0.55) 35%, rgba(249,246,240,0.45) 70%, rgba(249,246,240,1) 100%)",
          }}
        />
        <div
          ref={orbARef}
          className="absolute top-[6%] right-[8%] w-[440px] h-[440px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${ACCENT}1c, transparent 70%)`,
            filter: "blur(90px)",
          }}
        />
        <div
          ref={orbBRef}
          className="absolute top-[42%] left-[2%] w-[380px] h-[380px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${ACCENT}14, transparent 70%)`,
            filter: "blur(100px)",
          }}
        />
        <div
          ref={orbCRef}
          className="absolute bottom-[8%] right-[20%] w-[300px] h-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(200,180,140,0.13), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          ref={dotsRef}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.45) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute top-0 inset-x-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT}30, transparent)`,
          }}
        />
      </div>

      <style>{`
        @keyframes cat-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes cat-kenburns {
          0% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(1.16) translate(-1.5%, -1%); }
          100% { transform: scale(1.1) translate(0, 0); }
        }
        .cat-kenburns { animation: cat-kenburns 18s ease-in-out infinite; }
        .cat-card:hover .cat-kenburns { animation-play-state: paused; }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-32 sm:pt-40 pb-32">
        {/* ── Hero ── */}
        <header className="mb-24 sm:mb-32">
          <div className="flex items-center gap-4 mb-7">
            <div
              ref={lineRef}
              className="h-px w-14"
              style={{ background: ACCENT }}
            />
            <span
              ref={labelRef}
              className="font-[ABC] text-[10px] tracking-[0.3em] uppercase font-medium"
              style={{ color: ACCENT }}
            >
              The directory · {totalCategories} categories
            </span>
          </div>

          <div ref={headingRef} className="max-w-5xl">
            <h1 className="font-[druk] text-[clamp(3rem,11vw,9rem)] leading-[0.85] tracking-tight text-[#141414]">
              Every category,
            </h1>
            <h1
              className="font-[druk] text-[clamp(3rem,11vw,9rem)] leading-[0.85] tracking-tight"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              quietly curated.
            </h1>
          </div>

          <div
            ref={subRef}
            className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end"
          >
            <p className="md:col-span-6 font-[neue] text-base sm:text-lg text-black/65 leading-relaxed max-w-xl">
              Browse the verticals we work with — from quiet hotel suites to
              private aviation desks. Pick a category to see every partner
              store listed under it.
            </p>

            <form
              onSubmit={onSearchSubmit}
              className="md:col-span-6 md:justify-self-end w-full md:max-w-md"
            >
              <label className="block font-[ABC] text-[10px] tracking-[0.28em] uppercase text-black/45 mb-3">
                Or search a store
              </label>
              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-full border bg-white/70 backdrop-blur-sm transition-colors focus-within:bg-white"
                style={{ borderColor: `${ACCENT}55` }}
              >
                <Search className="w-4 h-4 text-black/40" strokeWidth={1.5} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Soho House, Aman, Patek…"
                  className="flex-1 bg-transparent outline-none font-[neue] text-sm text-black placeholder:text-black/35"
                />
                <button
                  type="submit"
                  className="font-[ABC] text-[10px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    background: ACCENT,
                    color: "#1a1a1a",
                  }}
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </header>

        {/* ── Sections ── */}
        {SECTIONS.map((section) => (
          <Section key={section.id} section={section} />
        ))}

        {/* ── Concierge CTA ── */}
        <section className="relative mt-8 rounded-[28px] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #161412 0%, #1f1c18 60%, #2a2520 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute -top-20 -right-20 w-[360px] h-[360px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${ACCENT}30, transparent 70%)`,
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${ACCENT}25, transparent 70%)`,
              filter: "blur(70px)",
            }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-10 px-7 sm:px-12 lg:px-16 py-16 sm:py-20">
            <div className="md:col-span-7">
              <div className="flex items-center gap-4 mb-6">
                <span
                  className="h-px w-10"
                  style={{ background: ACCENT }}
                />
                <span
                  className="font-[ABC] text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: ACCENT }}
                >
                  Don't see your category?
                </span>
              </div>
              <h3 className="font-[druk] text-[clamp(2rem,5vw,3.6rem)] leading-[0.95] tracking-tight text-white max-w-xl">
                Tell us what you're looking for. We'll source it.
              </h3>
              <p className="font-[neue] text-white/60 mt-5 max-w-md leading-relaxed">
                Our concierge team handles requests outside the listed
                directory — bespoke verticals, regional partners, private
                introductions.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col justify-end gap-3">
              <button
                onClick={() => navigate("/stores")}
                className="group flex items-center justify-between gap-4 px-6 py-4 rounded-full border transition-all hover:bg-white/5"
                style={{ borderColor: `${ACCENT}55` }}
              >
                <span className="font-[ABC] text-[11px] tracking-[0.28em] uppercase text-white">
                  Browse all stores
                </span>
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45"
                  style={{ background: ACCENT, color: "#1a1a1a" }}
                >
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
                </span>
              </button>
              <button
                onClick={() => navigate("/about#contact")}
                className="group flex items-center justify-between gap-4 px-6 py-4 rounded-full border border-white/15 transition-all hover:bg-white/5"
              >
                <span className="font-[ABC] text-[11px] tracking-[0.28em] uppercase text-white/85">
                  Speak to concierge
                </span>
                <span className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-45">
                  <ArrowUpRight
                    className="w-4 h-4 text-white"
                    strokeWidth={1.6}
                  />
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
