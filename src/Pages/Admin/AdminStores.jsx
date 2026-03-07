import React, { useState, useEffect } from 'react'
import { storeService } from '../../services/storeService'
import { Search, Edit2, Trash2, X, Loader2, ShoppingBag, MapPin, Tag, Mail, Globe, Image as ImageIcon, Plus, Phone, Instagram, Clock, CreditCard, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LUXURY_CATEGORIES } from '../../constants/categories'

const AdminStores = () => {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedStore, setSelectedStore] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        storeName: '',
        storeCategory: '',
        storeAddress: '',
        storeCity: '',
        storeState: '',
        storeEmail: '',
        storePhone: '',
        storeWebsite: '',
        storeInstagram: '',
        storeDescription: '',
        storeServices: '', // Comma separated
        openingHours: '',
        priceRange: '$$$',
        bannerUrl: '',
        logoUrl: '',
        galleryUrls: '' // Comma separated
    })

    useEffect(() => {
        fetchStores()
    }, [])

    const fetchStores = async () => {
        setLoading(true)
        try {
            const data = await storeService.getAllStores()
            setStores(data)
        } catch (error) {
            console.error("Error fetching stores", error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenEdit = (store) => {
        setSelectedStore(store)
        setFormData({
            storeName: store.storeName || '',
            storeCategory: store.storeCategory || '',
            storeAddress: store.storeAddress || '',
            storeCity: store.storeCity || '',
            storeState: store.storeState || '',
            storeEmail: store.storeEmail || '',
            storePhone: store.storePhone || '',
            storeWebsite: store.storeWebsite || '',
            storeInstagram: store.storeInstagram || '',
            storeDescription: store.storeDescription || '',
            storeServices: Array.isArray(store.storeServices) ? store.storeServices.join(', ') : store.storeServices || '',
            openingHours: store.openingHours || '',
            priceRange: store.priceRange || '$$$',
            bannerUrl: store.bannerUrl || '',
            logoUrl: store.logoUrl || '',
            galleryUrls: Array.isArray(store.galleryUrls) ? store.galleryUrls.join(', ') : store.galleryUrls || ''
        })
        setIsEditModalOpen(true)
    }

    const handleOpenAdd = () => {
        setSelectedStore(null)
        setFormData({
            storeName: '',
            storeCategory: LUXURY_CATEGORIES[0],
            storeAddress: '',
            storeCity: '',
            storeState: '',
            storeEmail: '',
            storePhone: '',
            storeWebsite: '',
            storeInstagram: '',
            storeDescription: '',
            storeServices: '',
            openingHours: '',
            priceRange: '$$$',
            bannerUrl: '',
            logoUrl: '',
            galleryUrls: ''
        })
        setIsEditModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        // Prepare data
        const submissionData = {
            ...formData,
            storeServices: formData.storeServices.split(',').map(s => s.trim()).filter(s => s !== ''),
            galleryUrls: formData.galleryUrls.split(',').map(s => s.trim()).filter(s => s !== '')
        }

        try {
            if (selectedStore) {
                await storeService.updateStore(selectedStore.id, submissionData)
            } else {
                await storeService.addStore(submissionData)
            }
            await fetchStores()
            setIsEditModalOpen(false)
        } catch (error) {
            console.error("Error saving store", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this store? All associated data may be lost.")) {
            try {
                await storeService.deleteStore(id)
                setStores(stores.filter(s => s.id !== id))
            } catch (error) {
                console.error("Error deleting store", error)
            }
        }
    }

    const filteredStores = stores.filter(store =>
        store.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.storeCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.storeCity?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Stores</h1>
                    <p className="text-gray-500 mt-1">Manage partner stores and luxury business accounts.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleOpenAdd()}
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all text-xs uppercase tracking-widest shadow-lg shadow-black/10"
                    >
                        <Plus size={16} /> Add Store
                    </button>
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{stores.length}</span>
                        <span className="text-sm text-gray-500 font-medium">Active Stores</span>
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-4">
                <div className="relative grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search stores by name, category or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-[ABC]"
                    />
                </div>
            </div>

            {/* Store List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 animate-spin text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium font-[ABC] uppercase tracking-widest text-xs">Loading Directory...</p>
                    </div>
                ) : filteredStores.length === 0 ? (
                    <div className="text-center py-24 text-gray-500">
                        No stores found in the directory.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Store Profile</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStores.map((store) => (
                                    <tr key={store.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-100">
                                                    {store.logoUrl ? (
                                                        <img src={store.logoUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="w-full h-full p-2 text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{store.storeName}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">ID: {store.id.substring(0, 10)}</span>
                                                        {store.storePhone && <span className="text-[10px] text-gray-400">• {store.storePhone}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 bg-black text-white px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                                {store.storeCategory}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} className="text-gray-300" />
                                                {store.storeCity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">{store.priceRange}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenEdit(store)}
                                                    className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(store.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Comprehensive Store Onboarding Modal */}
            <AnimatePresence mode="wait">
                {isEditModalOpen && (
                    <div key="store-edit-modal" className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-4xl shadow-2xl overflow-hidden relative z-10 flex flex-col"
                        >
                            <header className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10">
                                        {selectedStore ? <Edit2 size={24} /> : <Plus size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                            {selectedStore ? `Modifying "${formData.storeName}"` : 'Onboard Luxury Partner'}
                                        </h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Operational Profile & Catalog</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-3 hover:bg-white hover:shadow-md rounded-full transition-all border border-transparent hover:border-gray-100"
                                >
                                    <X size={24} className="text-gray-400" />
                                </button>
                            </header>

                            <form onSubmit={handleSubmit} className="overflow-y-auto px-10 py-10">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                                    {/* Column 1: Core Identity */}
                                    <div className="space-y-8">
                                        <SectionTitle icon={ShoppingBag} title="Business Identity" />

                                        <Field label="Store Name" required>
                                            <input
                                                required
                                                type="text"
                                                value={formData.storeName}
                                                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                                className="input-field"
                                                placeholder="e.g. The Grand Emporium"
                                            />
                                        </Field>

                                        <Field label="Luxury Category">
                                            <div className="relative">
                                                <select
                                                    value={formData.storeCategory}
                                                    onChange={(e) => setFormData({ ...formData, storeCategory: e.target.value })}
                                                    className="input-field appearance-none"
                                                >
                                                    {LUXURY_CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                            </div>
                                        </Field>

                                        <Field label="Price Tier">
                                            <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                                {['$', '$$', '$$$', '$$$$'].map(tier => (
                                                    <button
                                                        key={tier}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, priceRange: tier })}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.priceRange === tier ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
                                                    >
                                                        {tier}
                                                    </button>
                                                ))}
                                            </div>
                                        </Field>

                                        <Field label="Opening Hours">
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.openingHours}
                                                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                                                    className="input-field pl-12"
                                                    placeholder="e.g. 10:00 AM - 10:00 PM"
                                                />
                                            </div>
                                        </Field>
                                    </div>

                                    {/* Column 2: Connectivity & Catalog */}
                                    <div className="space-y-8">
                                        <SectionTitle icon={MapPin} title="Reach & Services" />

                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="City">
                                                <input
                                                    type="text"
                                                    value={formData.storeCity}
                                                    onChange={(e) => setFormData({ ...formData, storeCity: e.target.value })}
                                                    className="input-field"
                                                />
                                            </Field>
                                            <Field label="State/Reg">
                                                <input
                                                    type="text"
                                                    value={formData.storeState}
                                                    onChange={(e) => setFormData({ ...formData, storeState: e.target.value })}
                                                    className="input-field"
                                                />
                                            </Field>
                                        </div>

                                        <Field label="Phone Number">
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    value={formData.storePhone}
                                                    onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                                                    className="input-field pl-12"
                                                />
                                            </div>
                                        </Field>

                                        <Field label="Services Offered (Comma separated)">
                                            <div className="relative">
                                                <Tag className="absolute left-4 top-4 text-gray-400" size={18} />
                                                <textarea
                                                    rows="3"
                                                    value={formData.storeServices}
                                                    onChange={(e) => setFormData({ ...formData, storeServices: e.target.value })}
                                                    className="input-field pl-12 pt-4 min-h-[100px] resize-none"
                                                    placeholder="Valet Parking, Private Dining, Personal Stylist..."
                                                />
                                            </div>
                                        </Field>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="Instagram Handle">
                                                <div className="relative">
                                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        value={formData.storeInstagram}
                                                        onChange={(e) => setFormData({ ...formData, storeInstagram: e.target.value })}
                                                        className="input-field pl-12"
                                                    />
                                                </div>
                                            </Field>
                                            <Field label="Website Link">
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="text"
                                                        value={formData.storeWebsite}
                                                        onChange={(e) => setFormData({ ...formData, storeWebsite: e.target.value })}
                                                        className="input-field pl-12"
                                                    />
                                                </div>
                                            </Field>
                                        </div>
                                    </div>

                                    {/* Column 3: Visuals & Narrative */}
                                    <div className="space-y-8">
                                        <SectionTitle icon={ImageIcon} title="Aesthetics" />

                                        <Field label="Brand Logo URL">
                                            <input
                                                type="text"
                                                value={formData.logoUrl}
                                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                                className="input-field text-xs text-blue-500"
                                            />
                                        </Field>

                                        <Field label="Hero Banner URL">
                                            <input
                                                type="text"
                                                value={formData.bannerUrl}
                                                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                                                className="input-field text-xs text-blue-500"
                                            />
                                        </Field>

                                        <Field label="Gallery Links (Comma separated URLs)">
                                            <textarea
                                                rows="3"
                                                value={formData.galleryUrls}
                                                onChange={(e) => setFormData({ ...formData, galleryUrls: e.target.value })}
                                                className="input-field pt-3 text-xs text-blue-400 min-h-[80px]"
                                            />
                                        </Field>

                                        <Field label="Brand Story / Narrative">
                                            <textarea
                                                rows="5"
                                                value={formData.storeDescription}
                                                onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                                                className="input-field p-4 text-sm"
                                                placeholder="Describe the philosophy and heritage of this brand..."
                                            />
                                        </Field>
                                    </div>
                                </div>

                                <footer className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-gray-400 text-xs font-medium max-w-sm">
                                        Ensure all URLs are high-resolution and business details are verified for the premium directory.
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all text-[10px] uppercase tracking-widest"
                                        >
                                            Discard Changes
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="px-10 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-black/10 disabled:opacity-50"
                                        >
                                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                            {selectedStore ? 'Publish Updates' : 'Onboard Partner'}
                                        </button>
                                    </div>
                                </footer>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Injected Styles for the Form */}
            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 0.875rem 1.25rem;
                    background-color: #f9fafb;
                    border: 1px solid #f3f4f6;
                    border-radius: 1rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #111827;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    outline: none;
                    background-color: #ffffff;
                    border-color: #111827;
                    box-shadow: 0 0 0 4px rgba(0,0,0,0.02);
                }
                .input-field::placeholder {
                    color: #9ca3af;
                }
            `}</style>
        </div>
    )
}

const Field = ({ label, children, required }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
)

const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 pb-2 border-b-2 border-black/5 w-fit">
        <Icon size={18} className="text-black" />
        <h3 className="font-bold text-gray-900 uppercase tracking-tighter text-sm">{title}</h3>
    </div>
)

export default AdminStores
