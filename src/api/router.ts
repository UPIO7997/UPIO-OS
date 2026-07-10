import express from "express";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Chat API using Gemini
router.post("/chat", async (req, res) => {
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
router.get("/drive", async (req, res) => {
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

export default router;
