import React, { useState, useEffect } from 'react';
import { useSelectedPackageOptionStore } from '../stores/packageStore';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, Loader2, CreditCard, Lock } from 'lucide-react';
import { createOrder, updateOrderStatus, initiatePayment } from '../services/paymentService';
import { auth } from '../firebase';

const Checkout = () => {
    const navigate = useNavigate();
    const selectedPackage = useSelectedPackageOptionStore((state) => state.selectedPackageOption);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        onBoarded: false,
        uid: auth.currentUser.uid
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!selectedPackage) {
            navigate('/packages');
        }
    }, [selectedPackage, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        try {
            // 1. Create Order in Firestore
            const orderId = await createOrder({
                packageId: selectedPackage.id,
                packageName: selectedPackage.name,
                packagePrice: selectedPackage.price,
                customer: formData,
                amount: selectedPackage.price // You might need to parse "₹100-₹200" to a number
            });

            // 2. Initiate Payment (Mocked)
            const paymentResult = await initiatePayment(orderId, selectedPackage.price, formData);

            // 3. On Success (Mocked)
            await updateOrderStatus(orderId, "SUCCESS", { paymentId: paymentResult.paymentId });

            // Redirect to Success Page or show success message
            // navigate('/success');
            alert("Payment Successful! Order ID: " + orderId);
            navigate('/');

        } catch (err) {
            console.error("Payment failed:", err);
            setError("Payment failed: " + err.message);
            // Optionally update order status to FAILED
        } finally {
            setIsProcessing(false);
        }
    };

    if (!selectedPackage) return null;

    return (
        <div className="min-h-screen bg-white py-32 px-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <button
                    onClick={() => navigate('/packages')}
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 font-[ABC]"
                >
                    <ArrowRight className="rotate-180" size={20} />
                    Back to Packages
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Checkout Form */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2 font-[Albra]">Checkout</h1>
                        <p className="text-gray-500 mb-8 font-[ABC]">Complete your details to proceed with the payment.</p>

                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 font-[ABC]">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 font-[ABC]">Billing Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                    placeholder="Street Address, Apt, Suite"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                        placeholder="Mumbai"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 font-[ABC]">Pin Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        required
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-[ABC]"
                                        placeholder="400001"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold font-[ABC]">
                                    {error}
                                </div>
                            )}


                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 sticky top-32">
                            <h2 className="text-2xl font-bold mb-6 font-[Albra]">Order Summary</h2>

                            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                                <div>
                                    <h3 className="font-bold text-gray-900 font-[Albra]">{selectedPackage.name} Package</h3>
                                    <p className="text-sm text-gray-500 font-[ABC]">{selectedPackage.description}</p>
                                </div>
                                <span className="font-bold text-purple-600 text-lg font-[ABC]">{selectedPackage.price}</span>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-sm text-gray-600 font-[ABC]">
                                    <span>Subtotal</span>
                                    <span>{selectedPackage.price}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 font-[ABC]">
                                    <span>Tax (18% GST)</span>
                                    <span>Calculated at payment</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4 mt-4 font-[ABC]">
                                    <span>Total</span>
                                    <span>{selectedPackage.price}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-[ABC]"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={18} />
                                        Pay Now
                                    </>
                                )}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-[ABC]">
                                <Lock size={12} />
                                Secure Payment by Cashfree
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
