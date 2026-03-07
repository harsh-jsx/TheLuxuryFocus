import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storeService } from '../services/storeService';
import {
    MapPin, Instagram, Globe, Phone, Clock,
    Tag, ChevronLeft, Loader2, ArrowRight,
    ShoppingBag, Star, Share2, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StoreProfile = () => {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const data = await storeService.getStoreById(id);
                setStore(data);
            } catch (error) {
                console.error("Error loading store profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white space-y-4">
                <Loader2 className="animate-spin text-black" size={40} />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Curating Experience...</p>
            </div>
        );
    }

    if (!store) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
                <h2 className="text-3xl font-[Albra] mb-4">Store not found</h2>
                <Link to="/" className="text-sm font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">Return Home</Link>
            </div>
        );
    }

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    return (
        <div className="bg-white min-h-screen pb-20 overflow-x-hidden">
            {/* Header / Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-gray-100">
                <div className="absolute inset-0 z-10 bg-linear-to-b from-black/40 via-transparent to-white" />
                <img
                    src={store.bannerUrl || 'https://images.unsplash.com/photo-1497366216548-37526070a712?auto=format&fit=crop&q=80'}
                    alt={store.storeName}
                    className="w-full h-full object-cover scale-105"
                />

                <div className="absolute top-10 left-6 md:left-12 z-20">
                    <Link to="/" className="group flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-3 rounded-full hover:bg-white hover:text-black transition-all font-bold text-xs uppercase tracking-widest">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Directory
                    </Link>
                </div>

                <div className="absolute top-10 right-6 md:right-12 z-20 flex gap-3">
                    <button className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-all">
                        <Share2 size={20} />
                    </button>
                    <button className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full">
                        <Star size={20} />
                    </button>
                </div>

                {/* Identity Floating Card */}
                <div className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-12 pb-12 translate-y-12">
                    <motion.div
                        {...fadeIn}
                        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/5 flex flex-col md:flex-row items-center md:items-end gap-10 border border-gray-100"
                    >
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-gray-50 overflow-hidden border-8 border-white shadow-xl -mt-20 md:-mt-32 shrink-0">
                            <img src={store.logoUrl || 'https://via.placeholder.com/200'} alt={store.storeName} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                <span className="bg-black text-[10px] text-white px-4 py-1 rounded-full font-bold uppercase tracking-widest">{store.storeCategory}</span>
                                <span className="text-gray-900 font-bold text-sm tracking-widest">{store.priceRange}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-[Albra] text-gray-900 mb-4">{store.storeName}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-500 font-medium text-sm">
                                <span className="flex items-center gap-2"><MapPin size={16} className="text-black" /> {store.storeCity}, {store.storeState}</span>
                                {store.openingHours && <span className="flex items-center gap-2"><Clock size={16} className="text-black" /> {store.openingHours}</span>}
                            </div>
                        </div>

                        <div className="shrink-0 flex flex-col gap-4">
                            <button className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center gap-3">
                                Connect Now <ArrowRight size={16} />
                            </button>
                            <div className="flex items-center justify-center gap-6">
                                {store.storeInstagram && (
                                    <a href={`https://instagram.com/${store.storeInstagram}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                                        <Instagram size={20} />
                                    </a>
                                )}
                                {store.storeWebsite && (
                                    <a href={store.storeWebsite} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                                        <Globe size={20} />
                                    </a>
                                )}
                                {store.storePhone && (
                                    <a href={`tel:${store.storePhone}`} className="text-gray-400 hover:text-black transition-colors">
                                        <Phone size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="mt-40 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">

                {/* Left Side: About & Services */}
                <div className="lg:col-span-2 space-y-16">
                    <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 font-[ABC]">The Perspective</h3>
                        <p className="text-xl md:text-2xl font-[ABC] text-gray-800 leading-relaxed font-light italic">
                            {store.storeDescription || "This establishment defines the pinnacle of luxury, offering a curated experience that transcends the ordinary. Every detail is meticulously crafted to ensure the highest standards of excellence."}
                        </p>
                    </motion.div>

                    {store.storeServices && store.storeServices.length > 0 && (
                        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 font-[ABC]">Services & Amenities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {store.storeServices.map((service, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-black hover:text-white transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black shadow-sm group-hover:scale-90 transition-transform">
                                            <Tag size={18} />
                                        </div>
                                        <span className="font-bold text-sm tracking-wide">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Image Gallery */}
                    {store.galleryUrls && store.galleryUrls.length > 0 && (
                        <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 font-[ABC]">Visual Catalog</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {store.galleryUrls.map((url, idx) => (
                                    <div key={idx} className={`rounded-3xl overflow-hidden bg-gray-100 shadow-xl ${idx % 3 === 0 ? 'md:col-span-2 h-[500px]' : 'h-[400px]'}`}>
                                        <img src={url} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Side: Sidebar Details */}
                <div className="space-y-12">
                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 space-y-10"
                    >
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Established In</h4>
                            <p className="text-2xl font-[Albra] text-gray-900">Bespoke Tradition</p>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Location Portfolio</h4>
                            <p className="text-sm font-bold text-gray-800 leading-relaxed">
                                {store.storeAddress || `${store.storeCity}, ${store.storeState}`}
                            </p>
                            <button className="flex items-center gap-2 text-xs font-bold text-black border-b-2 border-black mt-4 pb-1 hover:gap-3 transition-all">
                                View on Map <ExternalLink size={12} />
                            </button>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Safety & Privacy</h4>
                            <ul className="space-y-3">
                                {['Premium Verification', 'Priority Support', 'Exclusive Access'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-xs font-bold text-gray-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeIn}
                        transition={{ delay: 0.6 }}
                        className="p-10 bg-black rounded-[2.5rem] text-white space-y-6"
                    >
                        <ShoppingBag size={32} />
                        <h4 className="text-2xl font-[Albra]">Interested in this Brand?</h4>
                        <p className="text-white/60 text-sm font-medium">Get priority access to their upcoming collections and seasonal experiences.</p>
                        <button className="w-full py-5 bg-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">
                            Request Concierge
                        </button>
                    </motion.div>
                </div>

            </section>
        </div>
    );
};

export default StoreProfile;
