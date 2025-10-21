
import React, { useState, useCallback } from 'react';
import { editImageWithGemini } from './services/geminiService';
import { SparklesIcon, UploadIcon, DownloadIcon, ArrowPathIcon, ExclamationTriangleIcon } from './components/icons';
import { Loader } from './components/Loader';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setOriginalMimeType(file.type);
                setEditedImage(null);
                setError(null);
                setPrompt('');
            };
            reader.onerror = () => {
                setError("Failed to read the image file.");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = useCallback(async () => {
        if (!originalImage || !prompt || !originalMimeType) {
            setError("Please upload an image and enter a prompt.");
            return;
        }
        setIsLoading(true);
        setEditedImage(null);
        setError(null);
        try {
            const newImageBase64 = await editImageWithGemini(originalImage, originalMimeType, prompt);
            setEditedImage(newImageBase64);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred while generating the image.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, originalMimeType, prompt]);

    const handleReset = () => {
        setOriginalImage(null);
        setOriginalMimeType(null);
        setEditedImage(null);
        setPrompt('');
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-6xl mx-auto text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    AI Photo Editor
                </h1>
                <p className="mt-2 text-lg text-gray-400">
                    Edit your photos with a simple text prompt, powered by Gemini.
                </p>
            </header>

            <main className="flex-grow w-full max-w-6xl mx-auto">
                {!originalImage ? (
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 border-2 border-dashed border-gray-600 rounded-2xl bg-gray-800/50 hover:border-purple-500 transition-colors duration-300">
                         <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Upload Your Photo</h2>
                        <p className="text-gray-400 mb-6 text-center">Drag & drop an image or click to select a file.</p>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300"
                        >
                            Select Image
                        </label>
                         {error && (
                            <div className="mt-4 flex items-center text-red-400">
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Original Image & Controls */}
                            <div className="flex flex-col space-y-4">
                                <h3 className="text-xl font-semibold text-gray-300">Before</h3>
                                <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                                    <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-grow flex flex-col space-y-4">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., 'make the sky a vibrant sunset', 'add a cat wearing sunglasses', 'turn it into a watercolor painting'..."
                                        rows={4}
                                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
                                        disabled={isLoading}
                                    />
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isLoading || !prompt}
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg transition-all transform hover:scale-105 disabled:scale-100"
                                        >
                                            <SparklesIcon className="w-5 h-5 mr-2" />
                                            {isLoading ? 'Generating...' : 'Generate'}
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            disabled={isLoading}
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors"
                                        >
                                            <ArrowPathIcon className="w-5 h-5 mr-2" />
                                            Start Over
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Edited Image */}
                            <div className="flex flex-col space-y-4">
                                <h3 className="text-xl font-semibold text-gray-300">After</h3>
                                <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-lg flex items-center justify-center relative">
                                    {isLoading && <Loader />}
                                    {error && !isLoading && (
                                        <div className="p-4 text-center text-red-400">
                                            <ExclamationTriangleIcon className="w-10 h-10 mx-auto mb-2" />
                                            <p className="font-semibold">Generation Failed</p>
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    )}
                                    {!isLoading && !error && editedImage && (
                                        <img src={`data:image/png;base64,${editedImage}`} alt="Edited" className="w-full h-full object-contain" />
                                    )}
                                    {!isLoading && !error && !editedImage && (
                                        <div className="text-center text-gray-500">
                                            <SparklesIcon className="w-12 h-12 mx-auto mb-2" />
                                            <p>Your edited image will appear here.</p>
                                        </div>
                                    )}
                                </div>
                                {editedImage && !isLoading && (
                                    <a
                                        href={`data:image/png;base64,${editedImage}`}
                                        download="edited-photo.png"
                                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg transition-all transform hover:scale-105"
                                    >
                                        <DownloadIcon className="w-5 h-5 mr-2" />
                                        Download Image
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
