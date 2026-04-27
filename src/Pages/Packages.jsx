import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Zap,
  Shield,
  Check,
  X,
  ArrowRight,
  ArrowUpRight,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Mail,
  Users,
  BarChart3,
  Clock,
  MessageCircle,
  Home,
  Sparkles,
  Gift,
  Loader2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectedPackageOptionStore } from "../stores/packageStore";
import { useAuth } from "../context/AuthContext";
import { trialService } from "../services/trialService";
import {
  SUBSCRIPTION_PLANS,
  TRIAL_DURATION_DAYS,
  TRIAL_PLAN_ID,
} from "../constants/subscriptionPlans";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#C9A227";
const ACCENT_LIGHT = "#E8D5A3";

/* ──────────────────────────────────────────────────────────────
   Plan catalog — IDs must match SUBSCRIPTION_PLANS in
   src/constants/subscriptionPlans.js (1=Basic, 2=Standard, 3=Premium)
   ────────────────────────────────────────────────────────────── */

const PACKAGES = [
  {
    id: 1,
    name: "Basic",
    price: 200,
    currency: "₹",
    period: "/listing",
    blurb: "An understated, well-built presence for emerging creators.",
    icon: Star,
    features: [
      { name: "2-3 Editorial Images", included: true, icon: ImageIcon },
      { name: "Website Link", included: true, icon: LinkIcon },
      { name: "Contact & Email", included: true, icon: Mail },
      { name: "Video Uploads", included: false, icon: Video },
      { name: "Social Media Modules", included: false, icon: Users },
    ],
  },
  {
    id: 2,
    name: "Standard",
    price: 500,
    currency: "₹",
    period: "/listing",
    tag: "Most chosen",
    blurb: "Heightened visibility with multimedia and social integration.",
    icon: Zap,
    features: [
      { name: "5 Editorial Images", included: true, icon: ImageIcon },
      { name: "2 Videos", included: true, icon: Video },
      { name: "YouTube & Instagram embeds", included: true, icon: LinkIcon },
      { name: "Full social integration", included: true, icon: Users },
      { name: "Analytics dashboard", included: false, icon: BarChart3 },
    ],
    featured: true,
  },
  {
    id: 3,
    name: "Premium",
    price: 2000,
    currency: "₹",
    period: "/listing",
    tag: "Atelier",
    blurb: "Maximum reach with priority concierge and brand-marquee placement.",
    icon: Shield,
    features: [
      { name: "Up to 25 photographs", included: true, icon: ImageIcon },
      { name: "10 videos", included: true, icon: Video },
      { name: "All social links", included: true, icon: LinkIcon },
      { name: "Priority support", included: true, icon: Clock },
      {
        name: "24/7 WhatsApp concierge bot",
        included: true,
        icon: MessageCircle,
      },
      { name: "Reviews & analytics", included: true, icon: BarChart3 },
      { name: "Logo on home-page client marquee", included: true, icon: Home },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────
   Pricing card
   ────────────────────────────────────────────────────────────── */

function PricingCard({ pkg, selected, onSelect }) {
  const Icon = pkg.icon;
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const featured = !!pkg.featured;

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    gsap.to(glow, {
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      opacity: 0.55,
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`pkg-card relative group flex flex-col h-full rounded-[24px] overflow-hidden transition-[transform,box-shadow,border-color] duration-500 will-change-transform hover:-translate-y-1 ${
        featured
          ? "bg-[#141412] text-white border border-white/8 shadow-[0_18px_55px_rgba(20,20,18,0.18)] hover:shadow-[0_22px_70px_rgba(20,20,18,0.28)]"
          : "bg-white text-[#141412] border border-black/8 shadow-[0_4px_22px_rgba(0,0,0,0.05)] hover:shadow-[0_18px_55px_rgba(0,0,0,0.10)] hover:border-black/15"
      }`}
    >
      {/* Top accent stripe */}
      <div
        className="h-[3px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT}, transparent)`,
        }}
      />

      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="absolute w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0"
        style={{
          background: `radial-gradient(circle, ${ACCENT}28 0%, transparent 70%)`,
          filter: "blur(45px)",
        }}
      />

      {/* Subtle noise on featured */}
      {featured && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col flex-1 p-7 sm:p-9">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                featured
                  ? "bg-white/8 border-white/15"
                  : "bg-[#FAF8F3] border-black/8"
              }`}
            >
              <Icon
                className="w-[18px] h-[18px]"
                strokeWidth={1.5}
                style={{ color: featured ? ACCENT_LIGHT : ACCENT }}
              />
            </div>
            <div>
              <div
                className={`font-[ABC] text-[10px] tracking-[0.28em] uppercase ${
                  featured ? "text-white/55" : "text-black/45"
                }`}
              >
                Tier
              </div>
              <div
                className={`font-[druk] text-[1.05rem] tracking-tight ${
                  featured ? "text-white" : "text-[#141412]"
                }`}
              >
                {pkg.name}
              </div>
            </div>
          </div>

          {pkg.tag && (
            <span
              className="px-3 py-1 rounded-full font-[ABC] text-[9px] tracking-[0.26em] uppercase border"
              style={{
                background: `${ACCENT}18`,
                borderColor: `${ACCENT}55`,
                color: featured ? ACCENT_LIGHT : ACCENT,
              }}
            >
              {pkg.tag}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-[neue] text-base ${
                featured ? "text-white/60" : "text-black/45"
              }`}
            >
              {pkg.currency}
            </span>
            <span
              className={`font-[druk] text-[3.6rem] sm:text-[4.2rem]   tabular-nums ${
                featured ? "text-white" : "text-[#141412]"
              }`}
            >
              {pkg.price}
            </span>
            <span
              className={`font-[neue] text-sm ml-1 ${
                featured ? "text-white/55" : "text-black/45"
              }`}
            >
              {pkg.period}
            </span>
          </div>
          <p
            className={`font-[neue] text-sm sm:text-[15px] leading-relaxed mt-3 max-w-[300px] ${
              featured ? "text-white/65" : "text-black/60"
            }`}
          >
            {pkg.blurb}
          </p>
        </div>

        {/* Divider */}
        <div
          className={`h-px w-full mb-6 ${
            featured ? "bg-white/10" : "bg-black/8"
          }`}
        />

        {/* Features */}
        <ul className="space-y-3 mb-auto">
          {pkg.features.map((f, j) => {
            const FIcon = f.icon;
            return (
              <li key={j} className="flex items-center gap-3 text-sm">
                <span
                  className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{
                    background: f.included
                      ? `${ACCENT}1f`
                      : featured
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.05)",
                  }}
                >
                  {f.included ? (
                    <Check
                      className="w-3.5 h-3.5"
                      strokeWidth={3}
                      style={{ color: ACCENT }}
                    />
                  ) : (
                    <X
                      className="w-3 h-3"
                      strokeWidth={2}
                      style={{
                        color: featured
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.3)",
                      }}
                    />
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <FIcon
                    className="w-3.5 h-3.5"
                    style={{
                      color: f.included
                        ? featured
                          ? "rgba(255,255,255,0.45)"
                          : "rgba(0,0,0,0.4)"
                        : featured
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(0,0,0,0.2)",
                    }}
                  />
                  <span
                    className={`font-[neue] ${
                      f.included
                        ? featured
                          ? "text-white/85"
                          : "text-[#141412]/80"
                        : featured
                          ? "text-white/30 line-through"
                          : "text-black/35 line-through"
                    }`}
                  >
                    {f.name}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <button
          type="button"
          onClick={onSelect}
          disabled={selected}
          className={`group/btn relative mt-8 w-full overflow-hidden rounded-2xl py-4 transition-all active:scale-[0.97] ${
            selected ? "cursor-wait opacity-70" : ""
          }`}
          style={{
            background: featured
              ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`
              : "#141412",
            color: featured ? "#141412" : "#FAF8F3",
            boxShadow: featured
              ? "0 14px 35px rgba(201,162,39,0.28)"
              : "0 14px 30px rgba(20,20,18,0.20)",
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2 font-[ABC] text-[11px] tracking-[0.24em] uppercase">
            {selected ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Securing tier
              </>
            ) : (
              <>
                Get started
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1.5" />
              </>
            )}
          </span>
          {!selected && (
            <div
              className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{
                background: featured
                  ? "rgba(20,20,18,0.10)"
                  : "rgba(255,255,255,0.08)",
              }}
            />
          )}
        </button>
      </div>

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
   Page
   ────────────────────────────────────────────────────────────── */

const Packages = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const selectedPackageOption = useSelectedPackageOptionStore(
    (s) => s.selectedPackageOption,
  );
  const setSelectedPackageOption = useSelectedPackageOptionStore(
    (s) => s.setSelectedPackageOption,
  );

  const rootRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const lineRef = useRef(null);
  const orbARef = useRef(null);
  const orbBRef = useRef(null);
  const orbCRef = useRef(null);
  const dotsRef = useRef(null);
  const trialBannerRef = useRef(null);
  const pricingSectionRef = useRef(null);
  const cardRefs = useRef([]);
  const ctaRef = useRef(null);

  const [trialBusy, setTrialBusy] = useState(false);
  const [trialError, setTrialError] = useState(null);

  const trialUsed = Boolean(userData?.trialUsed);
  const trialPlanName = SUBSCRIPTION_PLANS[TRIAL_PLAN_ID]?.name || "Standard";

  const claimTrial = async () => {
    if (trialBusy) return;
    setTrialError(null);
    if (!currentUser) {
      navigate("/login", { state: { from: "/packages" } });
      return;
    }
    if (trialUsed) return;
    setTrialBusy(true);
    try {
      await trialService.claimTrial(currentUser);
      navigate("/dashboard", {
        replace: true,
        state: { trialActivated: true },
      });
    } catch (err) {
      console.error("Failed to claim trial", err);
      setTrialError(err?.message || "Could not start your free trial.");
    } finally {
      setTrialBusy(false);
    }
  };

  const selectPackage = (pkg) => {
    setSelectedPackageOption({
      id: pkg.id,
      name: pkg.name,
      price: `${pkg.currency}${pkg.price}`,
      description: pkg.blurb,
      tag: pkg.tag,
    });
    setTimeout(() => navigate("/checkout"), 700);
  };

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

      if (trialBannerRef.current) {
        gsap.fromTo(
          trialBannerRef.current,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: trialBannerRef.current,
              start: "top 90%",
              once: true,
            },
          },
        );
      }

      const cards = cardRefs.current.filter(Boolean);
      if (pricingSectionRef.current && cards.length) {
        gsap.set(cards, { y: 60, autoAlpha: 0 });
        gsap.to(cards, {
          y: 0,
          autoAlpha: 1,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pricingSectionRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 88%",
              once: true,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

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

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-32 sm:pt-40 pb-32">
        {/* ── Hero ── */}
        <header className="mb-20 sm:mb-24">
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
              Subscription · Three tiers
            </span>
          </div>

          <div ref={headingRef} className="max-w-5xl">
            <h1 className="font-[druk] text-[clamp(3rem,11vw,9rem)] leading-[0.85] tracking-tight text-[#141414]">
              Plans that
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
              scale with you.
            </h1>
          </div>

          <div
            ref={subRef}
            className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end"
          >
            <p className="md:col-span-6 font-[neue] text-base sm:text-lg text-black/65 leading-relaxed max-w-xl">
              Three tiers, one philosophy — quiet, well-built listings that
              compound month over month. Start with what you need; upgrade when
              the brand asks for more.
            </p>

            <div className="md:col-span-6 md:justify-self-end flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                { value: "500+", label: "Active listings" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Concierge" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-[druk] text-2xl sm:text-3xl text-[#141412] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="font-[ABC] text-[10px] tracking-[0.26em] uppercase text-black/45 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── Free Trial Banner ── */}
        <section
          ref={trialBannerRef}
          className="mb-20 sm:mb-24"
          style={{ opacity: 0 }}
        >
          <div className="relative overflow-hidden rounded-[28px] border border-white/8">
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
              className="absolute -top-24 -right-24 w-[340px] h-[340px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${ACCENT}38, transparent 70%)`,
                filter: "blur(80px)",
              }}
            />
            <div
              className="absolute -bottom-20 -left-16 w-[280px] h-[280px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${ACCENT}1f, transparent 70%)`,
                filter: "blur(70px)",
              }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 px-7 sm:px-12 lg:px-16 py-12 sm:py-14">
              <div className="md:col-span-7 lg:col-span-8">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ background: `${ACCENT}22` }}
                  >
                    <Gift
                      className="w-3.5 h-3.5"
                      strokeWidth={1.8}
                      style={{ color: ACCENT_LIGHT }}
                    />
                  </span>
                  <span
                    className="font-[ABC] text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: ACCENT_LIGHT }}
                  >
                    One per account · Limited
                  </span>
                </div>
                <h2 className="font-[druk] text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-tight text-white max-w-2xl">
                  {TRIAL_DURATION_DAYS}-Day free trial of the {trialPlanName}{" "}
                  plan, on the house.
                </h2>
                <p className="font-[neue] text-white/65 mt-4 max-w-xl leading-relaxed text-sm sm:text-[15px]">
                  Activate the {trialPlanName} tier instantly. Full features for{" "}
                  {TRIAL_DURATION_DAYS} days — no card required, no
                  auto-renewal.
                </p>
                {trialError && (
                  <p className="mt-4 font-[neue] text-[13px] text-red-300/90">
                    {trialError}
                  </p>
                )}
              </div>

              <div className="md:col-span-5 lg:col-span-4 flex flex-col items-stretch md:items-end justify-end gap-3">
                <button
                  type="button"
                  onClick={claimTrial}
                  disabled={trialBusy || trialUsed}
                  className={`group flex items-center justify-between gap-4 px-6 py-4 rounded-full transition-all w-full md:w-auto disabled:cursor-not-allowed ${
                    trialUsed
                      ? "border border-white/15 bg-white/5"
                      : "shadow-[0_18px_45px_rgba(201,162,39,0.28)] hover:-translate-y-0.5"
                  }`}
                  style={
                    trialUsed
                      ? {}
                      : {
                          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`,
                          color: "#1a1a1a",
                        }
                  }
                >
                  <span
                    className={`font-[ABC] text-[11px] tracking-[0.28em] uppercase ${
                      trialUsed ? "text-white/55" : ""
                    }`}
                  >
                    {trialBusy
                      ? "Activating…"
                      : trialUsed
                        ? "Trial already used"
                        : "Start free trial"}
                  </span>
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform ${
                      trialUsed ? "bg-white/10" : "bg-[#141412]/15"
                    } ${!trialUsed && !trialBusy ? "group-hover:rotate-45" : ""}`}
                  >
                    {trialBusy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : trialUsed ? (
                      <Check
                        className="w-4 h-4"
                        strokeWidth={2.2}
                        style={{ color: ACCENT_LIGHT }}
                      />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
                    )}
                  </span>
                </button>
                <span className="font-[ABC] text-[9.5px] tracking-[0.26em] uppercase text-white/45 text-center md:text-right">
                  {currentUser
                    ? trialUsed
                      ? "You've already taken yours"
                      : "Activates immediately"
                    : "Sign in to activate"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Grid ── */}
        <section ref={pricingSectionRef} className="mb-24 sm:mb-32">
          <div className="flex items-center gap-4 mb-10 sm:mb-12">
            <span className="h-px w-10" style={{ background: ACCENT }} />
            <span
              className="font-[ABC] text-[10px] tracking-[0.3em] uppercase font-medium"
              style={{ color: ACCENT }}
            >
              Compare tiers
            </span>
            <div className="flex-1 h-px bg-black/8" />
            <span className="hidden sm:block font-[ABC] text-[10px] tracking-[0.26em] uppercase text-black/35">
              All include 7-day satisfaction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.id}
                ref={(el) => (cardRefs.current[i] = el)}
                style={{ opacity: 0 }}
              >
                <PricingCard
                  pkg={pkg}
                  selected={selectedPackageOption?.id === pkg.id}
                  onSelect={() => selectPackage(pkg)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-10">
            <Sparkles
              className="w-3.5 h-3.5"
              strokeWidth={1.6}
              style={{ color: ACCENT }}
            />
            <span className="font-[ABC] text-[10px] tracking-[0.26em] uppercase text-black/45">
              Cancel anytime · No hidden fees · 500+ creators
            </span>
          </div>
        </section>

        {/* ── Services bridge ── */}
        <section className="relative mb-24 rounded-[24px] border border-black/8 bg-white/70 backdrop-blur-sm px-7 sm:px-10 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8" style={{ background: ACCENT }} />
                <span
                  className="font-[ABC] text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: ACCENT }}
                >
                  Need more hands?
                </span>
              </div>
              <h3 className="font-[druk] text-[clamp(1.6rem,3.6vw,2.4rem)] leading-[0.95] tracking-tight text-[#141412]">
                Add growth, content, or event services by the hour.
              </h3>
              <p className="font-[neue] text-black/60 mt-4 max-w-xl leading-relaxed">
                Marketing strategy, content production, telecalling, email,
                event management — staffed by people we trust, billed only for
                the time you use.
              </p>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <button
                onClick={() => navigate("/services")}
                className="group flex items-center justify-between gap-4 px-6 py-4 rounded-full border transition-all hover:bg-black/5 w-full md:w-auto"
                style={{ borderColor: `${ACCENT}55` }}
              >
                <span className="font-[ABC] text-[11px] tracking-[0.28em] uppercase text-[#141412]">
                  Browse services
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
        <section
          ref={ctaRef}
          className="relative rounded-[28px] overflow-hidden"
          style={{ opacity: 0 }}
        >
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
                <span className="h-px w-10" style={{ background: ACCENT }} />
                <span
                  className="font-[ABC] text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: ACCENT }}
                >
                  Not sure which fits?
                </span>
              </div>
              <h3 className="font-[druk] text-[clamp(2rem,5vw,3.6rem)] leading-[0.95] tracking-tight text-white max-w-xl">
                A short call beats a long pricing page.
              </h3>
              <p className="font-[neue] text-white/60 mt-5 max-w-md leading-relaxed">
                Tell us where the brand is heading; we'll point at the tier that
                won't need rebuilding in three months.
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
                onClick={() => navigate("/services")}
                className="group flex items-center justify-between gap-4 px-6 py-4 rounded-full border border-white/15 transition-all hover:bg-white/5"
              >
                <span className="font-[ABC] text-[11px] tracking-[0.28em] uppercase text-white/85">
                  Add services à la carte
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

      {/* === CHECKOUT OVERLAY === */}
      <AnimatePresence>
        {selectedPackageOption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#FAF8F3]/95 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: 0.08,
                ease: [0.25, 0.1, 0.25, 1],
                duration: 0.5,
              }}
              className="text-center px-8"
            >
              <div className="relative w-14 h-14 mx-auto mb-6">
                <div
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: `${ACCENT}33` }}
                />
                <div
                  className="absolute inset-0 rounded-full border-t-2 animate-spin"
                  style={{ borderTopColor: ACCENT }}
                />
              </div>
              <div
                className="font-[ABC] text-[10px] tracking-[0.3em] uppercase mb-3"
                style={{ color: ACCENT }}
              >
                Initialising checkout
              </div>
              <h2 className="font-[druk] text-2xl sm:text-3xl tracking-tight text-[#141412]">
                Securing your{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {selectedPackageOption.name}
                </span>{" "}
                slot
              </h2>
              <p className="font-[neue] text-sm text-black/55 mt-2">
                One moment — preparing the order summary.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Packages;
