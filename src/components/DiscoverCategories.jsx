import React, { useRef } from 'react'
import { Moon, Coffee, MapPin, Bed, Sparkles, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
    {
        id: 1,
        title: 'FAMILY FRIENDLY',
        icon: Moon,
        image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop',
        desc: "It's always time for fun.",
        count: 12,
        span: 'md:col-span-2 md:row-span-2',
        aspect: 'aspect-square md:aspect-auto',
    },
    {
        id: 2,
        title: 'RESERVATIONS',
        icon: Coffee,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1947&auto=format&fit=crop',
        desc: "Coffee solves everything.",
        count: 8,
        span: 'md:col-span-1 md:row-span-1',
        aspect: 'aspect-square',
    },
    {
        id: 3,
        title: 'ALCOHOL',
        icon: MapPin,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop',
        desc: "Dream, breathe, explore.",
        count: 24,
        span: 'md:col-span-1 md:row-span-1',
        aspect: 'aspect-square',
    },
    {
        id: 4,
        title: 'ACCESSIBILITY',
        icon: Bed,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
        desc: "Hospitality and comfort.",
        count: 15,
        span: 'sm:col-span-2 md:col-span-3 md:row-span-1',
        aspect: 'aspect-[2/1] md:aspect-[3/1]',
    },
]

const DiscoverCategories = () => {
    const containerRef = useRef(null)
    const cardsRef = useRef([])
    const headerRef = useRef(null)

    useGSAP(() => {
        gsap.fromTo(
            headerRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        )

        const cards = cardsRef.current.filter(Boolean)
        gsap.fromTo(
            cards,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
            }
        )
    }, { scope: containerRef })

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-foreground">
            {/* Ambient background effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
                {/* Header */}
                <div ref={headerRef} className="mb-14 sm:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-semibold tracking-[0.15em] text-primary uppercase">Discover</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-5">
                        Are you still
                        <br />
                        <span className="text-gradient-pink">lost?</span>
                    </h1>

                    <p className="text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed">
                        Try the following suggested topics to find exactly what you're looking for.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-white sm:gap-5 auto-rows-[minmax(220px,auto)]">
                    {categories.map((cat, i) => {
                        const Icon = cat.icon
                        return (
                            <div
                                key={cat.id}
                                ref={(el) => { cardsRef.current[i] = el }}
                                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer ${cat.span} ${cat.aspect}`}
                            >
                                {/* Image */}
                                <img
                                    src={cat.image}
                                    alt={cat.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
                                <div className="absolute inset-0 bg-background/10 group-hover:bg-background/0 transition-colors duration-500" />

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-7">
                                    {/* Top row */}
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-foreground/10 backdrop-blur-md border border-foreground/10 flex items-center justify-center text-foreground group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:text-primary transition-all duration-500">
                                            <Icon className="w-4.5 h-4.5" />
                                        </div>

                                        <div className="w-8 h-8 rounded-full bg-foreground/10 backdrop-blur-md border border-foreground/10 flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                            <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
                                        </div>
                                    </div>

                                    {/* Bottom row */}
                                    <div>
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <span className="text-[10px] sm:text-[12px] font-bold tracking-[0.2em] text-foreground/90">
                                                {cat.title}
                                            </span>
                                            <span className="text-[10px] font-semibold text-primary bg-primary/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                {cat.count}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground/50 group-hover:text-foreground/70 transition-colors duration-500 leading-relaxed">
                                            {cat.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover border glow */}
                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-foreground/[0.06] group-hover:border-primary/30 transition-colors duration-500" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default DiscoverCategories