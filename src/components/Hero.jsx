import React, { useRef } from 'react'
import { ArrowDown, Search, Moon, BedDouble, Landmark, Trees, Compass, HandMetal, CornerRightDown, MoreHorizontal } from 'lucide-react'
import SplitText from './SplitText'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Hero = () => {
    const containerRef = useRef(null)

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

        // Initial setup
        gsap.set(".hero-element", { y: 40, opacity: 0 })
        gsap.set(".search-container", { y: 30, opacity: 0 }) // Animate from y instead of scale for cleaner look
        gsap.set(".category-icon", { y: 20, opacity: 0 })

        // Sequence
        tl.to(".hero-video-bg", {
            opacity: 0.6,
            scale: 1,
            duration: 2,
            ease: "power2.inOut"
        })
            // Text handles its own animation via SplitText
            .to(".hero-element", {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 1
            }, "-=1.2") // Overlap with video
            .to(".search-container", {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "expo.out"
            }, "-=0.5")
            .to(".category-icon", {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 1
            }, "-=1")
            .to(".scroll-indicator", {
                opacity: 0.6,
                y: 0,
                duration: 1
            }, "-=0.5")

        // Interactive Animations for Search Input
        const input = document.querySelector('.search-input');
        if (input) {
            input.addEventListener('focus', () => {
                gsap.to('.search-glow', { opacity: 0.6, duration: 0.5 });
                gsap.to('.search-container', {
                    borderColor: "rgba(255,255,255,0.4)",
                    boxShadow: "0 0 30px rgba(255,255,255,0.1)",
                    scale: 1.01,
                    duration: 0.4
                });
            });
            input.addEventListener('blur', () => {
                gsap.to('.search-glow', { opacity: 0, duration: 0.5 });
                gsap.to('.search-container', {
                    borderColor: "transparent",
                    boxShadow: "none",
                    scale: 1,
                    duration: 0.4
                });
            });
        }

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-center">

            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-video-bg w-full h-full object-cover opacity-0 scale-110" // Start state for animation
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full">

                {/* Headline Section */}
                <h1 className="hero-element font-[Albra] text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter mb-6">
                    <SplitText delay={0.2}>
                        Your Gateway to
                        Premium Services
                    </SplitText>
                </h1>

                <p className="hero-element max-w-xl font-[ABC] text-base md:text-lg leading-relaxed text-white/70 tracking-wide mb-12">
                    Experience the Finest Luxury Brands – Get the Pampered Treatment
                </p>

                {/* Search Bar */}
                <div className="search-container relative w-full max-w-2xl bg-white rounded-full p-2 flex items-center shadow-2xl shadow-white/10 mx-auto mb-16 group">
                    {/* Glow effect */}
                    <div className="search-glow absolute -inset-1 bg-linear-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full blur opacity-0 transition-opacity duration-300 -z-10"></div>

                    <div className="flex-1 flex items-center px-4 md:px-6 border-r border-gray-200">
                        <Compass className="text-gray-400 mr-3 w-5 h-5 shrink-0" />
                        <input
                            type="text"
                            className="search-input w-full bg-transparent text-black text-lg placeholder:text-gray-500 focus:outline-none font-[ABC]"
                            placeholder="What do you need?"
                        />
                    </div>

                    <div className="hidden md:flex items-center px-6">
                        <span className="text-black font-[ABC] font-medium text-sm mr-2 whitespace-nowrap">Where?</span>
                    </div>

                    <button className="bg-black hover:bg-[#2D45FF] text-white p-3 md:p-4 rounded-full transition-colors duration-300 shrink-0">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Floating Settings/Default Badges - Absoluted for style */}
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-[#2D45FF] text-white text-[10px] uppercase font-bold tracking-wider rounded-md transform -rotate-2">
                        Settings
                    </div>
                    <div className="absolute -top-3 left-28 px-3 py-1 bg-white text-black border border-gray-200 text-[10px] uppercase font-bold tracking-wider rounded-md transform rotate-1">
                        Default Search
                    </div>
                </div>

                {/* Hand / Highlight link */}
                <div className="hero-element flex items-center gap-3 text-white/80 mb-16 cursor-pointer hover:text-white transition-colors">
                    <HandMetal className="w-5 h-5 -rotate-45" />
                    <div className="text-left">
                        <div className="text-xs uppercase tracking-wider text-white/50">Need a Hand?</div>
                        <div className="text-sm font-medium">Click & Browse Highlights...</div>
                    </div>
                    <CornerRightDown className="w-4 h-4 ml-2 text-white/50" />
                </div>

                {/* Categories */}
                <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                    <CategoryIcon icon={Moon} label="Nightlife" />
                    <CategoryIcon icon={BedDouble} label="Stay" />
                    <CategoryIcon icon={Landmark} label="Museum" />
                    <CategoryIcon icon={Trees} label="Outdoor" />
                    <div className="category-icon w-12 h-12 rounded-full bg-white text-black flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <MoreHorizontal className="w-5 h-5" />
                    </div>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator flex flex-col items-center gap-2 opacity-0 z-20">
                <span className="font-[ABC] text-[10px] uppercase tracking-widest">Scroll</span>
                <ArrowDown size={16} />
            </div>

        </section>
    )
}

const CategoryIcon = ({ icon: Icon, label }) => (
    <div className="category-icon flex flex-col items-center gap-2 group cursor-pointer">
        <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-transparent group-hover:bg-white group-hover:text-black transition-all duration-300">
            <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-[ABC] tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
            {label}
        </span>
    </div>
)

export default Hero