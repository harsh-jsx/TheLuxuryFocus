import React, { useRef } from 'react';
import { Check, X, ArrowRight, Image, Video, Link as LinkIcon, MessageCircle, BarChart3, Clock, Users, Mic, Mail, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSelectedPackageOptionStore } from '../stores/packageStore';
import { useNavigate } from 'react-router-dom';
const packagesData = [
    {
        id: 1,
        name: "Basic",
        price: "₹200",
        period: "",
        description: "Essential presence for starters.",
        features: [
            { name: "2-3 Basic Images", included: true, icon: <Image size={14} /> },
            { name: "Website Link", included: true, icon: <LinkIcon size={14} /> },
            { name: "Contact Number", included: true, icon: <MessageCircle size={14} /> },
            { name: "Email ID", included: true, icon: <Mail size={14} /> },
            { name: "Video Uploads", included: false, icon: <Video size={14} /> },
            { name: "Social Media Integration", included: false, icon: <Users size={14} /> },
        ],
        gradient: "from-gray-500 to-gray-700",
        delay: 0
    },
    {
        id: 2,
        name: "Standard",
        price: "₹500",
        period: "",
        tag: "Popular",
        description: "Enhanced visibility with multimedia.",
        features: [
            { name: "5 Images", included: true, icon: <Image size={14} /> },
            { name: "2 Videos", included: true, icon: <Video size={14} /> },
            { name: "YouTube Link", included: true, icon: <Video size={14} /> },
            { name: "Instagram Link", included: true, icon: <LinkIcon size={14} /> },
            { name: "Full Social Media Integration", included: true, icon: <Users size={14} /> },
            { name: "Analytics", included: false, icon: <BarChart3 size={14} /> },
        ],
        gradient: "from-blue-600 to-cyan-500",
        delay: 0.2
    },
    {
        id: 3,
        name: "Premium",
        price: "₹2000",
        period: "",
        tag: "Best Value",
        description: "Maximum impact and priority support.",
        features: [
            { name: "Up to 25 Pictures", included: true, icon: <Image size={14} /> },
            { name: "10 Videos", included: true, icon: <Video size={14} /> },
            { name: "All Social Media Links", included: true, icon: <LinkIcon size={14} /> },
            { name: "Priority Support", included: true, icon: <Clock size={14} /> },
            { name: "24/7 WhatsApp Chatbot", included: true, icon: <MessageCircle size={14} /> },
            { name: "Google Review & Analytics", included: true, icon: <BarChart3 size={14} /> },
        ],
        gradient: "from-amber-500 to-orange-600",
        delay: 0.4
    }
];

const personalizedServices = [
    { title: "Social Media Management", price: "Hourly", icon: <Users size={24} /> },
    { title: "Content Creation", price: "Hourly", icon: <Video size={24} /> },
    { title: "Marketing Services", price: "Hourly", icon: <BarChart3 size={24} /> },
    { title: "Telecalling Services", price: "Hourly", icon: <MessageCircle size={24} /> },
    { title: "Email Marketing", price: "Hourly", icon: <Mail size={24} /> },
    { title: "SMS Marketing", price: "Hourly", icon: <MessageCircle size={24} /> },
    { title: "Event Anchoring", price: "₹2500/day - ₹1L/mo", icon: <Mic size={24} /> },
    { title: "Event Management", price: "Custom Quote", icon: <Calendar size={24} /> },
];

const Packages = () => {

    let navigate = useNavigate()
    const selectedPackageOption = useSelectedPackageOptionStore((state) => state.selectedPackageOption);
    const setSelectedPackageOption = useSelectedPackageOptionStore((state) => state.setSelectedPackageOption);
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);
    const tableRef = useRef(null);
    const servicesRef = useRef(null);


    const selectPackage = (pkg) => {
        console.log('12');
        setSelectedPackageOption(pkg);
        setTimeout(() => {
            navigate('/contact');
        }, 1000);
    };

    useGSAP(() => {
        const tl = gsap.timeline();
        const cards = cardsRef.current.filter(Boolean);

        // Ensure elements are visible if animation fails or for debugging
        // Using .from with clearProps or just simple y animation for now to test visibility

        tl.from(titleRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })


    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen bg-white text-black py-32 px-4 relative overflow-hidden">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header */}
                <div ref={titleRef} className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-[Albra]">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Excellence</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-light font-[ABC]">
                        Select the perfect plan to elevate your business presence and reach the right audience effectively.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-32">
                    {packagesData.map((pkg, index) => (
                        <div
                            key={pkg.id}
                            ref={el => cardsRef.current[index] = el}
                            className={`relative group rounded-[2rem] p-[1px] bg-white border transition-all duration-300
                                ${selectedPackageOption?.id === pkg.id
                                    ? 'border-purple-600 shadow-2xl ring-4 ring-purple-100 scale-[1.02] z-20'
                                    : 'border-gray-100 shadow-xl hover:shadow-2xl hover:scale-[1.01]'} 
                                ${pkg.tag && selectedPackageOption?.id !== pkg.id ? 'lg:-mt-8 lg:z-10 ring-4 ring-purple-50' : ''}`}
                        >
                            <div className="h-full bg-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden flex flex-col">

                                {/* Popular Tag */}
                                {pkg.tag && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl font-[ABC]">
                                        {pkg.tag}
                                    </div>
                                )}

                                {/* Hover Glow */}

                                {/* Header */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-900 font-[Albra]">{pkg.name} Package</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl md:text-5xl font-bold text-gray-900 font-[Albra]">{pkg.price}</span>
                                        <span className="text-gray-500 font-[ABC]">{pkg.period}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed border-b border-gray-100 pb-6 font-[ABC]">
                                        {pkg.description}
                                    </p>
                                </div>

                                {/* Features List */}
                                <div className="space-y-4 mb-10 flex-grow">
                                    {pkg.features.map((feature, i) => (
                                        <div key={i} className="flex items-center justify-between group/feature">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${feature.included ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-400'}`}>
                                                    {feature.included ? <Check size={14} /> : <X size={14} />}
                                                </div>
                                                <span className={`text-sm flex items-center gap-2 font-[ABC] ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                                                    {feature.icon && <span className="opacity-70">{feature.icon}</span>}
                                                    {feature.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Button */}
                                <button
                                    disabled={selectedPackageOption?.id === pkg.id}
                                    onClick={() => selectPackage(pkg)}
                                    className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2  font-[ABC]
                                    ${selectedPackageOption?.id === pkg.id
                                            ? 'bg-purple-600 text-white cursor-default'
                                            : pkg.tag
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 text-white'
                                                : 'bg-gray-50 text-black hover:bg-gray-100 border border-gray-200'
                                        }`}>
                                    {selectedPackageOption?.id === pkg.id ? 'Selected' : 'Get Started'}
                                    {selectedPackageOption?.id !== pkg.id && <ArrowRight size={16} />}
                                </button>
                                <p className='text-center m-2'>
                                    {selectedPackageOption?.id === pkg.id ? 'Redirecting to Payment page...' : ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Package Benefits Table */}
                <div ref={tableRef} className="mb-32">
                    <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center font-[Albra]">Package Comparison</h2>
                    <div className="overflow-x-auto rounded-3xl shadow-xl border border-gray-100">
                        <table className="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-6 font-[Albra] text-xl text-gray-900">Package</th>
                                    <th className="p-6 font-[Albra] text-xl text-gray-900">Images</th>
                                    <th className="p-6 font-[Albra] text-xl text-gray-900">Videos</th>
                                    <th className="p-6 font-[Albra] text-xl text-gray-900">Links</th>
                                    <th className="p-6 font-[Albra] text-xl text-gray-900">Support</th>
                                    <th className="p-6 font-[Albra] text-xl text-gray-900">Price</th>
                                </tr>
                            </thead>
                            <tbody className="font-[ABC]">
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6 font-bold text-gray-900">Basic</td>
                                    <td className="p-6 text-gray-600">2-3</td>
                                    <td className="p-6 text-gray-400">-</td>
                                    <td className="p-6 text-gray-600">Website, Contact, Email</td>
                                    <td className="p-6 text-gray-600">Standard</td>
                                    <td className="p-6 font-bold text-gray-900">₹200</td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6 font-bold text-blue-600">Standard</td>
                                    <td className="p-6 text-gray-600">5</td>
                                    <td className="p-6 text-gray-600">2</td>
                                    <td className="p-6 text-gray-600">YouTube, Insta, Socials</td>
                                    <td className="p-6 text-gray-600">Standard</td>
                                    <td className="p-6 font-bold text-blue-600">₹500</td>
                                </tr>
                                <tr className="hover:bg-gray-50/50 transition-colors bg-purple-50/30">
                                    <td className="p-6 font-bold text-purple-600">Premium</td>
                                    <td className="p-6 text-gray-600">25 (Max)</td>
                                    <td className="p-6 text-gray-600">10</td>
                                    <td className="p-6 text-gray-600">All Social Media</td>
                                    <td className="p-6 text-gray-600">Priority + 24/7 Bot</td>
                                    <td className="p-6 font-bold text-purple-600">₹2000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Personalized Services Section */}
                <div ref={servicesRef} className="pb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center font-[Albra]">Personalized Services</h2>
                    <p className="text-gray-500 text-center mb-12 font-[ABC]">Tailored solutions to meet your specific business needs on an hourly or project basis.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {personalizedServices.map((service, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 text-purple-600 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 font-[Albra]">{service.title}</h3>
                                <p className="text-sm text-gray-500 font-bold font-[ABC]">{service.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Packages;