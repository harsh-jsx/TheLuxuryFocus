import React, { useRef, useCallback, useLayoutEffect, useEffect } from "react";
import {
  Martini,
  Accessibility,
  ArrowUpRight,
  Landmark,
  Popcorn,
  Plane,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#C9A227";
const ACCENT_LIGHT = "#E8D5A3";

const amenitiesData = [
  {
    id: 1,
    title: "Banquet Halls",
    desc: "A dedicated space for hosting large gatherings and events.",
    icon: Landmark,
    videoSrc:
      "https://videos.pexels.com/video-files/31702886/13507850_2560_1440_24fps.mp4",
  },
  {
    id: 2,
    title: "Movie Theatre",
    desc: "Explore the world of cinema with our state-of-the-art movie theatre.",
    icon: Popcorn,
    videoSrc:
      "https://videos.pexels.com/video-files/7233521/7233521-uhd_2560_1080_25fps.mp4",
  },
  {
    id: 3,
    title: "Plane Bookings",
    desc: "Book your next flight with our state-of-the-art plane bookings system.",
    icon: Plane,
    videoSrc:
      "https://videos.pexels.com/video-files/32343188/13797766_1920_1080_30fps.mp4",
  },
  {
    id: 4,
    title: "Accessibility",
    desc: "Inclusive spaces built for everyone — comfort without compromise.",
    icon: Accessibility,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
  },
];

function AmenityCard({ item, onCardRef }) {
  const Icon = item.icon;
  const mediaRef = useRef(null);
  const innerRef = useRef(null);
  const glowRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    const el = innerRef.current;
    const media = mediaRef.current;
    const glow = glowRef.current;
    if (!el || !media) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(media, { x: x * 14, y: y * 10, duration: 0.6, ease: "power2.out" });
    if (glow) {
      gsap.to(glow, {
        left: `${(x + 0.5) * 100}%`,
        top: `${(y + 0.5) * 100}%`,
        opacity: 0.5,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (mediaRef.current)
      gsap.to(mediaRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    if (glowRef.current)
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
  }, []);

  return (
    <div
      ref={(el) => onCardRef(el)}
      className="amenity-card group relative cursor-pointer h-full"
    >
      <div
        ref={innerRef}
        className="amenity-reveal relative overflow-hidden rounded-2xl sm:rounded-[20px] h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image (wrapper = tilt; img = scroll parallax) */}
        <div
          ref={mediaRef}
          className="amenity-card-media absolute inset-[-12px]"
        >
          {item.videoSrc && (
            <video
              ref={videoRef}
              src={item.videoSrc}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover scale-[1.06] transition-transform duration-[1.2s] ease-out group-hover:scale-[1.12]"
              autoPlay
              muted
              loop
              playsInline
            />
          )}
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover scale-[1.06] transition-transform duration-[1.2s] ease-out group-hover:scale-[1.12]"
            />
          )}
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/5" />
        <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-black/25" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />

        {/* Cursor glow */}
        <div
          ref={glowRef}
          className="absolute w-[260px] h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0"
          style={{
            background: `radial-gradient(circle, ${ACCENT}20 0%, transparent 70%)`,
            filter: "blur(25px)",
          }}
        />

        {/* Noise */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Shimmer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "amenity-shimmer 2.5s ease-in-out infinite",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/8 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-white transition-all duration-500">
              <Icon className="w-[16px] h-[16px]" strokeWidth={1.5} />
            </div>
            <div className="w-8 h-8 rounded-full bg-white/8 backdrop-blur-xl border border-white/10 flex items-center justify-center opacity-0 translate-y-3 -rotate-45 group-hover:opacity-100 group-hover:translate-y-0 group-hover:rotate-0 transition-all duration-600 ease-[cubic-bezier(0.19,1,0.22,1)]">
              <ArrowUpRight
                className="w-3.5 h-3.5 text-white"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="translate-y-1 group-hover:translate-y-0 transition-transform duration-600 ease-[cubic-bezier(0.19,1,0.22,1)]">
            <div className="flex items-center gap-2.5 mb-2">
              <h3 className="font-[ABC] text-[10px] sm:text-[11px] tracking-[0.2em] text-white/90 font-medium uppercase">
                {item.title}
              </h3>
              <span className="h-px flex-1 max-w-6 bg-white/20 group-hover:max-w-10 group-hover:bg-white/40 transition-all duration-700" />
            </div>
            <p className="font-[neue] text-[12px] sm:text-[13px] text-white/40 group-hover:text-white/70 transition-colors duration-600 leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>

        {/* Border */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-[20px] border border-white/4 group-hover:border-white/15 transition-colors duration-600 pointer-events-none" />

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-[12%] right-[12%] h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT}90, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

const Amenities = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const labelRef = useRef(null);
  const lineRef = useRef(null);
  const orbARef = useRef(null);
  const orbBRef = useRef(null);
  const cardsRef = useRef([]);
  const gridRef = useRef(null);
  const bgWashRef = useRef(null);
  const dotGridRef = useRef(null);
  const accentTopRef = useRef(null);
  const accentBottomRef = useRef(null);

  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = el;
  };

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    let ctx;
    let io;
    let cancelled = false;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const setup = () => {
      if (cancelled || !containerRef.current) return;
      const el = containerRef.current;

      ctx = gsap.context(() => {
        const allCards = cardsRef.current.filter(Boolean);
        const reveals = allCards
          .map((c) => c.querySelector(".amenity-reveal"))
          .filter(Boolean);
        const orbs = [orbARef, orbBRef].map((r) => r.current).filter(Boolean);

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
          gsap.set(startHidden.label, { autoAlpha: 0, x: -14 });
        }
        if (startHidden.heading) {
          gsap.set(startHidden.heading, {
            autoAlpha: 0,
            y: prefersReduced ? 0 : 44,
          });
        }
        if (startHidden.sub) {
          gsap.set(startHidden.sub, {
            autoAlpha: 0,
            y: prefersReduced ? 0 : 20,
          });
        }
        if (startHidden.grid) {
          gsap.set(startHidden.grid, {
            autoAlpha: 0,
            y: prefersReduced ? 0 : 28,
          });
        }
        [startHidden.accentTop, startHidden.accentBottom].forEach((lineEl) => {
          if (lineEl)
            gsap.set(lineEl, { transformOrigin: "50% 50%", scaleX: 0 });
        });
        if (startHidden.wash) gsap.set(startHidden.wash, { autoAlpha: 0 });
        if (startHidden.dots) gsap.set(startHidden.dots, { opacity: 0 });

        allCards.forEach((card) => {
          gsap.set(card, { autoAlpha: 0, y: prefersReduced ? 0 : 32 });
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
            duration: prefersReduced ? 0.35 : 1.05,
            ease: "power3.inOut",
            stagger: 0.08,
          },
          0,
        );

        if (startHidden.wash) {
          tl.to(
            startHidden.wash,
            { autoAlpha: 1, duration: 0.95, ease: "power2.out" },
            0,
          );
        }
        if (startHidden.dots) {
          tl.to(
            startHidden.dots,
            { opacity: 0.02, duration: 0.75, ease: "power2.out" },
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
              duration: 1.35,
              ease: "power2.out",
              stagger: 0.12,
            },
            0,
          );
        } else if (orbs.length) {
          tl.to(orbs, { autoAlpha: 1, duration: 0.45, stagger: 0.06 }, 0);
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
            { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out" },
            0.2,
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
              duration: prefersReduced ? 0.4 : 0.9,
              ease: "power3.out",
            },
            0.38,
          );
        }

        const gridStart = prefersReduced ? 0.24 : 0.3;
        if (startHidden.grid) {
          tl.to(
            startHidden.grid,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.45 : 0.9,
              ease: "power3.out",
            },
            gridStart,
          );
        }

        const cardT = prefersReduced ? 0.32 : 0.38;
        if (allCards.length) {
          tl.to(
            allCards,
            {
              autoAlpha: 1,
              y: 0,
              duration: prefersReduced ? 0.38 : 0.82,
              ease: "power3.out",
              stagger: prefersReduced ? 0.06 : 0.1,
            },
            cardT,
          );
        }
        if (reveals.length) {
          tl.to(
            reveals,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: prefersReduced ? 0.35 : 1.05,
              ease: "power4.inOut",
              stagger: prefersReduced ? 0.06 : 0.1,
            },
            cardT,
          );
        }

        if (!prefersReduced && orbs.length) {
          tl.call(
            () => {
              orbs.forEach((orb, i) => {
                gsap.to(orb, {
                  y: `+=${12 + i * 10}`,
                  x: `+=${(-1) ** i * 12}`,
                  duration: 7 + i * 2,
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

        const shouldStartSectionEntrance = (entry) => {
          if (!entry?.isIntersecting) return false;
          const vh = window.innerHeight || 1;
          const r = entry.boundingClientRect;
          const ratio = entry.intersectionRatio;
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
            if (entries.some((e) => shouldStartSectionEntrance(e))) {
              playEntrance();
            }
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
          if (shouldStartFromRect(r)) playEntrance();
        });

        if (!prefersReduced) {
          allCards.forEach((card) => {
            const inner = card.querySelector(".amenity-card-media img");
            if (!inner) return;
            gsap.fromTo(
              inner,
              { y: 0 },
              {
                y: -20,
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
      ref={containerRef}
      className="relative py-28 sm:py-40 overflow-hidden"
    >
      {/* Rich background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={bgWashRef}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(249,246,240,0) 0%, rgba(249,246,240,0.5) 35%, rgba(249,246,240,0.5) 65%, rgba(249,246,240,0) 100%)",
          }}
        />

        <div
          ref={orbARef}
          className="absolute top-[10%] left-[8%] w-[340px] h-[340px] rounded-full opacity-0"
          style={{
            background: `radial-gradient(circle, ${ACCENT}16, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
        <div
          ref={orbBRef}
          className="absolute bottom-[10%] right-[10%] w-[280px] h-[280px] rounded-full opacity-0"
          style={{
            background: `radial-gradient(circle, ${ACCENT}12, transparent 70%)`,
            filter: "blur(90px)",
          }}
        />

        <div
          ref={dotGridRef}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div
          ref={accentTopRef}
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT}12, transparent)`,
          }}
        />
        <div
          ref={accentBottomRef}
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${ACCENT}12, transparent)`,
          }}
        />
      </div>

      <style>{`@keyframes amenity-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 sm:mb-24">
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
              Amenities
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div ref={headingRef}>
              <h2 className="font-[druk] text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.88] tracking-tight text-[#1a1a1a]">
                Explore
              </h2>
              <h2
                className="font-[druk] text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.88] tracking-tight"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Amenities
              </h2>
            </div>

            <p
              ref={subRef}
              className="font-[neue] text-sm sm:text-base text-black/40 max-w-sm leading-relaxed pb-2"
            >
              World-class amenities designed for your comfort and lifestyle.
            </p>
          </div>
        </div>

        {/* Staggered 2×2 Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
        >
          {amenitiesData.map((item, index) => (
            <div
              key={item.id}
              className={`${index % 2 === 1 ? "sm:translate-y-10" : ""}`}
            >
              <div
                className={`h-[340px] sm:h-[380px] ${index === 0 || index === 3 ? "lg:h-[420px]" : "lg:h-[360px]"}`}
              >
                <AmenityCard item={item} onCardRef={setCardRef(index)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
