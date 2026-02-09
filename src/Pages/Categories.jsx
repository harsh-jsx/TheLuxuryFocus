import React, { useRef } from 'react'
import { Moon, Coffee, MapPin, Bed, ShoppingBag, Utensils, LandPlot, Building2, Plane } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
    {
        id: 1,
        title: 'NIGHTLIFE',
        icon: <Moon className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop',
        desc: "It's always time for fun.",
        count: 0,
        color: "#8b5cf6", // Purple
        shapeClass: "rounded-[50px] rounded-tr-[100px] rounded-bl-[100px]"
    },
    {
        id: 2,
        title: 'STAY',
        icon: <Bed className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1947&auto=format&fit=crop',
        desc: "Relax, replenish, revive.",
        count: 0,
        color: "#3b82f6", // Blue
        shapeClass: "rounded-[50px] rounded-tl-[100px] rounded-br-[100px]"
    },
    {
        id: 3,
        title: 'MUSEUM',
        icon: <Building2 className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop',
        desc: "Tour by the history.",
        count: 0,
        color: "#be185d", // Pink
        shapeClass: "rounded-[60px]"
    },
    {
        id: 4,
        title: 'OUTDOOR',
        icon: <LandPlot className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2068&auto=format&fit=crop',
        desc: "Outside is the new inside.",
        count: 0,
        color: "#16a34a", // Green
        shapeClass: "rounded-[40px] rounded-tr-[80px]"
    },
    {
        id: 5,
        title: 'RESTAURANT',
        icon: <Utensils className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
        desc: "Eat responsibly.",
        count: 0,
        color: "#dc2626", // Red
        shapeClass: "rounded-[50px] rounded-br-[100px] rounded-tl-[30px]"
    },
    {
        id: 6,
        title: 'TOURISM',
        icon: <Plane className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
        desc: "Dream, breath, explore.",
        count: 0,
        color: "#c026d3", // Fuchsia
        shapeClass: "rounded-[50px] rounded-bl-[90px] rounded-tr-[90px]"
    },
    {
        id: 7,
        title: 'SHOP',
        icon: <ShoppingBag className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
        desc: "Quality, price and convenience.",
        count: 0,
        color: "#d97706", // Amber
        shapeClass: "rounded-[60px] rounded-tl-[20px]"
    },
    {
        id: 8,
        title: 'CAFE',
        icon: <Coffee className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop',
        desc: "Coffee solves everything.",
        count: 0,
        color: "#991b1b", // Red-900
        shapeClass: "rounded-[100px] h-[300px]" // Pill
    },
    {
        id: 9,
        title: 'HOTEL',
        icon: <Bed className="w-5 h-5" />,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        desc: "Experience hospitality.",
        count: 0,
        color: "#0d9488", // Teal
        shapeClass: "rounded-[50px] rounded-tr-[90px] rounded-bl-[20px]"
    }
]

const Categories = () => {
    const containerRef = useRef(null)
    const cardsRef = useRef([])

    useGSAP(() => {
        const cards = cardsRef.current

        gsap.fromTo(cards,
            { y: 100, opacity: 0, scale: 0.9 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
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
        <div ref={containerRef} className="min-h-screen bg-white py-32 px-6 overflow-hidden">
            <h1 className="text-5xl md:text-7xl font-[Albra] text-center mb-20 text-black">
                Categories
            </h1>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 items-center justify-items-center">
                {categories.map((cat, index) => (
                    <div
                        key={cat.id}
                        ref={el => cardsRef.current[index] = el}
                        className={`group relative w-full h-[320px] max-w-[400px] ${cat.shapeClass} overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2`}
                    >
                        {/* White Border Effect using inset box-shadow or extra div */}
                        <div className={`absolute inset-0 border-8 border-white z-20 ${cat.shapeClass} pointer-events-none`}></div>

                        {/* Background Image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        </div>

                        {/* Floating Icon (Top Left) */}
                        <div className="absolute top-6 left-6 z-30">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" style={{ color: cat.color }}>
                                {cat.icon}
                            </div>
                        </div>

                        {/* Notification Badge (Bottom Right) */}
                        <div className="absolute bottom-6 right-6 z-30">
                            {/* Tear drop shape: Circle with one sharp corner pointing bottom-left or similar */}
                            <div className="w-12 h-12 bg-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 rounded-full rounded-bl-sm" style={{ backgroundColor: cat.color, color: 'white' }}>
                                <span className="font-bold text-sm font-[ABC]">{cat.count}</span>
                            </div>
                            {/* Small pointer decoration */}
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full -z-10" style={{ backgroundColor: cat.color }}></div>
                        </div>

                        {/* Content (Center) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pt-10">
                            {/* Ribbon Title */}
                            <div className="relative mb-3">
                                {/* Ribbon ends style */}
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-6 h-8 bg-white skew-x-12 -z-10"></div>
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-8 bg-white -skew-x-12 -z-10"></div>

                                <div className="bg-white px-8 py-2 relative shadow-lg">
                                    <h3 className="text-black font-bold tracking-widest text-sm md:text-base font-[ABC] uppercase">
                                        {cat.title}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-white/90 font-[ABC] text-xs md:text-sm tracking-wide mt-2 text-center max-w-[70%] font-medium transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                {cat.desc}
                            </p>
                        </div>

                        {/* Inner stroke/glow on hover */}
                        <div className={`absolute inset-0 ${cat.shapeClass} border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointers-events-none`}></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories
