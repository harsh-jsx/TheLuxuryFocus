import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  const baseNavLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    {
      title: "Categories",
      path: "/categories",
    },
    { title: "Packages", path: "/packages" },
    { title: "Services", path: "/services" },
    { title: "Gallery", path: "/gallery" },
    { title: "Stores", path: "/stores" },
    { title: "Dashboard", path: "/dashboard" },
    ...(isAdmin ? [{ title: "Admin", path: "/admin" }] : []),
  ];

  const navLinks = [
    ...baseNavLinks,
    currentUser
      ? {
          title: "Logout",
          path: "/", // Redirect to home after logout usually, or keep on same page
          action: () => {
            logout();
            setIsMenuOpen(false);
          },
        }
      : {
          title: "Login",
          path: "/login",
        },
  ];

  // Smart Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) return; // Don't hide if menu is open
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  // Menu Animation
  useGSAP(() => {
    if (isMenuOpen) {
      // Document body lock
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline();

      // Overlay Slide Down
      tl.to(menuRef.current, {
        yPercent: 0,
        duration: 1,
        ease: "power4.inOut",
      })

        // Stagger Links
        .from(
          ".menu-link-item",
          {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5",
        )

        // Fade in details/line
        .from(
          ".menu-divider",
          {
            scaleX: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .from(
          ".menu-details",
          {
            opacity: 0,
            duration: 0.5,
          },
          "-=0.5",
        );
    } else {
      document.body.style.overflow = "auto";
      gsap.to(menuRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
      });
    }
  }, [isMenuOpen]);

  return (
    <div ref={containerRef}>
      {/* Top Bar — responsive padding, safe area, touch targets */}
      <nav
        className={`fixed top-0 left-0 w-full z-999 flex justify-between items-center transition-transform duration-500 ease-in-out mix-blend-difference text-[#E4E0D9]
                pt-[max(1.5rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))]
                pl-[max(1rem,env(safe-area-inset-left))] pb-4
                sm:px-6 sm:py-5 lg:px-8 lg:py-6
                ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* Logo — scale by breakpoint */}
        <Link
          to="/"
          className="font-[Albra] text-2xl sm:text-3xl lg:text-3xl tracking-tighter relative z-1000 py-2"
        >
          TLF
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 relative z-1000">
          {/* Menu Toggle — 44px min touch target on mobile/tablet */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="font-[ABC] text-[15px] sm:text-xl uppercase tracking-widest hover:opacity-70 active:opacity-80 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-end text-right group relative z-50"
          >
            <span className="block relative group-hover:-translate-y-full transition-transform duration-300 h-3 sm:h-4 overflow-hidden">
              <span className="h-full flex items-center justify-end">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
              <span className="absolute top-full left-0 w-full text-right h-full flex items-center justify-end">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
            </span>
          </button>
        </div>
      </nav>

      {/* Fullscreen menu — scrollable on mobile, two-column on tablet+ */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-[#0a0a0a] z-990 text-[#E4E0D9] flex flex-col md:flex-row
                pt-[max(5rem,calc(env(safe-area-inset-top)+4rem))] pb-[max(2rem,env(safe-area-inset-bottom))]
                px-4 sm:px-6 lg:px-8"
      >
        {/* Visual Divider — tablet and up */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 menu-divider origin-top" />

        {/* Left: Nav links — scrollable on small screens, centered on large */}
        <div className="w-full md:w-1/2 min-h-0 flex flex-col justify-center md:justify-center items-start md:pl-12 lg:pl-20 gap-2 sm:gap-3 md:gap-4 overflow-y-auto overscroll-contain">
          {navLinks.map((link, index) => (
            <div
              key={index}
              className="overflow-hidden menu-link-item shrink-0"
              onMouseEnter={() => setActiveLinkIndex(index)}
              onMouseLeave={() => setActiveLinkIndex(null)}
            >
              {link.action ? (
                <button
                  type="button"
                  onClick={link.action}
                  className={`font-[Albra] tracking-tight transition-all duration-300 block text-left py-1
                                    text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                                    touch-manipulation
                                    ${activeLinkIndex !== null && activeLinkIndex !== index ? "opacity-30 blur-[2px] scale-95" : "opacity-100 scale-100"}`}
                >
                  {link.title}
                </button>
              ) : (
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-[Albra] tracking-tight transition-all duration-300 block py-1
                                    text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                                    touch-manipulation
                                    ${activeLinkIndex !== null && activeLinkIndex !== index ? "opacity-30 blur-[2px] scale-95" : "opacity-100 scale-100"}`}
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right: Details — hidden on small mobile, visible tablet+ */}
        <div className="w-full md:w-1/2 min-h-0 flex flex-col justify-center items-start md:pl-12 lg:pl-20 menu-details mt-6 md:mt-0 shrink-0">
          <div className="w-full min-h-[200px] md:min-h-[300px] flex flex-col justify-center">
            {activeLinkIndex !== null && navLinks[activeLinkIndex].dropdown ? (
              <div className="flex flex-col gap-3 md:gap-4">
                <p className="font-[ABC] text-[10px] sm:text-xs uppercase tracking-widest opacity-50 mb-2 md:mb-4">
                  Explore {navLinks[activeLinkIndex].title}
                </p>
                {navLinks[activeLinkIndex].dropdown.map((sub, i) => (
                  <Link
                    key={i}
                    to={sub.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-[Albra] text-2xl sm:text-3xl md:text-4xl text-white/80 hover:text-white hover:translate-x-2 md:hover:translate-x-4 transition-all duration-300 py-0.5"
                  >
                    {sub.title}
                  </Link>
                ))}
              </div>
            ) : activeLinkIndex !== null ? (
              <div className="flex flex-col gap-2 md:gap-4">
                <p className="font-[ABC] text-[10px] sm:text-xs uppercase tracking-widest opacity-50 mb-2 md:mb-4">
                  Quick Link
                </p>
                <span className="font-[Albra] text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/50 italic">
                  Go to {navLinks[activeLinkIndex].title} Page &rarr;
                </span>
              </div>
            ) : (
              <div className="hidden md:flex flex-col gap-2 opacity-30">
                <p className="font-[ABC] text-xs uppercase tracking-widest">
                  The Luxury Focus
                </p>
                <p className="font-[Albra] text-xl lg:text-2xl">
                  Elevating brands through
                  <br />
                  digital excellence.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
