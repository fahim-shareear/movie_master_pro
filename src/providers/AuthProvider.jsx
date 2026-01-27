import React from 'react';
import { useState } from 'react';
import { auth } from '../firebase/firebase.init';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { AuthContext } from './AuthContext';
import { useEffect } from 'react';

const googleProvider = new GoogleAuthProvider;

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signInWithGoogle = () =>{
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    };

    const creatingUserWithEmail = (email, password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signInWithEmail = (email, password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signOutUser = () =>{
        setLoading(true);
        return signOut(auth);
    };


    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        
        if (currentUser) {
            // Get the token directly from Firebase
            const token = await currentUser.getIdToken();
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        
        setLoading(false);
    });

    return () => unsubscribe();
}, []);


    const authInfo = {
        signInWithGoogle,
        creatingUserWithEmail,
        signInWithEmail,
        signOutUser,
        loading,
        user
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;