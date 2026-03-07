import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const USERS_COLLECTION = 'users';

export const userService = {
    // Get all users
    getAllUsers: async () => {
        try {
            const usersQuery = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(usersQuery);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching users: ", error);
            throw error;
        }
    },

    // Update an existing user
    updateUser: async (id, userData) => {
        try {
            const docRef = doc(db, USERS_COLLECTION, id);
            await updateDoc(docRef, {
                ...userData,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Error updating user: ", error);
            throw error;
        }
    },

    // Delete a user
    deleteUser: async (id) => {
        try {
            const docRef = doc(db, USERS_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting user: ", error);
            throw error;
        }
    }
};
