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
            <div className="text-center mb-16 px-4">
                <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-4 overflow-hidden">
                    {splitTitle}
                </h2>
                <div className="h-1 w-24 mx-auto bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full mb-6"></div>
                <p className="text-gray-500 text-sm md:text-base font-medium max-w-lg mx-auto">
                    Are you still lost? You can try the following suggested topics...
                </p>
            </div>

            {/* Cards Container */}
            <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-12">
                {amenitiesData.map((item, index) => (
                    <div
                        key={item.id}
                        ref={el => cardsRef.current[index] = el}
                        className="group relative w-64 h-64 md:w-72 md:h-72 shrink-0 cursor-pointer"
                    >
                        {/* Main Circle with Gradient Border */}
                        <div className={`absolute inset-0 rounded-full p-2 bg-linear-to-br ${item.gradient} transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6 shadow-xl`}
                            style={{ boxShadow: `0 0 30px ${item.glowColor}` }}
                        >
                            {/* Inner Content Circle */}
                            <div className={`w-full h-full rounded-full ${item.imgClass} flex items-center justify-center relative overflow-hidden border-4 border-black`}>

                                {/* Decorative Neon Lines/Glow (Simulated) */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white to-transparent scale-0 group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>

                                {/* Central Text Pill */}
                                <div className="relative z-10 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                                    <span className="text-xs md:text-sm font-bold tracking-wider text-black uppercase">
                                        {item.title}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Floating Icon (Top Left) */}
                        <div className={`absolute top-4 left-4 w-12 h-12 rounded-full bg-linear-to-br ${item.gradient} p-0.5 z-20 shadow-lg transform transition-all duration-300 group-hover:-translate-y-2 group-hover:-translate-x-2`}>
                            <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center backdrop-blur-md">
                                {item.icon}
                            </div>
                        </div>

                        {/* Notification Badge (Bottom Right) */}
                        <div className={`absolute bottom-6 right-6 w-10 h-10 rounded-t-full rounded-bl-full bg-linear-to-br ${item.gradient} p-0.5 z-20 shadow-lg transform transition-all duration-300 group-hover:translate-y-2 group-hover:translate-x-2`}>
                            <div className="w-full h-full rounded-t-full rounded-bl-full bg-white flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-800">{item.notification}</span>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default Amenities
