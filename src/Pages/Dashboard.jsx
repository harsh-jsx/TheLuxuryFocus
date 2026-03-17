import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { storeService } from '../services/storeService';
import { recordStoreEvent, getStoreAnalyticsSummary, STORE_ANALYTICS_EVENTS } from '../services/storeAnalyticsService';
import { getConciergeRequestsByStoreId } from '../services/conciergeRequestService';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, Store, CheckCircle, MessageSquare, Mail, User, Phone, Calendar, Globe, Instagram, Target, FileText, Image as ImageIcon, Video, Sparkles, Tag } from 'lucide-react';
import { LUXURY_CATEGORIES, AD_GOALS } from '../constants/categories';
import { getPlanLimits } from '../constants/subscriptionPlans';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [isOnboarded, setIsOnboarded] = useState(false);
    const [storeId, setStoreId] = useState(null);
    const [analyticsSummary, setAnalyticsSummary] = useState({ profileViews: 0, listingClicks: 0, leads: 0 });
    const [conciergeRequests, setConciergeRequests] = useState([]);
    const [storeDetails, setStoreDetails] = useState(null);

    // Onboarding Form State
    const [storeData, setStoreData] = useState({
        storeName: '',
        storeEmail: '',
        storePhone: '',
        storeState: '',
        storeCity: '',
        storeCategory: '',
        storeAddress: '',
        storeWebsite: '',
        storeInstagram: '',
        storeSocialOther: '',
        storeDescription: '',
        videoUrl: '',
        advertisingPackages: '',
        advertisingRequirements: '',
        brandGuidelines: '',
        targetAudience: '',
        goalsOther: '',
    });
    const [goals, setGoals] = useState([]);
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [videoUrls, setVideoUrls] = useState(['']);
    const [submitting, setSubmitting] = useState(false);

    const planLimits = order ? getPlanLimits(order.packageId ?? (order.packageName === 'Premium' ? 3 : order.packageName === 'Standard' ? 2 : 1)) : getPlanLimits(1);

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

    // When onboarded, ensure we have storeId and load analytics
    useEffect(() => {
        if (!currentUser || !isOnboarded) return;

        const loadStoreAndAnalytics = async () => {
            try {
                let sid = storeId;
                if (!sid) {
                    const store = await storeService.getStoreByUserId(currentUser.uid);
                    if (store) {
                        sid = store.id;
                        setStoreId(sid);
                    }
                }
                if (sid) {
                    const [summary, requests, details] = await Promise.all([
                        getStoreAnalyticsSummary(sid),
                        getConciergeRequestsByStoreId(sid),
                        storeService.getStoreById(sid),
                    ]);
                    setAnalyticsSummary(summary);
                    setConciergeRequests(requests);
                    setStoreDetails(details);
                }
            } catch (err) {
                console.error('Error loading store analytics:', err);
            }
        };

        loadStoreAndAnalytics();
    }, [currentUser, isOnboarded, storeId]);

    const handleInputChange = (e) => {
        setStoreData({ ...storeData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, setFile) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const handleGalleryChange = (e) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        const max = planLimits.maxImages;
        setGalleryFiles((prev) => [...prev, ...files].slice(0, max));
    };

    const removeGalleryFile = (index) => {
        setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const addVideoUrl = () => {
        if (videoUrls.length >= planLimits.maxVideos) return;
        setVideoUrls((prev) => [...prev, '']);
    };
    const setVideoUrlAt = (index, value) => {
        setVideoUrls((prev) => prev.map((v, i) => (i === index ? value : v)));
    };
    const removeVideoUrl = (index) => {
        setVideoUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleGoal = (id) => {
        setGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
    };

    const handleOnboardingSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const plan = getPlanLimits(order.packageId);
        const galleryCount = galleryFiles.length;
        const validVideoUrls = videoUrls.filter((u) => u && u.trim());
        if (galleryCount > plan.maxImages) {
            alert(`Your ${plan.name} plan allows up to ${plan.maxImages} images. Please remove ${galleryCount - plan.maxImages} image(s).`);
            setSubmitting(false);
            return;
        }
        if (validVideoUrls.length > plan.maxVideos) {
            alert(`Your ${plan.name} plan allows up to ${plan.maxVideos} video(s). Please remove ${validVideoUrls.length - plan.maxVideos} video(s).`);
            setSubmitting(false);
            return;
        }

        try {
            const logoUrl = logoFile ? await uploadToCloudinary(logoFile) : null;
            const bannerUrl = bannerFile ? await uploadToCloudinary(bannerFile) : null;
            const galleryUrls = [];
            for (const file of galleryFiles.slice(0, plan.maxImages)) {
                const url = await uploadToCloudinary(file);
                if (url) galleryUrls.push(url);
            }

            const storePayload = {
                ...storeData,
                storeWebsite: plan.allowWebsite ? storeData.storeWebsite : '',
                storeInstagram: plan.allowSocial ? storeData.storeInstagram : '',
                storeSocialOther: plan.allowSocial ? storeData.storeSocialOther : '',
            };

            const payload = {
                userId: currentUser.uid,
                orderId: order.id,
                planId: order.packageId,
                ...storePayload,
                logoUrl,
                bannerUrl,
                galleryUrls,
                videoUrls: validVideoUrls,
                videoUrl: validVideoUrls[0] || null,
                goals,
                goalsOther: storePayload.goalsOther,
                createdAt: serverTimestamp(),
            };

            const storeRef = await addDoc(collection(db, "stores"), payload);
            const newStoreId = storeRef.id;
            recordStoreEvent(newStoreId, STORE_ANALYTICS_EVENTS.STORE_CREATED);

            const orderRef = doc(db, "orders", order.id);
            await updateDoc(orderRef, {
                "customer.onBoarded": true,
                "customer.storeName": storePayload.storeName,
            });

            setStoreId(newStoreId);
            setStoreDetails({
                id: newStoreId,
                ...storePayload,
                logoUrl,
                bannerUrl,
                galleryUrls,
                videoUrls: validVideoUrls,
                goals,
                goalsOther: storePayload.goalsOther,
                planId: order.packageId,
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
        const sectionClass = "border-b border-gray-100 pb-8 last:border-0 last:pb-0";
        const sectionTitle = "text-sm font-bold text-purple-600 font-[ABC] uppercase tracking-wider mb-4 flex items-center gap-2";

        return (
            <div className="min-h-screen bg-gray-50 py-20 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Store size={32} />
                        </div>
                        <div className="inline-block px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-[ABC] uppercase tracking-wider mb-4">
                            Your plan: {planLimits.name} — {planLimits.maxImages} image{planLimits.maxImages !== 1 ? 's' : ''}
                            {planLimits.maxVideos > 0 && `, ${planLimits.maxVideos} video${planLimits.maxVideos !== 1 ? 's' : ''}`}
                            {planLimits.allowWebsite && ', website'}
                            {planLimits.allowSocial && ', social links'}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-[Albra]">Luxury Brand Onboarding</h1>
                        <p className="text-gray-500 font-[ABC]">Set up your store within your plan limits.</p>
                    </div>

                    <form onSubmit={handleOnboardingSubmit} className="space-y-10">
                        {/* 1. Brand identity */}
                        <div className={sectionClass}>
                            <h2 className={sectionTitle}><Sparkles size={18} /> Brand identity</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Brand name *</label>
                                    <input type="text" name="storeName" required value={storeData.storeName} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="Your brand name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Logo</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer relative">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogoFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Upload className="mx-auto text-gray-400 mb-1" size={22} />
                                        <p className="text-xs text-gray-500 font-[ABC]">{logoFile ? logoFile.name : "Upload logo"}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Banner / hero image</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer relative">
                                        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBannerFile)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Upload className="mx-auto text-gray-400 mb-1" size={22} />
                                        <p className="text-xs text-gray-500 font-[ABC]">{bannerFile ? bannerFile.name : "Upload banner"}</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Brief description *</label>
                                    <textarea name="storeDescription" required value={storeData.storeDescription} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="History, mission, or unique selling point..." rows="4" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Contact */}
                        <div className={sectionClass}>
                            <h2 className={sectionTitle}><Mail size={18} /> Contact</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Email *</label>
                                    <input type="email" name="storeEmail" required value={storeData.storeEmail} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="contact@brand.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Phone</label>
                                    <input type="tel" name="storePhone" value={storeData.storePhone} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="+91 ..." />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Address *</label>
                                    <textarea name="storeAddress" required value={storeData.storeAddress} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="Full business address" rows="2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">City *</label>
                                    <input type="text" name="storeCity" required value={storeData.storeCity} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="e.g. Mumbai" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">State / UT *</label>
                                    <select name="storeState" required value={storeData.storeState} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]">
                                        <option value="">Select State / UT</option>
                                        {['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'].map((st) => (
                                            <option key={st} value={st}>{st}</option>
                                        ))}
                                    </select>
                                </div>
                                {planLimits.allowWebsite && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 font-[ABC]">Website</label>
                                        <input type="url" name="storeWebsite" value={storeData.storeWebsite} onChange={handleInputChange}
                                            className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                            placeholder="https://..." />
                                    </div>
                                )}
                                {planLimits.allowSocial && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 font-[ABC]">Instagram handle</label>
                                            <input type="text" name="storeInstagram" value={storeData.storeInstagram} onChange={handleInputChange}
                                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                                placeholder="username (no @)" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 font-[ABC]">Other social (URL)</label>
                                            <input type="url" name="storeSocialOther" value={storeData.storeSocialOther} onChange={handleInputChange}
                                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                                placeholder="Facebook, LinkedIn, etc." />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 3. Product/Service & media */}
                        <div className={sectionClass}>
                            <h2 className={sectionTitle}><Tag size={18} /> Category & media</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Product / service category *</label>
                                    <select name="storeCategory" required value={storeData.storeCategory} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]">
                                        <option value="">Select category</option>
                                        {LUXURY_CATEGORIES.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Gallery (up to {planLimits.maxImages} image{planLimits.maxImages !== 1 ? 's' : ''})</label>
                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center relative ${galleryFiles.length >= planLimits.maxImages ? 'border-gray-100 bg-gray-50 cursor-not-allowed' : 'border-gray-200 hover:bg-gray-50 cursor-pointer'}`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGalleryChange}
                                            disabled={galleryFiles.length >= planLimits.maxImages}
                                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        />
                                        <ImageIcon className="mx-auto text-gray-400 mb-1" size={22} />
                                        <p className="text-xs text-gray-500 font-[ABC]">
                                            {galleryFiles.length >= planLimits.maxImages
                                                ? `${planLimits.maxImages} images (plan limit)`
                                                : 'Add product/service images'}
                                        </p>
                                    </div>
                                    {galleryFiles.length > 0 && (
                                        <ul className="flex flex-wrap gap-2 mt-2">
                                            {galleryFiles.map((f, i) => (
                                                <li key={i} className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1 text-xs font-[ABC]">
                                                    {f.name}
                                                    <button type="button" onClick={() => removeGalleryFile(i)} className="text-red-500 hover:underline">×</button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {planLimits.maxVideos > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 font-[ABC]">Video URL{planLimits.maxVideos > 1 ? 's' : ''} (up to {planLimits.maxVideos})</label>
                                        {videoUrls.slice(0, planLimits.maxVideos).map((url, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => setVideoUrlAt(i, e.target.value)}
                                                    className="flex-1 p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                                    placeholder="YouTube, Vimeo, or direct link"
                                                />
                                                {videoUrls.length > 1 && (
                                                    <button type="button" onClick={() => removeVideoUrl(i)} className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl font-[ABC] text-sm">Remove</button>
                                                )}
                                            </div>
                                        ))}
                                        {videoUrls.length < planLimits.maxVideos && (
                                            <button type="button" onClick={addVideoUrl} className="text-sm text-purple-600 font-[ABC] hover:underline">
                                                + Add another video
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Advertising */}
                        <div className={sectionClass}>
                            <h2 className={sectionTitle}><Target size={18} /> Advertising</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Packages you're interested in</label>
                                    <input type="text" name="advertisingPackages" value={storeData.advertisingPackages} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="e.g. Basic, Standard, Premium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Specific advertising requirements</label>
                                    <textarea name="advertisingRequirements" value={storeData.advertisingRequirements} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="Campaign goals, formats, timelines..." rows="3" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Goals for advertising</label>
                                    <div className="flex flex-wrap gap-3">
                                        {AD_GOALS.map((g) => (
                                            <label key={g.id} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={goals.includes(g.id)} onChange={() => toggleGoal(g.id)} className="rounded border-gray-300" />
                                                <span className="text-sm font-[ABC] text-gray-700">{g.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {goals.includes('other') && (
                                        <input type="text" name="goalsOther" value={storeData.goalsOther} onChange={handleInputChange}
                                            className="mt-2 w-full p-3 rounded-xl border border-gray-200 font-[ABC] text-sm"
                                            placeholder="Describe other goals" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 5. Brand guidelines & audience */}
                        <div className={sectionClass}>
                            <h2 className={sectionTitle}><FileText size={18} /> Brand guidelines & audience</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Brand guidelines</label>
                                    <textarea name="brandGuidelines" value={storeData.brandGuidelines} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="Logo usage, tone of voice, do's and don'ts..." rows="3" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Target audience demographics</label>
                                    <textarea name="targetAudience" value={storeData.targetAudience} onChange={handleInputChange}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none font-[ABC]"
                                        placeholder="Age, location, interests, income segment..." rows="3" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={submitting}
                            className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg uppercase tracking-wider hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 font-[ABC]">
                            {submitting ? (<><Loader2 className="animate-spin" size={20} /> Saving...</>) : "Complete setup"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const s = storeDetails || {};
    const goalLabels = (s.goals || []).map((id) => AD_GOALS.find((g) => g.id === id)?.label || id).filter(Boolean);
    if (s.goals?.includes('other') && s.goalsOther) goalLabels.push(s.goalsOther);
    const dashboardPlan = getPlanLimits(s.planId ?? order?.packageId);

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4">
            <div className="container mx-auto max-w-7xl space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {s.logoUrl && (
                            <img src={s.logoUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                        )}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold font-[Albra]">{s.storeName || 'Your brand'}</h1>
                            <p className="text-gray-500 font-[ABC]">Welcome back, {currentUser.displayName}</p>
                        </div>
                    </div>
                    <div className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 font-[ABC]">
                        <CheckCircle size={16} />
                        {order?.packageName || dashboardPlan.name}
                    </div>
                </div>

                {/* Analytics — Premium only */}
                {dashboardPlan.allowAnalytics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-500 mb-2 font-[ABC]">Profile Views</h3>
                        <p className="text-4xl font-bold text-gray-900 font-[Albra]">{analyticsSummary.profileViews}</p>
                        <p className="text-xs text-gray-400 mt-1 font-[ABC]">Store page visits</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-500 mb-2 font-[ABC]">Leads</h3>
                        <p className="text-4xl font-bold text-gray-900 font-[Albra]">{analyticsSummary.leads}</p>
                        <p className="text-xs text-gray-400 mt-1 font-[ABC]">Connect / Concierge / Phone</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-500 mb-2 font-[ABC]">From Listing</h3>
                        <p className="text-4xl font-bold text-gray-900 font-[Albra]">{analyticsSummary.listingClicks}</p>
                        <p className="text-xs text-gray-400 mt-1 font-[ABC]">Clicks from stores page</p>
                    </div>
                </div>
                )}

                {/* Brand profile summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 font-[Albra] mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="text-purple-600" /> Brand & contact
                        </h2>
                        <div className="space-y-3 text-sm">
                            {s.storeDescription && (
                                <p className="text-gray-600 leading-relaxed font-[ABC]">{s.storeDescription}</p>
                            )}
                            <div className="pt-2 border-t border-gray-100 space-y-2">
                                {s.storeEmail && <p className="flex items-center gap-2 font-[ABC]"><Mail size={14} /> {s.storeEmail}</p>}
                                {s.storePhone && <p className="flex items-center gap-2 font-[ABC]"><Phone size={14} /> {s.storePhone}</p>}
                                {s.storeAddress && <p className="flex items-center gap-2 font-[ABC]"><Target size={14} /> {s.storeAddress}, {s.storeCity}{s.storeState ? `, ${s.storeState}` : ''}</p>}
                                {s.storeWebsite && <a href={s.storeWebsite} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-purple-600 hover:underline font-[ABC]"><Globe size={14} /> {s.storeWebsite}</a>}
                                {s.storeInstagram && <a href={`https://instagram.com/${s.storeInstagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-purple-600 hover:underline font-[ABC]"><Instagram size={14} /> @{s.storeInstagram}</a>}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 font-[Albra] mb-4 flex items-center gap-2">
                            <Tag size={20} className="text-purple-600" /> Category & goals
                        </h2>
                        <div className="space-y-3 text-sm">
                            {s.storeCategory && <p className="font-[ABC]"><span className="text-gray-500">Category:</span> {s.storeCategory}</p>}
                            {goalLabels.length > 0 && (
                                <div>
                                    <p className="text-gray-500 font-[ABC] mb-1">Advertising goals:</p>
                                    <ul className="list-disc list-inside font-[ABC] text-gray-700">{goalLabels.map((l, i) => <li key={i}>{l}</li>)}</ul>
                                </div>
                            )}
                            {s.targetAudience && (
                                <div className="pt-2 border-t border-gray-100">
                                    <p className="text-gray-500 font-[ABC] mb-1">Target audience:</p>
                                    <p className="font-[ABC] text-gray-700 leading-relaxed">{s.targetAudience}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {(s.brandGuidelines || s.advertisingPackages || s.advertisingRequirements) && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 font-[Albra] mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-purple-600" /> Guidelines & advertising
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            {s.brandGuidelines && (
                                <div>
                                    <p className="text-gray-500 font-[ABC] mb-1">Brand guidelines</p>
                                    <p className="font-[ABC] text-gray-700 leading-relaxed whitespace-pre-wrap">{s.brandGuidelines}</p>
                                </div>
                            )}
                            {s.advertisingPackages && (
                                <div>
                                    <p className="text-gray-500 font-[ABC] mb-1">Packages interested in</p>
                                    <p className="font-[ABC] text-gray-700">{s.advertisingPackages}</p>
                                </div>
                            )}
                            {s.advertisingRequirements && (
                                <div>
                                    <p className="text-gray-500 font-[ABC] mb-1">Ad requirements</p>
                                    <p className="font-[ABC] text-gray-700 leading-relaxed whitespace-pre-wrap">{s.advertisingRequirements}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {s.galleryUrls?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 font-[Albra] mb-4 flex items-center gap-2">
                            <ImageIcon size={20} className="text-purple-600" /> Gallery
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {s.galleryUrls.slice(0, 8).map((url, i) => (
                                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Concierge requests */}
                <div className="mt-10">
                    <h2 className="text-xl font-bold text-gray-900 font-[Albra] mb-4 flex items-center gap-2">
                        <MessageSquare className="text-purple-600" size={24} />
                        Concierge Requests
                    </h2>
                    {conciergeRequests.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                            <MessageSquare className="mx-auto text-gray-300 mb-3" size={40} />
                            <p className="text-gray-500 font-[ABC]">No concierge requests yet.</p>
                            <p className="text-gray-400 text-sm mt-1 font-[ABC]">Requests from your store page will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {conciergeRequests.map((req) => (
                                <div
                                    key={req.id}
                                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="font-[Albra] text-gray-900">{req.name}</p>
                                                <p className="text-sm text-gray-500 font-[ABC] flex items-center gap-1">
                                                    <Mail size={12} /> {req.email}
                                                </p>
                                            </div>
                                        </div>
                                        {req.createdAt && (
                                            <span className="text-xs text-gray-400 font-[ABC] flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(req.createdAt).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    {req.phone && (
                                        <p className="text-sm text-gray-600 font-[ABC] flex items-center gap-2 mb-2">
                                            <Phone size={14} /> {req.phone}
                                        </p>
                                    )}
                                    <p className="text-gray-700 text-sm leading-relaxed mt-2 pt-3 border-t border-gray-100">
                                        {req.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
