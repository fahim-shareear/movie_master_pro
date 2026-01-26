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


    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            // console.log(currentUser);
            setUser(currentUser);
            if(currentUser){
                const loggedUser = {email: currentUser.email}
                fetch('http://localhost:3000/getToken', {
                    method: 'POST',
                    headers: {
                        'content-type' : 'application/json'
                    },
                    body: JSON.stringify(loggedUser)
                })
                    .then(res => res.json())
                    .then(data => {
                        // console.log("After getting token", data);
                        localStorage.setItem('token', data.token);
                    });
            };
            setLoading(false);
        });

        return () =>{
            unsubscribe();
        }

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