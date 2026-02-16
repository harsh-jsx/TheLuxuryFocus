import React, { useRef } from "react";
import { Lightbulb, Coffee, Bell, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stepsData = [
    {
        number: "01",
        title: "Businesses",
        description:
            "Publish detailed listings to showcase your business, offerings, and unique value proposition.",
        icon: Lightbulb,
    },
    {
        number: "02",
        title: "Customers",
        description:
            "Discover curated businesses from local experts and explore listings efficiently.",
        icon: Coffee,
    },
    {
        number: "03",
        title: "Feedback",
        description:
            "Customers share experiences and help businesses build strong digital reputation.",
        icon: Bell,
    },
];

const HowItWorks = () => {
    const containerRef = useRef(null);
    const stepsRef = useRef([]);
    const arrowRefs = useRef([]);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
            });

            // Step reveal animation
            tl.from(stepsRef.current, {
                y: 60,
                opacity: 0,
                duration: 0.9,
                stagger: 0.25,
                ease: "power3.out",
            });

            // Draw arrows
            arrowRefs.current.forEach((arrow) => {
                if (!arrow) return;
                const length = arrow.getTotalLength();
                gsap.set(arrow, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });

                gsap.to(arrow, {
                    strokeDashoffset: 0,
                    duration: 1.4,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 65%",
                    },
                });
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            className="py-28 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-[Albra] text-gray-900 mb-4">
                    How It Works
                </h2>

                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-8"></div>

                <p className="font-[ABC] text-gray-500 max-w-2xl mx-auto mb-20 text-sm md:text-base">
                    Join a seamless ecosystem connecting businesses, customers, and
                    feedback — designed for growth and transparency.
                </p>

                <div className="relative flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">

                    {/* SVG Connectors */}
                    <div className="hidden md:block absolute top-[85px] left-0 w-full h-[150px] pointer-events-none z-0">
                        {[0, 1].map((_, i) => (
                            <svg
                                key={i}
                                className={`absolute top-0 ${i === 0 ? "left-[23%]" : "right-[23%]"
                                    } w-[180px] h-[100px]`}
                                viewBox="0 0 180 100"
                                fill="none"
                            >
                                <path
                                    ref={(el) => (arrowRefs.current[i] = el)}
                                    d="M10 30 Q 90 150 170 30"
                                    stroke="url(#grad)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                                <defs>
                                    <linearGradient id="grad" x1="0" x2="1">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        ))}
                    </div>

                    {stepsData.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                ref={(el) => (stepsRef.current[index] = el)}
                                className={`relative z-10 flex-1 flex flex-col items-center group ${index === 1 ? "md:mt-20" : ""
                                    }`}
                            >
                                {/* Icon Circle */}
                                <div className="w-36 h-36 rounded-full bg-white/70 backdrop-blur-md shadow-xl flex items-center justify-center mb-8 relative transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-pink-100 rounded-full scale-110 -z-10 group-hover:scale-125 transition-transform duration-500"></div>
                                    <Icon className="w-14 h-14 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
                                </div>

                                {/* Title */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-gray-300 font-bold text-xl">
                                        {step.number}
                                    </span>
                                    <h3 className="font-[ABC] font-semibold text-lg bg-white shadow px-5 py-1.5 rounded-full">
                                        {step.title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                                    {step.description}
                                </p>

                                {/* CTA Arrow */}
                                <div className="mt-8 w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;