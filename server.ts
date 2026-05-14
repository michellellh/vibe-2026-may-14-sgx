import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini AI Setup
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");

  // API routes
  app.post("/api/ai/chat", async (req, res) => {
    const { question } = req.body;
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
      }
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: `You are an expert financial analyst specializing in the Singapore Exchange (SGX). 
        Provide concise, accurate, and insightful information about stocks, indices, and market trends in Singapore. 
        Always remind the user that this is not financial advice. 
        Use professional yet accessible language. 
        If possible, mention specific SGX tickers (e.g., D05 for DBS).`,
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: question }] }],
        tools: [{ googleSearch: {} } as any],
      });

      const response = result.response;
      res.json({
        text: response.text(),
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
          url: chunk.web?.uri || "",
          title: chunk.web?.title || "",
        })).filter(s => s.url) || [],
      });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
