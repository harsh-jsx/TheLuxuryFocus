import React, { useRef } from 'react'
import { Moon, Coffee, MapPin, Bed, ShoppingBag, ArrowRight, Utensils } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
    {
        id: 1,
        title: 'Nightlife',
        icon: <Moon className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop',
        desc: "It's always time for fun.",
        count: 12
    },
    {
        id: 2,
        title: 'Cafe',
        icon: <Coffee className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1947&auto=format&fit=crop',
        desc: "Coffee solves everything.",
        count: 8
    },
    {
        id: 3,
        title: 'Tourism',
        icon: <MapPin className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop',
        desc: "Dream, breath, explore.",
        count: 24
    },
    {
        id: 4,
        title: 'Hotel',
        icon: <Bed className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
        desc: "Hospitality and comfort.",
        count: 15
    },
    {
        id: 5,
        title: 'Dining',
        icon: <Utensils className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
        desc: "Taste the finest cuisines.",
        count: 18
    },
    {
        id: 6,
        title: 'Shopping',
        icon: <ShoppingBag className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
        desc: "Retail therapy awaits.",
        count: 30
    }
]

const DiscoverCategories = () => {
    const containerRef = useRef(null)
    const cardsRef = useRef([])

    useGSAP(() => {
        const cards = cardsRef.current

        gsap.fromTo(cards,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        )

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 mb-16 text-center">
                <h2 className="text-4xl md:text-6xl font-[Albra] mb-4 text-black">
                    Discover Places Around
                </h2>
                <div className="w-24 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-yellow-500 mx-auto rounded-full mb-6"></div>
                <p className="font-[ABC] text-gray-500 max-w-xl mx-auto">
                    Browse listings curated by local experts, start filtering by category.
                </p>
            </div>

            {/* Scrollable Container */}
            <div className="overflow-x-auto pb-12 hide-scrollbar px-6 md:px-12">
                <div className="flex gap-8 w-max mx-auto md:mx-0">
                    {categories.map((cat, index) => (
                        <div
                            key={cat.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group relative w-[280px] h-[360px] md:w-[320px] md:h-[420px] rounded-[3rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                            </div>

                            {/* Floating Icon */}
                            <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-lg z-20">
                                {cat.icon}
                            </div>

                            {/* Count Badge */}
                            <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-[ABC] text-xs font-bold shadow-lg transform scale-90 group-hover:scale-110 transition-transform duration-300 z-20">
                                {cat.count}
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pt-20">
                                {/* Tag Design Title */}
                                <div className="relative mb-3">
                                    <div className="absolute inset-0 bg-white transform skew-x-12 scale-105 shadow-lg"></div>
                                    <h3 className="relative font-[ABC] font-bold text-black uppercase tracking-widest text-sm px-4 py-1.5 z-10">
                                        {cat.title}
                                    </h3>
                                </div>
                                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white mb-6"></div>

                                <p className="font-[ABC] text-white/90 text-sm md:text-base font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-[80%] leading-relaxed">
                                    {cat.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-8">
                <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 font-[ABC] text-sm hover:bg-black hover:text-white hover:border-black transition-colors duration-300 group">
                    View All Categories
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>
    )
}

export default DiscoverCategories
