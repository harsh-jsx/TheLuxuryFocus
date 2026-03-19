import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#C9A227";

const brands = [
    { name: "Marriott", logo: "https://cdn.worldvectorlogo.com/logos/marriott-1.svg" },
    { name: "Hilton", logo: "https://cdn.worldvectorlogo.com/logos/hilton-5.svg" },
    { name: "Airbnb", logo: "https://cdn.worldvectorlogo.com/logos/airbnb-2.svg" },
    { name: "Uber Eats", logo: "https://cdn.worldvectorlogo.com/logos/uber-eats-1.svg" },
    { name: "Zomato", logo: "https://cdn.worldvectorlogo.com/logos/zomato-1.svg" },
    { name: "Swiggy", logo: "https://cdn.worldvectorlogo.com/logos/swiggy-1.svg" },
    { name: "TripAdvisor", logo: "https://cdn.worldvectorlogo.com/logos/tripadvisor-logo-1.svg" },
];

function BrandLogo({ brand }) {
    return (
        <div className="flex items-center justify-center px-10 sm:px-14 shrink-0 select-none">
            <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 sm:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-500"
                style={{ filter: "none" }}
                draggable={false}
            />
        </div>
    );
}

function MarqueeRow({ items, direction = "left", duration = 30 }) {
    const trackRef = useRef(null);

    useGSAP(() => {
        const track = trackRef.current;
        if (!track) return;

        const totalWidth = track.scrollWidth / 2;
        const fromX = direction === "left" ? 0 : -totalWidth;
        const toX = direction === "left" ? -totalWidth : 0;

        gsap.fromTo(track,
            { x: fromX },
            { x: toX, duration, ease: "none", repeat: -1 }
        );
    }, [direction, duration]);

    return (
        <div className="overflow-hidden">
            <div ref={trackRef} className="flex w-max">
                {/* Duplicate items for seamless loop */}
                {[...items, ...items].map((brand, i) => (
                    <BrandLogo key={`${brand.name}-${i}`} brand={brand} />
                ))}
            </div>
        </div>
    );
}

const BrandMarquee = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const lineRef = useRef(null);
    const labelRef = useRef(null);
    const rowsRef = useRef(null);

    useGSAP(() => {
        const root = sectionRef.current;
        if (!root) return;

        const tl = gsap.timeline({
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
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
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.15
        )
        .fromTo(rowsRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.35
        );
    }, { scope: sectionRef });

    const rowA = brands;
    const rowB = [...brands].reverse();

    return (
        <section ref={sectionRef} className="relative py-24 sm:py-36 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(249,246,240,0.4) 40%, rgba(249,246,240,0.4) 60%, transparent 100%)" }} />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent 10%, ${ACCENT}18 50%, transparent 90%)` }} />
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent 10%, ${ACCENT}18 50%, transparent 90%)` }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                {/* Header */}
                <div className="mb-16 sm:mb-20 text-center">
                    <div className="flex items-center justify-center gap-4 mb-7">
                        <div ref={lineRef} className="h-px w-10 origin-right" style={{ background: ACCENT }} />
                        <span ref={labelRef} className="font-[ABC] text-[10px] tracking-[0.25em] uppercase font-medium" style={{ color: ACCENT }}>
                            Partners
                        </span>
                        <div className="h-px w-10 origin-left" style={{ background: ACCENT }} />
                    </div>

                    <h2 ref={headingRef} className="font-[Albra] text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1a1a1a]">
                        Brands that trust us
                    </h2>
                </div>
            </div>

            {/* Marquee rows */}
            <div ref={rowsRef} className="space-y-8 sm:space-y-10">
                {/* Fade masks on edges */}
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, white 0%, transparent 100%)" }} />
                    <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, white 0%, transparent 100%)" }} />
                    <MarqueeRow items={rowA} direction="left" duration={35} />
                </div>

                {/* Separator */}
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
                    <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}15, transparent)` }} />
                </div>

                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, white 0%, transparent 100%)" }} />
                    <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, white 0%, transparent 100%)" }} />
                    <MarqueeRow items={rowB} direction="right" duration={40} />
                </div>
            </div>
        </section>
    );
};

export default BrandMarquee;
