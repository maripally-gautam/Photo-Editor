import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- Authentication ---
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
};

export const signOutUser = () => {
    return signOut(auth);
};

export { onAuthStateChanged };

// --- Storage and Firestore ---

// Helper to convert data URL to a blob
async function dataUrlToBlob(dataUrl: string) {
    const res = await fetch(dataUrl);
    return await res.blob();
}

export const saveImageToGallery = async (
    userId: string,
    generatedImageDataUrl: string, // "data:image/png;base64,..."
    prompt: string,
    originalImageDataUrl: string | null
) => {
    if (!userId) throw new Error("User not authenticated.");

    try {
        // 1. Upload the generated image to Firebase Storage
        const generatedImageRef = ref(storage, `images/${userId}/${Date.now()}_generated.png`);
        await uploadString(generatedImageRef, generatedImageDataUrl, 'data_url');
        const generatedImageUrl = await getDownloadURL(generatedImageRef);

        let originalImageUrl: string | null = null;
        // 2. If it's an "edit", upload the original image too
        if (originalImageDataUrl) {
             const originalImageRef = ref(storage, `images/${userId}/${Date.now()}_original.png`);
             await uploadString(originalImageRef, originalImageDataUrl, 'data_url');
             originalImageUrl = await getDownloadURL(originalImageRef);
        }

        // 3. Save metadata to Firestore
        await addDoc(collection(db, "images"), {
            userId,
            prompt,
            generatedImageUrl,
            originalImageUrl,
            createdAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Error saving image to gallery: ", error);
        throw new Error("Could not save image to your gallery. Please try again.");
    }
};

export interface GalleryImage {
    id: string;
    prompt: string;
    generatedImageUrl: string;
    originalImageUrl?: string;
    createdAt: Date;
}

export const getUserImages = async (userId: string): Promise<GalleryImage[]> => {
    if (!userId) return [];
    try {
        const q = query(
            collection(db, "images"), 
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        const images: GalleryImage[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            images.push({
                id: doc.id,
                prompt: data.prompt,
                generatedImageUrl: data.generatedImageUrl,
                originalImageUrl: data.originalImageUrl || undefined,
                createdAt: data.createdAt.toDate(),
            });
        });
        return images;
    } catch (error) {
        console.error("Error fetching user images: ", error);
        throw new Error("Could not fetch your gallery. Please try again.");
    }
};