import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#C9A227";

const FAQ_ITEMS = [
  {
    id: "what",
    q: "What is The Luxury Focus?",
    a: "A curated directory and platform for premium brands and experiences—discover listings, editorial stories, and spaces that meet a high bar for presentation and trust.",
  },
  {
    id: "list",
    q: "How do I list my business?",
    a: "Choose a package that fits your needs, complete checkout, then finish onboarding from your dashboard. You can upload your logo, gallery, contact details, and category information in one guided flow.",
  },
  {
    id: "packages",
    q: "What is the difference between packages?",
    a: "Basic is ideal for a lean presence; Standard adds richer media and social links; Premium unlocks the full toolkit—more images and videos, analytics, priority support, and optional visibility in our home page partner marquee.",
  },
  {
    id: "premium-logo",
    q: "How does the Premium home page logo feature work?",
    a: "Premium subscribers can opt in from the dashboard so their logo appears in the scrolling partner section on the home page, linking visitors straight to their public listing.",
  },
  {
    id: "after",
    q: "Can I update my listing later?",
    a: "Yes. Sign in and open your dashboard anytime to edit copy, media, and contact details—your changes are reflected on your public store profile.",
  },
];

function FaqRow({ item, isOpen, onToggle, index }) {
  return (
    <div
      className="faq-item  group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm transition-colors duration-500 hover:border-white/[0.12] hover:bg-white/[0.05] data-[open=true]:border-amber-500/25 data-[open=true]:bg-white/[0.06]"
      data-open={isOpen}
    >
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-5"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        id={`faq-trigger-${item.id}`}
      >
        <span className="flex items-start gap-4">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 font-[ABC] text-[10px] uppercase tracking-widest text-white/50 transition-colors duration-300 group-data-[open=true]:border-amber-500/40 group-data-[open=true]:text-amber-200/90"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-[Albra] text-lg leading-snug tracking-tight text-white sm:text-xl">
            {item.q}
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70"
          aria-hidden
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1.75} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id={`faq-panel-${item.id}`}
            role="region"
            aria-labelledby={`faq-trigger-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.28, delay: 0.06 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                opacity: { duration: 0.15 },
                height: { duration: 0.36, ease: [0.4, 0, 0.2, 1] },
              },
            }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <motion.div
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="px-5 pb-6 pt-4 sm:px-6 sm:pb-7 sm:pl-[4.5rem]"
            >
              <p className="font-[ABC] text-sm leading-relaxed text-white/65 sm:text-[15px]">
                {item.a}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const HomeFAQ = () => {
  const rootRef = useRef(null);
  const glowRef = useRef(null);
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      gsap.set(".faq-kicker", { opacity: 0, y: 16 });
      gsap.set(".faq-title", { opacity: 0, y: 28 });
      gsap.set(".faq-sub", { opacity: 0, y: 20 });
      gsap.set(".faq-item", { opacity: 0, y: 36 });

      gsap.fromTo(
        ".faq-kicker",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".faq-title",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".faq-sub",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".faq-item",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        },
      );

      const glow = glowRef.current;
      if (glow) {
        gsap.to(glow, {
          opacity: 0.55,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="home-faq-section relative overflow-hidden bg-[#0a0a0a] py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${ACCENT}55 50%, transparent 100%)`,
        }}
      />

      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-1/4 top-1/3 h-[420px] w-[70%] rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(201,162,39,0.22) 0%, transparent 70%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full md:w-4/5">
          <div className="text-center">
            <p
              className="faq-kicker font-[ABC] text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{ color: ACCENT }}
            >
              Answers
            </p>
            <h2 className="faq-title mt-4 font-[Albra] text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
              Frequently asked
            </h2>
            <p className="faq-sub mx-auto mt-4 max-w-md font-[ABC] text-sm leading-relaxed text-white/55 sm:text-base">
              Everything you need to know about joining the directory, packages,
              and how listings work.
            </p>
          </div>

          <div className="mt-14 space-y-10 sm:mt-16 sm:space-y-3.5">
            {FAQ_ITEMS.map((item, index) => (
              <FaqRow
                key={item.id}
                item={item}
                index={index}
                isOpen={openId === item.id}
                onToggle={toggle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
