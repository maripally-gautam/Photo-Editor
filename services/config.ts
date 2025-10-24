import { firebaseCredentials } from '../firebaseConfig';

// Firebase configuration is imported from firebaseConfig.ts for local development.
// IMPORTANT: For production, it's highly recommended to use secure environment variables.
export const firebaseConfig = firebaseCredentials;

// Gemini API key is securely read from environment variables provided by the platform.
export const geminiApiKey = process.env.API_KEY;

// Check if all necessary configuration is present.
// This ensures the app doesn't run with placeholder credentials.
export const isConfigured = 
    !!geminiApiKey &&
    !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY_HERE" &&
    !!firebaseConfig.authDomain && firebaseConfig.authDomain !== "YOUR_FIREBASE_AUTH_DOMAIN_HERE" &&
    !!firebaseConfig.projectId && firebaseConfig.projectId !== "YOUR_FIREBASE_PROJECT_ID_HERE" &&
    !!firebaseConfig.storageBucket && firebaseConfig.storageBucket !== "YOUR_FIREBASE_STORAGE_BUCKET_HERE" &&
    !!firebaseConfig.messagingSenderId && firebaseConfig.messagingSenderId !== "YOUR_FIREBASE_MESSAGING_SENDER_ID_HERE" &&
    !!firebaseConfig.appId && firebaseConfig.appId !== "YOUR_FIREBASE_APP_ID_HERE";
