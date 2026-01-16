import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, getDocs, onSnapshot } from "firebase/firestore";

export const viewService = {
    // Increment view count for a movie
    incrementView: async (movieId) => {
        if (!movieId) return;

        const movieRef = doc(db, "movies", String(movieId));

        try {
            const docSnap = await getDoc(movieRef);

            if (docSnap.exists()) {
                await updateDoc(movieRef, {
                    views: increment(1)
                });
            } else {
                // Initialize if doesn't exist
                await setDoc(movieRef, {
                    views: 1,
                    likes: 0,
                    dislikes: 0
                });
            }
        } catch (error) {
            console.error("Error updating view count:", error);
        }
    },

    // Increment like count
    likeMovie: async (movieId) => {
        if (!movieId) return;
        const movieRef = doc(db, "movies", String(movieId));
        try {
            const docSnap = await getDoc(movieRef);
            if (docSnap.exists()) {
                await updateDoc(movieRef, {
                    likes: increment(1)
                });
            } else {
                await setDoc(movieRef, {
                    views: 0,
                    likes: 1,
                    dislikes: 0
                });
            }
            return true;
        } catch (error) {
            console.error("Error liking movie:", error);
            return false;
        }
    },

    // Get stats for a single movie
    getMovieStats: async (movieId) => {
        if (!movieId) return null;
        const movieRef = doc(db, "movies", String(movieId));
        try {
            const docSnap = await getDoc(movieRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return { views: 0, likes: 0, dislikes: 0 };
        } catch (error) {
            console.error("Error fetching movie stats:", error);
            return null;
        }
    },

    // Get all stats to populate the list
    getAllMovieStats: async () => {
        const stats = {};
        try {
            const querySnapshot = await getDocs(collection(db, "movies"));
            querySnapshot.forEach((doc) => {
                stats[doc.id] = doc.data();
            });
            return stats;
        } catch (error) {
            console.error("Error fetching all stats:", error);
            return {};
        }
    },
    // Listen to real-time updates for all movies
    listenToAllStats: (callback) => {
        try {
            const unsub = onSnapshot(collection(db, "movies"), (querySnapshot) => {
                const stats = {};
                querySnapshot.forEach((doc) => {
                    stats[doc.id] = doc.data();
                });
                callback(stats);
            });
            return unsub;
        } catch (error) {
            console.error("Error listening to stats:", error);
            return () => { };
        }
    },

    // Reset all stats (Admin/Dev tool)
    resetAllStats: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "movies"));
            const promises = querySnapshot.docs.map(docSnap =>
                updateDoc(doc(db, "movies", docSnap.id), {
                    views: 0,
                    likes: 0,
                    dislikes: 0
                })
            );
            await Promise.all(promises);
            console.log("All stats reset to 0");
        } catch (error) {
            console.error("Error resetting stats:", error);
        }
    }
};
