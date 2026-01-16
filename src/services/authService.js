import { auth, googleProvider } from '../firebase';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail
} from "firebase/auth";

const SESSION_KEY = 'cinemax_session';

export const authService = {
    // Register a new user
    register: async (userData) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const user = userCredential.user;

            // Validate userData name
            if (userData.name) {
                await updateProfile(user, {
                    displayName: userData.name,
                    photoURL: userData.avatar || `https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}&background=random`
                });
            }

            const mappedUser = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || userData.name,
                avatar: user.photoURL,
                dob: userData.dob // Firebase doesn't store DOB natively in profile, would need Firestore. For now, we skip or store in local session wrapper if needed, but let's stick to basics.
            };

            // Persist mimicking legacy behavior if needed, but Firebase handles session.
            // We'll update local storage just for components relying on it synchronously for now, 
            // but ideally we should move to onAuthStateChanged.
            localStorage.setItem(SESSION_KEY, JSON.stringify(mappedUser));

            return { success: true, user: mappedUser };
        } catch (error) {
            console.error(error);
            let message = "Kayıt başarısız.";
            if (error.code === 'auth/email-already-in-use') message = "Bu e-posta adresi zaten kullanımda.";
            if (error.code === 'auth/weak-password') message = "Şifre çok zayıf.";
            return { success: false, message };
        }
    },

    // Login existing user
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const mappedUser = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || email.split('@')[0],
                avatar: user.photoURL
            };

            localStorage.setItem(SESSION_KEY, JSON.stringify(mappedUser));
            return { success: true, user: mappedUser };
        } catch (error) {
            console.error(error);
            let message = "Giriş başarısız.";
            if (error.code === 'auth/user-not-found') message = "Kullanıcı bulunamadı.";
            if (error.code === 'auth/wrong-password') message = "Hatalı şifre.";
            if (error.code === 'auth/invalid-credential') message = "Hatalı e-posta veya şifre.";
            return { success: false, message };
        }
    },

    // Login with Google
    loginWithGoogle: async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const mappedUser = {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL
            };

            localStorage.setItem(SESSION_KEY, JSON.stringify(mappedUser));
            return { success: true, user: mappedUser };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.message };
        }
    },

    changePassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true, message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi." };
        } catch (error) {
            console.error(error);
            return { success: false, message: "E-posta gönderilemedi. Lütfen tekrar deneyin." };
        }
    },

    updateUser: (updatedUser) => {
        // Only updates local representation for immediate UI. 
        // Real updateProfile would be async.
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
        if (auth.currentUser) {
            updateProfile(auth.currentUser, {
                displayName: updatedUser.name,
                photoURL: updatedUser.avatar
            }).catch(e => console.error(e));
        }
    },

    // Get current session
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    },

    // Logout
    logout: async () => {
        try {
            await signOut(auth);
            localStorage.removeItem(SESSION_KEY);
        } catch (error) {
            console.error(error);
        }
    }
};
