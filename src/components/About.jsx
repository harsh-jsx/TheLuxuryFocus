import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import aboutImage from '../assets/about-hero.jpg'

gsap.registerPlugin(ScrollTrigger)

const features = [
    { title: 'Strategy', desc: 'Brand positioning and digital roadmap.' },
    { title: 'Design', desc: 'Visual identity and user experience.' },
    { title: 'Development', desc: 'Robust technical implementation.' },
]

const About = () => {
    const containerRef = useRef(null)
    const textRef = useRef(null)
    const imageContainerRef = useRef(null)
    const imageRef = useRef(null)
    const lineRef = useRef(null)
    const featuresRef = useRef([])
    const subtitleRef = useRef(null)
    const headingRef = useRef(null)

    useGSAP(() => {
        if (!containerRef.current) return

        // Heading fade in
        gsap.fromTo(
            headingRef.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                },
            }
        )

        // Line expansion
        gsap.fromTo(
            lineRef.current,
            { width: 0 },
            {
                width: '4rem',
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                    end: 'top 50%',
                    scrub: 1,
                },
            }
        )

        // Word-by-word text reveal
        if (textRef.current) {
            const text = textRef.current.innerText.trim()
            const words = text.split(/\s+/)
            textRef.current.innerHTML = ''
            words.forEach((word) => {
                const wrapper = document.createElement('span')
                wrapper.style.display = 'inline-block'
                wrapper.style.overflow = 'hidden'
                wrapper.style.verticalAlign = 'top'

                const inner = document.createElement('span')
                inner.innerText = word
                inner.style.display = 'inline-block'
                inner.style.opacity = '0'
                inner.style.transform = 'translateY(100%)'
                inner.className = 'word-reveal'

                wrapper.appendChild(inner)
                textRef.current.appendChild(wrapper)
                textRef.current.appendChild(document.createTextNode(' '))
            })

            gsap.to(textRef.current.querySelectorAll('.word-reveal'), {
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 85%',
                    end: 'center center',
                    scrub: 1,
                },
                opacity: 1,
                y: 0,
                stagger: 0.04,
                ease: 'power2.out',
            })
        }

        // Subtitle fade
        gsap.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: subtitleRef.current,
                    start: 'top 85%',
                },
            }
        )

        // Image clip-path reveal
        gsap.fromTo(
            imageContainerRef.current,
            { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
            {
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: imageContainerRef.current,
                    start: 'top 85%',
                    end: 'center center',
                    scrub: 1,
                },
            }
        )

        // Image zoom out
        gsap.fromTo(
            imageRef.current,
            { scale: 1.3 },
            {
                scale: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: imageContainerRef.current,
                    start: 'top 85%',
                    end: 'center center',
                    scrub: 1,
                },
            }
        )

        // Features stagger
        gsap.fromTo(
            featuresRef.current.filter(Boolean),
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: featuresRef.current[0],
                    start: 'top 90%',
                },
            }
        )
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="relative min-h-screen bg-background py-32 px-6 md:px-12 lg:px-20">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 line-accent" />

            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Left: Text */}
                    <div className="flex flex-col justify-center space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div ref={lineRef} className="h-px bg-primary" style={{ width: 0 }} />
                                <span className="section-label text-white">The Vision</span>
                            </div>

                            <h2
                                ref={headingRef}
                                className="text-4xl md:text-5xl text-white lg:text-6xl font-medium leading-[1.1] tracking-tight"
                            >
                                Crafting <span className="text-white">Premium</span> Digital Experiences
                            </h2>
                        </div>

                        <p
                            ref={textRef}
                            className="text-lg md:text-xl leading-relaxed text-white"
                        >
                            We are a digital innovation studio crafting premium experiences for ambitious brands. We blend strategy, design, and technology to define the new standard of luxury in the digital age.
                        </p>

                        <p
                            ref={subtitleRef}
                            className="text-white leading-relaxed max-w-lg"
                            style={{ opacity: 0 }}
                        >
                            Elevating brand narratives through meticulous design, immersive interactions, and robust engineering. We don't just build websites — we create digital destinations.
                        </p>
                    </div>

                    {/* Right: Image + Features */}
                    <div className="space-y-10">
                        <div
                            ref={imageContainerRef}
                            className="relative aspect-square overflow-hidden"
                            style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
                        >
                            <img
                                ref={imageRef}
                                src={aboutImage}
                                alt="Modern architectural design showcasing premium craftsmanship"
                                className="h-full w-full object-cover"
                                style={{ transform: 'scale(1.3)' }}
                            />
                            <div className="absolute inset-0 image-overlay" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {features.map((item, i) => (
                                <div
                                    key={item.title}
                                    ref={(el) => { featuresRef.current[i] = el }}
                                    className="feature-card"
                                    style={{ opacity: 0 }}
                                >
                                    <h3 className="text-sm font-semibold font-[neue] uppercase tracking-widest text-white mb-2" >
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-white leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About