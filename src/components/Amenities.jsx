import React, { useRef, useCallback } from "react";
import { Baby, Calendar, Martini, Accessibility, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#C9A227";
const ACCENT_LIGHT = "#E8D5A3";

const amenitiesData = [
    {
        id: 1,
        title: "Family Friendly",
        desc: "Safe, fun environments designed for the whole family to enjoy together.",
        icon: Baby,
        image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1925&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Reservations",
        desc: "Book ahead and skip the wait — your table is always ready.",
        icon: Calendar,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Alcohol",
        desc: "Curated drinks menus, cocktail bars, and rare vintage selections.",
        icon: Martini,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Accessibility",
        desc: "Inclusive spaces built for everyone — comfort without compromise.",
        icon: Accessibility,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
    },
];

function AmenityCard({ item, onCardRef }) {
    const Icon = item.icon;
    const imageRef = useRef(null);
    const innerRef = useRef(null);
    const glowRef = useRef(null);

    const handleMouseMove = useCallback((e) => {
        const el = innerRef.current;
        const img = imageRef.current;
        const glow = glowRef.current;
        if (!el || !img) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(img, { x: x * 14, y: y * 10, duration: 0.6, ease: "power2.out" });
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
        if (imageRef.current) gsap.to(imageRef.current, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
        if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
    }, []);

    return (
        <div
            ref={(el) => onCardRef(el)}
            className="group relative cursor-pointer h-full"
        >
            <div
                ref={innerRef}
                className="amenity-reveal relative overflow-hidden rounded-2xl sm:rounded-[20px] h-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Image */}
                <div className="absolute inset-[-12px]">
                    <img
                        ref={imageRef}
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover scale-[1.06] transition-transform duration-[1.2s] ease-out group-hover:scale-[1.12]"
                    />
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/5" />
                <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-black/25" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />

                {/* Cursor glow */}
                <div
                    ref={glowRef}
                    className="absolute w-[260px] h-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0"
                    style={{ background: `radial-gradient(circle, ${ACCENT}20 0%, transparent 70%)`, filter: "blur(25px)" }}
                />

                {/* Noise */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                />

                {/* Shimmer */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)", backgroundSize: "200% 100%", animation: "amenity-shimmer 2.5s ease-in-out infinite" }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6">
                    <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white/8 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-white transition-all duration-500">
                            <Icon className="w-[16px] h-[16px]" strokeWidth={1.5} />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/8 backdrop-blur-xl border border-white/10 flex items-center justify-center opacity-0 translate-y-3 -rotate-45 group-hover:opacity-100 group-hover:translate-y-0 group-hover:rotate-0 transition-all duration-600 ease-[cubic-bezier(0.19,1,0.22,1)]">
                            <ArrowUpRight className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
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
                    style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}90, transparent)` }}
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

    const setCardRef = (index) => (el) => { cardsRef.current[index] = el; };

    useGSAP(() => {
        const root = containerRef.current;
        if (!root) return;
        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: root, start: "top 75%", once: true },
            });

            tl.fromTo(lineRef.current,
                { scaleX: 0 },
                { scaleX: 1, duration: 1, ease: "power3.inOut" }, 0
            )
            .fromTo(labelRef.current,
                { opacity: 0, x: -14 },
                { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, 0.2
            )
            .fromTo(headingRef.current,
                { opacity: 0, y: 44 },
                { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }, 0.12
            )
            .fromTo(subRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.4
            );

            // Floating orbs
            if (!prefersReduced) {
                [orbARef, orbBRef].forEach((ref, i) => {
                    const orb = ref.current;
                    if (!orb) return;
                    gsap.fromTo(orb,
                        { opacity: 0, scale: 0.85 },
                        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out", scrollTrigger: { trigger: root, start: "top 80%", once: true }, delay: i * 0.3 }
                    );
                    gsap.to(orb, {
                        y: `${12 + i * 10}`, x: `${(-1) ** i * 12}`,
                        duration: 7 + i * 2, ease: "sine.inOut", yoyo: true, repeat: -1,
                    });
                });
            }

            // Card clip-path reveal
            const allCards = cardsRef.current.filter(Boolean);
            allCards.forEach((card, i) => {
                const reveal = card.querySelector(".amenity-reveal");
                if (!reveal) return;
                gsap.fromTo(reveal,
                    { clipPath: prefersReduced ? "inset(0)" : "inset(100% 0 0 0)" },
                    {
                        clipPath: "inset(0% 0% 0% 0%)",
                        duration: prefersReduced ? 0.4 : 1.1,
                        ease: "power4.inOut",
                        scrollTrigger: { trigger: card, start: "top 88%", once: true },
                        delay: i * 0.1,
                    }
                );
            });

            // Scroll parallax
            if (!prefersReduced) {
                allCards.forEach((card) => {
                    const img = card?.querySelector("img");
                    if (!img) return;
                    gsap.to(img, {
                        y: -20,
                        ease: "none",
                        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1.5 },
                    });
                });
            }
        }, root);

        return () => ctx.revert();
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative py-28 sm:py-40 overflow-hidden">
            {/* Rich background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(249,246,240,0) 0%, rgba(249,246,240,0.5) 35%, rgba(249,246,240,0.5) 65%, rgba(249,246,240,0) 100%)" }} />

                <div ref={orbARef} className="absolute top-[10%] left-[8%] w-[340px] h-[340px] rounded-full opacity-0" style={{ background: `radial-gradient(circle, ${ACCENT}16, transparent 70%)`, filter: "blur(80px)" }} />
                <div ref={orbBRef} className="absolute bottom-[10%] right-[10%] w-[280px] h-[280px] rounded-full opacity-0" style={{ background: `radial-gradient(circle, ${ACCENT}12, transparent 70%)`, filter: "blur(90px)" }} />

                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}12, transparent)` }} />
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}12, transparent)` }} />
            </div>

            <style>{`@keyframes amenity-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                {/* Header */}
                <div className="mb-16 sm:mb-24">
                    <div className="flex items-center gap-4 mb-7">
                        <div ref={lineRef} className="h-px w-14 origin-left" style={{ background: ACCENT }} />
                        <span ref={labelRef} className="font-[ABC] text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: ACCENT }}>
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

                        <p ref={subRef} className="font-[neue] text-sm sm:text-base text-black/40 max-w-sm leading-relaxed pb-2">
                            World-class amenities designed for your comfort and lifestyle.
                        </p>
                    </div>
                </div>

                {/* Staggered 2×2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {amenitiesData.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${index % 2 === 1 ? "sm:translate-y-10" : ""}`}
                        >
                            <div className={`h-[340px] sm:h-[380px] ${index === 0 || index === 3 ? "lg:h-[420px]" : "lg:h-[360px]"}`}>
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
