import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Part } from '@google/genai';
import { sendStudyMessage, generateQuiz, QuizQuestion, generateSpeech } from '../services/geminiService';
import { PaperAirplaneIcon, UserIcon, CpuChipIcon, ExclamationTriangleIcon, DocumentTextIcon, PhotoIcon, SparklesIcon, AcademicCapIcon, SpeakerWaveIcon, PlusIcon } from './icons';

interface StudyMessage {
    role: 'user' | 'model' | 'system';
    parts: Part[];
    id: string;
}

interface FileData {
    name: string;
    type: 'image';
    content: string; // base64 for image
    mimeType?: string;
}

// --- Audio Helper Functions ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const StudyModule: React.FC = () => {
    const [messages, setMessages] = useState<StudyMessage[]>([]);
    const [input, setInput] = useState('');
    const [attachedFile, setAttachedFile] = useState<FileData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<(string | null)[]>([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{ role: 'model', parts: [{ text: "Welcome to the Study Assistant! Upload an image or ask me a question about any topic to get started." }], id: Date.now().toString() }]);
        // Fix: Cast window to any to access vendor-prefixed webkitAudioContext
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setIsActionMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);

        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            setError('File is too large. Please upload an image smaller than 5MB.');
            return;
        }

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachedFile({ name: file.name, type: 'image', content: (reader.result as string).split(',')[1], mimeType: file.type });
            };
            reader.readAsDataURL(file);
        } else {
            setError("Unsupported file type. Please upload an image.");
        }
    };
    
    const handleSendMessage = async () => {
        if ((!input.trim() && !attachedFile) || isLoading) return;

        setIsLoading(true);
        setError(null);

        const userParts: Part[] = [];
        if (input.trim()) userParts.push({ text: input });
        if (attachedFile) {
            userParts.push({ inlineData: { mimeType: attachedFile.mimeType!, data: attachedFile.content } });
        }
        
        const newUserMessage: StudyMessage = { role: 'user', parts: userParts, id: Date.now().toString() };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setAttachedFile(null);

        try {
            const responseText = await sendStudyMessage(userParts);
            const newModelMessage: StudyMessage = { role: 'model', parts: [{ text: responseText }], id: (Date.now() + 1).toString() };
            setMessages(prev => [...prev, newModelMessage]);
        } catch (e: any) {
            const errorMessage: StudyMessage = { role: 'system', parts: [{ text: `Error: ${e.message}` }], id: (Date.now() + 1).toString() };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateQuiz = async () => {
        setIsActionMenuOpen(false);
        setIsLoading(true);
        setError(null);
        setQuiz(null);
        setQuizSubmitted(false);

        const context = messages
            .filter(m => m.role !== 'system')
            .map(m => m.parts.map(p => 'text' in p ? p.text : `[IMAGE]`).join(' '))
            .join('\n');
            
        const systemMessage: StudyMessage = { role: 'system', parts: [{ text: 'Generating a quiz based on our conversation...' }], id: Date.now().toString() };
        setMessages(prev => [...prev, systemMessage]);

        try {
            const quizData = await generateQuiz(context);
            if (quizData.length > 0) {
                setQuiz(quizData);
                setQuizAnswers(new Array(quizData.length).fill(null));
                 setMessages(prev => prev.filter(m => m.id !== systemMessage.id)); // remove loading message
            } else {
                throw new Error("The AI couldn't generate a quiz from this content.");
            }
        } catch(e: any) {
            setError(e.message);
            setMessages(prev => prev.filter(m => m.id !== systemMessage.id)); // remove loading message
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayAudio = useCallback(async (text: string, messageId: string) => {
        if (!audioContextRef.current) return;
        if (audioPlaying === messageId) return;

        setAudioPlaying(messageId);
        try {
            const base64Audio = await generateSpeech(text);
            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.start();
            source.onended = () => setAudioPlaying(null);
        } catch (e: any) {
            setError(`Audio generation failed: ${e.message}`);
            setAudioPlaying(null);
        }
    }, [audioPlaying]);


    const renderQuiz = () => {
        if (!quiz) return null;

        const score = quiz.reduce((acc, q, i) => acc + (q.answer === quizAnswers[i] ? 1 : 0), 0);

        return (
            <div className="bg-gray-800 p-6 rounded-lg my-4 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-teal-300">Knowledge Check</h3>
                {quiz.map((q, qIndex) => (
                    <div key={qIndex} className="mb-6">
                        <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                        <div className="space-y-2">
                            {q.options.map((option, oIndex) => {
                                let bgColor = 'bg-gray-700 hover:bg-gray-600';
                                if (quizSubmitted) {
                                    if (option === q.answer) {
                                        bgColor = 'bg-green-500/50';
                                    } else if (option === quizAnswers[qIndex]) {
                                        bgColor = 'bg-red-500/50';
                                    }
                                }
                                return (
                                    <button
                                        key={oIndex}
                                        disabled={quizSubmitted}
                                        onClick={() => {
                                            const newAnswers = [...quizAnswers];
                                            newAnswers[qIndex] = option;
                                            setQuizAnswers(newAnswers);
                                        }}
                                        className={`w-full text-left p-3 rounded-md transition-colors ${bgColor} ${quizAnswers[qIndex] === option && !quizSubmitted ? 'ring-2 ring-teal-400' : ''}`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {quizSubmitted ? (
                    <div className="text-center p-4 bg-gray-900 rounded-lg">
                        <p className="text-2xl font-bold">You scored {score} out of {quiz.length}!</p>
                    </div>
                ) : (
                    <button onClick={() => setQuizSubmitted(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                        Submit Quiz
                    </button>
                )}
            </div>
        );
    };

    const renderPart = (part: Part) => {
        if ('text' in part) return <p className="whitespace-pre-wrap">{part.text}</p>;
        if ('inlineData' in part) return <img src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} className="max-w-xs rounded-lg mt-2" alt="Uploaded content" />;
        return null;
    };
    
    return (
        <div className="h-full flex flex-col bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden">
            <header className="flex items-center justify-between p-4 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <AcademicCapIcon className="w-6 h-6 text-teal-400"/>
                    Study Assistant
                </h3>
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''} ${msg.role === 'system' ? 'justify-center' : ''}`}>
                         {msg.role === 'model' && (
                            <div className="w-8 h-8 flex-shrink-0 bg-teal-500 rounded-full flex items-center justify-center">
                                <CpuChipIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-xs md:max-w-2xl px-4 py-2 rounded-2xl text-white ${
                            msg.role === 'user' ? 'bg-purple-600 rounded-br-none' : 
                            msg.role === 'model' ? 'bg-gray-700 rounded-bl-none' : 
                            'bg-red-800 text-center'}`
                        }>
                           {msg.parts.map((p, i) => <div key={i}>{renderPart(p)}</div>)}
                           {msg.role === 'model' && msg.parts.some(p => 'text' in p) && (
                                <button
                                    onClick={() => handlePlayAudio(msg.parts.map(p => 'text' in p ? p.text : '').join(' '), msg.id)}
                                    className="mt-2 text-gray-400 hover:text-white"
                                    disabled={audioPlaying !== null}
                                >
                                    {audioPlaying === msg.id ? (
                                        <span className="text-sm italic">Playing...</span>
                                    ) : (
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                    )}
                                </button>
                           )}
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {renderQuiz()}
                 {isLoading && !quiz && (
                    <div className="flex items-start gap-3">
                         <div className="w-8 h-8 flex-shrink-0 bg-teal-500 rounded-full flex items-center justify-center">
                            <CpuChipIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-xs md:max-w-sm px-4 py-3 rounded-2xl bg-gray-700 rounded-bl-none flex items-center space-x-2">
                           <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                           <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                           <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

             <div className="p-4 border-t border-gray-700 bg-gray-800">
                {error && (
                    <div className="flex items-center text-red-400 mb-2 p-2 bg-red-900/50 rounded-lg">
                        <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}
                {attachedFile && (
                    <div className="mb-2 flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                            <PhotoIcon className="w-5 h-5" />
                            <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                        </div>
                        <button onClick={() => setAttachedFile(null)} className="text-gray-400 hover:text-white">&times;</button>
                    </div>
                )}
                 <div className="flex items-center gap-2">
                    <div className="relative" ref={actionMenuRef}>
                         <button onClick={() => setIsActionMenuOpen(prev => !prev)} className="p-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors" aria-label="More actions">
                            <PlusIcon className="w-6 h-6" />
                         </button>
                         {isActionMenuOpen && (
                            <div className="absolute bottom-full mb-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg overflow-hidden">
                                <button 
                                    onClick={handleGenerateQuiz} 
                                    disabled={isLoading || messages.length < 2} 
                                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SparklesIcon className="w-5 h-5 text-teal-400"/>
                                    <span>Generate Quiz</span>
                                </button>
                                <button
                                     onClick={() => {
                                        fileInputRef.current?.click();
                                        setIsActionMenuOpen(false);
                                     }}
                                     className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-600"
                                >
                                     <PhotoIcon className="w-5 h-5 text-purple-400"/>
                                     <span>Upload Photo</span>
                                </button>
                            </div>
                         )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    <div className="flex-1 flex items-center space-x-2 bg-gray-700 rounded-lg pr-2">
                        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())} placeholder="Ask a question or describe your photo..." rows={1} className="flex-1 bg-transparent p-2 text-white placeholder-gray-400 focus:outline-none resize-none" style={{ maxHeight: '100px' }} />
                        <button onClick={handleSendMessage} disabled={(!input.trim() && !attachedFile) || isLoading} className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors" aria-label="Send message">
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                 </div>
             </div>
        </div>
    );
};