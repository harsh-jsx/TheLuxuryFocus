import React, { useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import SplitText from './SplitText'
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
        image: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?q=80&w=2070&auto=format&fit=crop', // Replaced
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
        image: 'https://images.unsplash.com/photo-1572455044327-7348c1be7267?q=80&w=2070&auto=format&fit=crop', // Replaced
        desc: 'City of Pearls'
    },
    {
        name: 'LUCKNOW',
        image: 'https://images.unsplash.com/photo-1723981132479-d824a62a24c0?q=80&w=737&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replaced (Rumi Darwaza)
        desc: 'The City of Nawabs'
    },
    {
        name: 'MUMBAI',
        image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1974&auto=format&fit=crop',
        desc: 'The City of Dreams'
    },
    {
        name: 'DELHI',
        image: 'https://images.unsplash.com/photo-1678966432189-d58296e45ad2?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Replaced (India Gate)
        desc: 'Heart of India'
    }
]

const HomeCities = () => {
    const sectionRef = useRef(null)
    const triggerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scrollWidth = sectionRef.current.scrollWidth
            const windowWidth = window.innerWidth
            const distance = -(scrollWidth - windowWidth)

            // Horizontal Scroll
            const tl = gsap.to(sectionRef.current, {
                x: distance,
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: "top top",
                    end: () => `+=${Math.abs(distance)}`,
                    scrub: 0.6,
                    pin: true,
                    invalidateOnRefresh: true,
                },
            });

            // Parallax Effect for Images
            cities.forEach((_, i) => {
                const image = document.getElementById(`city-img-${i}`);
                if (image) {
                    gsap.to(image, {
                        x: 50, // Subtle parallax movement
                        ease: "none",
                        scrollTrigger: {
                            trigger: triggerRef.current,
                            start: "top top",
                            end: () => `+=${Math.abs(distance)}`,
                            containerAnimation: tl,
                            scrub: true,
                        }
                    })
                }
            });

        }, triggerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section className="bg-white overflow-hidden cities-section">
            <div ref={triggerRef}>
                <div
                    ref={sectionRef}
                    className="h-screen flex flex-row items-center relative w-max px-10 md:px-20 bg-neutral-50"
                >
                    {/* Intro Card */}
                    <div className="shrink-0 w-[80vw] md:w-[40vw] lg:w-[30vw] flex flex-col justify-center pr-10 md:pr-20 z-10">
                        {/* Animated Divider */}
                        <div className="w-0 h-[2px] bg-yellow-400 mb-8" ref={(el) => {
                            if (el && triggerRef.current) {
                                gsap.to(el, {
                                    width: '4rem',
                                    duration: 1,
                                    ease: "power2.out",
                                    scrollTrigger: {
                                        trigger: triggerRef.current,
                                        start: "top center",
                                    }
                                })
                            }
                        }}></div>

                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-[Albra] leading-[0.85] mb-8 text-black tracking-tight">
                            <div className="relative inline-block">
                                <SplitText delay={0.2} className="relative z-10">Explore</SplitText>
                                {/* Decorative circle or element can go here if needed */}
                            </div>
                            <br />
                            <span className="inline-block relative pl-2 transform -translate-y-2">
                                <span className="font-[ABC] italic font-light text-4xl md:text-6xl text-yellow-600 tracking-wide">Premium</span>
                            </span>
                            <br />
                            <SplitText delay={0.4}>Destinations</SplitText>
                        </h2>

                        <div className="flex flex-col gap-4 max-w-sm">
                            <div className="text-xs font-[ABC] uppercase tracking-[0.2em] text-gray-400">
                                01 — Our Collections
                            </div>
                            <p className="font-[ABC] text-gray-600 text-lg leading-relaxed">
                                Curated experiences in the most vibrant cities across the country. Find your next luxury stay.
                            </p>
                        </div>
                    </div>

                    {/* Cities List */}
                    <div className="flex flex-row gap-6 md:gap-10">
                        {cities.map((city, index) => (
                            <div
                                key={index}
                                className="group relative w-[80vw] md:w-[30vw] lg:w-[22vw] h-[60vh] md:h-[70vh] shrink-0 overflow-hidden cursor-pointer rounded-sm"
                            >
                                <div className="absolute inset-0 bg-gray-200" />

                                <div className="absolute inset-0 overflow-hidden">
                                    <img
                                        id={`city-img-${index}`}
                                        src={city.image}
                                        alt={city.name}
                                        className="w-[120%] h-full object-cover transform -translate-x-10 transition-transform duration-1000 ease-out group-hover:scale-110 grayscale-100 group-hover:grayscale-0"
                                    />
                                </div>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10">
                                    <div className="overflow-hidden">
                                        <h3 className="text-white text-3xl md:text-5xl font-[Albra] mb-2 transform bg-clip-text">
                                            <span className="inline-block transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                                {city.name}
                                            </span>
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 font-[ABC] text-sm md:text-base mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-2 group-hover:translate-y-0">
                                        {city.desc}
                                    </p>

                                    <div className="flex items-center gap-3 text-white font-[ABC] uppercase tracking-wider text-xs md:text-sm group/btn opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                        <span className="border-b border-white pb-0.5">Explore Properties</span>
                                        <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-110">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Number */}
                                <div className="absolute top-6 right-6 font-[Albra] text-6xl text-white/5 group-hover:text-white/20 transition-colors duration-500 z-10">
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