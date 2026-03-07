import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const STORES_COLLECTION = 'stores';

export const storeService = {
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
    }
};
