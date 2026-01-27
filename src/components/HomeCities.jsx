import React, { useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import splitText from './SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cities = [
    {
        name: 'AGRA',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop',
        desc: 'Home of the Taj Mahal'
    },
    {
        name: 'CHENNAI',
        image: 'https://images.unsplash.com/photo-1582510003544-bea4db3e62df?q=80&w=2070&auto=format&fit=crop',
        desc: 'Gateway to South India'
    },
    {
        name: 'JAIPUR',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop',
        desc: 'The Pink City'
    },
    {
        name: 'AHMEDABAD',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1928&auto=format&fit=crop',
        desc: 'Heritage & Modernity'
    },
    {
        name: 'HYDERABAD',
        image: 'https://images.unsplash.com/photo-1626014902271-bfbd98c39db8?q=80&w=2070&auto=format&fit=crop',
        desc: 'City of Pearls'
    },
    {
        name: 'LUCKNOW',
        image: 'https://images.unsplash.com/photo-1589403816223-b1d3d63bd1f6?q=80&w=2070&auto=format&fit=crop',
        desc: 'The City of Nawabs'
    },
    {
        name: 'MUMBAI',
        image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1974&auto=format&fit=crop',
        desc: 'The City of Dreams'
    },
    {
        name: 'DELHI',
        image: 'https://images.unsplash.com/photo-1587474265431-c9fd8446bacf?q=80&w=2070&auto=format&fit=crop',
        desc: 'Heart of India'
    }
]

const HomeCities = () => {
    const sectionRef = useRef(null)
    const triggerRef = useRef(null)

    useEffect(() => {
        // Delay slightly ensuring DOM layout is complete
        const ctx = gsap.context(() => {
            const scrollWidth = sectionRef.current.scrollWidth
            const windowWidth = window.innerWidth
            const distance = -(scrollWidth - windowWidth)

            gsap.fromTo(
                sectionRef.current,
                {
                    x: 0,
                },
                {
                    x: distance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: () => `+=${Math.abs(distance)}`, // The scroll length matches the horizontal distance
                        scrub: 0.6,
                        pin: true,
                        invalidateOnRefresh: true,
                    },
                }
            )
        }, triggerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section className="bg-white overflow-hidden">
            <div ref={triggerRef}>
                <div
                    ref={sectionRef}
                    className="h-screen flex flex-row items-center relative w-max px-10 md:px-20"
                >
                    {/* Intro Card */}
                    <div className="flex-shrink-0 w-[80vw] md:w-[40vw] lg:w-[30vw] flex flex-col justify-center pr-10 md:pr-20 z-10">
                        <div className="w-16 h-1 bg-yellow-400 mb-6"></div>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-[Albra] leading-[0.9] mb-8 text-black">
                            <splitText delay={5.8} >Explore</splitText> <br />
                            <span className="text-gray-400 font-[ABC] italic text-4xl md:text-6xl tracking-normal">Premium</span> <br />
                            <splitText delay={5.2}>Destinations</splitText>
                        </h2>
                        <p className="font-[ABC] text-gray-600 text-lg md:text-xl max-w-sm">
                            Curated experiences in the most vibrant cities across the country. Find your next luxury stay.
                        </p>
                    </div>

                    {/* Cities List */}
                    <div className="flex flex-row gap-6 md:gap-10">
                        {cities.map((city, index) => (
                            <div
                                key={index}
                                className="group relative w-[80vw] md:w-[30vw] lg:w-[22vw] h-[60vh] md:h-[70vh] flex-shrink-0 overflow-hidden cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gray-200" />
                                <img
                                    src={city.image}
                                    alt={city.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="overflow-hidden">
                                        <h3 className="text-white text-3xl md:text-5xl font-[Albra] mb-2 transform bg-clip-text">
                                            {city.name}
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 font-[ABC] text-sm md:text-base mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {city.desc}
                                    </p>

                                    <div className="flex items-center gap-3 text-white font-[ABC] uppercase tracking-wider text-xs md:text-sm group/btn">
                                        <span className="border-b border-transparent group-hover/btn:border-white transition-all pb-0.5">Explore Properties</span>
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover/btn:bg-yellow-400 group-hover/btn:text-black transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Number */}
                                <div className="absolute top-6 right-6 font-[Albra] text-6xl text-white/10 group-hover:text-white/30 transition-colors">
                                    {String(index + 1).padStart(2, '0')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomeCities