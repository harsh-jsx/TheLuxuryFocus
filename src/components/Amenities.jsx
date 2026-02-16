import React, { useRef } from "react";
import { Baby, Calendar, Martini, Accessibility, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const amenitiesData = [
    {
        id: 1,
        title: "Family Friendly",
        desc: "Safe, fun environments for the whole family.",
        icon: Baby,
        image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?q=80&w=1925&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Reservations",
        desc: "Book ahead and skip the wait.",
        icon: Calendar,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Alcohol",
        desc: "Curated drinks menus and cocktail bars.",
        icon: Martini,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Accessibility",
        desc: "Inclusive spaces for everyone.",
        icon: Accessibility,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop",
    },
];

const Amenities = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useGSAP(
        () => {
            gsap.from(cardsRef.current.filter(Boolean), {
                y: 80,
                opacity: 0,
                scale: 0.92,
                stagger: 0.15,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                },
            });
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className="py-24  sm:py-32 bg-background relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
                {/* Header */}
                <div className="mb-14 sm:mb-20">
                    <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                        Amenities
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                            Explore <span className="text-gradient-pink">Amenities</span>
                        </h2>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-sm leading-relaxed">
                            World-class amenities designed for your comfort and lifestyle.
                        </p>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid text-white grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {amenitiesData.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.id}
                                ref={(el) => { cardsRef.current[index] = el }}
                                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer aspect-[3/4]"
                            >
                                {/* Image */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-80" />

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-6">
                                    {/* Top */}
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-foreground/10 backdrop-blur-md border border-foreground/10 flex items-center justify-center text-foreground group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:text-primary transition-all duration-500">
                                            <Icon className="w-4.5 h-4.5" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-foreground/10 backdrop-blur-md border border-foreground/10 flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                            <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
                                        </div>
                                    </div>

                                    {/* Bottom */}
                                    <div>
                                        <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-foreground/90 mb-1.5">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-foreground/50 group-hover:text-foreground/70 transition-colors duration-500 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Border */}
                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-foreground/[0.06] group-hover:border-primary/30 transition-colors duration-500" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Amenities;