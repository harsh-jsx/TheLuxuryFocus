import React, { useRef, useState, useEffect } from "react";
import {
  Check,
  X,
  ArrowRight,
  Image,
  Video,
  Link as LinkIcon,
  MessageCircle,
  BarChart3,
  Clock,
  Users,
  Mic,
  Mail,
  Calendar,
  Sparkles,
  Star,
  Zap,
  Shield,
  Home,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import SplitText from "../components/SplitText";
import { useSelectedPackageOptionStore } from "../stores/packageStore";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const PACKAGES = [
  {
    id: 1,
    name: "Basic",
    price: "200",
    currency: "₹",
    period: "/listing",
    description: "Essential presence for emerging creators.",
    icon: Star,
    features: [
      { name: "2-3 Basic Images", included: true, icon: Image },
      { name: "Website Link", included: true, icon: LinkIcon },
      { name: "Contact & Email", included: true, icon: Mail },
      { name: "Video Uploads", included: false, icon: Video },
      { name: "Social Media", included: false, icon: Users },
    ],
  },
  {
    id: 2,
    name: "Standard",
    price: "500",
    currency: "₹",
    period: "/listing",
    tag: "Most Popular",
    description: "Enhanced visibility with multimedia integration.",
    icon: Zap,
    features: [
      { name: "5 Images", included: true, icon: Image },
      { name: "2 Videos", included: true, icon: Video },
      { name: "YouTube & Instagram", included: true, icon: LinkIcon },
      { name: "Full Social Integration", included: true, icon: Users },
      { name: "Analytics Dashboard", included: false, icon: BarChart3 },
    ],
  },
  {
    id: 3,
    name: "Premium",
    price: "2000",
    currency: "₹",
    period: "/listing",
    tag: "Enterprise",
    description: "Maximum impact with priority concierge support.",
    icon: Shield,
    features: [
      { name: "Up to 25 Pictures", included: true, icon: Image },
      { name: "10 Videos", included: true, icon: Video },
      { name: "All Social Links", included: true, icon: LinkIcon },
      { name: "Priority Support", included: true, icon: Clock },
      { name: "24/7 WhatsApp Bot", included: true, icon: MessageCircle },
      { name: "Reviews & Analytics", included: true, icon: BarChart3 },
      { name: "Your logo in home page client marquee", included: true, icon: Home },
    ],
  },
];

const ADDONS = [
  { title: "Social Management", price: "Hourly", icon: Users },
  { title: "Content Creation", price: "Hourly", icon: Video },
  { title: "Marketing", price: "Hourly", icon: BarChart3 },
  { title: "Telecalling", price: "Hourly", icon: MessageCircle },
  { title: "Email Marketing", price: "Hourly", icon: Mail },
  { title: "SMS Marketing", price: "Hourly", icon: MessageCircle },
  { title: "Event Anchoring", price: "₹2500/day", icon: Mic },
  { title: "Event Management", price: "Custom", icon: Calendar },
];

const TICKER_ITEMS = [
  "No Hidden Fees",
  "Cancel Anytime",
  "Priority Support",
  "100% Transparent",
  "Trusted by 500+ Creators",
  "Instant Setup",
  "No Hidden Fees",
  "Cancel Anytime",
  "Priority Support",
  "100% Transparent",
  "Trusted by 500+ Creators",
  "Instant Setup",
];

// Mouse-tracking card tilt
const PricingCard = ({ pkg, index, selected, onSelect, cardRef }) => {
  const ref = useRef(null);
  const PkgIcon = pkg.icon;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;
    ref.current.style.transform = `perspective(800px) rotateY(${xPercent * 2}deg) rotateX(${-yPercent * 2}deg)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform =
      "perspective(800px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      ref={(el) => {
        ref.current = el;
        cardRef(el);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col h-full transition-[transform,box-shadow] duration-500 will-change-transform
        bg-card rounded-[28px] md:rounded-[32px] shadow-featured shine-sweep overflow-hidden border-2 border-gold/20`}
      style={{ opacity: 0 }}
    >
      <div className="h-1 w-full gold-gradient" />

      <div className="p-6 sm:p-8 md:p-10 flex flex-col flex-1 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center gold-gradient">
                <PkgIcon className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                {pkg.name}
              </span>
            </div>
            {pkg.tag && (
              <span className="px-3 py-1 rounded-full bg-gold/10 text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/20">
                {pkg.tag}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-0.5 mb-3">
            <span className="text-base font-medium text-muted-foreground">
              {pkg.currency}
            </span>
            <span className="text-5xl sm:text-6xl font-display font-bold tracking-tighter tabular-nums">
              {pkg.price}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              {pkg.period}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {pkg.description}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* Features */}
        <ul className="space-y-3 mb-auto">
          {pkg.features.map((f, j) => {
            const Icon = f.icon;
            return (
              <li
                key={j}
                className="feature-item flex items-center gap-3 text-sm"
                style={{ opacity: 0 }}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    f.included ? "bg-gold/10" : "bg-muted"
                  }`}
                >
                  {f.included ? (
                    <Check className="w-3.5 h-3.5 text-gold" strokeWidth={3} />
                  ) : (
                    <X
                      className="w-3 h-3 text-muted-foreground/30"
                      strokeWidth={2}
                    />
                  )}
                </span>
                <span className="flex items-center gap-2">
                  <Icon
                    className={`w-3.5 h-3.5 ${f.included ? "text-foreground/50" : "text-muted-foreground/20"}`}
                  />
                  <span
                    className={
                      f.included
                        ? "text-foreground/80"
                        : "text-muted-foreground/35 line-through"
                    }
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
          onClick={onSelect}
          disabled={selected}
          className={`group/btn relative w-full mt-8 py-4 rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.97] will-change-transform ${
            selected ? "cursor-wait opacity-70" : ""
          } gold-gradient shadow-lg shadow-gold/20`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-foreground">
            {selected ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5" />
              </>
            )}
          </span>
          {!selected && (
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
          )}
        </button>
      </div>
    </div>
  );
};

const Packages = () => {
  const navigate = useNavigate();
  const selectedPackageOption = useSelectedPackageOptionStore(
    (s) => s.selectedPackageOption,
  );
  const setSelectedPackageOption = useSelectedPackageOptionStore(
    (s) => s.setSelectedPackageOption,
  );

  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const pricingSectionRef = useRef(null);
  const cardRefs = useRef([]);
  const addonsSectionRef = useRef(null);
  const addonRefs = useRef([]);
  const tickerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const selectPackage = (pkg) => {
    setSelectedPackageOption({
      id: pkg.id,
      name: pkg.name,
      price: `₹${pkg.price}`,
      description: pkg.description,
      tag: pkg.tag,
    });
    setTimeout(() => navigate("/checkout"), 700);
  };

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      if (hero) {
        const line = hero.querySelector(".hero-line");
        const badge = hero.querySelector(".hero-badge");
        const stats = hero.querySelectorAll(".hero-stat");
        if (line)
          gsap.fromTo(
            line,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.6 },
          );
        if (badge)
          gsap.fromTo(
            badge,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 },
          );
        if (stats.length) {
          gsap.set(stats, { opacity: 0, y: 20 });
          gsap.to(stats, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.8,
          });
        }
      }

      const section = pricingSectionRef.current;
      const cards = cardRefs.current.filter(Boolean);
      if (section && cards.length) {
        gsap.set(cards, { y: 80, opacity: 0 });
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
        });

        cards.forEach((card, i) => {
          const items = card?.querySelectorAll(".feature-item");
          if (items?.length) {
            gsap.set(items, { x: -12, opacity: 0 });
            gsap.to(items, {
              x: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.04,
              delay: 0.4 + i * 0.15,
              ease: "power2.out",
              scrollTrigger: { trigger: section, start: "top 85%", once: true },
            });
          }
        });
      }

      const addonsSection = addonsSectionRef.current;
      const addonEls = addonRefs.current.filter(Boolean);
      if (addonsSection && addonEls.length) {
        gsap.set(addonEls, { y: 30, opacity: 0, scale: 0.95 });
        gsap.to(addonEls, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: addonsSection,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Ticker parallax
      if (tickerRef.current) {
        gsap.fromTo(
          tickerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: tickerRef.current,
              start: "top 90%",
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
      className="min-h-screen bg-background text-foreground font-body relative overflow-x-hidden"
    >
      {/* === RICH BACKGROUND === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40" />

        {/* Floating orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-gold/4 blur-[100px] animate-orb" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gold/3 blur-[120px] animate-orb-delayed" />
        <div className="absolute bottom-[-5%] right-[20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-foreground/2 blur-[80px] animate-orb-slow" />

        {/* Subtle radial gradient center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(45 100% 47% / 0.03) 0%, transparent 70%)",
          }}
        />

        {/* Mouse-following spotlight (subtle) */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full transition-all duration-[2s] ease-out"
          style={{
            left: mousePos.x - 300,
            top: mousePos.y - 300,
            background:
              "radial-gradient(circle, hsl(45 100% 47% / 0.02) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* === HERO === */}
      <header
        ref={heroRef}
        className="relative pt-16 sm:pt-20 md:pt-28 pb-12 sm:pb-16 md:pb-24 px-5 sm:px-6 max-w-7xl mx-auto"
      >
        <div className="relative">
          {/* Badge */}
          <div
            className="hero-badge inline-flex items-center gap-2.5 mb-6 sm:mb-8 px-4 py-2 rounded-full border border-border bg-card/80 backdrop-blur-sm"
            style={{ opacity: 0 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              Service Tiers / 2024
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-6 sm:mb-8 text-balance">
            <SplitText delay={0.1}>Plans that</SplitText>
            <span className="relative inline-block">
              <SplitText
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-6 sm:mb-8 text-balance"
                delay={0.3}
              >
                scale
              </SplitText>
              <span
                className="hero-line absolute -bottom-1 left-0 w-full h-[3px] gold-gradient origin-left rounded-full"
                style={{ transform: "scaleX(0)" }}
              />
            </span>{" "}
            <SplitText className="text-muted-foreground" delay={0.5}>
              with you.
            </SplitText>
          </h1>

          {/* Subtext */}
          <p className="max-w-md sm:max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed font-body mb-10 sm:mb-14">
            Transparent scaling. No hidden fees. Choose a foundation and expand
            as your audience grows.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 sm:gap-10">
            {[
              { value: "500+", label: "Active Creators" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Support" },
            ].map((stat, i) => (
              <div key={i} className="hero-stat" style={{ opacity: 0 }}>
                <div className="text-2xl sm:text-3xl font-display font-bold tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* === TRUST TICKER === */}
      <div
        ref={tickerRef}
        className="relative py-4 sm:py-5 border-y border-border bg-surface/50 backdrop-blur-sm overflow-hidden"
        style={{ opacity: 0 }}
      >
        <div className="flex animate-ticker whitespace-nowrap">
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 mx-4 sm:mx-6 text-xs uppercase tracking-widest text-muted-foreground/60 font-medium"
            >
              <Sparkles className="w-3 h-3 text-gold/50" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* === PRICING GRID === */}
      <main className="max-w-7xl mx-auto px-5 sm:px-6 pb-16 sm:pb-20">
        <section ref={pricingSectionRef} className="pt-16 sm:pt-20 md:pt-28">
          {/* Section header */}
          <div className="flex items-baseline gap-3 mb-8 sm:mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
              Compare plans
            </span>
            <div className="flex-1 h-px bg-border" />
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
              3 Tiers Available
            </span>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {PACKAGES.map((pkg, i) => (
              <PricingCard
                key={pkg.id}
                pkg={pkg}
                index={i}
                selected={selectedPackageOption?.id === pkg.id}
                onSelect={() => selectPackage(pkg)}
                cardRef={(el) => (cardRefs.current[i] = el)}
              />
            ))}
          </div>

          {/* Guarantee badge */}
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
            <Shield className="w-4 h-4 text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground/50 font-medium">
              All plans include a 7-day satisfaction guarantee
            </span>
          </div>
        </section>

        {/* === ADD-ONS === */}
        <section ref={addonsSectionRef} className="mt-20 sm:mt-28 md:mt-36">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 border-b border-border pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold block mb-2">
                Add-ons
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-semibold tracking-tight">
                Ancillary Services
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                On-demand support for specific campaign needs.
              </p>
            </div>
            <span className="hidden md:block text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">
              Available Hourly or Flat-Rate
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {ADDONS.map((addon, i) => {
              const Icon = addon.icon;
              return (
                <div
                  key={i}
                  ref={(el) => (addonRefs.current[i] = el)}
                  className="group p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-standard card-glow hover:shadow-hover hover:border-gold/15 hover:-translate-y-1 transition-all duration-400 cursor-pointer"
                  style={{ opacity: 0 }}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-gold/10 transition-colors duration-300">
                    <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-muted-foreground group-hover:text-gold transition-colors duration-300" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium font-display mb-0.5">
                    {addon.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-muted-foreground tabular-nums">
                    {addon.price}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* === BOTTOM CTA === */}
        <section className="mt-20 sm:mt-28 md:mt-36 mb-8 sm:mb-12">
          <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-foreground px-6 sm:px-12 md:px-20 py-12 sm:py-16 md:py-20 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-gold/8 blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-gold/5 blur-[60px]" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-background mb-3 sm:mb-4 text-balance">
                Not sure which plan fits?
              </h2>
              <p className="text-background/50 text-sm sm:text-base max-w-md mx-auto mb-6 sm:mb-8">
                Talk to our team for a personalized recommendation based on your
                goals.
              </p>
              <button className="gold-gradient px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] text-foreground transition-all hover:shadow-lg hover:shadow-gold/20 active:scale-[0.97]">
                Get in Touch
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* === FOOTER === */}
      <footer className="border-t border-border py-8 sm:py-10 px-5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground/40">
            © 2024 · All rights reserved
          </span>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer">
              Terms
            </span>
            <span className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer">
              Privacy
            </span>
            <span className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-pointer">
              Support
            </span>
          </div>
        </div>
      </footer>

      {/* === CHECKOUT OVERLAY === */}
      <AnimatePresence>
        {selectedPackageOption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
                duration: 0.5,
              }}
              className="text-center"
            >
              <div className="w-14 h-14 border-2 border-border border-t-gold rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-xl sm:text-2xl font-display font-semibold tracking-tight">
                Initializing Checkout
              </h2>
              <p className="text-sm text-muted-foreground mt-2 tabular-nums">
                Securing your{" "}
                <span className="gold-text font-semibold">
                  {selectedPackageOption.name}
                </span>{" "}
                slot...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Packages;
