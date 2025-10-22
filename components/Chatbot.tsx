import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon, UserIcon, CpuChipIcon, LightBulbIcon } from './icons';

export interface Message {
    role: 'user' | 'model';
    text: string;
}

interface ChatbotProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    onClose: () => void;
    isLoading: boolean;
    purpose: 'general' | 'prompt_generation';
    onPromptSelect: (prompt: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ messages, onSendMessage, onClose, isLoading, purpose, onPromptSelect }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    // Function to extract prompt from model's response
    const extractPrompt = (text: string): string | null => {
        const match = text.match(/"(.*?)"/);
        return match ? match[1] : null;
    };

    return (
        <div className="fixed bottom-24 right-5 w-[calc(100vw-40px)] max-w-md h-[70vh] max-h-[600px] bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">{purpose === 'prompt_generation' ? 'Prompt Generator' : 'Creative Assistant'}</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close chat"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </header>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => {
                    const potentialPrompt = extractPrompt(msg.text);
                    return (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
                                    <CpuChipIcon className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div className="flex flex-col gap-2">
                                <div className={`max-w-xs md:max-w-sm px-4 py-2 rounded-2xl text-white ${msg.role === 'user' ? 'bg-purple-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                   <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                                {purpose === 'prompt_generation' && msg.role === 'model' && potentialPrompt && (
                                    <button 
                                        onClick={() => onPromptSelect(potentialPrompt)}
                                        className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full transition-colors duration-200 bg-pink-600 hover:bg-pink-700 text-white font-semibold self-start"
                                    >
                                        <LightBulbIcon className="w-4 h-4" />
                                        Try this Prompt
                                    </button>
                                )}
                            </div>
                             {msg.role === 'user' && (
                                <div className="w-8 h-8 flex-shrink-0 bg-gray-600 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="flex items-start gap-3">
                         <div className="w-8 h-8 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
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

            {/* Input Form */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex items-center space-x-2 bg-gray-700 rounded-lg pr-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask for an idea..."
                        rows={1}
                        className="flex-1 bg-transparent p-2 text-white placeholder-gray-400 focus:outline-none resize-none"
                        style={{ maxHeight: '100px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};