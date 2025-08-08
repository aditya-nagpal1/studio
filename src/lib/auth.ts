
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
  User
} from "firebase/auth";
import { auth, db, storage } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Sign Up
export const signUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign In
export const signIn = async (email: string, password: string) => {
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
export const passwordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// Auth State Change
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

interface UserProfileInput {
  username: string;
  displayName: string;
  bio?: string;
  photoFile?: File;
}

// Create User Profile
export const createUserProfile = async (
  user: User | null,
  { username, displayName, bio, photoFile }: UserProfileInput
) => {
    if (!user) return;

    let photoURL = user.photoURL || '';

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
        bio: bio || '',
        photoURL,
        createdAt: new Date()
    }, { merge: true });
};

// Get User Profile
export const getUserProfile = async (uid: string) => {
    if (!uid) return null;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};
