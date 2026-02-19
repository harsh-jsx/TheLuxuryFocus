import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Search, MapPin, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'stores'));
                const storesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setStores(storesData);

                // Extract unique cities and categories for filters
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
        const matchesCity = selectedCity ? store.storeCity === selectedCity : true;
        const matchesCategory = selectedCategory ? store.storeCategory === selectedCategory : true;

        return matchesSearch && matchesCity && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[Albra]">Discover Luxury Stores</h1>
                    <p className="text-gray-500 font-[ABC] max-w-2xl mx-auto">
                        Explore our curated collection of premium brands and boutiques.
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                            />
                        </div>

                        {/* City Filter */}
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC] appearance-none bg-white"
                            >
                                <option value="">All Cities</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC] appearance-none bg-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500 font-[ABC]">Loading stores...</p>
                    </div>
                )}

                {/* Results */}
                {!loading && filteredStores.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2 font-[Albra]">No stores found</h3>
                        <p className="text-gray-500 font-[ABC]">Try adjusting your search or filters.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCity(''); setSelectedCategory(''); }}
                            className="mt-6 text-purple-600 font-bold hover:underline font-[ABC]"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {!loading && filteredStores.map(store => (
                            <div key={store.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                {/* Banner Image */}
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {store.bannerUrl ? (
                                        <img
                                            src={store.bannerUrl}
                                            alt={store.storeName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                            <span className="font-[Albra] text-4xl opacity-20">{store.storeName[0]}</span>
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    {store.storeCategory && (
                                        <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                            {store.storeCategory}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        {/* Logo */}
                                        <div className="-mt-12 w-20 h-20 bg-white rounded-xl p-1 shadow-md relative z-10">
                                            {store.logoUrl ? (
                                                <img
                                                    src={store.logoUrl}
                                                    alt={`${store.storeName} logo`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                    <span className="font-bold text-xl">{store.storeName[0]}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* City Badge */}
                                        {store.storeCity && (
                                            <div className="flex items-center text-gray-500 text-sm gap-1">
                                                <MapPin size={14} />
                                                <span>{store.storeCity}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 font-[Albra]">{store.storeName}</h3>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-[ABC]">
                                        {store.storeDescription || "No description available."}
                                    </p>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-sm text-gray-400 font-[ABC]">View Store</span>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stores;
