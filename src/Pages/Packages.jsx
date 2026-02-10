import React, { useRef } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const packagesData = [
    {
        id: 1,
        name: "Starter",
        price: "$499",
        period: "/month",
        description: "Perfect for small businesses starting their digital journey.",
        features: [
            { name: "5 Listings", included: true },
            { name: "Basic Analytics", included: true },
            { name: "Standard Support", included: true },
            { name: "Marketing Tools", included: false },
            { name: "Priority Listing", included: false },
            { name: "Dedicated Manager", included: false },
        ],
        gradient: "from-blue-500 to-cyan-400",
        delay: 0
    },
    {
        id: 2,
        name: "Business",
        price: "$999",
        period: "/month",
        tag: "Most Popular",
        description: "Comprehensive solution for growing agencies.",
        features: [
            { name: "25 Listings", included: true },
            { name: "Advanced Analytics", included: true },
            { name: "Priority Support", included: true },
            { name: "Marketing Tools", included: true },
            { name: "Priority Listing", included: true },
            { name: "Dedicated Manager", included: false },
        ],
        gradient: "from-purple-600 to-pink-500",
        delay: 0.2
    },
    {
        id: 3,
        name: "Elite",
        price: "$2499",
        period: "/month",
        description: "Maximum visibility and support for market leaders.",
        features: [
            { name: "Unlimited Listings", included: true },
            { name: "Custom Analytics", included: true },
            { name: "24/7 Concierge", included: true },
            { name: "Marketing Tools", included: true },
            { name: "Priority Listing", included: true },
            { name: "Dedicated Manager", included: true },
        ],
        gradient: "from-amber-500 to-orange-600",
        delay: 0.4
    }
];

const Packages = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);


    useGSAP(() => {
        const tl = gsap.timeline();
        const cards = cardsRef.current.filter(Boolean);

        tl.from(titleRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
            .from(cards, {
                y: 100,
                autoAlpha: 0, // Using autoAlpha for better visibility handling
                stagger: 0.2,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-white text-black py-32 px-4 relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header */}
                <div ref={titleRef} className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Excellence</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Select the perfect plan to elevate your business presence and reach the right audience effectively.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {packagesData.map((pkg, index) => (
                        <div
                            key={pkg.id}
                            ref={el => cardsRef.current[index] = el}
                            className={`relative group rounded-[2rem] p-[1px] bg-white border border-gray-100 shadow-xl hover:shadow-2xl ${pkg.tag ? 'lg:-mt-8 lg:z-10 ring-4 ring-purple-50' : ''}`}
                        >
                            <div className="h-full bg-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden">

                                {/* Popular Tag */}
                                {pkg.tag && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
                                        {pkg.tag}
                                    </div>
                                )}

                                {/* Hover Glow */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                {/* Header */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{pkg.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl md:text-5xl font-bold text-gray-900">{pkg.price}</span>
                                        <span className="text-gray-500">{pkg.period}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed border-b border-gray-100 pb-6">
                                        {pkg.description}
                                    </p>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4 mb-10">
                                    {pkg.features.map((feature, i) => (
                                        <div key={i} className="flex items-center justify-between group/feature">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${feature.included ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-400'}`}>
                                                    {feature.included ? <Check size={12} /> : <X size={12} />}
                                                </div>
                                                <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                                    {feature.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Button */}
                                <button className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3
                                    ${pkg.tag
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 text-white'
                                        : 'bg-gray-50 text-black hover:bg-gray-100 border border-gray-200'
                                    }`}>
                                    Get Started
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ / Extra Info */}

            </div>
        </div>
    );
};

export default Packages;