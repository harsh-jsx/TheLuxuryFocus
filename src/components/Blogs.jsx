import React, { useRef, useState, useEffect } from 'react'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from './SplitText'
import { blogService } from '../services/blogService'

gsap.registerPlugin(ScrollTrigger)

const Blogs = () => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const containerRef = useRef(null)
    const titleRef = useRef(null)
    const postsRef = useRef([])

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await blogService.getFeaturedBlogs(3)
                setBlogs(data)
            } catch (error) {
                console.error("Failed to fetch blogs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    useGSAP(() => {
        if (!loading && blogs.length > 0) {
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
        }
    }, { scope: containerRef, dependencies: [loading, blogs] })

    return (
        <section ref={containerRef} className="py-24 bg-white text-black overflow-hidden min-h-[600px]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div ref={titleRef} className="text-center mb-16">
                    <SplitText className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                        Latest Insights
                    </SplitText>
                    <div className="w-20 h-1 bg-black mx-auto"></div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">Curating the finest articles...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">No articles found in our collection yet.</p>
                        <p className="text-sm text-gray-400 mt-2">Check back soon for exclusive updates.</p>
                    </div>
                ) : (
                    /* Blog Grid */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogs.map((post, index) => (
                            <article
                                key={post.id}
                                ref={el => postsRef.current[index] = el}
                                className="group cursor-pointer flex flex-col h-full"
                                onClick={() => navigate(`/blog/${post.id}`)}
                            >
                                {/* Image Container */}
                                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-4/3">
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
                                <div className="flex flex-col grow">
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
                )}
            </div>
        </section>
    )
}

export default Blogs
