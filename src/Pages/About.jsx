import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Target,
  ArrowUpRight,
  Sparkles,
  Search,
  Verified,
  Award,
  Zap,
} from "lucide-react";
import SplitText from "../components/SplitText";
import aboutImage from "../assets/about-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = {
  amber: "#C9A227",
  amberLight: "#E8D5A3",
  amberBg: "rgba(201, 162, 39, 0.08)",
};

const values = [
  {
    icon: Target,
    title: "Curation",
    desc: "We carefully select and feature only high-quality businesses, ensuring every listing meets a premium standard of excellence.",
  },
  {
    icon: Search,
    title: "Discovery",
    desc: "A seamless experience designed to help users find the finest businesses quickly — without the noise of mass listings.",
  },
  {
    icon: Verified,
    title: "Trust",
    desc: "Verified profiles, refined presentation, and quality-first filtering create a platform users can rely on with confidence.",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Curated Listings" },
  { value: 10000, suffix: "+", label: "Monthly Discoveries" },
  { value: 20, suffix: "+", label: "Premium Categories" },
  { value: 95, suffix: "%", label: "Verified Quality Rate" },
];
const principles = [
  "Curated, not crowded",
  "Excellence over everything",
  "Trust through quality",
  "Experience defines value",
];

const marqueeItems = [
  "Curated Luxury",
  "Elite Listings",
  "Refined Discovery",
  "Premium Experiences",
  "Verified Excellence",
  "Timeless Quality",
];

const About = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const heroLineRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const storyRef = useRef(null);
  const storyTextRef = useRef(null);
  const imageRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const statsRef = useRef([]);
  const statsSectionRef = useRef(null);
  const quoteRef = useRef(null);
  const quoteSectionRef = useRef(null);
  const quoteDecorRef = useRef(null);
  const principlesRef = useRef([]);
  const valuesRef = useRef([]);
  const ctaRef = useRef(null);
  const marqueeRef = useRef(null);

  const [animatedStats, setAnimatedStats] = useState(stats.map((s) => 0));

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const dur = reduceMotion ? 0.25 : 0.8;
      const delay = reduceMotion ? 0 : 0.2;

      // Hero line expansion (fromTo so end state is explicit)
      if (heroLineRef.current) {
        gsap.fromTo(
          heroLineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: dur, ease: "power2.inOut" },
        );
      }

      // Hero entrance
      if (heroTitleRef.current) {
        gsap.fromTo(
          heroTitleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.3 : 1,
            delay,
            ease: "power3.out",
          },
        );
      }
      if (heroSubRef.current) {
        gsap.fromTo(
          heroSubRef.current,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.3 : 0.9,
            delay: reduceMotion ? 0 : 0.45,
            ease: "power3.out",
          },
        );
      }

      // Story section scroll reveal
      if (storyRef.current) {
        if (storyTextRef.current) {
          gsap.fromTo(
            storyTextRef.current,
            { y: 48, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: storyRef.current,
                start: "top 78%",
                once: true,
              },
            },
          );
        }
        if (imageRef.current) {
          gsap.fromTo(
            imageRef.current,
            { scale: 1.12, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: storyRef.current,
                start: "top 78%",
                once: true,
              },
            },
          );
        }
      }

      // Image parallax
      if (!reduceMotion && imageRef.current && imageWrapperRef.current) {
        gsap.to(imageRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapperRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      // Quote section — entrance + parallax on decorative mark
      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { y: 56, opacity: 0, filter: reduceMotion ? "none" : "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: reduceMotion ? 0.35 : 1.15,
            ease: "power4.out",
            scrollTrigger: {
              trigger: quoteRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
      if (!reduceMotion && quoteDecorRef.current && quoteSectionRef.current) {
        gsap.to(quoteDecorRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: quoteSectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      }

      // Principles stagger
      const principleEls = principlesRef.current.filter(Boolean);
      if (principleEls.length) {
        gsap.fromTo(
          principleEls,
          { x: -32, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: principleEls[0],
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      // Values stagger
      const valueEls = valuesRef.current.filter(Boolean);
      if (valueEls.length) {
        gsap.fromTo(
          valueEls,
          { y: 44, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: valueEls[0],
              start: "top 82%",
              once: true,
            },
          },
        );
      }

      // CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // Marquee (infinite loop)
      if (!reduceMotion && marqueeRef.current) {
        const track = marqueeRef.current.querySelector(".marquee-track");
        if (track) {
          gsap.set(track, { xPercent: 0 });
          gsap.to(track, {
            xPercent: -50,
            duration: 24,
            ease: "none",
            repeat: -1,
          });
        }
      }
    }, container);

    return () => ctx.revert();
  }, []);

  // Count-up for stats when section enters view
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setAnimatedStats(stats.map((s) => s.value));
      return;
    }

    const node = statsSectionRef.current;
    if (!node) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasAnimated) return;
        hasAnimated = true;
        stats.forEach((stat, i) => {
          let current = 0;
          const step = stat.value / 50;
          const timer = setInterval(() => {
            current += step;
            if (current >= stat.value) {
              current = stat.value;
              clearInterval(timer);
            }
            setAnimatedStats((prev) => {
              const next = [...prev];
              next[i] = Math.round(current);
              return next;
            });
          }, 28);
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white text-gray-900 overflow-x-hidden relative"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full opacity-20 blur-[90px]"
          style={{
            background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute top-1/2 -left-24 w-72 h-72 rounded-full opacity-15 blur-[80px]"
          style={{
            background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* Marquee */}
      <div
        ref={marqueeRef}
        className="relative py-5 border-y border-gray-100 overflow-hidden select-none"
      >
        <div className="marquee-track flex gap-16 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="font-[Albra] text-2xl md:text-4xl tracking-tight"
              style={{ color: "rgba(0,0,0,0.12)" }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-20 pb-24"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div
            ref={heroLineRef}
            className="hero-line h-0.5 w-32 md:w-48 mb-10 origin-left rounded-full"
            style={{
              background: `linear-gradient(90deg, ${ACCENT.amber}, #111)`,
            }}
          />
          <h1
            ref={heroTitleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-[Albra] tracking-tight leading-[0.95] max-w-4xl"
          >
            Crafting{" "}
            <span className="italic" style={{ color: ACCENT.amber }}>
              Premium
            </span>
            <br />
            Business Experiences
          </h1>
          <p
            ref={heroSubRef}
            className="mt-10 text-lg md:text-xl text-gray-600 font-[ABC] max-w-2xl leading-relaxed"
          >
            We are a luxury-first discovery platform built for those who value
            quality over clutter. Through careful curation, refined design, and
            trust-driven listings, we bring forward only the most exceptional
            businesses — setting a new standard for discovering luxury in the
            digital age.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsSectionRef}
        className="relative py-20 md:py-28 px-6 md:px-12 lg:px-20"
        style={{ backgroundColor: ACCENT.amberBg }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                ref={(el) => {
                  statsRef.current[i] = el;
                }}
                className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm p-6 md:p-8 text-center md:text-left hover:border-amber-200/60 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="font-[Albra] text-4xl md:text-5xl lg:text-6xl tracking-tight"
                  style={{ color: ACCENT.amber }}
                >
                  {animatedStats[i]}
                  {stat.suffix}
                </div>
                <div className="mt-2 font-[ABC] text-xs uppercase tracking-widest text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section
        ref={storyRef}
        className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div ref={storyTextRef} className="space-y-8">
            <span
              className="inline-block font-[ABC] text-xs uppercase tracking-[0.3em] px-3 py-1 rounded-full border"
              style={{
                color: ACCENT.amber,
                borderColor: `${ACCENT.amber}40`,
                backgroundColor: ACCENT.amberBg,
              }}
            >
              The Vision
            </span>
            <div
              className="text-3xl md:text-4xl lg:text-5xl font-[Albra] leading-[1.1] text-gray-900"
              role="heading"
              aria-level={2}
            >
              <SplitText
                scrollTrigger
                once
                type="words"
                stagger={0.04}
                animationType="fade"
              >
                We redefine access to luxury — creating a curated digital space
                where exceptional businesses are discovered effortlessly.
              </SplitText>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              We elevate how people discover premium businesses through
              thoughtful curation, refined presentation, and a seamless browsing
              experience. Every listing, every detail, and every interaction is
              designed to highlight quality and build trust.
            </p>
            <p className="text-gray-500 leading-relaxed">
              From emerging brands to established luxury names, we feature only
              those who meet a higher standard. The result is a platform where
              users don’t search endlessly — they discover the best,
              effortlessly.
            </p>
          </div>
          <div
            ref={imageWrapperRef}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <img
              ref={imageRef}
              src={aboutImage}
              alt="The Luxury Focus — Premium digital craftsmanship"
              className="absolute inset-0 w-full h-[120%] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: ACCENT.amber }}
              >
                <Award className="w-5 h-5" />
              </div>
              <span className="font-[ABC] text-xs uppercase tracking-widest text-gray-700">
                Award-Winning Studio
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quote — editorial full-bleed moment */}
      <section
        ref={quoteSectionRef}
        className="relative py-28 md:py-36 lg:py-44 px-6 md:px-12 lg:px-20 overflow-hidden bg-[#0a0a0a]"
        aria-labelledby="about-quote-heading"
      >
        {/* Ambient light */}
        <div
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[120%] w-[140%] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
          style={{
            background: `radial-gradient(ellipse at center, ${ACCENT.amber}33 0%, transparent 55%)`,
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full opacity-25 blur-[100px]"
          style={{
            background: `radial-gradient(circle at center, ${ACCENT.amberLight}40 0%, transparent 70%)`,
          }}
        />
        {/* Hairline grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div ref={quoteRef} className="relative md:pl-8 lg:pl-4">
            <span id="about-quote-heading" className="sr-only">
              Our philosophy
            </span>
            {/* Oversized typographic mark */}
            <div
              ref={quoteDecorRef}
              className="pointer-events-none absolute -left-2 md:-left-4 lg:-left-8 top-0 select-none font-[Albra] text-[clamp(8rem,22vw,20rem)] leading-[0.75] text-white/[0.04]"
              aria-hidden
            >
              “
            </div>
            <div className="relative border-l border-white/10 pl-8 md:pl-12 lg:pl-16">
              <p
                className="mb-8 font-[ABC] text-[0.65rem] uppercase tracking-[0.45em] md:text-xs"
                style={{ color: ACCENT.amberLight }}
              >
                Our Philosophy
              </p>
              <blockquote className="m-0 border-0 p-0">
                <div className="text-[clamp(1.75rem,4.5vw,3.75rem)] font-[Albra] font-normal leading-[1.08] tracking-[-0.02em] text-white">
                  <SplitText
                    scrollTrigger
                    once
                    type="words"
                    stagger={0.035}
                    animationType="fade"
                  >
                    {
                      "Excellence is not a destination—it's a continuous journey. We build for brands that never stop evolving."
                    }
                  </SplitText>
                </div>
              </blockquote>
              <footer className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-10 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-5">
                  <div
                    className="h-px w-12 shrink-0 md:w-16"
                    style={{
                      background: `linear-gradient(90deg, ${ACCENT.amber}, transparent)`,
                    }}
                  />
                  <div>
                    <cite className="not-italic font-[Albra] text-lg text-white/95 md:text-xl">
                      The Luxury Focus
                    </cite>
                    <span className="mt-1 block font-[ABC] text-[0.65rem] uppercase tracking-[0.35em] text-white/35">
                      Studio manifesto
                    </span>
                  </div>
                </div>
                <div
                  className="hidden h-px flex-1 max-w-xs self-end bg-gradient-to-r from-transparent to-white/20 sm:block lg:max-w-md"
                  aria-hidden
                />
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <span
            className="font-[ABC] text-xs uppercase tracking-[0.3em] block mb-4"
            style={{ color: ACCENT.amber }}
          >
            What We Believe
          </span>
          <h2 className="text-3xl md:text-5xl font-[Albra] text-gray-900 mb-14">
            Principles that guide every project.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {principles.map((p, i) => (
              <div
                key={p}
                ref={(el) => {
                  principlesRef.current[i] = el;
                }}
                className="group flex items-center gap-4 p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-amber-100 hover:shadow-lg hover:shadow-amber-50/50 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: ACCENT.amber }}
                >
                  <Zap className="w-5 h-5" />
                </div>
                <span className="font-[ABC] text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-gray-100"
        style={{ backgroundColor: ACCENT.amberBg }}
      >
        <div className="max-w-7xl mx-auto">
          <span
            className="font-[ABC] text-xs uppercase tracking-[0.3em] block mb-4"
            style={{ color: ACCENT.amber }}
          >
            Our Expertise
          </span>
          <h2 className="text-3xl md:text-5xl font-[Albra] text-gray-900 mb-14">
            Strategy. Design. Development.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((item, i) => (
              <div
                key={item.title}
                ref={(el) => {
                  valuesRef.current[i] = el;
                }}
                className="group p-8 rounded-2xl border border-gray-200/80 bg-white shadow-sm hover:border-amber-200/80 hover:shadow-xl hover:shadow-amber-50/30 transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 transition-all duration-300 group-hover:scale-105"
                  style={{ backgroundColor: ACCENT.amber }}
                >
                  <item.icon size={26} />
                </div>
                <h3 className="text-xl font-[Albra] text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white pointer-events-none" />
        <div ref={ctaRef} className="max-w-4xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
            style={{
              backgroundColor: ACCENT.amberBg,
              borderColor: `${ACCENT.amber}30`,
              color: ACCENT.amber,
            }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-[ABC] text-xs uppercase tracking-widest">
              Start Your Journey
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-[Albra] text-gray-900 mb-6">
            Let's create something new.
          </h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Ready to elevate your brand's digital presence?
          </p>
          <Link
            to="/packages"
            className="inline-flex items-center gap-3 px-10 py-5 text-white font-[ABC] text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:opacity-95 hover:scale-[1.02] hover:shadow-xl"
            style={{ backgroundColor: ACCENT.amber }}
          >
            Explore Packages <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
