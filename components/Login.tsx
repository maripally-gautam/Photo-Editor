import React, { useState } from 'react';
import { signInWithGoogle } from '../services/firebaseService';
import { UserCircleIcon, ExclamationTriangleIcon } from './icons';

export const Login: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
            <div className="w-full max-w-md mx-auto bg-gray-800/50 border border-gray-700 rounded-2xl shadow-2xl p-8 text-center">
                <UserCircleIcon className="w-24 h-24 mx-auto text-purple-400" />
                <h1 className="text-3xl font-extrabold tracking-tight text-white mt-4">
                    Welcome to AI Studio
                </h1>
                <p className="mt-2 text-lg text-gray-400">
                    Sign in to begin your creative journey.
                </p>

                <div className="mt-8">
                    <button
                        onClick={handleSignIn}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg transition-all transform hover:scale-105 disabled:scale-100"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-t-white border-gray-400 rounded-full animate-spin"></div>
                        ) : (
                           <>
                                <svg className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 381.7 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 56.4l-64.2 64.2c-35.2-30.3-81-48.2-133-48.2-109.1 0-198.6 89.5-198.6 199.8s89.5 199.8 198.6 199.8c58.4 0 111.3-24.9 148.8-65.4l64.2 64.2C394.8 456.3 325.3 496 248 496c-132.3 0-240-107.7-240-240S115.7 16 248 16c69.1 0 131.6 28.3 176 74.4l-64 64c-25.1-22.3-58.8-36.4-96-36.4-82.7 0-150 67.3-150 150s67.3 150 150 150c44.5 0 83.8-19.1 112.5-49.4l-64.5-64.5H248v-85h236.1c2.4 12.3 3.9 24.9 3.9 38.1z"></path>
                                </svg>
                                Sign in with Google
                           </>
                        )}
                    </button>
                </div>
                {error && (
                    <div className="mt-6 flex items-center justify-center text-red-400 bg-red-900/50 p-3 rounded-lg">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
