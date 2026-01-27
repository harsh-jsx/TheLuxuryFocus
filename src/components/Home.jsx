import React from 'react'
import Hero from './Hero'
import About from './About'
import Services from './Services'
import Gallery from './Gallery'
import Footer from './Footer'

const Home = () => {
    return (
        <div className="bg-[#0a0a0a] min-h-screen">
            <Hero />
            {/* <About /> */}
            <Services />
            <Gallery />
            <Footer />
        </div>
    )
}

export default Home