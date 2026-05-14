import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askStockQuestion(question: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: `You are an expert financial analyst specializing in the Singapore Exchange (SGX). 
        Provide concise, accurate, and insightful information about stocks, indices, and market trends in Singapore. 
        Always remind the user that this is not financial advice. 
        Use professional yet accessible language. 
        If possible, mention specific SGX tickers (e.g., D05 for DBS).`,
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "I'm sorry, I couldn't generate a response at this time.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        url: chunk.web?.uri || "",
        title: chunk.web?.title || "",
      })).filter(s => s.url) || [],
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
