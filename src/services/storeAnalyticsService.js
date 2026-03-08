import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { db, analytics } from '../firebase';

const STORE_ANALYTICS_COLLECTION = 'storeAnalytics';

/** Event types for store owner analytics */
export const STORE_ANALYTICS_EVENTS = {
    STORE_CREATED: 'store_created',
    STORE_PROFILE_VIEW: 'store_profile_view',
    STORE_LISTING_CLICK: 'store_listing_click',
    STORE_CONNECT_CLICK: 'store_connect_click',
    STORE_INSTAGRAM_CLICK: 'store_instagram_click',
    STORE_WEBSITE_CLICK: 'store_website_click',
    STORE_PHONE_CLICK: 'store_phone_click',
    STORE_MAP_CLICK: 'store_map_click',
    STORE_REQUEST_CONCIERGE_CLICK: 'store_request_concierge_click',
    STORE_SHARE_CLICK: 'store_share_click',
};

/**
 * Record a store-related analytics event (persisted in Firestore for store owner dashboard).
 * @param {string} storeId - Store document ID
 * @param {string} eventType - One of STORE_ANALYTICS_EVENTS
 * @param {object} metadata - Optional extra data (e.g. { linkType: 'instagram' })
 */
export async function recordStoreEvent(storeId, eventType, metadata = {}) {
    if (!storeId || !eventType) return;
    try {
        await addDoc(collection(db, STORE_ANALYTICS_COLLECTION), {
            storeId,
            eventType,
            metadata,
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.error('storeAnalytics.recordStoreEvent:', err);
    }
}

/**
 * Optionally send the same event to Firebase Analytics (for app-level reporting).
 */
export function logStoreEventToFirebase(eventName, params = {}) {
    try {
        if (analytics) logEvent(analytics, eventName, params);
    } catch (err) {
        console.error('storeAnalytics.logEvent:', err);
    }
}

/**
 * Get analytics summary for a store (for store owner dashboard).
 * @param {string} storeId
 * @returns {Promise<{ profileViews, listingClicks, leads, eventsByType }>}
 */
export async function getStoreAnalyticsSummary(storeId) {
    if (!storeId) return { profileViews: 0, listingClicks: 0, leads: 0, eventsByType: {} };
    try {
        const q = query(
            collection(db, STORE_ANALYTICS_COLLECTION),
            where('storeId', '==', storeId)
        );
        const snapshot = await getDocs(q);
        const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        const profileViews = events.filter((e) => e.eventType === STORE_ANALYTICS_EVENTS.STORE_PROFILE_VIEW).length;
        const listingClicks = events.filter((e) => e.eventType === STORE_ANALYTICS_EVENTS.STORE_LISTING_CLICK).length;

        const leadEvents = [
            STORE_ANALYTICS_EVENTS.STORE_CONNECT_CLICK,
            STORE_ANALYTICS_EVENTS.STORE_REQUEST_CONCIERGE_CLICK,
            STORE_ANALYTICS_EVENTS.STORE_PHONE_CLICK,
        ];
        const leads = events.filter((e) => leadEvents.includes(e.eventType)).length;

        const eventsByType = {};
        events.forEach((e) => {
            eventsByType[e.eventType] = (eventsByType[e.eventType] || 0) + 1;
        });

        return { profileViews, listingClicks, leads, eventsByType };
    } catch (err) {
        console.error('storeAnalytics.getStoreAnalyticsSummary:', err);
        return { profileViews: 0, listingClicks: 0, leads: 0, eventsByType: {} };
    }
}

export const storeAnalyticsService = {
    recordStoreEvent,
    logStoreEventToFirebase,
    getStoreAnalyticsSummary,
    STORE_ANALYTICS_EVENTS,
};
