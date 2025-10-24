import React, { useState, useCallback, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, saveImageToGallery } from './services/firebaseService';
import { editImageWithGemini, generateImageWithGemini, sendChatMessage, analyzeImageForSuggestions } from './services/geminiService';
import { SparklesIcon, UploadIcon, DownloadIcon, ExclamationTriangleIcon, PencilSquareIcon, PhotoIcon, MagicWandIcon, ChatBubbleOvalLeftEllipsisIcon, HomeIcon, BookOpenIcon, LightBulbIcon, ArrowRightOnRectangleIcon, ServerIcon } from './components/icons';
import { Loader } from './components/Loader';
import { ImageComparator } from './components/ImageComparator';
import { Chatbot, Message } from './components/Chatbot';
import { StudyModule } from './components/StudyModule';
import { Login } from './components/Login';
import { Gallery } from './components/Gallery';

const staticEditPrompts = [
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
    isLoading?: boolean;
}> = ({ prompts, onPromptClick, onSurpriseClick, color, isLoading = false }) => (
    <div className="mt-4">
        <p className="text-sm font-medium text-gray-400 mb-2">Need inspiration? Try these:</p>
        {isLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-4 h-4 border-2 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
                Analyzing your image for ideas...
            </div>
        ) : (
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
        )}
    </div>
);


const AppContent: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [mode, setMode] = useState<'select' | 'edit' | 'generate' | 'study' | 'gallery'>('select');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalMimeType, setOriginalMimeType] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editSuggestions, setEditSuggestions] = useState<string[]>(staticEditPrompts);
    const [isSuggestionLoading, setIsSuggestionLoading] = useState<boolean>(false);

    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [chatbotPurpose, setChatbotPurpose] = useState<'general' | 'prompt_generation'>('general');
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth!, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
            if (currentUser) {
                setMode('select');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (chatMessages.length === 0) {
            setChatMessages([
                { role: 'model', text: "Hello! I'm your creative assistant. Ask me for image ideas or editing tips!" }
            ]);
        }
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imageDataUrl = reader.result as string;
                setOriginalImage(imageDataUrl);
                setOriginalMimeType(file.type);
                setGeneratedImage(null);
                setError(null);
                setPrompt('');
                
                setIsSuggestionLoading(true);
                try {
                    const suggestions = await analyzeImageForSuggestions(imageDataUrl, file.type);
                    setEditSuggestions(suggestions);
                } catch (e) {
                    console.error("Failed to get suggestions:", e);
                    setEditSuggestions(staticEditPrompts);
                } finally {
                    setIsSuggestionLoading(false);
                }
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

    const handleResetToSelect = () => {
        setMode('select');
        setOriginalImage(null);
        setOriginalMimeType(null);
        setGeneratedImage(null);
        setPrompt('');
        setError(null);
        setIsLoading(false);
        setEditSuggestions(staticEditPrompts);
    };
    
    const handleSurpriseMe = (promptList: string[]) => {
        const randomPrompt = promptList[Math.floor(Math.random() * promptList.length)];
        setPrompt(randomPrompt);
    };

    const handleSendChatMessage = async (message: string) => {
        if (!message.trim()) return;

        const newUserMessage: Message = { role: 'user', text: message };
        setChatMessages(prev => [...prev, newUserMessage]);
        setIsChatLoading(true);

        try {
            const responseText = await sendChatMessage(message, chatbotPurpose);
            const newModelMessage: Message = { role: 'model', text: responseText };
            setChatMessages(prev => [...prev, newModelMessage]);
        } catch (e: any) {
            const errorMessage: Message = { role: 'model', text: "Sorry, I couldn't get a response. Please try again." };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsChatLoading(false);
        }
    };
    
    const handlePromptSelect = (selectedPrompt: string) => {
        setPrompt(selectedPrompt);
        setIsChatOpen(false);
    };
    
    const openPromptGenerator = () => {
        setChatbotPurpose('prompt_generation');
        setChatMessages([
            { role: 'model', text: "I can help with that! What kind of image are you thinking of? Give me a theme, a style, or a subject." }
        ]);
        setIsChatOpen(true);
    };

    const handleSaveToGallery = async () => {
        if (!generatedImage || !user) return;
        setIsSaving(true);
        setError(null);
        try {
            const imageToSave = `data:image/png;base64,${generatedImage}`;
            await saveImageToGallery(user.uid, imageToSave, prompt, originalImage);
        } catch(e: any) {
            setError(e.message || "Failed to save image to gallery.");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader message="Authenticating..." /></div>;
    }

    if (!user) {
        return <Login />;
    }

    const renderContent = () => {
        if (mode === 'select') {
            return (
                <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <button onClick={() => setMode('edit')} className="flex flex-col items-center justify-center p-8 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-center hover:border-purple-500 hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1">
                            <PencilSquareIcon className="w-16 h-16 text-purple-400 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-100">Edit Photo</h3>
                            <p className="text-gray-400 mt-2">Modify an existing image with a text prompt.</p>
                        </button>
                        <button onClick={() => setMode('generate')} className="flex flex-col items-center justify-center p-8 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-center hover:border-pink-500 hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1">
                            <PhotoIcon className="w-16 h-16 text-pink-400 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-100">Create Image</h3>
                            <p className="text-gray-400 mt-2">Generate a new image from a text description.</p>
                        </button>
                         <button onClick={() => setMode('study')} className="flex flex-col items-center justify-center p-8 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-center hover:border-teal-500 hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1">
                            <BookOpenIcon className="w-16 h-16 text-teal-400 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-100">Study Assistant</h3>
                            <p className="text-gray-400 mt-2">Learn with an AI tutor, upload files, and create quizzes.</p>
                        </button>
                    </div>
                </div>
            );
        }
        
        if (mode === 'study') return <StudyModule />;
        if (mode === 'gallery') return <Gallery user={user} />;

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
                         {error && (
                            <div className="mt-4 flex items-center text-red-400">
                                <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                );
            }
            return (
                <div className="space-y-6">
                    {generatedImage ? (
                         <div className="relative">
                            <ImageComparator before={originalImage} after={`data:image/png;base64,${generatedImage}`}/>
                            {isLoading && <Loader message="Generating..." />}
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
                                    {isLoading && <Loader message="Generating..." />}
                                    <div className="text-center text-gray-500">
                                        <SparklesIcon className="w-12 h-12 mx-auto mb-2" />
                                        <p>Your edited image will appear here.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="max-w-2xl mx-auto w-full space-y-4">
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'make the sky a vibrant sunset'..." rows={3} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none" disabled={isLoading}/>
                        <PromptSuggestions prompts={editSuggestions} onPromptClick={setPrompt} onSurpriseClick={() => handleSurpriseMe(editSuggestions)} color="purple" isLoading={isSuggestionLoading}/>
                        {error && <div className="flex items-center text-red-400"><ExclamationTriangleIcon className="w-5 h-5 mr-2" /><span>{error}</span></div>}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg transition-all transform hover:scale-105 disabled:scale-100">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isLoading ? 'Generating...' : 'Generate'}
                            </button>
                            {generatedImage && !isLoading && (
                                <>
                                    <button onClick={handleSaveToGallery} disabled={isSaving} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 shadow-lg transition-all transform hover:scale-105">
                                        <ServerIcon className="w-5 h-5 mr-2" />
                                        {isSaving ? 'Saving...' : 'Save to Gallery'}
                                    </button>
                                    <a href={`data:image/png;base64,${generatedImage}`} download="edited-photo.png" className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg transition-all transform hover:scale-105">
                                        <DownloadIcon className="w-5 h-5 mr-2" />
                                        Download
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (mode === 'generate') {
            return (
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-300">Describe the image you want to create</h3>
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'A photorealistic image of an astronaut riding a horse on Mars'..." rows={4} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200 resize-none" disabled={isLoading}/>
                         <PromptSuggestions prompts={generatePrompts} onPromptClick={setPrompt} onSurpriseClick={() => handleSurpriseMe(generatePrompts)} color="pink"/>
                        <div className="flex flex-col sm:flex-row gap-4">
                             <button onClick={openPromptGenerator} disabled={isLoading} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-teal-600 text-base font-medium rounded-md text-teal-300 bg-gray-800 hover:bg-teal-600 hover:text-white disabled:opacity-50 transition-colors">
                                <LightBulbIcon className="w-5 h-5 mr-2" />
                                Generate Prompt
                            </button>
                            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg transition-all transform hover:scale-105 disabled:scale-100">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isLoading ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-xl font-semibold text-gray-300">Generated Image</h3>
                        <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden shadow-lg flex items-center justify-center relative">
                            {isLoading && <Loader message="Generating..." />}
                            {error && !isLoading && (
                                <div className="p-4 text-center text-red-400">
                                    <ExclamationTriangleIcon className="w-10 h-10 mx-auto mb-2" />
                                    <p className="font-semibold">Generation Failed</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            {!isLoading && !error && generatedImage && (<img src={`data:image/png;base64,${generatedImage}`} alt="Generated" className="w-full h-full object-contain" />)}
                            {!isLoading && !error && !generatedImage && (<div className="text-center text-gray-500"><PhotoIcon className="w-12 h-12 mx-auto mb-2" /><p>Your generated image will appear here.</p></div>)}
                        </div>
                        {generatedImage && !isLoading && (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleSaveToGallery} disabled={isSaving} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 shadow-lg transition-all transform hover:scale-105">
                                    <ServerIcon className="w-5 h-5 mr-2" />
                                    {isSaving ? 'Saving...' : 'Save to Gallery'}
                                </button>
                                <a href={`data:image/png;base64,${generatedImage}`} download="generated-photo.png" className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-lg transition-all transform hover:scale-105">
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    Download Image
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-6xl mx-auto mb-8 flex items-center justify-between">
                <button onClick={handleResetToSelect} className="flex items-center gap-2 cursor-pointer">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                        AI Studio
                    </h1>
                </button>
                <div className="flex items-center gap-4">
                    <button onClick={() => setMode('gallery')} className="text-gray-300 hover:text-white font-semibold transition-colors">Gallery</button>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-300">{user.displayName || user.email}</span>
                    <button onClick={() => auth!.signOut()} className="text-gray-400 hover:text-white" aria-label="Sign out">
                        <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="flex-grow w-full max-w-6xl mx-auto flex flex-col">
                {renderContent()}
            </main>

            {mode !== 'study' && mode !== 'gallery' && (
                <div className="fixed bottom-5 right-5 z-50">
                    <button onClick={() => { setChatbotPurpose('general'); setIsChatOpen(!isChatOpen); }} className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500" aria-label="Toggle chatbot">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
                    </button>
                </div>
            )}
            {isChatOpen && (
                 <Chatbot messages={chatMessages} onSendMessage={handleSendChatMessage} onClose={() => setIsChatOpen(false)} isLoading={isChatLoading} purpose={chatbotPurpose} onPromptSelect={handlePromptSelect}/>
            )}
        </div>
    );
};

export default AppContent;
