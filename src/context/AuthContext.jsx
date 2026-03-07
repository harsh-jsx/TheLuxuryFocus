import React, { useContext, useState, useEffect } from 'react'
import { auth, googleAuthProvider, db } from '../firebase'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    async function googleSignIn() {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider)
            return result.user
        } catch (error) {
            console.error("Error signing in with Google", error)
            throw error
        }
    }

    function logout() {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user)
                // Fetch user data from Firestore
                const userRef = doc(db, 'users', user.uid)
                const userSnap = await getDoc(userRef)

                if (userSnap.exists()) {
                    setUserData(userSnap.data())
                } else {
                    // Initialize user document if not exists (should have been handled in sign in, but just in case)
                    const newUserData = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        createdAt: serverTimestamp(),
                        lastLogin: serverTimestamp(),
                        is_admin: false // Default to false
                    }
                    await setDoc(userRef, newUserData)
                    setUserData(newUserData)
                }
            } else {
                setCurrentUser(null)
                setUserData(null)
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userData,
        isAdmin: userData?.is_admin || false,
        googleSignIn,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
