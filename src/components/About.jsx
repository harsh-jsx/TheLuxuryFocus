import React, { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aboutImage from "../assets/about-hero.jpg";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = {
  amber: "#C9A227",
  amberLight: "#E8D5A3",
  amberBg: "rgba(201, 162, 39, 0.10)",
};

const features = [
  { title: "Strategy", desc: "Brand positioning and digital roadmap." },
  { title: "Design", desc: "Visual identity and user experience." },
  { title: "Development", desc: "Robust technical implementation." },
];

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const lineRef = useRef(null);
  const featuresRef = useRef([]);
  const subtitleRef = useRef(null);
  const headingRef = useRef(null);
  const labelRef = useRef(null);
  const ctaRef = useRef(null);
  const blobARef = useRef(null);
  const blobBRef = useRef(null);
  const gridRef = useRef(null);
  const shimmerRef = useRef(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const ctx = gsap.context(() => {
        // Prepare word-by-word spans once (but keep the same layout)
        let wordEls = [];
        let originalHtml = null;
        if (textRef.current) {
          originalHtml = textRef.current.innerHTML;
          const original = textRef.current.innerText.trim();
          const words = original.split(/\s+/);
          textRef.current.innerHTML = "";

          words.forEach((word) => {
            const wrapper = document.createElement("span");
            wrapper.style.display = "inline-block";
            wrapper.style.overflow = "hidden";
            wrapper.style.verticalAlign = "top";

            const inner = document.createElement("span");
            inner.innerText = word;
            inner.style.display = "inline-block";
            inner.className = "word-reveal";
            wrapper.appendChild(inner);

            textRef.current.appendChild(wrapper);
            textRef.current.appendChild(document.createTextNode(" "));
          });

          wordEls = Array.from(
            textRef.current.querySelectorAll(".word-reveal"),
          );
          gsap.set(wordEls, { opacity: 0, yPercent: 110, filter: "blur(6px)" });
        }

        // Background (subtle luxury motion)
        gsap.set([blobARef.current, blobBRef.current], {
          opacity: 0,
          scale: reduceMotion ? 1 : 0.9,
        });
        if (gridRef.current) gsap.set(gridRef.current, { opacity: 0 });

        // Initial states (consistent animation start)
        gsap.set(labelRef.current, { opacity: 0, y: reduceMotion ? 0 : 10 });
        gsap.set(headingRef.current, { opacity: 0, y: reduceMotion ? 0 : 24 });
        gsap.set(subtitleRef.current, {
          opacity: 0,
          y: reduceMotion ? 0 : 16,
        });
        gsap.set(ctaRef.current, { opacity: 0, y: reduceMotion ? 0 : 12 });
        gsap.set(featuresRef.current.filter(Boolean), {
          opacity: 0,
          y: reduceMotion ? 0 : 18,
        });
        gsap.set(lineRef.current, { width: 0 });

        if (imageContainerRef.current) {
          gsap.set(imageContainerRef.current, {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
          });
        }
        if (imageRef.current) {
          gsap.set(imageRef.current, {
            scale: reduceMotion ? 1 : 1.25,
            y: reduceMotion ? 0 : 18,
          });
        }
        if (shimmerRef.current) {
          gsap.set(shimmerRef.current, { xPercent: -140, opacity: 0 });
        }

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 20%",
            scrub: reduceMotion ? false : 0.8,
          },
        });

        tl.to([blobARef.current, blobBRef.current], {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
        })
          .to(gridRef.current, { opacity: 1, duration: 0.6 }, 0)
          .to(
            lineRef.current,
            { width: "4rem", duration: 0.35, ease: "power2.inOut" },
            0.05,
          )
          .to(labelRef.current, { opacity: 1, y: 0, duration: 0.35 }, 0.12)
          .to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.18)
          .to(
            imageContainerRef.current,
            {
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              duration: 0.7,
              ease: "power3.inOut",
            },
            0.18,
          )
          .to(
            imageRef.current,
            { scale: 1, y: 0, duration: 0.9, ease: "power2.out" },
            0.22,
          );

        if (wordEls.length) {
          tl.to(
            wordEls,
            {
              opacity: 1,
              yPercent: 0,
              filter: "blur(0px)",
              duration: reduceMotion ? 0.01 : 0.55,
              stagger: reduceMotion ? 0 : 0.025,
              ease: "power2.out",
            },
            0.32,
          );
        }

        tl.to(
          subtitleRef.current,
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          0.62,
        )
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.7)
          .to(
            featuresRef.current.filter(Boolean),
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: reduceMotion ? 0 : 0.12,
            },
            0.72,
          );

        // Subtle, premium parallax on the image while scrolling through section
        if (!reduceMotion && imageRef.current) {
          gsap.to(imageRef.current, {
            y: -14,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }

        // Image shimmer sweep
        if (!reduceMotion && shimmerRef.current) {
          gsap.to(shimmerRef.current, {
            xPercent: 140,
            opacity: 0.7,
            duration: 2.4,
            ease: "power2.inOut",
            repeat: -1,
            repeatDelay: 1.6,
          });
        }

        // Background slow float
        if (!reduceMotion) {
          if (blobARef.current) {
            gsap.to(blobARef.current, {
              x: 18,
              y: -22,
              duration: 7,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }
          if (blobBRef.current) {
            gsap.to(blobBRef.current, {
              x: -14,
              y: 18,
              duration: 8.5,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }
        }

        return () => {
          // restore original html to avoid accumulating spans across mounts
          if (textRef.current && originalHtml != null) {
            textRef.current.innerHTML = originalHtml;
          }
        };
      }, root);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-background py-32 px-6 md:px-12 lg:px-20"
    >
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={blobARef}
          className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-[110px] opacity-0"
          style={{
            background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 70%)`,
          }}
        />
        <div
          ref={blobBRef}
          className="absolute bottom-[-140px] left-[-160px] w-[520px] h-[520px] rounded-full blur-[120px] opacity-0"
          style={{
            background: `radial-gradient(circle, ${ACCENT.amberLight} 0%, transparent 70%)`,
          }}
        />
        <div
          ref={gridRef}
          className="absolute inset-0 opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(circle at 50% 35%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 35%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 line-accent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Text */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  ref={lineRef}
                  className="h-px bg-primary"
                  style={{ width: 0 }}
                />
                <span ref={labelRef} className="section-label text-white">
                  The Vision
                </span>
              </div>

              <h2
                ref={headingRef}
                className="text-4xl md:text-5xl text-white lg:text-6xl font-medium leading-[1.1] tracking-tight"
              >
                Crafting <span className="text-white">Premium</span> Digital
                Experiences
              </h2>
            </div>

            <p
              ref={textRef}
              className="text-lg md:text-xl leading-relaxed text-white"
            >
              We are a digital innovation studio crafting premium experiences
              for ambitious brands. We blend strategy, design, and technology to
              define the new standard of luxury in the digital age.
            </p>

            <p
              ref={subtitleRef}
              className="text-white leading-relaxed max-w-lg"
              style={{ opacity: 0 }}
            >
              Elevating brand narratives through meticulous design, immersive
              interactions, and robust engineering. We don't just build websites
              — we create digital destinations.
            </p>
            <Link
              to="/about"
              ref={ctaRef}
              className="inline-flex items-center gap-2 font-[ABC] text-xs uppercase tracking-widest text-[#D0B887] hover:text-[#E4E0D9] transition-colors mt-6"
            >
              Learn more about us →
            </Link>
          </div>

          {/* Right: Image + Features */}
          <div className="space-y-10">
            <div
              ref={imageContainerRef}
              className="relative aspect-square overflow-hidden"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
              }}
            >
              <img
                ref={imageRef}
                src={aboutImage}
                alt="Modern architectural design showcasing premium craftsmanship"
                className="h-full w-full object-cover"
                style={{ transform: "scale(1.3)" }}
              />
              <div className="absolute inset-0 image-overlay" />
              <div
                ref={shimmerRef}
                className="absolute inset-0 opacity-0"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.08) 55%, transparent 100%)",
                  mixBlendMode: "soft-light",
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    featuresRef.current[i] = el;
                  }}
                  className="feature-card"
                  style={{ opacity: 0 }}
                >
                  <h3 className="text-sm font-semibold font-[neue] uppercase tracking-widest text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
