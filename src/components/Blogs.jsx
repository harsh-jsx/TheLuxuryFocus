import React, { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const blogsStartData = [
    {
        id: 1,
        title: "The Future of Luxury Living",
        category: "Real Estate",
        date: "Oct 12, 2025",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        excerpt: "Discover how technology and sustainable design are reshaping the landscape of modern luxury homes."
    },
    {
        id: 2,
        title: "Top 10 Amenities for 2025",
        category: "Lifestyle",
        date: "Sep 28, 2025",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        excerpt: "From private wellness centers to smart home integration, explore the must-have amenities for the coming year."
    },
    {
        id: 3,
        title: "Investing in Premium Properties",
        category: "Investment",
        date: "Sep 15, 2025",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
        excerpt: "Expert insights on why premium real estate remains a solid investment strategy in a fluctuating market."
    }
]

const Blogs = () => {
    const containerRef = useRef(null)
    const titleRef = useRef(null)
    const postsRef = useRef([])

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "bottom center",
                toggleActions: "play none none reverse"
            }
        })

        tl.from(titleRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
            .from(postsRef.current, {
                y: 100,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.4")

    }, { scope: containerRef })

    return (
        <section ref={containerRef} className="py-24 bg-white text-black overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                        Latest Insights
                    </h2>
                    <div className="w-20 h-1 bg-black mx-auto"></div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogsStartData.map((post, index) => (
                        <article
                            key={post.id}
                            ref={el => postsRef.current[index] = el}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[4/3]">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {post.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                                    <span>{post.date}</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-gray-600 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between group-hover:text-blue-600 transition-colors">
                                    <span className="font-bold text-sm uppercase tracking-wide">Read Article</span>
                                    <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Blogs
