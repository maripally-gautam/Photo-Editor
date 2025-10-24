import React from 'react';
import { ExclamationTriangleIcon } from './icons';

export const ConfigurationError: React.FC = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
        <div className="w-full max-w-lg mx-auto bg-gray-800 border border-red-500/50 rounded-2xl shadow-2xl p-8 text-center">
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto text-red-400" />
            <h1 className="text-3xl font-extrabold text-white mt-4">Configuration Error</h1>
            <p className="mt-4 text-lg text-gray-300">
                The application is missing necessary API keys or configuration variables.
            </p>
            <p className="mt-2 text-md text-gray-400">
                Please ensure that your environment variables for both the Gemini API key and the Firebase configuration are correctly set up. These are required for the application to function.
            </p>
        </div>
    </div>
);
