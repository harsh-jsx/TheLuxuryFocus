import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const ORDERS_COLLECTION = 'orders';

export const orderService = {
    // Get all orders
    getAllOrders: async () => {
        try {
            const ordersQuery = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(ordersQuery);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching orders: ", error);
            throw error;
        }
    },

    // Update an existing order
    updateOrder: async (id, orderData) => {
        try {
            const docRef = doc(db, ORDERS_COLLECTION, id);
            await updateDoc(docRef, {
                ...orderData,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Error updating order: ", error);
            throw error;
        }
    },

    // Delete an order
    deleteOrder: async (id) => {
        try {
            const docRef = doc(db, ORDERS_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting order: ", error);
            throw error;
        }
    }
};
