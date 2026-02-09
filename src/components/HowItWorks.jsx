import React, { useRef } from 'react'
import { Lightbulb, Coffee, Bell, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HowItWorks = () => {
    const containerRef = useRef(null)
    const arrow1Ref = useRef(null)
    const arrow2Ref = useRef(null)
    const stepsRef = useRef([])

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                end: "bottom 80%",
                toggleActions: "play none none reverse"
            }
        })

        // Animate steps fading in up
        timeline.from(stepsRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: "power2.out"
        })

        // Draw arrows
        const drawArrow = (arrow) => {
            if (!arrow) return
            const length = arrow.getTotalLength()
            gsap.set(arrow, { strokeDasharray: length, strokeDashoffset: length })
            gsap.to(arrow, {
                strokeDashoffset: 0,
                duration: 1.5,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 60%"
                }
            })
        }

        if (arrow1Ref.current) drawArrow(arrow1Ref.current)
        if (arrow2Ref.current) drawArrow(arrow2Ref.current)

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-[Albra] mb-2 text-black">
                    How it Works?
                </h2>
                <div className="w-16 h-1 bg-linear-to-r from-purple-500 via-pink-500 to-yellow-500 mx-auto rounded-full mb-8"></div>
                <p className="font-[ABC] text-gray-500 max-w-xl mx-auto mb-16 text-sm md:text-base">
                    We made it possible to join our community with interesting business ideas, including startups.
                </p>

                <div className="relative flex flex-col md:flex-row justify-center items-start gap-12 md:gap-8 max-w-6xl mx-auto">

                    {/* Connecting Arrows (Absolute) - only visible on md and up */}
                    <div className="hidden md:block absolute top-[60px] left-0 w-full h-[150px] pointer-events-none z-0">
                        {/* Arrow 1: Between Step 1 and 2 */}
                        <svg className="absolute top-0 left-[25%] w-[150px] h-[80px]" viewBox="0 0 150 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                ref={arrow1Ref}
                                d="M10 20 Q 75 120 140 20"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <polygon points="140,20 130,25 130,15" fill="#3b82f6" opacity="0" className="arrow-head" />
                            {/* Simple path for now. Arrowhead logic is complex with pure SVG path animation, usually just animating the dashoffset is enough for the line. */}
                        </svg>

                        {/* Arrow 2: Between Step 2 and 3 */}
                        <svg className="absolute top-0 right-[25%] w-[150px] h-[80px]" viewBox="0 0 150 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                ref={arrow2Ref}
                                d="M10 20 Q 75 120 140 20"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </svg>
                    </div>

                    {/* Step 1 */}
                    <div ref={el => stepsRef.current[0] = el} className="relative z-10 flex-1 flex flex-col items-center group">
                        <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute inset-0 bg-blue-50/50 rounded-full scale-125 -z-10 group-hover:scale-110 transition-transform duration-300"></div>
                            <Lightbulb className="w-12 h-12 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-gray-300 font-bold text-xl">01</span>
                            <h3 className="font-[ABC] font-bold text-lg bg-gray-100 px-4 py-1 rounded-full">Businesses</h3>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                            Start pubish listings to show everyone the details and goodies of your establishment.
                        </p>
                        <div className="mt-6 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div ref={el => stepsRef.current[1] = el} className="relative z-10 flex-1 flex flex-col items-center group mt-0 md:mt-16">
                        <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute inset-0 bg-blue-50/50 rounded-full scale-125 -z-10 group-hover:scale-110 transition-transform duration-300"></div>
                            <Coffee className="w-12 h-12 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-gray-300 font-bold text-xl">02</span>
                            <h3 className="font-[ABC] font-bold text-lg bg-gray-100 px-4 py-1 rounded-full">Customers</h3>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                            Easily find interesting places by local experts, save time by checking listing features.
                        </p>
                        <div className="mt-6 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div ref={el => stepsRef.current[2] = el} className="relative z-10 flex-1 flex flex-col items-center group">
                        <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute inset-0 bg-blue-50/50 rounded-full scale-125 -z-10 group-hover:scale-110 transition-transform duration-300"></div>
                            <Bell className="w-12 h-12 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-gray-300 font-bold text-xl">03</span>
                            <h3 className="font-[ABC] font-bold text-lg bg-gray-100 px-4 py-1 rounded-full">Feedback</h3>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                            Visitors discuss listings to share experiences, so businesses get reputation consolidated.
                        </p>
                        <div className="mt-6 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default HowItWorks
