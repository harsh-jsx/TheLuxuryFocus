/**
 * Subscription plan limits — used by Packages, Checkout, and Dashboard.
 * Plan IDs must match package IDs in Packages.jsx (1 = Basic, 2 = Standard, 3 = Premium).
 */
export const SUBSCRIPTION_PLANS = {
    1: {
        id: 1,
        name: 'Basic',
        price: '₹200',
        maxImages: 3,
        maxVideos: 0,
        maxServices: 5,
        allowWebsite: true,
        allowSocial: false,
        allowAnalytics: false,
    },
    2: {
        id: 2,
        name: 'Standard',
        price: '₹500',
        maxImages: 5,
        maxVideos: 2,
        maxServices: 10,
        allowWebsite: true,
        allowSocial: true,
        allowAnalytics: false,
    },
    3: {
        id: 3,
        name: 'Premium',
        price: '₹2000',
        maxImages: 25,
        maxVideos: 10,
        maxServices: 20,
        allowWebsite: true,
        allowSocial: true,
        allowAnalytics: true,
    },
};

export const getPlanLimits = (packageId) => {
    const id = Number(packageId);
    return SUBSCRIPTION_PLANS[id] || SUBSCRIPTION_PLANS[1];
};
