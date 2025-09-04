import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { 
  insertProjectSchema, 
  insertChatMessageSchema,
  insertAnalyticsSchema 
} from "@shared/schema";
import { 
  generateText, 
  analyzeImage, 
  generateContent,
  startChat,
  sendMessage,
  getChatHistory 
} from "./services/gemini";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Projects CRUD
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, projectData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Chat endpoints
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/send", async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Add user message
      await storage.addChatMessage({ role: "user", content });

      // Track analytics
      const startTime = Date.now();
      
      // Get AI response
      const response = await sendMessage(content);
      const responseTime = Date.now() - startTime;

      // Add AI response
      await storage.addChatMessage({ role: "assistant", content: response });

      // Track analytics
      await storage.addAnalyticsEntry({
        feature: "chat",
        requestCount: 1,
        responseTime,
      });

      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.delete("/api/chat/clear", async (req, res) => {
    try {
      await storage.clearChatHistory();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear chat history" });
    }
  });

  // Vision/Image Analysis
  app.post("/api/vision/analyze", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const startTime = Date.now();
      
      // Convert buffer to base64 for Gemini API
      const base64Image = req.file.buffer.toString('base64');
      const analysis = await analyzeImage(base64Image, req.file.mimetype);
      
      const responseTime = Date.now() - startTime;

      // Track analytics
      await storage.addAnalyticsEntry({
        feature: "vision",
        requestCount: 1,
        responseTime,
      });

      res.json({ analysis });
    } catch (error) {
      console.error("Vision analysis error:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  // Content Generation
  app.post("/api/content/generate", async (req, res) => {
    try {
      const { topic, tone, length, type, instructions } = req.body;
      
      if (!topic || !type) {
        return res.status(400).json({ message: "Topic and type are required" });
      }

      const startTime = Date.now();
      
      const content = await generateContent({
        topic,
        tone: tone || "professional",
        length: length || "medium",
        type,
        instructions: instructions || "",
      });
      
      const responseTime = Date.now() - startTime;

      // Track analytics
      await storage.addAnalyticsEntry({
        feature: "content",
        requestCount: 1,
        responseTime,
      });

      res.json({ content });
    } catch (error) {
      console.error("Content generation error:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Analytics
  app.get("/api/analytics/summary", async (req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });

  app.get("/api/analytics/data", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
