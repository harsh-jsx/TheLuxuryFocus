import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const navLinks = [
    { title: 'Home', path: '/' },
    {
        title: 'Categories',
        path: '/categories',

    },
    { title: 'Packages', path: '/packages' },
    {
        title: 'Account',
        path: '/login',

    },
    { title: 'Insights', path: '/insights' },
]

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeLinkIndex, setActiveLinkIndex] = useState(null)
    const [showNavbar, setShowNavbar] = useState(true)
    const lastScrollY = useRef(0)
    const containerRef = useRef(null)
    const menuRef = useRef(null)

    // Smart Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            if (isMenuOpen) return // Don't hide if menu is open
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                setShowNavbar(false)
            } else {
                setShowNavbar(true)
            }
            lastScrollY.current = currentScrollY
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isMenuOpen])

    // Menu Animation
    useGSAP(() => {
        if (isMenuOpen) {
            // Document body lock
            document.body.style.overflow = 'hidden'

            const tl = gsap.timeline()

            // Overlay Slide Down
            tl.to(menuRef.current, {
                yPercent: 0,
                duration: 1,
                ease: 'power4.inOut',
            })

                // Stagger Links
                .from('.menu-link-item', {
                    y: 100,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                }, '-=0.5')

                // Fade in details/line
                .from('.menu-divider', {
                    scaleX: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                }, '-=0.8')
                .from('.menu-details', {
                    opacity: 0,
                    duration: 0.5,
                }, '-=0.5')

        } else {
            document.body.style.overflow = 'auto'
            gsap.to(menuRef.current, {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
            })
        }
    }, [isMenuOpen])

    return (
        <div ref={containerRef}>
            {/* Top Bar */}
            <nav
                className={`fixed top-0 left-0 w-full z-999 px-8 py-6 flex justify-between items-center transition-transform duration-500 ease-in-out mix-blend-difference text-[#E4E0D9]
                ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
            >
                {/* Logo */}
                <Link to="/" className="font-[Albra] text-3xl tracking-tighter relative z-1000">
                    TLF
                </Link>

                <div className="flex items-center gap-8 relative z-1000">
                    {/* <Link
                        to="/contact"
                        className="hidden md:block font-[ABC] text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
                    >
                        Let's Talk
                    </Link> */}

                    {/* Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="font-[ABC] text-xs uppercase tracking-widest hover:opacity-70 transition-opacity w-12 text-right group relative z-50"
                    >
                        <span className="block relative group-hover:-translate-y-full transition-transform duration-300 h-3 md:h-4 overflow-hidden">
                            <span className="h-full flex items-center justify-end">{isMenuOpen ? 'Close' : 'Menu'}</span>
                            <span className="absolute top-full left-0 w-full text-right h-full flex items-center justify-end">{isMenuOpen ? 'Close' : 'Menu'}</span>
                        </span>
                    </button>
                </div>
            </nav>

            <div
                ref={menuRef}
                className="fixed inset-0 bg-[#0a0a0a] z-990 text-[#E4E0D9] pt-32 pb-10 px-8 flex flex-col md:flex-row"
            >
                {/* Visual Divider (Mobile: Hidden, Desktop: Vertical Line) */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 menu-divider origin-top" />

                {/* Left Column: Navigation Links */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-start md:pl-20 gap-4">
                    {navLinks.map((link, index) => (
                        <div
                            key={index}
                            className="overflow-hidden menu-link-item"
                            onMouseEnter={() => setActiveLinkIndex(index)}
                            onMouseLeave={() => setActiveLinkIndex(null)}
                        >
                            <Link
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`font-[Albra] text-6xl md:text-8xl tracking-tight transition-all duration-300 block
                                ${activeLinkIndex !== null && activeLinkIndex !== index ? 'opacity-30 blur-[2px] scale-95' : 'opacity-100 scale-100'}`}
                            >
                                {link.title}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Right Column: Sub-links / Details */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-start md:pl-20 menu-details mt-10 md:mt-0">
                    <div className="h-[300px] flex flex-col justify-center">
                        {activeLinkIndex !== null && navLinks[activeLinkIndex].dropdown ? (
                            <div className="flex flex-col gap-4">
                                <p className="font-[ABC] text-xs uppercase tracking-widest opacity-50 mb-4">
                                    Explore {navLinks[activeLinkIndex].title}
                                </p>
                                {navLinks[activeLinkIndex].dropdown.map((sub, i) => (
                                    <Link
                                        key={i}
                                        to={sub.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="font-[Albra] text-3xl md:text-4xl text-white/80 hover:text-white hover:translate-x-4 transition-all duration-300"
                                    >
                                        {sub.title}
                                    </Link>
                                ))}
                            </div>
                        ) : activeLinkIndex !== null ? (
                            <div className="flex flex-col gap-4">
                                <p className="font-[ABC] text-xs uppercase tracking-widest opacity-50 mb-4">
                                    Quick Link
                                </p>
                                <span className="font-[Albra] text-3xl md:text-4xl text-white/50 italic">
                                    Go to {navLinks[activeLinkIndex].title} Page &rarr;
                                </span>
                            </div>
                        ) : (
                            <div className="hidden md:flex flex-col gap-2 opacity-30">
                                <p className="font-[ABC] text-xs uppercase tracking-widest">
                                    The Luxury Focus
                                </p>
                                <p className="font-[Albra] text-2xl">
                                    Elevating brands through<br />digital excellence.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar