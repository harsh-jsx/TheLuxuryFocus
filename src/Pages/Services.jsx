import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Camera,
  Megaphone,
  PhoneCall,
  Mail,
  MessageSquare,
  Mic,
  CalendarRange,
  ArrowUpRight,
  Search,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#C9A227";
const ACCENT_LIGHT = "#E8D5A3";

/* ──────────────────────────────────────────────────────────────
   Footage library — confirmed-working Pexels CDN URLs reused
   from the Categories redesign so featured services move.
   ────────────────────────────────────────────────────────────── */

const FEATURED_VIDEO_A =
  "https://videos.pexels.com/video-files/35083677/14863159_1920_1080_60fps.mp4";
const FEATURED_VIDEO_B =
  "https://videos.pexels.com/video-files/34668838/14694819_1920_1080_30fps.mp4";

const SECTIONS = [
  {
    id: "growth",
    label: "01 — Growth & Acquisition",
    title: "How brands get found",
    blurb:
      "Strategy, paid acquisition, and content engines that scale awareness without diluting positioning.",
    items: [
      {
        title: "Marketing Strategy",
        category: "Strategy",
        icon: Megaphone,
        desc: "Full-funnel playbooks — positioning, paid acquisition, retention loops, attribution.",
        bullets: [
          "Quarterly GTM roadmap",
          "Channel mix & budget allocation",
          "Performance dashboards",
        ],
        price: "Hourly",
        cadence: "Retainer or project",
        featured: true,
        video: FEATURED_VIDEO_A,
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Social Management",
        category: "Always-on",
        icon: Users,
        desc: "Editorial calendars, posting cadence, community replies, and monthly performance reads across IG, LI, X, TikTok.",
        bullets: [
          "Channel-specific editorial",
          "Daily community management",
          "Weekly insight reports",
        ],
        price: "Hourly",
        cadence: "Monthly retainer",
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Content Creation",
        category: "Production",
        icon: Camera,
        desc: "Photo, video, reels, and ad creative — shot in-house or on-location with an editorial sensibility.",
        bullets: [
          "Stills, reels, long-form video",
          "Ad creative variants",
          "Brand-aligned art direction",
        ],
        price: "Hourly",
        cadence: "Per shoot or retainer",
        featured: true,
        video: FEATURED_VIDEO_B,
        image:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "outreach",
    label: "02 — Outreach & Lifecycle",
    title: "How conversations land",
    blurb:
      "Email, SMS, and human-led calling that nurtures leads from interest to commitment.",
    items: [
      {
        title: "Email Marketing",
        category: "Lifecycle",
        icon: Mail,
        desc: "Newsletters, drip sequences, and transactional flows authored in the brand voice.",
        bullets: [
          "Welcome & onboarding flows",
          "Editorial newsletters",
          "A/B testing & deliverability tuning",
        ],
        price: "Hourly",
        cadence: "Monthly retainer",
        image:
          "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "SMS Marketing",
        category: "Conversion",
        icon: MessageSquare,
        desc: "High-intent SMS campaigns and automated replies for launches, restocks, and reservations.",
        bullets: [
          "Campaign ideation & copy",
          "Vendor & delivery setup",
          "Conversion attribution",
        ],
        price: "Hourly",
        cadence: "Per campaign",
        image:
          "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Telecalling",
        category: "Concierge",
        icon: PhoneCall,
        desc: "Trained outbound concierge who can warm a list, qualify leads, or recover lapsed customers in your tone.",
        bullets: [
          "Script & voice training",
          "CRM-ready call logs",
          "Lead-quality scoring",
        ],
        price: "Hourly",
        cadence: "Per pod or retainer",
        image:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "events",
    label: "03 — Events & Activation",
    title: "Where the room remembers",
    blurb:
      "On-stage hosts and end-to-end producers for launches, weddings, and brand activations.",
    items: [
      {
        title: "Event Anchoring",
        category: "Talent",
        icon: Mic,
        desc: "Polished hosts and emcees for launches, awards, and stage-led activations — bilingual options available.",
        bullets: [
          "Single host or duo",
          "Script & rehearsal included",
          "On-day green-room support",
        ],
        price: "₹2,500 / day",
        cadence: "Per event",
        image:
          "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2070&auto=format&fit=crop",
      },
      {
        title: "Event Management",
        category: "Production",
        icon: CalendarRange,
        desc: "End-to-end production — venue, vendors, design, run-of-show, and on-day execution.",
        bullets: [
          "Concept & creative direction",
          "Vendor curation & logistics",
          "On-ground production team",
        ],
        price: "Custom quote",
        cadence: "Per project",
        image:
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────
   Card
   ────────────────────────────────────────────────────────────── */

function ServiceCard({ item, featured = false, onEnquire }) {
  const Icon = item.icon;
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const glowRef = useRef(null);

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

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`svc-card group relative block overflow-hidden rounded-[22px] cursor-default h-full ${
        featured ? "min-h-[520px]" : "min-h-[460px]"
      }`}
    >
      {/* Media */}
      <div
        ref={mediaRef}
        className="svc-card-media absolute inset-[-18px] will-change-transform"
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
            className="w-full h-full object-cover scale-[1.1] svc-kenburns transition-transform duration-[1.4s] ease-out group-hover:scale-[1.18]"
          />
        )}
      </div>

      {/* Tonal overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/55 to-black/15" />
      <div className="absolute inset-0 bg-linear-to-br from-black/15 via-transparent to-black/45" />
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
          animation: "svc-shimmer 2.6s ease-in-out infinite",
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
          <div
            className="px-2.5 py-1 rounded-full text-[10px] font-[ABC] tracking-[0.22em] uppercase backdrop-blur-md border"
            style={{
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {item.category}
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
              Service
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
            className={`font-[neue] text-white/65 group-hover:text-white/85 transition-colors duration-700 leading-relaxed mt-3 ${
              featured ? "text-sm sm:text-[15px] max-w-[460px]" : "text-[12.5px] sm:text-[13px] max-w-[340px]"
            }`}
          >
            {item.desc}
          </p>

          {/* Bullets */}
          {item.bullets?.length > 0 && (
            <ul className="mt-4 space-y-1.5 max-w-[460px]">
              {item.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 font-[neue] text-[12px] sm:text-[12.5px] text-white/55 group-hover:text-white/75 transition-colors duration-700"
                >
                  <Check
                    className="w-3 h-3 mt-[3px] shrink-0"
                    strokeWidth={2.5}
                    style={{ color: ACCENT_LIGHT }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* Footer row: price + CTA */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <div>
              <div
                className="font-[druk] text-white text-[1.05rem] tracking-tight"
              >
                {item.price}
              </div>
              {item.cadence && (
                <div
                  className="flex items-center gap-1.5 mt-1 font-[ABC] text-[9.5px] tracking-[0.22em] uppercase text-white/45"
                >
                  <Clock className="w-3 h-3" strokeWidth={1.6} />
                  {item.cadence}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onEnquire?.(item)}
              className="group/btn flex items-center gap-2 text-white/75 hover:text-white transition-colors duration-300"
            >
              <span className="font-[ABC] text-[10.5px] tracking-[0.22em] uppercase">
                Enquire
              </span>
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 group-hover/btn:rotate-0 -rotate-45"
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
            </button>
          </div>
        </div>
      </div>

      {/* Border glow */}
      <div className="absolute inset-0 rounded-[22px] border border-white/5 group-hover:border-white/15 transition-colors duration-700 pointer-events-none" />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-[10%] right-[10%] h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT}aa, transparent)`,
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Section
   ────────────────────────────────────────────────────────────── */

function Section({ section, onEnquire }) {
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
    <section ref={sectionEl} className="relative mb-28 sm:mb-36">
      <header className="mb-10 sm:mb-14">
        <div className="sec-fade flex items-center gap-4 mb-5">
          <span className="h-px w-10" style={{ background: ACCENT }} />
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
            <ServiceCard item={featured} featured onEnquire={onEnquire} />
          </div>
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
            {rest.slice(0, 2).map((it) => (
              <div key={it.title} className="sec-fade">
                <ServiceCard item={it} onEnquire={onEnquire} />
              </div>
            ))}
          </div>
          {rest.length > 2 && (
            <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.slice(2).map((it) => (
                <div key={it.title} className="sec-fade">
                  <ServiceCard item={it} onEnquire={onEnquire} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {section.items.map((it) => (
            <div key={it.title} className="sec-fade">
              <ServiceCard item={it} onEnquire={onEnquire} />
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

const Services = () => {
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

  const totalServices = SECTIONS.reduce((n, s) => n + s.items.length, 0);

  const onEnquire = useCallback(
    (item) => {
      const subject = encodeURIComponent(`Enquiry — ${item.title}`);
      navigate(`/about?service=${encodeURIComponent(item.title)}#contact`, {
        state: { service: item.title, subject },
      });
    },
    [navigate],
  );

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
        .to(
          lineRef.current,
          { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
          0.15,
        )
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
    const match = SECTIONS.flatMap((s) => s.items).find((it) =>
      it.title.toLowerCase().includes(q.toLowerCase()),
    );
    if (match) {
      onEnquire(match);
    } else {
      navigate(`/about?topic=${encodeURIComponent(q)}#contact`);
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-[#FAF8F3]"
    >
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
        @keyframes svc-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes svc-kenburns {
          0% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(1.16) translate(-1.5%, -1%); }
          100% { transform: scale(1.1) translate(0, 0); }
        }
        .svc-kenburns { animation: svc-kenburns 18s ease-in-out infinite; }
        .svc-card:hover .svc-kenburns { animation-play-state: paused; }
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
              The studio · {totalServices} services
            </span>
          </div>

          <div ref={headingRef} className="max-w-5xl">
            <h1 className="font-[druk] text-[clamp(3rem,11vw,9rem)] leading-[0.85] tracking-tight text-[#141414]">
              Services that
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
              extend your team.
            </h1>
          </div>

          <div
            ref={subRef}
            className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end"
          >
            <p className="md:col-span-6 font-[neue] text-base sm:text-lg text-black/65 leading-relaxed max-w-xl">
              Every TLF subscription can be deepened with on-demand growth,
              outreach, and event services — staffed by people we've worked
              with for years and priced to scale with the brief.
            </p>

            <form
              onSubmit={onSearchSubmit}
              className="md:col-span-6 md:justify-self-end w-full md:max-w-md"
            >
              <label className="block font-[ABC] text-[10px] tracking-[0.28em] uppercase text-black/45 mb-3">
                Looking for something specific?
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
                  placeholder="e.g. content, telecalling, event…"
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
                  Find
                </button>
              </div>
            </form>
          </div>
        </header>

        {/* ── Sections ── */}
        {SECTIONS.map((section) => (
          <Section
            key={section.id}
            section={section}
            onEnquire={onEnquire}
          />
        ))}

        {/* ── Bundling note ── */}
        <section className="relative mt-8 mb-20 rounded-[24px] border border-black/8 bg-white/70 backdrop-blur-sm px-7 sm:px-10 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="h-px w-8"
                  style={{ background: ACCENT }}
                />
                <span
                  className="font-[ABC] text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: ACCENT }}
                >
                  Bundle with a package
                </span>
              </div>
              <h3 className="font-[druk] text-[clamp(1.5rem,3.5vw,2.4rem)] leading-[0.95] tracking-tight text-[#141414]">
                Already on a TLF plan? Services slot in by the hour.
              </h3>
              <p className="font-[neue] text-black/60 mt-4 max-w-xl leading-relaxed">
                If you're on Standard or Premium, you can add any of these
                services as you need them — no minimum retainer, no contract
                rebuild.
              </p>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <button
                onClick={() => navigate("/packages")}
                className="group flex items-center justify-between gap-4 px-6 py-4 rounded-full border transition-all hover:bg-black/5 w-full md:w-auto"
                style={{ borderColor: `${ACCENT}55` }}
              >
                <span className="font-[ABC] text-[11px] tracking-[0.28em] uppercase text-[#141414]">
                  See packages
                </span>
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45"
                  style={{ background: ACCENT, color: "#1a1a1a" }}
                >
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Concierge CTA ── */}
        <section className="relative rounded-[28px] overflow-hidden">
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
                  Outside this list?
                </span>
              </div>
              <h3 className="font-[druk] text-[clamp(2rem,5vw,3.6rem)] leading-[0.95] tracking-tight text-white max-w-xl">
                Tell us the brief. We'll staff it.
              </h3>
              <p className="font-[neue] text-white/60 mt-5 max-w-md leading-relaxed">
                PR, influencer programs, podcast production, exec briefings —
                if it's adjacent to growth or events, we likely have someone
                on call.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col justify-end gap-3">
              <button
                onClick={() => navigate("/about#contact")}
                className="group flex items-center justify-between gap-4 px-6 py-4 rounded-full border transition-all hover:bg-white/5"
                style={{ borderColor: `${ACCENT}55` }}
              >
                <span className="font-[ABC] text-[11px] tracking-[0.28em] uppercase text-white">
                  Speak to concierge
                </span>
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45"
                  style={{ background: ACCENT, color: "#1a1a1a" }}
                >
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
                </span>
              </button>
              <button
                onClick={() => navigate("/categories")}
                className="group flex items-center justify-between gap-4 px-6 py-4 rounded-full border border-white/15 transition-all hover:bg-white/5"
              >
                <span className="font-[ABC] text-[11px] tracking-[0.28em] uppercase text-white/85">
                  Browse categories
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

export default Services;
