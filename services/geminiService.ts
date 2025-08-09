
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { SummaryOption } from "../types";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const enhanceTextWithAI = async (textToEnhance: string, context: 'summary' | 'experience'): Promise<string> => {
  // Defensive check to prevent crash if textToEnhance is not a string
  if (!API_KEY || !textToEnhance || !textToEnhance.trim()) {
    return textToEnhance;
  }
  
  const contextPrompt = context === 'summary' 
    ? 'You are an expert resume writer. Rewrite the following professional summary to be more impactful and concise for a resume. Use strong action verbs and highlight key achievements.'
    : 'You are an expert resume writer. Rewrite the following job description point to be more impactful and achievement-oriented for a resume. Use the STAR method (Situation, Task, Action, Result) if possible and quantify results where you can. Keep it to a single paragraph or a few bullet points.';

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${contextPrompt}\n\nOriginal text: "${textToEnhance}"\n\nEnhanced text:`,
        config: {
            temperature: 0.7,
            topP: 1,
            topK: 32,
            maxOutputTokens: 256,
        }
    });
    
    const enhancedText = response.text;

    // Guard against empty/falsy response to prevent crash
    if (enhancedText && typeof enhancedText === 'string') {
      return enhancedText.trim();
    }
    
    console.warn("AI enhancement returned no text. This could be due to safety settings or other content filters. Returning original text.");
    return textToEnhance;

  } catch (error) {
    console.error("Error enhancing text with AI:", error);
    // In case of an API error, return the original text so the user's work isn't lost.
    return textToEnhance; 
  }
};


export const getEnhancedSummaryOptions = async (textToEnhance: string): Promise<SummaryOption[]> => {
  if (!API_KEY || !textToEnhance || !textToEnhance.trim()) {
    return [];
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert resume writer. A user has provided their professional summary. Generate three distinct, improved versions of it. Each version should have a specific angle or tone. For each version, provide a short title (e.g., "Impact-Focused"), a one-sentence description of its style, and the full enhanced summary content.
      
      Original summary: "${textToEnhance}"`,
      config: {
        temperature: 0.8,
        topP: 1,
        topK: 40,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaries: {
              type: Type.ARRAY,
              description: "An array of three enhanced summary options.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "A short, catchy title for the summary style (e.g., 'Professional & Concise')." },
                  description: { type: Type.STRING, description: "A brief one-sentence explanation of the summary's tone and focus." },
                  content: { type: Type.STRING, description: "The full, rewritten professional summary." }
                },
                required: ["title", "description", "content"]
              }
            }
          },
          required: ["summaries"]
        }
      }
    });

    const responseText = response.text;
    // FIX: Check if responseText is a non-empty string before processing.
    if (responseText && typeof responseText === 'string') {
        const jsonResponse = JSON.parse(responseText);
        return jsonResponse.summaries || [];
    }
    
    console.warn("AI enhancement for summary options returned no text. Returning empty array.");
    return [];

  } catch (error) {
    console.error("Error getting summary enhancement options from AI:", error);
    return [];
  }
};
