import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Target, Palette, Code2, ArrowUpRight, Quote, Sparkles, Award, Zap } from 'lucide-react'
import aboutImage from '../assets/about-hero.jpg'

gsap.registerPlugin(ScrollTrigger)

const values = [
    {
        icon: Target,
        title: 'Strategy',
        desc: 'Brand positioning and digital roadmap. We align every decision with your long-term vision.',
    },
    {
        icon: Palette,
        title: 'Design',
        desc: 'Visual identity and user experience. Crafting interfaces that feel as premium as your brand.',
    },
    {
        icon: Code2,
        title: 'Development',
        desc: 'Robust technical implementation. Scalable, performant, and built to last.',
    },
]

const stats = [
    { value: 50, suffix: '+', label: 'Brands Elevated' },
    { value: 100, suffix: '+', label: 'Projects Delivered' },
    { value: 5, suffix: '+', label: 'Years of Excellence' },
    { value: 98, suffix: '%', label: 'Client Satisfaction' },
]

const principles = [
    'Quality over quantity',
    'Design with purpose',
    'Technology as an enabler',
    'Partnership, not transaction',
]

const marqueeItems = [
    'Digital Excellence',
    'Brand Strategy',
    'Premium Design',
    'Innovation',
    'Luxury',
    'Craftsmanship',
]

const About = () => {
    const containerRef = useRef(null)
    const heroRef = useRef(null)
    const heroLineRef = useRef(null)
    const heroTitleRef = useRef(null)
    const heroSubRef = useRef(null)
    const storyRef = useRef(null)
    const storyTextRef = useRef(null)
    const imageRef = useRef(null)
    const imageWrapperRef = useRef(null)
    const statsRef = useRef([])
    const statsSectionRef = useRef(null)
    const quoteRef = useRef(null)
    const principlesRef = useRef([])
    const valuesRef = useRef([])
    const ctaRef = useRef(null)
    const marqueeRef = useRef(null)

    const [animatedStats, setAnimatedStats] = useState(stats.map(s => 0))

    useGSAP(() => {
        if (!containerRef.current) return

        const reduceMotion =
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

        // Hero line expansion
        gsap.from(heroLineRef.current, {
            width: 0,
            duration: reduceMotion ? 0.2 : 0.8,
            ease: 'power2.inOut',
        })

        // Hero entrance
        gsap.from(heroTitleRef.current, {
            y: 80,
            opacity: 0,
            duration: reduceMotion ? 0.3 : 1,
            delay: reduceMotion ? 0 : 0.2,
            ease: 'power3.out',
        })
        gsap.from(heroSubRef.current, {
            y: 40,
            opacity: 0,
            duration: reduceMotion ? 0.3 : 0.8,
            delay: reduceMotion ? 0 : 0.5,
            ease: 'power3.out',
        })

        // Story section scroll reveal
        gsap.from(storyTextRef.current, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: storyRef.current,
                start: 'top 75%',
                once: true,
            },
        })
        gsap.from(imageRef.current, {
            scale: 1.15,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: storyRef.current,
                start: 'top 75%',
                once: true,
            },
        })

        // Image parallax
        if (!reduceMotion && imageRef.current) {
            gsap.to(imageRef.current, {
                yPercent: -8,
                ease: 'none',
                scrollTrigger: {
                    trigger: imageWrapperRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            })
        }

        // Stats count-up
        if (statsSectionRef.current && !reduceMotion) {
            const statEls = statsRef.current.filter(Boolean)
            statEls.forEach((el, i) => {
                const target = stats[i]
                gsap.from(el, {
                    textContent: 0,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    scrollTrigger: {
                        trigger: statsSectionRef.current,
                        start: 'top 70%',
                        once: true,
                    },
                })
            })
        }

        // Quote section
        gsap.from(quoteRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: quoteRef.current,
                start: 'top 80%',
                once: true,
            },
        })

        // Principles stagger
        gsap.from(principlesRef.current.filter(Boolean), {
            x: -40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: principlesRef.current[0],
                start: 'top 85%',
                once: true,
            },
        })

        // Values stagger with scale
        gsap.from(valuesRef.current.filter(Boolean), {
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: valuesRef.current[0],
                start: 'top 80%',
                once: true,
            },
        })

        // CTA
        gsap.from(ctaRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top 85%',
                once: true,
            },
        })

        // Marquee
        if (marqueeRef.current && !reduceMotion) {
            const track = marqueeRef.current.querySelector('.marquee-track')
            if (track) {
                gsap.to(track, {
                    xPercent: -50,
                    duration: 20,
                    ease: 'none',
                    repeat: -1,
                })
            }
        }
    }, { scope: containerRef })

    // Count-up for stats (GSAP textContent doesn't work well with suffix)
    useEffect(() => {
        if (typeof window === 'undefined') return
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (reduced) {
            setAnimatedStats(stats.map(s => s.value))
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return
                    stats.forEach((stat, i) => {
                        let current = 0
                        const step = stat.value / 40
                        const timer = setInterval(() => {
                            current += step
                            if (current >= stat.value) {
                                current = stat.value
                                clearInterval(timer)
                            }
                            setAnimatedStats((prev) => {
                                const next = [...prev]
                                next[i] = Math.round(current)
                                return next
                            })
                        }, 30)
                    })
                })
            },
            { threshold: 0.5 }
        )

        if (statsSectionRef.current) observer.observe(statsSectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef} className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
            {/* Marquee */}
            <div
                ref={marqueeRef}
                className="py-6 border-y border-gray-100 overflow-hidden select-none"
            >
                <div className="marquee-track flex gap-16 whitespace-nowrap">
                    {[...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span
                            key={i}
                            className="font-[Albra] text-2xl md:text-4xl text-gray-200 tracking-tight"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hero */}
            <section
                ref={heroRef}
                className="min-h-[65vh] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-24 pb-20"
            >
                <div className="max-w-7xl mx-auto w-full">
                    <div
                        ref={heroLineRef}
                        className="h-px bg-gray-900 mb-8 overflow-hidden"
                        style={{ width: 0 }}
                    />
                    <h1
                        ref={heroTitleRef}
                        className="text-5xl md:text-7xl lg:text-8xl font-[Albra] tracking-tight leading-[0.95] max-w-4xl"
                    >
                        Crafting <span className="italic text-gray-600">Premium</span>
                        <br />
                        Digital Experiences
                    </h1>
                    <p
                        ref={heroSubRef}
                        className="mt-10 text-lg md:text-xl text-gray-600 font-[ABC] max-w-2xl leading-relaxed"
                    >
                        We are a digital innovation studio for ambitious brands. Strategy, design, and technology—unified to define the new standard of luxury in the digital age.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section
                ref={statsSectionRef}
                className="py-16 md:py-24 px-6 md:px-12 lg:px-20 bg-gray-50"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, i) => (
                            <div
                                key={stat.label}
                                ref={(el) => { statsRef.current[i] = el }}
                                className="text-center md:text-left"
                            >
                                <div className="font-[Albra] text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight">
                                    {animatedStats[i]}
                                    {stat.suffix}
                                </div>
                                <div className="mt-2 font-[ABC] text-xs uppercase tracking-widest text-gray-500">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section
                ref={storyRef}
                className="py-24 md:py-32 px-6 md:px-12 lg:px-20"
            >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div ref={storyTextRef} className="space-y-8">
                        <span className="font-[ABC] text-xs uppercase tracking-[0.3em] text-gray-500">
                            The Vision
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-[Albra] leading-tight">
                            We don't just build websites — we create digital destinations.
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Elevating brand narratives through meticulous design, immersive interactions, and robust engineering. Every pixel, every interaction, every line of code serves a single purpose: to make your brand unforgettable.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            From startups to established luxury houses, we partner with those who refuse to compromise. The result is digital experiences that feel as refined as the brands they represent.
                        </p>
                    </div>
                    <div
                        ref={imageWrapperRef}
                        className="relative aspect-[4/5] overflow-hidden rounded-2xl"
                    >
                        <img
                            ref={imageRef}
                            src={aboutImage}
                            alt="The Luxury Focus — Premium digital craftsmanship"
                            className="absolute inset-0 w-full h-[120%] object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                                <Award className="w-5 h-5 text-gray-700" />
                            </div>
                            <span className="font-[ABC] text-xs uppercase tracking-widest text-gray-600">
                                Award-Winning Studio
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote */}
            <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div
                        ref={quoteRef}
                        className="relative"
                    >
                        <Quote className="absolute -top-4 -left-2 w-12 h-12 text-gray-200" />
                        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-[Albra] leading-snug text-gray-900 italic pl-8">
                            Excellence is not a destination—it's a continuous journey. We build for brands that never stop evolving.
                        </blockquote>
                        <div className="mt-8 flex items-center gap-4 pl-8">
                            <div className="w-px h-12 bg-gray-300" />
                            <div>
                                <span className="font-[Albra] text-gray-900">The Luxury Focus</span>
                                <span className="font-[ABC] text-xs text-gray-500 block uppercase tracking-widest">Our Philosophy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Principles */}
            <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <span className="font-[ABC] text-xs uppercase tracking-[0.3em] text-gray-500 block mb-6">
                        What We Believe
                    </span>
                    <h2 className="text-3xl md:text-5xl font-[Albra] mb-16">
                        Principles that guide every project.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {principles.map((p, i) => (
                            <div
                                key={p}
                                ref={(el) => { principlesRef.current[i] = el }}
                                className="group flex items-center gap-4 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all duration-500"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <span className="font-[ABC] text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                    {p}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-gray-100 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <span className="font-[ABC] text-xs uppercase tracking-[0.3em] text-gray-500 block mb-6">
                        Our Expertise
                    </span>
                    <h2 className="text-3xl md:text-5xl font-[Albra] mb-16">
                        Strategy. Design. Development.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {values.map((item, i) => (
                            <div
                                key={item.title}
                                ref={(el) => { valuesRef.current[i] = el }}
                                className="group p-8 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-500"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700 mb-6 group-hover:bg-gray-900 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                    <item.icon size={26} />
                                </div>
                                <h3 className="text-xl font-[Albra] mb-3">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
                <div
                    ref={ctaRef}
                    className="max-w-4xl mx-auto text-center relative"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 mb-8">
                        <Sparkles className="w-4 h-4 text-gray-600" />
                        <span className="font-[ABC] text-xs uppercase tracking-widest text-gray-600">
                            Start Your Journey
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-[Albra] mb-6">
                        Let's create something new.
                    </h2>
                    <p className="text-gray-600 mb-10 max-w-xl mx-auto">
                        Ready to elevate your brand's digital presence? We'd love to hear from you.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white font-[ABC] text-sm uppercase tracking-widest rounded-full hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                    >
                        Get in Touch <ArrowUpRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default About
