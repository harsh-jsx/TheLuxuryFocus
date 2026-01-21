import React, { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const Preloader = () => {
    const comp = useRef(null)
    const [counter, setCounter] = useState(0)

    useLayoutEffect(() => {
        // Check if already visited in this session
        const hasVisited = sessionStorage.getItem('tlf-visited')
        if (hasVisited) {
            if (comp.current) comp.current.style.display = 'none'
            return
        }

        // Mark as visited
        sessionStorage.setItem('tlf-visited', 'true')

        let ctx = gsap.context(() => {
            const tl = gsap.timeline()

            // Counter Animation
            const counterObj = { value: 0 }
            tl.to(counterObj, {
                value: 100,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                    setCounter(Math.round(counterObj.value))
                },
            })

            // Text Reveal / Hide
            tl.to('.preloader-text', {
                opacity: 0,
                y: -50,
                duration: 0.5,
                ease: 'power2.in',
            })

            // Curtain Reveal
            tl.to(comp.current, {
                yPercent: -100,
                duration: 1.2,
                ease: 'power4.inOut',
            })

            // Cleanup for interactivity (though yPercent -100 moves it out anyway)
            tl.set(comp.current, { display: 'none' })
        }, comp)

        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={comp}
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black text-[#E4E0D9]"
        >
            <div className="preloader-text flex flex-col items-center gap-4 overflow-hidden">
                {/* Logo or Title */}
                <h1 className="font-[Albra] text-6xl md:text-8xl tracking-tighter">
                    TheLuxuryFocus
                </h1>

                {/* Subtle Tagline */}
                <p className="font-[ABC] text-xs uppercase tracking-widest opacity-70">
                    Premium Experience
                </p>

                {/* Counter */}
                <div className="mt-8 font-[ABC] text-4xl md:text-5xl font-light tabular-nums">
                    {counter}%
                </div>
            </div>
        </div>
    )
}

export default Preloader
