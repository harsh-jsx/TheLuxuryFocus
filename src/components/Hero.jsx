import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Search, MapPin, Wine, Palmtree, Landmark, Mountain, MoreHorizontal, MousePointer2 } from 'lucide-react'

const Hero = () => {
    const containerRef = useRef(null)
    const pillRef = useRef(null)
    const titleRef = useRef(null)
    const subRef = useRef(null)
    const iconsRef = useRef(null)
    const [isHoveringPill, setIsHoveringPill] = useState(false)

    // Initial Animation & Parallax
    useGSAP(() => {
        const tl = gsap.timeline()

        // Initial Reveal
        tl.from(titleRef.current, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            delay: 0.5 // Wait for Preloader
        })
            .from(subRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.8")
            .from(pillRef.current, {
                y: 50,
                opacity: 0,
                scale: 0.9,
                duration: 1,
                ease: "back.out(1.2)"
            }, "-=0.6")
            .from(".hero-icon-item", {
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.5")

        // Floating Animation for Pill
        gsap.to(pillRef.current, {
            y: "-=10",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })

        // Mouse Parallax with cleanups
        const handleMouseMove = (e) => {
            if (!containerRef.current) return
            const { clientX, clientY } = e
            const x = (clientX / window.innerWidth - 0.5) * 20
            const y = (clientY / window.innerHeight - 0.5) * 20

            gsap.to(titleRef.current, { x: x * 2, y: y * 2, duration: 1, ease: "power2.out" })
            gsap.to(pillRef.current, { x: x * 1.5, y: y * 1.5, rotateX: -y * 0.5, rotateY: x * 0.5, duration: 1, ease: "power2.out" })
            gsap.to(iconsRef.current, { x: x, y: y, duration: 1, ease: "power2.out" })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center text-[#E4E0D9] perspective-1000">

            {/* Video Background */}
            <div className="absolute inset-0 z-0 select-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-80"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/60 z-10" />
            </div>

            {/* Ambient Background (Optional - kept for depth) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center gap-8 md:gap-12 px-4 max-w-7xl mx-auto">

                {/* Text Content */}
                <div className="flex flex-col items-center gap-6">
                    <h1 ref={titleRef} className="font-[Albra] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9]">
                        Your Gateway to <br />
                        <span className="italic">Premium Services</span>
                    </h1>
                    <p ref={subRef} className="font-[ABC] text-xs md:text-sm uppercase tracking-widest opacity-60">
                        Experience the Finest Luxury Brands — Get the Pampered Treatment
                    </p>
                </div>

                {/* Interactive Search Pill */}
                <div
                    ref={pillRef}
                    className="relative group w-full max-w-2xl mx-auto z-50 perspective-pill"
                    onMouseEnter={() => setIsHoveringPill(true)}
                    onMouseLeave={() => setIsHoveringPill(false)}
                >
                    {/* Floating Tags */}
                    <div className="absolute -top-4 left-6 flex items-center gap-2 z-20">
                        <span className="bg-[#2D45FF] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg transform transition-transform group-hover:-translate-y-1">
                            Settings
                        </span>
                    </div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <span className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg transform transition-transform group-hover:-translate-y-1">
                            Default Search
                        </span>
                    </div>

                    {/* Main Pill Body */}
                    <div className="relative bg-white rounded-full p-2 pl-6 shadow-2xl flex flex-col md:flex-row items-center gap-4 transition-all duration-300 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">

                        {/* Input Area */}
                        <div className="flex-1 flex items-center gap-3 w-full border-b md:border-b-0 border-black/10 pb-2 md:pb-0">
                            <div className="bg-black/5 p-2 rounded-full">
                                <Search size={20} className="text-black/60" />
                            </div>
                            <input
                                type="text"
                                placeholder="What do you need?"
                                className="w-full bg-transparent outline-none text-black font-[Albra] text-lg md:text-xl placeholder:text-black/40"
                            />
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-black/10" />

                        {/* Location / Secondary Input */}
                        <div className="flex items-center gap-3 w-full md:w-auto justify-between px-2">
                            <span className="text-black/40 font-[ABC] text-xs uppercase tracking-wide whitespace-nowrap">Where?</span>
                            <MapPin size={16} className="text-black/40" />
                        </div>

                        {/* Search Action Button */}
                        <button className="bg-black text-white hover:bg-[#2D45FF] transition-colors duration-300 p-4 rounded-full flex items-center justify-center shrink-0 w-full md:w-auto">
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Helper Tooltip */}
                    <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-300 ${isHoveringPill ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="flex items-center gap-2 text-[#E4E0D9]/60">
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
                                <MousePointer2 size={12} />
                            </div>
                            <span className="font-[ABC] text-[10px] uppercase tracking-wider">Need a Hand?</span>
                        </div>
                        <span className="font-[Albra] text-sm text-white/40 italic">Click & Browse Highlights...</span>

                        {/* Arrow */}
                        <svg width="40" height="20" viewBox="0 0 40 20" className="absolute -left-12 bottom-0 fill-none stroke-white/20">
                            <path d="M40,0 Q20,20 0,10" />
                            <path d="M0,10 L5,5 M0,10 L5,15" />
                        </svg>
                    </div>
                </div>

                {/* Categories */}
                <div ref={iconsRef} className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 md:mt-16">
                    <CategoryItem icon={Wine} label="Nightlife" />
                    <CategoryItem icon={Palmtree} label="Stay" />
                    <CategoryItem icon={Landmark} label="Museum" />
                    <CategoryItem icon={Mountain} label="Outdoor" />
                    <CategoryItem icon={MoreHorizontal} label="More" isMore />
                </div>

            </div>
        </section>
    )
}

const CategoryItem = ({ icon: Icon, label, isMore }) => (
    <div className="hero-icon-item flex flex-col items-center gap-3 group cursor-pointer">
        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md
            ${isMore
                ? 'bg-transparent border-white/20 text-white group-hover:bg-white/10'
                : 'bg-white text-black border-white group-hover:scale-110 shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            }`}>
            <Icon size={24} />
        </div>
        <span className="font-[ABC] text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
            {label}
        </span>
    </div>
)

export default Hero