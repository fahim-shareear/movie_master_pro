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
        const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
            setUser(currentUser);
            if(currentUser){
                const loggedUser = {email: currentUser.email};
                // Request a JWT from the server. The server should set the JWT as an HttpOnly cookie
                // via the Set-Cookie header. We include credentials so the browser accepts the cookie.
                fetch('http://localhost:3000/jwt', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(loggedUser)
                })
                .then(res => {
                    setLoading(false);
                    return res.json().catch(() => null);
                })
                .then(() => {
                    // token is expected to be stored as an HttpOnly cookie by the server
                })
                .catch(() => setLoading(false))
            } else {
                // No user; ensure loading is false. If you need to clear the cookie on sign-out,
                // implement a logout endpoint on the server that clears the HttpOnly cookie.
                setLoading(false);
            }
        })

        return () => unsubscribe();
    }, [])


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