import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { getUserImages, GalleryImage } from '../services/firebaseService';
import { Loader } from './Loader';
import { ExclamationTriangleIcon, PhotoIcon } from './icons';

interface GalleryProps {
    user: User;
}

export const Gallery: React.FC<GalleryProps> = ({ user }) => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const userImages = await getUserImages(user.uid);
                setImages(userImages);
            } catch (e: any) {
                setError(e.message || "Failed to load your gallery. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [user]);

    if (isLoading) {
        return <div className="flex-grow flex items-center justify-center"><Loader message="Loading Gallery..." /></div>;
    }

    if (error) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-red-400 p-4 text-center">
                <ExclamationTriangleIcon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold">Oops! Something went wrong.</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
                <PhotoIcon className="w-24 h-24 mb-4" />
                <h3 className="text-2xl font-bold">Your Gallery is Empty</h3>
                <p className="mt-2">Start creating or editing images to see them here.</p>
            </div>
        );
    }

    return (
        <div className="flex-grow w-full">
            <h2 className="text-3xl font-bold text-white mb-8">My Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map(image => (
                    <div key={image.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg group relative border border-gray-700">
                        <img 
                            src={image.generatedImageUrl} 
                            alt={image.prompt} 
                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                            <p className="text-white text-sm font-semibold line-clamp-3">{image.prompt}</p>
                            <p className="text-xs text-gray-300 mt-1">{image.createdAt.toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
