
"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, db, storage } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Sign Up
export const signUp = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign In
export const signIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign In with Google
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// Sign Out
export const logout = () => {
  return signOut(auth);
};

// Password Reset
export const passwordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

// Auth State Change
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Create User Profile
export const createUserProfile = async (user, { username, displayName, bio, photoFile }) => {
    if (!user) return;

    let photoURL = user.photoURL;

    if (photoFile) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
    }
    
    await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
    });

    const userRef = doc(db, "users", user.uid);
    return setDoc(userRef, {
        uid: user.uid,
        username,
        displayName,
        email: user.email,
        bio,
        photoURL,
        createdAt: new Date()
    });
};

// Get User Profile
export const getUserProfile = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};
