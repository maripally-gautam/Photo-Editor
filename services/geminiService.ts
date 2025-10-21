
import { GoogleGenAI, Modality } from '@google/genai';

export const editImageWithGemini = async (
    base64ImageDataUrl: string,
    mimeType: string,
    prompt: string
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // The model expects a raw base64 string, not a data URL.
    const rawBase64Data = base64ImageDataUrl.split(',')[1];
    if (!rawBase64Data) {
        throw new Error("Invalid image data URL provided.");
    }
    
    const imagePart = {
        inlineData: {
            data: rawBase64Data,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', // 'Nano Banana' model
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        // Find the image part in the response
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                return part.inlineData.data;
            }
        }

        throw new Error("No image data found in the API response.");
    } catch (error: any) {
        console.error("Gemini API call failed:", error);
        // Provide a more user-friendly error message
        if (error.message.includes('deadline')) {
            throw new Error("The request timed out. Please try again.");
        }
        if(error.message.includes('API key not valid')){
             throw new Error("The provided API key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to communicate with the AI model.");
    }
};
