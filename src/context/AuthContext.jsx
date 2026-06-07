import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inscription
  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  };

  // Connexion
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Déconnexion
  const logout = () => {
    return signOut(auth);
  };

  // Connexion avec Google
  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Réinitialisation du mot de passe
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/auth/login`,
      handleCodeInApp: false,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
