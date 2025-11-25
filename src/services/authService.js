// Firebase Authentication service
// Handles email/password and Google authentication
// Session management is automatically handled by Firebase

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

// Convert Firebase user to app user format
const formatUser = (firebaseUser) => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    photoURL: firebaseUser.photoURL || null,
    createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
    providerId: firebaseUser.providerData[0]?.providerId || 'password'
  };
};

// Get current logged-in user
export const getCurrentUser = () => {
  const user = auth.currentUser;
  return formatUser(user);
};

// Sign up a new user with email and password
export const signUp = async (email, password, fullName) => {
  try {
    // Validate password
    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters.');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address.');
    }

    // Create user with Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    if (fullName && fullName.trim()) {
      await updateProfile(userCredential.user, {
        displayName: fullName.trim()
      });
    }

    return formatUser(userCredential.user);
  } catch (error) {
    // Handle Firebase errors
    let errorMessage = 'Failed to create account. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please log in instead.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Sign in an existing user with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return formatUser(userCredential.user);
  } catch (error) {
    // Handle Firebase errors
    let errorMessage = 'Failed to log in. Please check your credentials.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please sign up.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return formatUser(result.user);
  } catch (error) {
    let errorMessage = 'Failed to sign in with Google. Please try again.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Sign-in was cancelled. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked. Please allow popups and try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Sign out current user
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

// Listen to auth state changes (Firebase automatically handles this)
export const onAuthStateChanged = (callback) => {
  // Firebase's onAuthStateChanged automatically handles session persistence
  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    const user = formatUser(firebaseUser);
    callback(user);
  });
};

// Sign out with notification (for backward compatibility)
export const signOutWithNotification = async () => {
  await signOut();
  // Firebase's onAuthStateChanged will automatically notify listeners
};

// Sign in with notification (for backward compatibility)
export const signInWithNotification = async (email, password) => {
  const user = await signIn(email, password);
  // Firebase's onAuthStateChanged will automatically notify listeners
  return user;
};

// Sign up with notification (for backward compatibility)
export const signUpWithNotification = async (email, password, fullName) => {
  const user = await signUp(email, password, fullName);
  // Firebase's onAuthStateChanged will automatically notify listeners
  return user;
};
