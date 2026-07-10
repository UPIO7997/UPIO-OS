import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Chat API using Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const { message, history } = req.body;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }]}
        ],
        config: {
          systemInstruction: "You are the UPIO OS Assistant. Help the user manage influencers, brands, campaigns, and company knowledge.",
        }
      });

      res.json({ reply: response.text });
    } catch (err) {
      console.error("Chat Error", err);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Google Drive API
  app.get("/api/drive", async (req, res) => {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET
      );
      
      oauth2Client.setCredentials({
        refresh_token: process.env.OAUTH_REFRESH_TOKEN
      });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      const response = await drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name, mimeType)',
      });
      
      res.json({ files: response.data.files });
    } catch (err) {
      console.error("Drive Error", err);
      res.status(500).json({ error: "Failed to fetch documents from Google Drive", details: (err as Error).message });
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
