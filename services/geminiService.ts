import { GoogleGenAI, Modality, Chat, Part, Type } from '@google/genai';
import { geminiApiKey } from './config';

// Helper to get an AI instance. The API key is guaranteed to be present by the App component guard.
const getAi = () => new GoogleGenAI({ apiKey: geminiApiKey! });

// Helper for error handling
const handleApiError = (error: any, context: string) => {
    console.error(`Gemini API call failed (${context}):`, error);
    if (error.message.includes('deadline')) {
        throw new Error("The request timed out. Please try again.");
    }
    if(error.message.includes('API key not valid')){
         throw new Error("The provided API key is not valid. Please check your configuration.");
    }
    throw new Error(`Failed to communicate with the AI model for ${context}.`);
};


// --- Image Generation and Editing ---

export const generateImageWithGemini = async (prompt: string): Promise<string> => {
    const ai = getAi();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [{ text: prompt }],
            config: { responseModalities: [Modality.IMAGE] },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data found in the API response.");
    } catch (error) {
        handleApiError(error, 'image generation');
        return ''; // Should not be reached
    }
};


export const editImageWithGemini = async (
    base64ImageDataUrl: string,
    mimeType: string,
    prompt: string
): Promise<string> => {
    const ai = getAi();
    const rawBase64Data = base64ImageDataUrl.split(',')[1];
    if (!rawBase64Data) throw new Error("Invalid image data URL provided.");
    
    const imagePart = { inlineData: { data: rawBase64Data, mimeType } };
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [imagePart, textPart],
            config: { responseModalities: [Modality.IMAGE] },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data found in the API response.");
    } catch (error) {
        handleApiError(error, 'image editing');
        return ''; // Should not be reached
    }
};

export const analyzeImageForSuggestions = async (
    base64ImageDataUrl: string,
    mimeType: string,
): Promise<string[]> => {
    const ai = getAi();
    const rawBase64Data = base64ImageDataUrl.split(',')[1];
    if (!rawBase64Data) throw new Error("Invalid image data URL provided.");

    const imagePart = { inlineData: { data: rawBase64Data, mimeType } };
    const textPart = { text: `You are a creative photo editing assistant. Analyze this image and provide 4 brief, creative suggestions for how to edit it using a text prompt. Your suggestions should be imaginative and inspiring.` };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [imagePart, textPart],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.suggestions || [];
    } catch (error) {
        handleApiError(error, 'image analysis');
        return []; // Should not be reached
    }
};


// --- Chatbot Services ---

let creativeAssistantChat: Chat | null = null;
let promptGeneratorChat: Chat | null = null;
let studyAssistantChat: Chat | null = null;

function getChatInstance(purpose: 'general' | 'prompt_generation' | 'study'): Chat {
    const ai = getAi();
    switch (purpose) {
        case 'prompt_generation':
            if (!promptGeneratorChat) {
                promptGeneratorChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction: 'You are an expert prompt engineer. Your goal is to help users create detailed, imaginative, and effective prompts for an AI image generator. Ask clarifying questions and provide creative, descriptive prompts. Always enclose the final, suggested prompt in double quotes.' },
                });
            }
            return promptGeneratorChat;
        case 'study':
            if (!studyAssistantChat) {
                 studyAssistantChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction: "You are a friendly and patient study assistant. Your goal is to help users understand topics. When an image is provided, thoroughly analyze its contents, identify key elements, and provide detailed explanations, reasoning, or answers related to it. Explain concepts, summarize materials, and answer questions clearly and concisely." },
                });
            }
            return studyAssistantChat;
        case 'general':
        default:
            if (!creativeAssistantChat) {
                creativeAssistantChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction: 'You are a friendly and helpful creative assistant for an AI photo editing app. You can help users with ideas for image generation prompts, suggest creative edits, or just have a pleasant conversation. Keep your responses concise and encouraging.' },
                });
            }
            return creativeAssistantChat;
    }
}

export const sendChatMessage = async (message: string, purpose: 'general' | 'prompt_generation'): Promise<string> => {
    try {
        const chatInstance = getChatInstance(purpose);
        const response = await chatInstance.sendMessage({ message });
        return response.text;
    } catch (error) {
         handleApiError(error, 'chatbot response');
         return ''; // Should not be reached
    }
};

export const sendStudyMessage = async (parts: Part[]): Promise<string> => {
    try {
        const chatInstance = getChatInstance('study');
        const response = await chatInstance.sendMessage({ parts });
        return response.text;
    } catch (error) {
        handleApiError(error, 'study assistant response');
        return '';
    }
};


// --- Study Assistant specific services ---

export const generateSpeech = async (text: string): Promise<string> => {
    const ai = getAi();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data found in response.");
        }
        return base64Audio;
    } catch (error) {
        handleApiError(error, 'speech generation');
        return '';
    }
};

export interface QuizQuestion {
    question: string;
    options: string[];
    answer: string;
}

export const generateQuiz = async (context: string): Promise<QuizQuestion[]> => {
    const ai = getAi();
    const prompt = `Based on the following context, generate a multiple-choice quiz with 3 questions. For each question, provide 4 options and clearly indicate the correct answer. Context: "${context}"`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quiz: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    answer: { type: Type.STRING }
                                },
                                required: ['question', 'options', 'answer']
                            }
                        }
                    }
                }
            }
        });
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.quiz || [];
    } catch (error) {
        handleApiError(error, 'quiz generation');
        return [];
    }
};
