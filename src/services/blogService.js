import { collection, getDocs, getDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

const BLOGS_COLLECTION = 'blogs';

export const blogService = {
    // Get all blogs
    getAllBlogs: async () => {
        try {
            const blogsQuery = query(collection(db, BLOGS_COLLECTION), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(blogsQuery);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching blogs: ", error);
            throw error;
        }
    },

    // Get a single blog by ID
    getBlogById: async (id) => {
        try {
            const docRef = doc(db, BLOGS_COLLECTION, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching blog: ", error);
            throw error;
        }
    },

    // Get featured blogs (for home page)
    getFeaturedBlogs: async (count = 3) => {
        try {
            const blogsQuery = query(
                collection(db, BLOGS_COLLECTION),
                orderBy('date', 'desc'),
                limit(count)
            );
            const querySnapshot = await getDocs(blogsQuery);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching featured blogs: ", error);
            throw error;
        }
    }
};
