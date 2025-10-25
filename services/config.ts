// Import Firebase credentials from the dedicated config file.
import { firebaseCredentials } from '../firebaseConfig';

// Use the imported credentials as the main Firebase config.
export const firebaseConfig = firebaseCredentials;

// Gemini API key is securely read from environment variables provided by the platform.
export const geminiApiKey = process.env.API_KEY;

// Helper function to check if a value is a placeholder.
const isPlaceholder = (value: string | undefined): boolean => {
    return !value || value.startsWith('YOUR_');
};

// Check if all necessary configuration is present and doesn't contain placeholder values.
// This ensures the app doesn't try to run with incomplete credentials.
export const isConfigured =
    !!geminiApiKey && // Gemini key comes from the environment
    !isPlaceholder(firebaseConfig.apiKey) &&
    !isPlaceholder(firebaseConfig.authDomain) &&
    !isPlaceholder(firebaseConfig.projectId) &&
    !isPlaceholder(firebaseConfig.storageBucket) &&
    !isPlaceholder(firebaseConfig.messagingSenderId) &&
    !isPlaceholder(firebaseConfig.appId);
