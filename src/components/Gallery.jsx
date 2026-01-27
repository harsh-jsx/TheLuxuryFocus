import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

const images = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop",
]

const Gallery = () => {
    const trackRef = useRef(null)

    useEffect(() => {
        const track = trackRef.current
        const calculateWidth = () => {
            const width = track.scrollWidth
            // Clone items to ensure seamless loop if needed, 
            // but for simple marquee we can just animate xPercent
        }

        gsap.to(track, {
            xPercent: -50, // Move half way (assuming 2 sets of images)
            duration: 20,
            ease: "none",
            repeat: -1
        })
    }, [])

    return (
        <section className="py-20 bg-[#0a0a0a] overflow-hidden">
            <div className="flex w-max" ref={trackRef}>
                {/* First Set */}
                {images.map((src, i) => (
                    <div key={i} className="w-[30vw] h-[40vh] md:h-[60vh] px-2 md:px-4 flex-shrink-0">
                        <img
                            src={src}
                            alt="Gallery"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                ))}
                {/* Second Set for Loop */}
                {images.map((src, i) => (
                    <div key={`d-${i}`} className="w-[30vw] h-[40vh] md:h-[60vh] px-2 md:px-4 flex-shrink-0">
                        <img
                            src={src}
                            alt="Gallery"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Gallery
