import React, { useRef } from 'react'
import { Bell, Calendar, Martini, Accessibility, Baby } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Amenities = () => {
    const containerRef = useRef(null)
    const titleRef = useRef(null)
    const cardsRef = useRef([])

    useGSAP(() => {
        // Title Animation (Simple Stagger)
        // We will target the spans inside the title
        const chars = titleRef.current.querySelectorAll('.char')
        gsap.fromTo(chars,
            {
                y: 50,
                opacity: 0,
                rotateX: -90
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                stagger: 0.05,
                duration: 1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        )

        // Cards Animation
        gsap.fromTo(cardsRef.current,
            { y: 100, opacity: 0, scale: 0.8 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                stagger: 0.2,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                }
            }
        )
    }, { scope: containerRef })

    const amenitiesData = [
        {
            id: 1,
            title: "Family Friendly",
            icon: <Baby size={20} className="text-white" />,
            notification: 0,
            gradient: "from-pink-500 via-red-500 to-yellow-500",
            glowColor: "rgba(236, 72, 153, 0.4)",
            imgClass: "bg-gradient-to-br from-gray-900 to-black" // Placeholder for image
        },
        {
            id: 2,
            title: "Reservations",
            icon: <Calendar size={20} className="text-white" />,
            notification: 0,
            gradient: "from-purple-500 via-pink-500 to-red-500",
            glowColor: "rgba(168, 85, 247, 0.4)",
            imgClass: "bg-gradient-to-bl from-gray-800 to-black"
        },
        {
            id: 3,
            title: "Alcohol",
            icon: <Martini size={20} className="text-white" />,
            notification: 0,
            gradient: "from-blue-500 via-indigo-500 to-purple-500",
            glowColor: "rgba(59, 130, 246, 0.4)",
            imgClass: "bg-gradient-to-tr from-gray-900 to-blue-950"
        },
        {
            id: 4,
            title: "Accessibility",
            icon: <Accessibility size={20} className="text-white" />,
            notification: 0,
            gradient: "from-green-400 via-emerald-500 to-teal-500",
            glowColor: "rgba(34, 197, 94, 0.4)",
            imgClass: "bg-gradient-to-tl from-gray-900 to-green-950"
        }
    ]

    // Helper to split text
    const splitTitle = "Explore Amenities".split("").map((char, index) => (
        <span key={index} className="char inline-block whitespace-pre">
            {char}
        </span>
    ))

    return (
        <div ref={containerRef} className="py-24 w-full relative z-10 overflow-hidden bg-white text-black transition-colors duration-500">
            {/* Header Section */}
            <div className="container mx-auto px-4 mb-20">
                <div className="flex flex-col items-center justify-center text-center">
                    <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 overflow-hidden">
                        {splitTitle}
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Experience world-class amenities designed for your comfort and lifestyle.
                    </p>
                </div>
            </div>

            {/* Cards Container */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {amenitiesData.map((item, index) => (
                        <div
                            key={item.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group relative h-80 rounded-[2.5rem] bg-gray-50 overflow-hidden border border-gray-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl"
                        >
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${item.gradient} transition-opacity duration-500`} />

                            {/* Content */}
                            <div className="relative h-full p-8 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${item.gradient}`}
                                        style={{ boxShadow: `0 10px 20px ${item.glowColor}` }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-black transition-colors">↗</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-300">{item.title}</h3>
                                    <div className={`w-full h-1 rounded-full bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                                </div>
                            </div>

                            {/* Decorative Circle/Image Placeholder */}
                            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full ${item.imgClass} opacity-50 blur-2xl group-hover:opacity-80 transition-all duration-500 group-hover:scale-125`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Amenities
