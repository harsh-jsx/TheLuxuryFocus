import React, { useRef, useCallback, useLayoutEffect } from "react";
import { Moon, Coffee, MapPin, Bed, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);
const ACCENT = "#C9A227";
const ACCENT_LIGHT = "#E8D5A3";

const categories = [
  {
    id: 1,
    title: "HOTELS",
    category: "hotel",
    icon: Moon,
    videoSrc:
      "https://videos.pexels.com/video-files/35083677/14863159_1920_1080_60fps.mp4",
    desc: "Curated Hotels and Resorts, Private Villas, and more.",
    count: 12,
  },
  {
    id: 2,
    title: "GYM & FITNESS",
    category: "gym",
    icon: Coffee,
    videoSrc:
      "https://videos.pexels.com/video-files/34668838/14694819_1920_1080_30fps.mp4",
    desc: "Curated Gyms and Fitness Centers, Private Studios, and more.",
    count: 8,
  },
  {
    id: 3,
    title: "SPA & WELLNESS",
    category: "spa",
    icon: MapPin,
    image:
      "https://images.unsplash.com/photo-1696841212541-449ca29397cc?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    desc: "Curated Spas and Wellness Centers, Private Retreats, and more.",
    count: 24,
  },
  {
    id: 4,
    title: "RESTAURANTS & CAFES",
    category: "restaurant",
    icon: Bed,
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    desc: "Curated Restaurants and Cafes, Private Dining, and more.",
    count: 15,
  },
];

function Card({ cat, onCardRef }) {
  const Icon = cat.icon;
  const mediaRef = useRef(null);
  const innerRef = useRef(null);
  const glowRef = useRef(null);
  const navigate = useNavigate();
  const shimmerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = innerRef.current;
    const media = mediaRef.current;
    const glow = glowRef.current;
    if (!el || !media) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(media, { x: x * 20, y: y * 14, duration: 0.6, ease: "power2.out" });
    if (glow) {
      gsap.to(glow, {
        left: `${(x + 0.5) * 100}%`,
        top: `${(y + 0.5) * 100}%`,
        opacity: 0.6,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mediaRef.current) {
      gsap.to(mediaRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
    }
  }, []);

  return (
    <div
      onClick={() => navigate(`/stores?category=${cat.category}`)}
      ref={(el) => onCardRef(el)}
      className="discover-card group relative cursor-pointer h-full"
    >
      <a href={`/stores?category=${cat.category}`}>
        <div
          ref={innerRef}
          className="card-reveal relative overflow-hidden rounded-2xl sm:rounded-[20px] h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image */}
          <div
            ref={mediaRef}
            className="discover-card-media absolute inset-[-14px]"
          >
            {cat.videoSrc ? (
              <video
                src={cat.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.08] transition-transform duration-[1.2s] ease-out group-hover:scale-[1.14]"
              />
            ) : (
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                className="w-full h-full object-cover scale-[1.08] transition-transform duration-[1.2s] ease-out group-hover:scale-[1.14]"
              />
            )}
          </div>

          {/* Dark overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/5" />
          <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-black/30" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />

          {/* Cursor glow */}
          <div
            ref={glowRef}
            className="absolute w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0"
            style={{
              background: `radial-gradient(circle, ${ACCENT}22 0%, transparent 70%)`,
              filter: "blur(30px)",
            }}
          />

          {/* Shimmer sweep */}
          <div
            ref={shimmerRef}
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2.5s ease-in-out infinite",
            }}
          />

          {/* Noise grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-7">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/8 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-white transition-all duration-500">
                <Icon className="w-[17px] h-[17px]" strokeWidth={1.5} />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/8 backdrop-blur-xl border border-white/10 flex items-center justify-center opacity-0 translate-y-3 -rotate-45 group-hover:opacity-100 group-hover:translate-y-0 group-hover:rotate-0 transition-all duration-600 ease-[cubic-bezier(0.19,1,0.22,1)]">
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="translate-y-1 group-hover:translate-y-0 transition-transform duration-600 ease-[cubic-bezier(0.19,1,0.22,1)]">
              <div className="flex items-center gap-3 mb-2.5">
                <h3 className="font-[ABC] text-[10px] sm:text-[11px] tracking-[0.25em] text-white/90 font-medium">
                  {cat.title}
                </h3>
                <span className="h-px flex-1 max-w-8 bg-white/20 group-hover:max-w-14 group-hover:bg-white/40 transition-all duration-700" />
                <span
                  className="font-[ABC] text-[10px] tabular-nums"
                  style={{ color: ACCENT_LIGHT }}
                >
                  {String(cat.count).padStart(2, "0")}
                </span>
              </div>
              <p className="font-[neue] text-[12px] sm:text-[13px] text-white/40 group-hover:text-white/70 transition-colors duration-600 leading-relaxed max-w-[260px]">
                {cat.desc}
              </p>
            </div>
          </div>

          {/* Border glow */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-[20px] border border-white/4 group-hover:border-white/15 transition-colors duration-600 pointer-events-none" />

          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-[12%] right-[12%] h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${ACCENT}90, transparent)`,
            }}
          />
        </div>
      </a>
    </div>
  );
}

const DiscoverCategories = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const labelRef = useRef(null);
  const lineRef = useRef(null);
  const orbARef = useRef(null);
  const orbBRef = useRef(null);
  const orbCRef = useRef(null);
  const cardsRef = useRef([]);
  const gridRef = useRef(null);
  const accentTopRef = useRef(null);
  const accentBottomRef = useRef(null);
  const bgWashRef = useRef(null);
  const dotGridRef = useRef(null);

  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = el;
  };

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    let ctx;
    let io;
    let cancelled = false;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const setup = () => {
      if (cancelled || !sectionRef.current) return;
      const el = sectionRef.current;

      ctx = gsap.context(() => {
        const allCards = cardsRef.current.filter(Boolean);
        const reveals = allCards
          .map((c) => c.querySelector(".card-reveal"))
          .filter(Boolean);
        const orbs = [orbARef, orbBRef, orbCRef]
          .map((r) => r.current)
          .filter(Boolean);

        const startHidden = {
          line: lineRef.current,
          label: labelRef.current,
          heading: headingRef.current,
          sub: subRef.current,
          grid: gridRef.current,
          accentTop: accentTopRef.current,
          accentBottom: accentBottomRef.current,
          wash: bgWashRef.current,
          dots: dotGridRef.current,
        };

        if (startHidden.line) {
          gsap.set(startHidden.line, {
            transformOrigin: "left center",
            scaleX: 0,
          });
        }
        if (startHidden.label) {
          gsap.set(startHidden.label, { autoAlpha: 0, x: -16 });
        }
        if (startHidden.heading) {
          gsap.set(startHidden.heading, {
            autoAlpha: 0,
            y: prefersReduced ? 0 : 50,
          });
        }
        if (startHidden.sub) {
          gsap.set(startHidden.sub, {
            autoAlpha: 0,
            y: prefersReduced ? 0 : 24,
          });
        }
        if (startHidden.grid) {
          gsap.set(startHidden.grid, {
            autoAlpha: 0,
            y: prefersReduced ? 0 : 32,
          });
        }
        [startHidden.accentTop, startHidden.accentBottom].forEach((lineEl) => {
          if (lineEl)
            gsap.set(lineEl, { transformOrigin: "50% 50%", scaleX: 0 });
        });
        if (startHidden.wash) {
          gsap.set(startHidden.wash, { autoAlpha: 0 });
        }
        if (startHidden.dots) {
          gsap.set(startHidden.dots, { opacity: 0 });
        }

        allCards.forEach((card) => {
          gsap.set(card, {
            autoAlpha: 0,
            y: prefersReduced ? 0 : 36,
          });
        });
        reveals.forEach((reveal) => {
          gsap.set(reveal, {
            clipPath: prefersReduced
              ? "inset(0% 0% 0% 0%)"
              : "inset(100% 0 0 0)",
          });
        });

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });

        tl.to(
          [startHidden.accentTop, startHidden.accentBottom].filter(Boolean),
          {
            scaleX: 1,
            duration: prefersReduced ? 0.35 : 1.1,
            ease: "power3.inOut",
            stagger: 0.08,
          },
          0,
        );

        if (startHidden.wash) {
          tl.to(
            startHidden.wash,
            { autoAlpha: 1, duration: 1, ease: "power2.out" },
            0,
          );
        }
        if (startHidden.dots) {
          tl.to(
            startHidden.dots,
            { opacity: 0.025, duration: 0.8, ease: "power2.out" },
            0.05,
          );
        }

        if (!prefersReduced && orbs.length) {
          tl.fromTo(
            orbs,
            { autoAlpha: 0, scale: 0.85 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 1.25,
              ease: "power2.out",
              stagger: 0.1,
            },
            0,
          );
        } else if (orbs.length) {
          tl.to(orbs, { autoAlpha: 1, duration: 0.5, stagger: 0.05 }, 0);
        }

        if (startHidden.line) {
          tl.to(
            startHidden.line,
            { scaleX: 1, duration: 1, ease: "power3.inOut" },
            0.08,
          );
        }
        if (startHidden.label) {
          tl.to(
            startHidden.label,
            { autoAlpha: 1, x: 0, duration: 0.75, ease: "power3.out" },
            0.22,
          );
        }
        if (startHidden.heading) {
          tl.to(
            startHidden.heading,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.45 : 1.05,
              ease: "power3.out",
            },
            0.14,
          );
        }
        if (startHidden.sub) {
          tl.to(
            startHidden.sub,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.4 : 0.95,
              ease: "power3.out",
            },
            0.38,
          );
        }

        const gridStart = prefersReduced ? 0.25 : 0.32;
        if (startHidden.grid) {
          tl.to(
            startHidden.grid,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.45 : 0.95,
              ease: "power3.out",
            },
            gridStart,
          );
        }

        const cardT = prefersReduced ? 0.35 : 0.42;
        if (allCards.length) {
          tl.to(
            allCards,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.4 : 0.85,
              ease: "power3.out",
              stagger: prefersReduced ? 0.06 : 0.11,
            },
            cardT,
          );
        }
        if (reveals.length) {
          tl.to(
            reveals,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: prefersReduced ? 0.35 : 1.15,
              ease: "power4.inOut",
              stagger: prefersReduced ? 0.06 : 0.11,
            },
            cardT,
          );
        }

        if (!prefersReduced && orbs.length) {
          tl.call(
            () => {
              orbs.forEach((orb, i) => {
                gsap.to(orb, {
                  y: `+=${15 + i * 8}`,
                  x: `+=${(-1) ** i * (10 + i * 5)}`,
                  duration: 6 + i * 2,
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                });
              });
            },
            null,
            0.2,
          );
        }

        let entrancePlayed = false;
        const playEntrance = () => {
          if (entrancePlayed || cancelled) return;
          entrancePlayed = true;
          io?.disconnect();
          tl.play(0);
        };

        const shouldStartDiscoverEntrance = (entry) => {
          if (!entry?.isIntersecting) return false;
          const vh = window.innerHeight || 1;
          const r = entry.boundingClientRect;
          const ratio = entry.intersectionRatio;
          // threshold:0 was firing on a bottom-edge sliver while HomeCities still dominates.
          if (ratio < 0.16) return false;
          if (r.top > vh * 0.78) return false;
          const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
          if (visible < Math.min(vh * 0.14, Math.max(80, r.height * 0.08))) {
            return false;
          }
          return true;
        };

        const shouldStartFromRect = (r) => {
          const vh = window.innerHeight || 1;
          if (r.top > vh * 0.78) return false;
          const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
          if (visible < Math.min(vh * 0.14, Math.max(80, r.height * 0.08))) {
            return false;
          }
          if (r.height > 0 && visible / r.height < 0.12) return false;
          return true;
        };

        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => shouldStartDiscoverEntrance(e))) playEntrance();
          },
          {
            root: null,
            threshold: [0, 0.05, 0.1, 0.14, 0.16, 0.2, 0.25, 0.35, 0.5],
            rootMargin: "0px 0px -18% 0px",
          },
        );
        io.observe(el);

        requestAnimationFrame(() => {
          if (cancelled) return;
          ScrollTrigger.refresh();
          const r = el.getBoundingClientRect();
          if (shouldStartFromRect(r)) {
            playEntrance();
          }
        });

        if (!prefersReduced) {
          allCards.forEach((card) => {
            const inner = card.querySelector(
              ".discover-card-media img, .discover-card-media video",
            );
            if (!inner) return;
            gsap.fromTo(
              inner,
              { y: 0 },
              {
                y: -28,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.5,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        }
      }, el);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(setup);
    });

    return () => {
      cancelled = true;
      io?.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 sm:py-40 overflow-hidden"
    >
      {/* ── Rich background layer ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm cream wash */}
        <div
          ref={bgWashRef}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(249,246,240,0) 0%, rgba(249,246,240,0.6) 40%, rgba(249,246,240,0.3) 70%, rgba(249,246,240,0) 100%)",
          }}
        />

        {/* Floating orbs */}
        <div
          ref={orbARef}
          className="absolute top-[8%] right-[12%] w-[380px] h-[380px] rounded-full opacity-0"
          style={{
            background: `radial-gradient(circle, ${ACCENT}18, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          ref={orbBRef}
          className="absolute bottom-[15%] left-[5%] w-[320px] h-[320px] rounded-full opacity-0"
          style={{
            background: `radial-gradient(circle, ${ACCENT}14, transparent 70%)`,
            filter: "blur(90px)",
          }}
        />
        <div
          ref={orbCRef}
          className="absolute top-[45%] left-[55%] w-[250px] h-[250px] rounded-full opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(200,180,140,0.12), transparent 70%)",
            filter: "blur(70px)",
          }}
        />

        {/* Dot grid */}
        <div
          ref={dotGridRef}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Horizontal accent lines */}
        <div
          ref={accentTopRef}
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT}15, transparent)`,
          }}
        />
        <div
          ref={accentBottomRef}
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT}15, transparent)`,
          }}
        />
      </div>

      {/* Shimmer keyframes */}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* ── Header ── */}
        <div className="mb-20 sm:mb-28">
          <div className="flex items-center gap-4 mb-7">
            <div
              ref={lineRef}
              className="h-px w-14 origin-left"
              style={{ background: ACCENT }}
            />
            <span
              ref={labelRef}
              className="font-[ABC] text-[10px] tracking-[0.25em] uppercase font-medium"
              style={{ color: ACCENT }}
            >
              Discover
            </span>
          </div>

          <div ref={headingRef} className="mb-7">
            <h2 className="font-[druk] text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-tight text-[#1a1a1a]">
              Still
            </h2>
            <h2
              className="font-[druk] text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-tight"
              style={{
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Searching?
            </h2>
          </div>

          <p
            ref={subRef}
            className="font-[neue] text-lg md:text-xl text-black/90 max-w-md leading-relaxed"
          >
            Explore curated categories to find exactly what you're looking for.
          </p>
        </div>

        {/* ── Asymmetric Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5"
        >
          {/* Left tall — PUBS */}
          <div className="md:col-span-7 md:row-span-2">
            <div className="h-[420px] sm:h-[500px] md:h-full md:min-h-[620px]">
              <Card cat={categories[0]} onCardRef={setCardRef(0)} />
            </div>
          </div>

          {/* Right top — RESERVATIONS */}
          <div className="md:col-span-5">
            <div className="h-[280px] sm:h-[300px]">
              <Card cat={categories[1]} onCardRef={setCardRef(1)} />
            </div>
          </div>

          {/* Right bottom — ALCOHOL */}
          <div className="md:col-span-5">
            <div className="h-[280px] sm:h-[300px]">
              <Card cat={categories[2]} onCardRef={setCardRef(2)} />
            </div>
          </div>

          {/* Full-width — ACCESSIBILITY */}
          <div className="md:col-span-12">
            <div className="h-[260px] sm:h-[320px]">
              <Card cat={categories[3]} onCardRef={setCardRef(3)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverCategories;
