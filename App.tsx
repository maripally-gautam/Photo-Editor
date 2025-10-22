
import React, { useState, useCallback } from 'react';
import { editImageWithGemini, generateImageWithGemini } from './services/geminiService';
import { SparklesIcon, UploadIcon, DownloadIcon, ArrowPathIcon, ExclamationTriangleIcon, PencilSquareIcon, PhotoIcon, MagicWandIcon } from './components/icons';
import { Loader } from './components/Loader';
import { ImageComparator } from './components/ImageComparator';

const editPrompts = [
    "Make it look like a vintage photograph",
    "Change the season to winter",
    "Add a dramatic, cloudy sky",
    "Turn it into a watercolor painting",
];

const generatePrompts = [
    "A majestic lion wearing a crown in a lush jungle",
    "A futuristic cityscape at night with flying cars",
    "A cozy library in a treehouse, filled with books",
    "A surreal underwater world with glowing fish",
];

const PromptSuggestions: React.FC<{
    prompts: string[];
    onPromptClick: (prompt: string) => void;
    onSurpriseClick: () => void;
    color: 'purple' | 'pink';
}> = ({ prompts, onPromptClick, onSurpriseClick, color }) => (
    <div className="mt-4">
        <p className="text-sm font-medium text-gray-400 mb-2">Need inspiration? Try these:</p>
        <div className="flex flex-wrap gap-2">
            {prompts.map(p => (
                <button
                    key={p}
                    onClick={() => onPromptClick(p)}
                    className={`text-sm px-3 py-1 rounded-full transition-colors duration-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300`}
                >
                    {p}
                </button>
            ))}
            <button
                onClick={onSurpriseClick}
                className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition-colors duration-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-semibold hover:border-${color}-500 hover:text-white`}
            >
                <MagicWandIcon className="w-4 h-4" />
                Surprise Me
            </button>
        </div>
    </div>
);


const App: React.FC = () => {
    const [mode, setMode] = useState<'select' | 'edit' | 'generate'>('select');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
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
                setGeneratedImage(null);
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
        if (!prompt) {
            setError("Please enter a prompt.");
            return;
        }
        if (mode === 'edit' && (!originalImage || !originalMimeType)) {
            setError("Something went wrong, no original image found to edit.");
            return;
        }

        setIsLoading(true);
        setError(null);
        // Do not clear the previous image, so the comparator can still show it while loading
        // setGeneratedImage(null); 
        try {
            const newImageBase64 = mode === 'edit'
                ? await editImageWithGemini(originalImage!, originalMimeType!, prompt)
                : await generateImageWithGemini(prompt);
            setGeneratedImage(newImageBase64);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred while generating the image.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [mode, originalImage, originalMimeType, prompt]);

    const handleReset = () => {
        setMode('select');
        setOriginalImage(null);
        setOriginalMimeType(null);
        setGeneratedImage(null);
        setPrompt('');
        setError(null);
        setIsLoading(false);
    };
    
    const handleSurpriseMe = (promptList: string[]) => {
        const randomPrompt = promptList[Math.floor(Math.random() * promptList.length)];
        setPrompt(randomPrompt);
    };

    const renderContent = () => {
        if (mode === 'select') {
            return (
                <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-200">What would you like to create?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <button
                            onClick={() => setMode('edit')}
                            className="flex flex-col items-center justify-center p-8 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-center hover:border-purple-500 hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <PencilSquareIcon className="w-16 h-16 text-purple-400 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-100">Edit Photo</h3>
                            <p className="text-gray-400 mt-2">Modify an existing image with a text prompt.</p>
                        </button>
                        <button
                            onClick={() => setMode('generate')}
                            className="flex flex-col items-center justify-center p-8 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-center hover:border-pink-500 hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <PhotoIcon className="w-16 h-16 text-pink-400 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-100">Create Image</h3>
                            <p className="text-gray-400 mt-2">Generate a new image from a text description.</p>
                        </button>
                    </div>
                </div>
            );
        }

        if (mode === 'edit') {
            if (!originalImage) {
                return (
                    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 border-2 border-dashed border-gray-600 rounded-2xl bg-gray-800/50 hover:border-purple-500 transition-colors duration-300">
                        <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Upload Your Photo</h2>
                        <p className="text-gray-400 mb-6 text-center">Drag & drop an image or click to select a file to edit.</p>
                        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="file-upload" className="cursor-pointer bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition-all duration-300">
                            Select Image
                        </label>
                         <button onClick={handleReset} className="mt-4 text-gray-400 hover:text-white transition-colors">Back</button>
                         {error && (
                            <div className="mt-4 flex items-center text-red-400">
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                );
            }
            // With an image uploaded, show the editor view
            return (
                <div className="space-y-6">
                    {generatedImage ? (
                         <div className="relative">
                            <ImageComparator
                                before={originalImage}
                                after={`data:image/png;base64,${generatedImage}`}
                            />
                            {isLoading && <Loader />}
                         </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-300 mb-4">Before</h3>
                                <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                                    <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-300 mb-4">After</h3>
                                <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-lg flex items-center justify-center relative">
                                    {isLoading && <Loader />}
                                    <div className="text-center text-gray-500">
                                        <SparklesIcon className="w-12 h-12 mx-auto mb-2" />
                                        <p>Your edited image will appear here.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="max-w-2xl mx-auto w-full space-y-4">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'make the sky a vibrant sunset', 'add a cat wearing sunglasses'..."
                            rows={3}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
                            disabled={isLoading}
                        />
                        <PromptSuggestions
                            prompts={editPrompts}
                            onPromptClick={setPrompt}
                            onSurpriseClick={() => handleSurpriseMe(editPrompts)}
                            color="purple"
                        />
                        {error && (
                            <div className="flex items-center text-red-400">
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}
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
                        {generatedImage && !isLoading && (
                            <a href={`data:image/png;base64,${generatedImage}`} download="edited-photo.png" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg transition-all transform hover:scale-105">
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                Download Image
                            </a>
                        )}
                    </div>
                </div>
            );
        }

        if (mode === 'generate') {
            return (
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-300">Describe the image you want to create</h3>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'A photorealistic image of an astronaut riding a horse on Mars', 'a cute cat programmer writing code'..."
                            rows={4}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200 resize-none"
                            disabled={isLoading}
                        />
                         <PromptSuggestions
                            prompts={generatePrompts}
                            onPromptClick={setPrompt}
                            onSurpriseClick={() => handleSurpriseMe(generatePrompts)}
                            color="pink"
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt}
                                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg transition-all transform hover:scale-105 disabled:scale-100"
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

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-300">Generated Image</h3>
                        <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-lg flex items-center justify-center relative">
                            {isLoading && <Loader />}
                            {error && !isLoading && (
                                <div className="p-4 text-center text-red-400">
                                    <ExclamationTriangleIcon className="w-10 h-10 mx-auto mb-2" />
                                    <p className="font-semibold">Generation Failed</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            {!isLoading && !error && generatedImage && (
                                <img src={`data:image/png;base64,${generatedImage}`} alt="Generated" className="w-full h-full object-contain" />
                            )}
                            {!isLoading && !error && !generatedImage && (
                                <div className="text-center text-gray-500">
                                    <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                                    <p>Your generated image will appear here.</p>
                                </div>
                            )}
                        </div>
                        {generatedImage && !isLoading && (
                            <a href={`data:image/png;base64,${generatedImage}`} download="generated-photo.png" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg transition-all transform hover:scale-105">
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                Download Image
                            </a>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-6xl mx-auto text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    AI Photo & Image Studio
                </h1>
                <p className="mt-2 text-lg text-gray-400">
                    Your creative partner for editing photos and generating images with Gemini.
                </p>
            </header>

            <main className="flex-grow w-full max-w-6xl mx-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
