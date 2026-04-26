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
        /** Shown in the home page client / partner logo marquee when opted in */
        allowHomePageLogoFeature: true,
    },
};

export const getPlanLimits = (packageId) => {
    const id = Number(packageId);
    return SUBSCRIPTION_PLANS[id] || SUBSCRIPTION_PLANS[1];
};

/* ─── Subscription duration & trial ─── */

export const TRIAL_DURATION_DAYS = 7;
export const PAID_DURATION_DAYS = 30;

/** Plan that the free trial unlocks. */
export const TRIAL_PLAN_ID = 2;

/** ms in a day — kept as a single constant so date math is consistent. */
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Coerce any of: Firestore Timestamp, Date, ISO string, or epoch ms → ms since epoch.
 * Returns null if the value is unset or unparseable, so callers can branch
 * cleanly on "no expiry on file" vs "expired".
 */
export const toMillis = (value) => {
    if (!value) return null;
    if (typeof value === 'number') return value;
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (value instanceof Date) return value.getTime();
    if (typeof value.seconds === 'number') return value.seconds * 1000;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
};

/** Days until expiry, rounded toward zero (negative = days past expiry). null if unknown. */
export const daysUntil = (expiresAt) => {
    const ms = toMillis(expiresAt);
    if (ms === null) return null;
    const diff = ms - Date.now();
    // Round toward zero so "0" only shows on the actual expiry day.
    return diff >= 0 ? Math.ceil(diff / ONE_DAY_MS) : Math.floor(diff / ONE_DAY_MS);
};

/**
 * Bucket a subscription into a status. `null` means we have no expiry on file
 * — older records pre-dating the expiry field land here, so don't auto-expire.
 */
export const subscriptionStatus = (expiresAt) => {
    const days = daysUntil(expiresAt);
    if (days === null) return 'unknown';
    if (days < 0) return 'expired';
    if (days <= 3) return 'expiring';
    return 'active';
};
