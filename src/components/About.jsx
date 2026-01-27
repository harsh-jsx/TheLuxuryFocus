import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
    const containerRef = useRef(null)
    const textRef = useRef(null)

    useGSAP(() => {
        const words = textRef.current.innerText.split(' ')
        textRef.current.innerHTML = ''
        words.forEach(word => {
            const span = document.createElement('span')
            span.innerText = word + ' '
            span.className = 'inline-block opacity-0 translate-y-4' // Initial state
            textRef.current.appendChild(span)
        })

        gsap.to(textRef.current.children, {
            scrollTrigger: {
                trigger: textRef.current,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 1,
            },
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out"
        })
    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="py-32 px-4 md:px-12 bg-[#0a0a0a] text-[#E4E0D9] min-h-[80vh] flex flex-col justify-center">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-white/20"></div>
                    <span className="font-[ABC] text-xs uppercase tracking-widest opacity-60">Who We Are</span>
                </div>

                <h2 ref={textRef} className="font-[Albra] text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-white/90">
                    We are a digital innovation studio crafting premium experiences for ambitious brands. We blend strategy, design, and technology to define the new standard of luxury in the digital age.
                </h2>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-12">
                    {[
                        { title: 'Strategy', desc: 'Brand positioning and digital roadmap.' },
                        { title: 'Design', desc: 'Visual identity and user experience.' },
                        { title: 'Development', desc: 'Robust technical implementation.' }
                    ].map((item, i) => (
                        <div key={i} className="group cursor-pointer">
                            <h3 className="font-[Albra] text-2xl mb-4 group-hover:text-[#2D45FF] transition-colors">{item.title}</h3>
                            <p className="font-[ABC] text-sm text-white/50 leading-relaxed max-w-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About
