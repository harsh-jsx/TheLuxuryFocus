import React, { useRef } from "react";
import { UserPlus, Link2, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stepsData = [
    {
        icon: UserPlus,
        number: "01",
        title: "Create Profile",
        desc: "Set up your business profile and get discovered by the right audience."
    },
    {
        icon: Link2,
        number: "02",
        title: "Connect & Engage",
        desc: "Interact with customers and build trust through meaningful engagement."
    },
    {
        icon: TrendingUp,
        number: "03",
        title: "Scale & Grow",
        desc: "Use insights and analytics to optimize and scale your performance."
    }
];

const HowItWorks = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useGSAP(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardsRef.current, {
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    once: true
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="py-2 bg-white"
        >
            <div className="max-w-7xl mx-auto px-6 text-center">

                {/* Heading */}
                <h2 className="text-4xl md:text-5xl font-semibold mb-6">
                    How It Works
                </h2>

                <p className="text-black font-[neue] text-[18px] font-bold tracking-[0.02em] leading-[1.2] mb-20">
                    A seamless process designed to connect businesses and customers efficiently.
                </p>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-10">
                    {stepsData.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={i}
                                ref={(el) => (cardsRef.current[i] = el)}
                                className="group p-10 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl"
                            >
                                {/* Icon */}
                                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300">
                                    <Icon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                                </div>

                                {/* Number */}
                                <div className="text-black font-[neue] text-[18px] font-bold tracking-[0.02em] leading-[1.2] text-sm font-semibold mb-2">
                                    {step.number}
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold mb-4">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-black font-[neue] text-[18px] font-bold tracking-[0.02em] leading-[1.2] text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default HowItWorks;