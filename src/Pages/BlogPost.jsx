import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { blogService } from '../services/blogService'
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitText from '../components/SplitText'

const BlogPost = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await blogService.getBlogById(id)
                if (data) {
                    setBlog(data)
                } else {
                    // Navigate back or show 404
                    console.error("Blog post not found")
                }
            } catch (error) {
                console.error("Failed to fetch blog:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
        window.scrollTo(0, 0)
    }, [id])

    useGSAP(() => {
        if (!loading && blog) {
            const tl = gsap.timeline()

            tl.from(".blog-header", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            })
                .from(".blog-image", {
                    scale: 1.1,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.out"
                }, "-=0.5")
                .from(".blog-content", {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.8")
        }
    }, [loading, blog])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
                <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="bg-white min-h-screen pb-24">
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-black z-50 origin-left"
                style={{ scaleX }}
            />

            {/* Navigation */}
            <nav className="fixed top-8 left-8 z-40">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-black border border-gray-100"
                >
                    <ArrowLeft size={24} />
                </button>
            </nav>

            {/* Hero Section */}
            <header className="relative w-full h-[70vh] overflow-hidden">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="blog-image w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-16">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap items-center gap-4 text-white/80 mb-6 blog-header">
                            <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white border border-white/20">
                                {blog.category}
                            </span>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Calendar size={16} />
                                <span>{blog.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Clock size={16} />
                                <span>{blog.readingTime || '5 min'} read</span>
                            </div>
                        </div>
                        <h1 className="blog-header text-4xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tighter max-w-4xl">
                            {blog.title}
                        </h1>
                        <div className="flex items-center gap-4 blog-header">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${blog.author || 'Admin'}&background=random`}
                                    alt={blog.author}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-white">
                                <p className="text-sm font-bold">{blog.author || 'The Luxury Focus'}</p>
                                <p className="text-xs text-white/60">Expert Columnist</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <main className="container mx-auto px-4 md:px-8 -mt-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Sidebar - Socials */}
                    <div className="hidden lg:flex flex-col gap-6 sticky top-32 h-fit">
                        <button className="p-4 rounded-full border border-gray-100 hover:bg-black hover:text-white transition-all">
                            <Share2 size={20} />
                        </button>
                        <button className="p-4 rounded-full border border-gray-100 hover:bg-black hover:text-white transition-all">
                            <Bookmark size={20} />
                        </button>
                    </div>

                    {/* Main Content */}
                    <article className="blog-content w-full lg:max-w-4xl bg-white p-8 md:p-16 rounded-4xl shadow-2xl shadow-gray-200/50">
                        {/* Excerpt */}
                        <p className="text-2xl md:text-3xl font-medium text-gray-800 mb-12 leading-relaxed tracking-tight italic border-l-4 border-black pl-8">
                            {blog.excerpt}
                        </p>

                        {/* Body */}
                        <div className="prose prose-xl prose-slate max-w-none text-gray-700 leading-relaxed space-y-8">
                            {blog.content ? (
                                <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                            ) : (
                                <>
                                    <p>
                                        In the ever-evolving world of luxury living, the definition of opulence is shifting from mere material abundance to meaningful experiences and sustainable elegance. Today's discerning homeowners are looking beyond the surface, seeking environments that resonate with their values and enhance their well-being.
                                    </p>
                                    <h2 className="text-3xl font-bold text-black mt-12 mb-6">Designing for the Future</h2>
                                    <p>
                                        Modern architecture is increasingly integrating nature within its core structure. Biophilic design is no longer just a trend; it's a cornerstone of high-end real estate. From vertical gardens to indoor waterfalls, the line between internal and external spaces is blurring, creating a harmonious sanctuary that promotes tranquility.
                                    </p>
                                    <blockquote className="my-12 p-8 bg-gray-50 rounded-2xl border-l-8 border-black font-semibold text-2xl text-black">
                                        "Luxury is not about what you have, but how you feel in the space you inhabit."
                                    </blockquote>
                                    <p>
                                        Technology also plays a pivotal role. Smart home systems are becoming invisible, operating seamlessly in the background to anticipate needs and optimize energy consumption. The goal is "quiet luxury"—sophistication that doesn't need to shout to be noticed.
                                    </p>
                                    <p>
                                        As we look towards 2026, we expect to see even more emphasis on modularity and adaptability in luxury interiors. Homes will need to function as offices, wellness retreats, and social hubs simultaneously, all while maintaining an uncompromising standard of style and comfort.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Footer / Tags */}
                        <footer className="mt-16 pt-16 border-t border-gray-100">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share this:</span>
                                    <div className="flex gap-4">
                                        <button className="text-gray-400 hover:text-blue-600 transition-colors">Twitter</button>
                                        <button className="text-gray-400 hover:text-blue-700 transition-colors">LinkedIn</button>
                                        <button className="text-gray-400 hover:text-red-600 transition-colors">Facebook</button>
                                    </div>
                                </div>
                                <Link
                                    to="/"
                                    className="flex items-center gap-2 group font-bold text-black"
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">Next Article</span>
                                    <ArrowLeft className="rotate-180" size={20} />
                                </Link>
                            </div>
                        </footer>
                    </article>

                    {/* Right Sidebar - Newsletter/Related (Optional) */}
                    <div className="lg:w-80 flex flex-col gap-8">
                        <div className="bg-black text-white p-8 rounded-3xl">
                            <h3 className="text-2xl font-bold mb-4 tracking-tighter">Stay Inspired</h3>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">Join 10,000+ readers for weekly insights into the world of luxury.</p>
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white mb-4"
                            />
                            <button className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm uppercase tracking-wider">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default BlogPost
