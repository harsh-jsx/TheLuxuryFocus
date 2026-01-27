import React, { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import SplitText from './SplitText'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Hero = () => {
    const containerRef = useRef(null)

    useGSAP(() => {
        const tl = gsap.timeline()

        // Video scale-in effect
        tl.from(".hero-video-bg", {
            scale: 1.2,
            opacity: 0,
            duration: 1.5,
            ease: "power2.out"
        })

        // Scroll indicator animation
        gsap.to(".scroll-indicator", {
            y: 10,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: "sine.inOut"
        })

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-[#0a0a0a] text-[#E4E0D9] overflow-hidden flex flex-col items-center justify-center">

            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-video-bg w-full h-full object-cover opacity-60"
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-7xl mx-auto">
                <div className="mb-6 overflow-hidden">
                    <span className="font-[ABC] text-xs md:text-sm uppercase tracking-[0.2em] text-white/60">
                        Redefining Luxury
                    </span>
                </div>

                <h1 className="font-[Albra] text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter mix-blend-difference mb-8">
                    <SplitText delay={0.5}>
                        The Luxury
                    </SplitText>
                    <span className="block italic font-light text-white/80">
                        <SplitText delay={0.8}>Focus</SplitText>
                    </span>
                </h1>

                <p className="max-w-xl font-[ABC] text-sm md:text-base leading-relaxed text-white/70 tracking-wide mt-8">
                    Elevating brands through strategic digital excellence. We craft immersive experiences that resonate with the modern elite.
                </p>

                <div className="mt-12 flex items-center gap-6">
                    <button className="px-8 py-3 bg-white text-black font-[ABC] text-xs uppercase tracking-widest hover:bg-[#2D45FF] hover:text-white transition-colors duration-300 rounded-full">
                        Start Project
                    </button>
                    <button className="px-8 py-3 border border-white/20 text-white font-[ABC] text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 rounded-full">
                        View Work
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 scroll-indicator flex flex-col items-center gap-2 opacity-50 z-20">
                <span className="font-[ABC] text-[10px] uppercase tracking-widest">Scroll</span>
                <ArrowDown size={16} />
            </div>

        </section>
    )
}

export default Hero