import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, addDoc, getDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

const STORES_COLLECTION = 'stores';

export const storeService = {
    // Get store by owner userId (for dashboard)
    getStoreByUserId: async (userId) => {
        try {
            const q = query(
                collection(db, STORES_COLLECTION),
                where('userId', '==', userId)
            );
            const snapshot = await getDocs(q);
            if (snapshot.empty) return null;
            const storeDoc = snapshot.docs[0];
            return { id: storeDoc.id, ...storeDoc.data() };
        } catch (error) {
            console.error('Error fetching store by userId:', error);
            throw error;
        }
    },

    /**
     * Premium stores that opted in to show their logo on the home page marquee.
     * Uses a single-field query (no composite index); filters plan + logo in memory.
     */
    getFeaturedHomePageStores: async () => {
        try {
            const q = query(
                collection(db, STORES_COLLECTION),
                where('featuredOnHomePage', '==', true)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter(
                    (s) =>
                        Number(s.planId) === 3 &&
                        typeof s.logoUrl === 'string' &&
                        s.logoUrl.length > 0
                );
        } catch (error) {
            console.error('Error fetching featured home page stores:', error);
            throw error;
        }
    },

    // Get all stores
    getAllStores: async () => {
        try {
            const storesQuery = query(collection(db, STORES_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(storesQuery);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching stores: ", error);
            throw error;
        }
    },

    // Get a single store by ID
    getStoreById: async (id) => {
        try {
            const docRef = doc(db, STORES_COLLECTION, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching store by ID: ", error);
            throw error;
        }
    },

    // Update an existing store
    updateStore: async (id, storeData) => {
        try {
            const docRef = doc(db, STORES_COLLECTION, id);
            await updateDoc(docRef, {
                ...storeData,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Error updating store: ", error);
            throw error;
        }
    },

    // Delete a store
    deleteStore: async (id) => {
        try {
            const docRef = doc(db, STORES_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting store: ", error);
            throw error;
        }
    },

    // Add a new store
    addStore: async (storeData) => {
        try {
            const docRef = await addDoc(collection(db, STORES_COLLECTION), {
                ...storeData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding store: ", error);
            throw error;
        }
    },

    /**
     * Toggle a store's `disabled` flag. Disabled stores are hidden from public
     * listings (Stores.jsx) and 404'd on the public profile (StoreProfile.jsx),
     * but the document is preserved so an admin can re-enable later.
     */
    setStoreDisabled: async (id, disabled) => {
        try {
            const docRef = doc(db, STORES_COLLECTION, id);
            await updateDoc(docRef, {
                disabled: Boolean(disabled),
                disabledAt: disabled ? new Date() : null,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Error toggling store disabled flag:', error);
            throw error;
        }
    },
};
