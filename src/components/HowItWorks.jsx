import React, { useRef } from "react";
import { MapPinned, MessagesSquare, Store } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "./SplitText";

gsap.registerPlugin(ScrollTrigger);

const stepsData = [
  {
    icon: Store,
    code: "A",
    title: "List your space",
    desc: "Publish a profile that shows what you offer, where you are, and why people should visit.",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    glow: "rgba(56, 189, 248, 0.35)",
  },
  {
    icon: MapPinned,
    code: "B",
    title: "People explore",
    desc: "Guests browse, save favorites, and check in—discovery stays lightweight and visual.",
    gradient: "from-violet-400 via-fuchsia-500 to-rose-500",
    glow: "rgba(192, 132, 252, 0.35)",
  },
  {
    icon: MessagesSquare,
    code: "C",
    title: "Trust compounds",
    desc: "Reviews and conversations around listings help the whole network feel credible.",
    gradient: "from-amber-300 via-orange-400 to-red-500",
    glow: "rgba(251, 191, 36, 0.3)",
  },
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  const railRef = useRef(null);
  const pathRef = useRef(null);
  const orbARef = useRef(null);
  const orbBRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      if (path) {
        const len = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 75%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        });
      }

      gsap.fromTo(
        ".hiw-sub",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 78%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".hiw-step",
        {
          y: 72,
          opacity: 0,
          rotateX: 14,
          transformOrigin: "50% 0%",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.05,
          stagger: 0.22,
          ease: "power4.out",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 72%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".hiw-badge",
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 70%",
            once: true,
          },
        },
      );

      gsap.to(orbARef.current, {
        y: -18,
        x: 12,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orbBRef.current, {
        y: 22,
        x: -16,
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hiw-shimmer", {
        backgroundPosition: "200% 50%",
        duration: 8,
        repeat: -1,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-[#07080d] py-24 md:py-32"
    >
      <div
        ref={orbARef}
        className="pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[100px]"
        aria-hidden="true"
      />
      <div
        ref={orbBRef}
        className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-fuchsia-500/15 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="hiw-shimmer pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[ABC] text-[11px] uppercase tracking-[0.35em] text-white/45">
            The flow
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-4 font-[Albra] text-4xl tracking-tight text-white md:text-5xl md:leading-[1.08]"
          >
            <SplitText animationType="spring" stagger={0.06}>
              Three beats. One living map.
            </SplitText>
          </h2>
          <p className="hiw-sub mt-6 text-base leading-relaxed text-white/60 md:text-lg">
            Businesses show up, people wander, and the crowd turns visits into
            signal—without extra noise.
          </p>
        </div>

        <div
          ref={railRef}
          className="relative mx-auto mt-20 max-w-5xl [perspective:1200px]"
        >
          {/* Desktop connector */}
          <div
            className="pointer-events-none absolute left-[8%] right-[8%] top-[52px] z-0 hidden md:block"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 900 120"
              className="h-[100px] w-full"
              fill="none"
            >
              <path
                ref={pathRef}
                d="M 60 60 C 200 20, 300 100, 450 60 S 700 20, 840 60"
                stroke="url(#hiw-line)"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <defs>
                <linearGradient
                  id="hiw-line"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <ol className="relative z-10 grid list-none grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {stepsData.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.code} className="hiw-step">
                  <div
                    className="group relative flex h-full flex-col rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-md transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]"
                    style={{ transformStyle: "preserve-3d" }}
                    onMouseMove={(e) => {
                      const el = e.currentTarget;
                      const r = el.getBoundingClientRect();
                      el.style.setProperty(
                        "--mx",
                        `${e.clientX - r.left}px`,
                      );
                      el.style.setProperty(
                        "--my",
                        `${e.clientY - r.top}px`,
                      );
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.removeProperty("--mx");
                      el.style.removeProperty("--my");
                    }}
                  >
                    <div
                      className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(600px circle at var(--mx,50%) var(--my,50%), ${step.glow}, transparent 45%)`,
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <span className="hiw-badge inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-3 font-[ABC] text-xs tracking-widest text-white/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div
                        className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg ring-1 ring-white/20`}
                      >
                        <Icon className="h-7 w-7 text-white drop-shadow-md" />
                      </div>
                    </div>

                    <h3 className="relative mt-8 font-[Albra] text-2xl tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="relative mt-3 flex-1 text-sm leading-relaxed text-white/55">
                      {step.desc}
                    </p>

                    <div className="relative mt-8 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                      <span
                        className="h-px w-8 bg-gradient-to-r from-transparent to-white/30"
                        aria-hidden="true"
                      />
                      Phase {step.code}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
