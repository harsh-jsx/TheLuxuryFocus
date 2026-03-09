import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { recordStoreEvent, STORE_ANALYTICS_EVENTS } from '../services/storeAnalyticsService';
import { Search, MapPin, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);

    const location = useLocation();

    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const filtersRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'stores'));
                const storesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStores(storesData);

                const uniqueCities = [...new Set(storesData.map(store => store.storeCity).filter(Boolean))];
                const uniqueCategories = [...new Set(storesData.map(store => store.storeCategory).filter(Boolean))];

                setCities(uniqueCities.sort());
                setCategories(uniqueCategories.sort());
            } catch (error) {
                console.error("Error fetching stores:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    const filteredStores = stores.filter(store => {
        const matchesSearch = store.storeName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = selectedCity
            ? store.storeCity?.toLowerCase() === selectedCity.toLowerCase()
            : true;
        const matchesCategory = selectedCategory ? store.storeCategory === selectedCategory : true;
        return matchesSearch && matchesCity && matchesCategory;
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cityParam = params.get('city');

        if (cityParam) {
            const normalized = cities.find(
                (city) => city.toLowerCase() === cityParam.toLowerCase()
            );
            setSelectedCity(normalized || cityParam);
        }
    }, [location.search, cities]);

    useGSAP(() => {
        if (!containerRef.current) return;

        gsap.from(headerRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
        });

        gsap.from(filtersRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            delay: 0.15,
            ease: 'power3.out',
        });

        gsap.from(cardsRef.current.filter(Boolean), {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: cardsRef.current[0] || containerRef.current,
                start: 'top 85%',
                once: true,
            },
        });
    }, { scope: containerRef, dependencies: [loading, filteredStores] });

    return (
        <div ref={containerRef} className="min-h-screen bg-white text-gray-900 pt-28 pb-24 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 mb-8">
                        <Sparkles className="w-3.5 h-3.5 text-gray-600" />
                        <span className="font-[ABC] text-[11px] tracking-[0.15em] text-gray-600 uppercase">Discover</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-[Albra] tracking-tight mb-6">
                        Luxury Stores
                    </h1>
                    <p className="text-gray-500 font-[ABC] max-w-2xl mx-auto text-sm md:text-base tracking-wide">
                        Explore our curated collection of premium brands and boutiques.
                    </p>
                </div>

                {/* Filters */}
                <div
                    ref={filtersRef}
                    className="bg-gray-50 rounded-2xl p-5 md:p-6 border border-gray-100 mb-14"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <span className="block text-[11px] font-[ABC] uppercase tracking-[0.18em] text-gray-400 mb-2">
                                Search
                            </span>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by store name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none transition-all font-[ABC] text-sm"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <span className="block text-[11px] font-[ABC] uppercase tracking-[0.18em] text-gray-400 mb-2">
                                City
                            </span>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none transition-all font-[ABC] text-sm appearance-none cursor-pointer"
                                >
                                    <option value="">All Cities</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                                    ▼
                                </span>
                            </div>
                        </div>
                        <div className="relative">
                            <span className="block text-[11px] font-[ABC] uppercase tracking-[0.18em] text-gray-400 mb-2">
                                Category
                            </span>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 outline-none transition-all font-[ABC] text-sm appearance-none cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                                    ▼
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-6" />
                        <p className="font-[ABC] text-xs uppercase tracking-widest text-gray-500">Curating stores...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredStores.length === 0 && (
                    <div className="text-center py-24 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-400" size={28} />
                        </div>
                        <h3 className="text-xl font-[Albra] mb-2">No stores found</h3>
                        <p className="text-gray-500 font-[ABC] text-sm mb-8">Try adjusting your search or filters.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCity(''); setSelectedCategory(''); }}
                            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-[ABC] text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Store Cards */}
                {!loading && filteredStores.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredStores.map((store, idx) => (
                            <Link
                                key={store.id}
                                ref={el => { cardsRef.current[idx] = el }}
                                to={`/store/${store.id}`}
                                className="group block"
                                onClick={() => recordStoreEvent(store.id, STORE_ANALYTICS_EVENTS.STORE_LISTING_CLICK)}
                            >
                                <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500">
                                    <div className="h-52 md:h-56 relative overflow-hidden">
                                        {store.bannerUrl ? (
                                            <img
                                                src={store.bannerUrl}
                                                alt={store.storeName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <span className="font-[Albra] text-5xl text-gray-300">{store.storeName?.[0] || '?'}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                        {store.storeCategory && (
                                            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-[ABC] uppercase tracking-wider text-gray-800">
                                                {store.storeCategory}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start -mt-10 relative z-10 mb-4">
                                            <div className="w-16 h-16 rounded-xl bg-white p-1.5 border border-gray-100 shadow-md overflow-hidden shrink-0">
                                                {store.logoUrl ? (
                                                    <img
                                                        src={store.logoUrl}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <span className="font-[Albra] text-lg text-gray-400">{store.storeName?.[0] || '?'}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {store.storeCity && (
                                                <div className="flex items-center text-gray-500 text-xs gap-1.5 font-[ABC]">
                                                    <MapPin size={12} />
                                                    {store.storeCity}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-[Albra] text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                            {store.storeName}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 font-[ABC] leading-relaxed mb-6">
                                            {store.storeDescription || "Premium establishment."}
                                        </p>

                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-[10px] font-[ABC] uppercase tracking-widest text-gray-400 group-hover:text-gray-700 transition-colors">
                                                View details
                                            </span>
                                            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white text-gray-600 transition-all">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stores;
