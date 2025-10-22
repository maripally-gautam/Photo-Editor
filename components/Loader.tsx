import React from 'react';

interface LoaderProps {
    message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Generating Magic..." }) => (
    <div className="absolute inset-0 bg-gray-800/50 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-gray-200">{message}</p>
    </div>
);