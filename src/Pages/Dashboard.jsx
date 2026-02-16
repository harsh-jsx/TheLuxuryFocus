import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, Store, CheckCircle } from 'lucide-react';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [isOnboarded, setIsOnboarded] = useState(false);

    // Onboarding Form State
    const [storeData, setStoreData] = useState({
        storeName: '',
        storeEmail: '',
        storeAddress: '',
        storeDescription: ''
    });
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                // Find successful order for this user
                const q = query(
                    collection(db, "orders"),
                    where("customer.uid", "==", currentUser.uid),
                    where("status", "==", "SUCCESS")
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Get the latest one if multiple? For now just take the first one
                    const orderDoc = querySnapshot.docs[0];
                    const orderData = orderDoc.data();
                    setOrder({ id: orderDoc.id, ...orderData });

                    if (orderData.customer?.onBoarded) {
                        setIsOnboarded(true);
                    }
                } else {
                    // User has no successful orders
                    // Maybe redirect to packages or show empty state
                    console.log("No successful orders found");
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [currentUser, navigate]);

    const handleInputChange = (e) => {
        setStoreData({ ...storeData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, setFile) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleOnboardingSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Upload Images
            const logoUrl = logoFile ? await uploadToCloudinary(logoFile) : null;
            const bannerUrl = bannerFile ? await uploadToCloudinary(bannerFile) : null;

            // 2. Save Store Details
            await addDoc(collection(db, "stores"), {
                userId: currentUser.uid,
                orderId: order.id,
                ...storeData,
                logoUrl,
                bannerUrl,
                createdAt: serverTimestamp()
            });

            // 3. Update Order to set onBoarded = true
            // IMPORTANT: We need to update the nested field `customer.onBoarded`
            const orderRef = doc(db, "orders", order.id);

            // Construct the update object for nested field
            // Note: In Firestore update, "customer.onBoarded" works for nested fields
            await updateDoc(orderRef, {
                "customer.onBoarded": true,
                "customer.storeName": storeData.storeName // Optional: redundancy
            });

            setIsOnboarded(true);

        } catch (error) {
            console.error("Onboarding failed:", error);
            alert("Failed to save details. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-purple-600" size={48} />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
                <h1 className="text-3xl font-bold mb-4 font-[Albra]">No Active Plan Found</h1>
                <p className="text-gray-500 mb-8 font-[ABC]">It looks like you haven't purchased a package yet.</p>
                <button onClick={() => navigate('/packages')} className="px-6 py-3 bg-black text-white rounded-xl font-bold font-[ABC]">
                    View Packages
                </button>
            </div>
        );
    }

    if (!isOnboarded) {
        return (
            <div className="min-h-screen bg-gray-50 py-32 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Store size={32} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-[Albra]">Setup Your Store</h1>
                        <p className="text-gray-500 font-[ABC]">Welcome to The Luxury Focus! Let's get your store ready for the spotlight.</p>
                    </div>

                    <form onSubmit={handleOnboardingSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 font-[ABC]">Store Name</label>
                                <input
                                    type="text"
                                    name="storeName"
                                    required
                                    value={storeData.storeName}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                    placeholder="My Luxury Brand"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 font-[ABC]">Business Email</label>
                                <input
                                    type="email"
                                    name="storeEmail"
                                    required
                                    value={storeData.storeEmail}
                                    onChange={handleInputChange}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                    placeholder="contact@brand.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 font-[ABC]">Business Address</label>
                            <textarea
                                name="storeAddress"
                                required
                                value={storeData.storeAddress}
                                onChange={handleInputChange}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                placeholder="Full address of your store..."
                                rows="3"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 font-[ABC]">Description</label>
                            <textarea
                                name="storeDescription"
                                required
                                value={storeData.storeDescription}
                                onChange={handleInputChange}
                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                placeholder="Tell us about your brand..."
                                rows="4"
                            />
                        </div>

                        {/* Image Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 font-[ABC]">Store Logo</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setLogoFile)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                    <p className="text-sm text-gray-500 font-[ABC]">
                                        {logoFile ? logoFile.name : "Click to upload logo"}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 font-[ABC]">Banner Image</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setBannerFile)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                    <p className="text-sm text-gray-500 font-[ABC]">
                                        {bannerFile ? bannerFile.name : "Click to upload banner"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg uppercase tracking-wider hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 font-[ABC]"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Saving...
                                </>
                            ) : (
                                "Complete Setup"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-32 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 font-[Albra]">Welcome back, {currentUser.displayName}!</h1>
                        <p className="text-gray-500 font-[ABC]">Your store is live and ready.</p>
                    </div>
                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 font-[ABC]">
                        <CheckCircle size={16} />
                        Active Plan: {order.packageName}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Placeholder Dashboard Cards */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-500 mb-2 font-[ABC]">Total Views</h3>
                        <p className="text-4xl font-bold text-gray-900 font-[Albra]">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-500 mb-2 font-[ABC]">Leads</h3>
                        <p className="text-4xl font-bold text-gray-900 font-[Albra]">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-500 mb-2 font-[ABC]">Messages</h3>
                        <p className="text-4xl font-bold text-gray-900 font-[Albra]">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
