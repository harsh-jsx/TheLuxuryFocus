import React, { useRef } from 'react'
import { Moon, Coffee, MapPin, Bed, ArrowRight, Utensils, ShoppingBag } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
    {
        id: 1,
        title: 'FAMILY FRIENDLY',
        icon: <Moon className="w-5 h-5 text-pink-500" />,
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop',
        desc: "It's always time for fun.",
        count: 12,
        gradient: "from-pink-500 via-red-500 to-yellow-500",
        borderColor: "#ec4899"
    },
    {
        id: 2,
        title: 'RESERVATIONS',
        icon: <Coffee className="w-5 h-5 text-purple-500" />,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1947&auto=format&fit=crop',
        desc: "Coffee solves everything.",
        count: 8,
        gradient: "from-purple-500 via-pink-500 to-red-500",
        borderColor: "#a855f7"
    },
    {
        id: 3,
        title: 'ALCOHOL',
        icon: <MapPin className="w-5 h-5 text-blue-500" />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop',
        desc: "Dream, breath, explore.",
        count: 24,
        gradient: "from-blue-500 via-indigo-500 to-purple-500",
        borderColor: "#3b82f6"
    },
    {
        id: 4,
        title: 'ACCESSIBILITY',
        icon: <Bed className="w-5 h-5 text-green-500" />,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
        desc: "Hospitality and comfort.",
        count: 15,
        gradient: "from-green-400 via-emerald-500 to-teal-500",
        borderColor: "#10b981"
    }
]

const DiscoverCategories = () => {
    const containerRef = useRef(null)
    const cardsRef = useRef([])

    useGSAP(() => {
        const cards = cardsRef.current

        gsap.fromTo(cards,
            { scale: 0.8, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        )
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="py-24 bg-white overflow-hidden relative">
            <div className="container mx-auto px-6 md:px-12 mb-16 text-center">
                <p className="font-[ABC] text-gray-500 max-w-xl mx-auto mb-6 text-sm md:text-base">
                    Are you still lost? You can try the following suggested topics...
                </p>
                {/* <h2 className="text-4xl md:text-6xl font-[Albra] mb-4 text-black">
                    Discover Places Around
                </h2> */}
            </div>

            {/* Circular Grid */}
            <div className="flex flex-col items-center justify-center gap-10 md:gap-16 px-6">

                {/* Top Row (3 items) */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 w-full">
                    {categories.slice(0, 3).map((cat, index) => (
                        <div
                            key={cat.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group relative w-64 h-64 md:w-80 md:h-80 rounded-full p-[3px] cursor-pointer transition-transform duration-500 hover:scale-105"
                        >
                            {/* Gradient Border */}
                            <div className={`absolute inset-0 rounded-full bg-linear-to-r ${cat.gradient} opacity-80 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-500`}></div>
                            <div className={`absolute inset-0 rounded-full bg-linear-to-r ${cat.gradient} opacity-100`}></div>

                            {/* Inner Circle (Content) */}
                            <div className="absolute inset-[3px] bg-[#050511] rounded-full overflow-hidden flex items-center justify-center z-10">

                                {/* Background Image (Hidden initially, visible on hover) */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform scale-125 group-hover:scale-100 rotate-12 group-hover:rotate-0"
                                    />
                                </div>

                                {/* Floating Icon (Top Left) */}
                                <div className={`absolute top-[15%] left-[10%] w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-700 bg-[#0a0a0a] flex items-center justify-center z-20 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="w-full h-full rounded-full border border-opacity-50 flex items-center justify-center" style={{ borderColor: cat.borderColor }}>
                                        {cat.icon}
                                    </div>
                                </div>

                                {/* Title (Pill) */}
                                <div className="relative z-20 px-6 py-2 bg-white rounded-full text-black font-[ABC] font-bold text-xs md:text-sm tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.3)] transform group-hover:scale-110 transition-transform duration-300">
                                    {cat.title}
                                </div>

                                {/* Notification Badge (Bottom Right) */}
                                <div className="absolute bottom-[10%] right-[10%] w-10 h-10 md:w-12 md:h-12">
                                    {/* Pointer/Tail for chat bubble look */}
                                    <div className="absolute -bottom-1 right-3 w-4 h-4 bg-white rotate-45 z-10"></div>

                                    <div className="relative z-20 w-full h-full rounded-full rounded-br-none bg-white text-black font-bold flex items-center justify-center border-2 shadow-lg transform group-hover:translate-y-1 transition-transform duration-300" style={{ borderColor: cat.borderColor }}>
                                        <span className="text-xs md:text-sm">{cat.count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Row (1 item) */}
                <div className="flex justify-center w-full">
                    {categories.slice(3, 4).map((cat, index) => (
                        <div
                            key={cat.id}
                            ref={el => cardsRef.current[index + 3] = el}
                            className="group relative w-64 h-64 md:w-80 md:h-80 rounded-full p-[3px] cursor-pointer transition-transform duration-500 hover:scale-105"
                        >
                            {/* Gradient Border */}
                            <div className={`absolute inset-0 rounded-full bg-linear-to-r ${cat.gradient} opacity-80 group-hover:opacity-100 blur-sm group-hover:blur-md transition-all duration-500`}></div>
                            <div className={`absolute inset-0 rounded-full bg-linear-to-r ${cat.gradient} opacity-100`}></div>

                            {/* Inner Circle */}
                            <div className="absolute inset-[3px] bg-[#050511] rounded-full overflow-hidden flex items-center justify-center z-10">

                                {/* Background Image */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform scale-125 group-hover:scale-100 rotate-12 group-hover:rotate-0"
                                    />
                                </div>

                                {/* Floating Icon */}
                                <div className={`absolute top-[15%] left-[10%] w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-700 bg-[#0a0a0a] flex items-center justify-center z-20 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <div className="w-full h-full rounded-full border border-opacity-50 flex items-center justify-center" style={{ borderColor: cat.borderColor }}>
                                        {cat.icon}
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="relative z-20 px-6 py-2 bg-white rounded-full text-black font-[ABC] font-bold text-xs md:text-sm tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.3)] transform group-hover:scale-110 transition-transform duration-300">
                                    {cat.title}
                                </div>

                                {/* Notification Badge */}
                                <div className="absolute bottom-[10%] right-[10%] w-10 h-10 md:w-12 md:h-12">
                                    <div className="absolute -bottom-1 right-3 w-4 h-4 bg-white rotate-45 z-10"></div>
                                    <div className="relative z-20 w-full h-full rounded-full rounded-br-none bg-white text-black font-bold flex items-center justify-center border-2 shadow-lg transform group-hover:translate-y-1 transition-transform duration-300" style={{ borderColor: cat.borderColor }}>
                                        <span className="text-xs md:text-sm">{cat.count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default DiscoverCategories
