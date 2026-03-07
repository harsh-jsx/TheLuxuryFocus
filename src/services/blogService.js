import { collection, getDocs, getDoc, doc, query, orderBy, limit, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
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
    },

    // Add a new blog
    addBlog: async (blogData) => {
        try {
            const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
                ...blogData,
                createdAt: serverTimestamp(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding blog: ", error);
            throw error;
        }
    },

    // Update an existing blog
    updateBlog: async (id, blogData) => {
        try {
            const docRef = doc(db, BLOGS_COLLECTION, id);
            await updateDoc(docRef, {
                ...blogData,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating blog: ", error);
            throw error;
        }
    },

    // Delete a blog
    deleteBlog: async (id) => {
        try {
            const docRef = doc(db, BLOGS_COLLECTION, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting blog: ", error);
            throw error;
        }
    }
};
