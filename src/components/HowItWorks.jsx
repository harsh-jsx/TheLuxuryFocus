import React, { useRef } from "react";
import { ArrowRight, Bell, Coffee, Lightbulb } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stepsData = [
  {
    icon: Lightbulb,
    number: "01",
    title: "Businesses",
    desc: "Start publishing listings to showcase your details and offerings.",
  },
  {
    icon: Coffee,
    number: "02",
    title: "Customers",
    desc: "Discover interesting places by exploring, saving, and checking in.",
  },
  {
    icon: Bell,
    number: "03",
    title: "Feedback",
    desc: "Visitors discuss listings, share experiences, and help build trust.",
  },
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current.filter(Boolean), {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="bg-white py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[Albra] text-4xl md:text-5xl tracking-tight text-black">
            How it Works?
          </h2>
          <p className="mt-4 text-black/70">
            We made it possible to join our community with interesting business ideas, including startups.
          </p>
        </div>

        <div className="relative mx-auto mt-16 md:mt-20">
          {/* Connectors (md+) */}
          <div className="pointer-events-none absolute inset-x-0 -top-6 hidden md:block">
            <svg
              viewBox="0 0 1000 260"
              className="mx-auto h-[220px] w-full max-w-6xl"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M120 210 C 220 70, 330 70, 430 210"
                stroke="rgb(37 99 235)"
                strokeOpacity="0.9"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M570 210 C 670 70, 780 70, 880 210"
                stroke="rgb(37 99 235)"
                strokeOpacity="0.9"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {stepsData.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    cardsRef.current[i] = el;
                  }}
                  className="relative rounded-3xl bg-white p-8 text-left shadow-[0_18px_45px_rgba(15,23,42,0.10)] ring-1 ring-black/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-[0_10px_25px_rgba(15,23,42,0.10)] ring-1 ring-black/5">
                      <Icon className="h-7 w-7 text-blue-600" />
                    </div>
                  </div>

                  <div className="mt-7 flex items-baseline gap-3">
                    <span className="font-[ABC] text-xs tracking-widest text-black/40">
                      {step.number}
                    </span>
                    <h3 className="font-[Albra] text-2xl tracking-tight text-black">
                      {step.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-black/65">
                    {step.desc}
                  </p>

                  <div className="mt-8">
                    <button
                      type="button"
                      aria-label={`Go to step ${step.number}`}
                      className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white shadow-sm transition hover:border-black/20 hover:shadow-md"
                    >
                      <ArrowRight className="h-5 w-5 text-black/60 transition group-hover:translate-x-0.5 group-hover:text-black" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;