import React, { useRef } from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'
import HomeCities from '../components/HomeCities'
import DiscoverCategories from '../components/DiscoverCategories'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
    const mainContainerRef = useRef(null)

    useGSAP(() => {
        // Theme Transition: Black -> White
        // Trigger when the Cities section starts coming into view

        ScrollTrigger.create({
            trigger: ".cities-section",
            start: "top 80%", // Start transition when top of cities is 80% down viewport
            end: "top 20%",   // End transition when top of cities is 20% down viewport
            scrub: true,
            onUpdate: (self) => {
                // Interpolate colors or simplest way: just animate the main container bg
                const progress = self.progress
                gsap.to(mainContainerRef.current, {
                    backgroundColor: progress > 0.1 ? "#ffffff" : "#0a0a0a",
                    duration: 0.5,
                    overwrite: true
                })
            }
        });

        // Simpler approach with direct toggle or tween
        gsap.to(mainContainerRef.current, {
            backgroundColor: "#ffffff",
            scrollTrigger: {
                trigger: ".cities-section",
                start: "top center", // Transition happens around center
                end: "top top",
                toggleActions: "play none none reverse", // Play going down, reverse going up
                scrub: 1 // Smooth scrubbing
            }
        })

    }, { scope: mainContainerRef })

    return (
        <div ref={mainContainerRef} className="bg-[#0a0a0a] min-h-screen transition-colors duration-500">
            <Hero />
            <HomeCities />
            <DiscoverCategories />
            {/* <About /> */}
            <Services />
            <Gallery />
            <Footer />
        </div>
    )
}

export default Home