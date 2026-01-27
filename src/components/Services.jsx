import React, { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const services = [
    { id: 1, name: "Brand Identity", desc: "Crafting unique visual languages." },
    { id: 2, name: "Web Design", desc: "Award-winning digital experiences." },
    { id: 3, name: "Development", desc: "Seamless, high-performance code." },
    { id: 4, name: "Content Strategy", desc: "Narratives that captivate." },
]

const Services = () => {
    const [hoveredService, setHoveredService] = useState(null)

    return (
        <section className="py-32 px-4 md:px-12 bg-[#0F0F0F] text-[#E4E0D9]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
                    <h2 className="font-[Albra] text-5xl md:text-7xl tracking-tighter">Our Expertise</h2>
                    <p className="font-[ABC] text-xs uppercase tracking-widest opacity-60 mb-2 md:mb-0">Comprehensive Solutions</p>
                </div>

                <div className="flex flex-col">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="group relative border-b border-white/10 py-12 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-500 hover:px-8 hover:bg-white/5 cursor-pointer"
                            onMouseEnter={() => setHoveredService(service.id)}
                            onMouseLeave={() => setHoveredService(null)}
                        >
                            <div className="flex items-center gap-6">
                                <span className="font-[ABC] text-xs opacity-30">0{service.id}</span>
                                <h3 className="font-[Albra] text-3xl md:text-5xl group-hover:translate-x-4 transition-transform duration-500">{service.name}</h3>
                            </div>

                            <div className="flex items-center gap-12 mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                <p className="font-[ABC] text-sm text-white/60 hidden md:block">{service.desc}</p>
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white text-black">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Services
