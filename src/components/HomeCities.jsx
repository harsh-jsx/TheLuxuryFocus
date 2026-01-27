import React from 'react'
import { ArrowRight } from 'lucide-react'

const cities = [
    { name: 'AGRA', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=2071&auto=format&fit=crop' },
    { name: 'CHENNAI', image: 'https://images.unsplash.com/photo-1582510003544-bea4db3e62df?q=80&w=2070&auto=format&fit=crop' },
    { name: 'JAIPUR', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop' },
    { name: 'AHMEDABAD', image: 'https://plus.unsplash.com/premium_photo-1697730221799-f2aa87b54d3e?q=80&w=2070&auto=format&fit=crop' },
    { name: 'HYDERABAD', image: 'https://images.unsplash.com/photo-1626014902271-bfbd98c39db8?q=80&w=2070&auto=format&fit=crop' },
    { name: 'LUCKNOW', image: 'https://images.unsplash.com/photo-1589403816223-b1d3d63bd1f6?q=80&w=2070&auto=format&fit=crop' },
]

const HomeCities = () => {
    return (
        <section className="cities-section py-24 px-4 w-full bg-white text-black min-h-screen flex flex-col items-center">

            <div className="text-center mb-16 max-w-3xl">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-[Albra] mb-4 tracking-tight">
                    What City Would You Like To Explore?
                </h2>
                {/* Decorative line */}
                <div className="w-32 h-1 mx-auto bg-linear-to-r from-pink-500 via-yellow-400 to-purple-500 rounded-full mb-6"></div>

                <p className="font-[ABC] text-gray-600 text-lg">
                    Easily find the most appreciated and recommended gems in the neighborhoods.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
                {cities.map((city, index) => (
                    <div key={index} className="group relative w-full h-[300px] md:h-[350px] rounded-[50%] overflow-hidden cursor-pointer shadow-xl transition-transform hover:-translate-y-2 duration-300">
                        {/* Image */}
                        <img
                            src={city.image}
                            alt={city.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>

                        {/* Badge Name */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
                            <div className="bg-white px-8 py-2 relative shadow-lg">
                                {/* Triangle Cutouts/Styling could be added via CSS clip-path if needed for exact look, keeping clean for now */}
                                <span className="text-black font-[ABC] font-bold tracking-widest text-sm md:text-base uppercase z-10 relative">
                                    {city.name}
                                </span>
                            </div>
                        </div>

                        {/* Bottom Action Icon */}
                        <div className="absolute bottom-6 right-8 z-10">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full rounded-bl-none flex items-center justify-center shadow-lg group-hover:bg-yellow-300 transition-colors">
                                <ArrowRight className="text-white w-5 h-5 md:w-6 md:h-6 -rotate-45" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    )
}

export default HomeCities