import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const CONCIERGE_REQUESTS_COLLECTION = 'conciergeRequests';

/**
 * Submit a concierge request for a store.
 * @param {string} storeId
 * @param {{ name: string, email: string, phone?: string, message: string }} data
 * @returns {Promise<string>} document id
 */
export async function submitConciergeRequest(storeId, data) {
    const docRef = await addDoc(collection(db, CONCIERGE_REQUESTS_COLLECTION), {
        storeId,
        name: data.name?.trim() || '',
        email: data.email?.trim() || '',
        phone: data.phone?.trim() || '',
        message: data.message?.trim() || '',
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Get all concierge requests for a store (for store owner dashboard).
 * @param {string} storeId
 * @returns {Promise<Array<{ id: string, name, email, phone, message, createdAt }>>}
 */
export async function getConciergeRequestsByStoreId(storeId) {
    if (!storeId) return [];
    const q = query(
        collection(db, CONCIERGE_REQUESTS_COLLECTION),
        where('storeId', '==', storeId)
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            message: data.message,
            createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
        };
    });
    list.sort((a, b) => (b.createdAt ? b.createdAt.getTime() : 0) - (a.createdAt ? a.createdAt.getTime() : 0));
    return list;
}

export const conciergeRequestService = {
    submitConciergeRequest,
    getConciergeRequestsByStoreId,
};
