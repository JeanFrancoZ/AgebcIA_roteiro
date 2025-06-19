import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { ScriptingAgent } from "./services/langgraph.js";
import { insertScriptSchema, updateScriptSchema } from "@shared/schema";
import { z } from "zod";

const agents = new Map<string, ScriptingAgent>();

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get recent scripts for a user
  app.get("/api/scripts", async (req, res) => {
    try {
      // Using demo user for now
      const scripts = await storage.getScriptsByUser(1);
      res.json(scripts);
    } catch (error) {
      res.status(500).json({ error: "Falha ao buscar roteiros" });
    }
  });

  // Create new script
  app.post("/api/scripts", async (req, res) => {
    try {
      const validatedData = insertScriptSchema.parse(req.body);
      const script = await storage.createScript({
        ...validatedData,
        userId: 1 // Demo user
      });
      res.json(script);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Dados inválidos", details: error.errors });
      } else {
        res.status(500).json({ error: "Falha ao criar roteiro" });
      }
    }
  });

  // Get specific script
  app.get("/api/scripts/:id", async (req, res) => {
    try {
      const scriptId = parseInt(req.params.id);
      const script = await storage.getScript(scriptId);
      
      if (!script) {
        res.status(404).json({ error: "Roteiro não encontrado" });
        return;
      }
      
      res.json(script);
    } catch (error) {
      res.status(500).json({ error: "Falha ao buscar roteiro" });
    }
  });

  // Update script
  app.patch("/api/scripts/:id", async (req, res) => {
    try {
      const scriptId = parseInt(req.params.id);
      const validatedData = updateScriptSchema.parse(req.body);
      
      const updatedScript = await storage.updateScript(scriptId, validatedData);
      
      if (!updatedScript) {
        res.status(404).json({ error: "Roteiro não encontrado" });
        return;
      }
      
      res.json(updatedScript);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Dados inválidos", details: error.errors });
      } else {
        res.status(500).json({ error: "Falha ao atualizar roteiro" });
      }
    }
  });

  // Start AI analysis for a script
  app.post("/api/scripts/:id/analyze", async (req, res) => {
    try {
      const scriptId = parseInt(req.params.id);
      const script = await storage.getScript(scriptId);
      
      if (!script) {
        res.status(404).json({ error: "Roteiro não encontrado" });
        return;
      }

      const agent = new ScriptingAgent(script.idea, script.type);
      const sessionKey = `script_${scriptId}`;
      agents.set(sessionKey, agent);

      const result = await agent.processIdea();
      
      // Save AI session
      await storage.createAiSession({
        scriptId,
        step: 'analysis',
        input: { idea: script.idea, type: script.type },
        output: result
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Falha na análise da IA: " + error.message });
    }
  });

  // Submit answers to AI questions
  app.post("/api/scripts/:id/answers", async (req, res) => {
    try {
      const scriptId = parseInt(req.params.id);
      const { answers } = req.body;
      
      if (!answers || typeof answers !== 'object') {
        res.status(400).json({ error: "Respostas são obrigatórias" });
        return;
      }

      const sessionKey = `script_${scriptId}`;
      const agent = agents.get(sessionKey);
      
      if (!agent) {
        res.status(400).json({ error: "Sessão da IA não encontrada. Inicie a análise novamente." });
        return;
      }

      const result = await agent.processAnswers(answers);
      
      // Save AI session
      await storage.createAiSession({
        scriptId,
        step: 'questions',
        input: { answers },
        output: result
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Falha ao processar respostas: " + error.message });
    }
  });

  // Generate final script
  app.post("/api/scripts/:id/generate", async (req, res) => {
    try {
      const scriptId = parseInt(req.params.id);
      const sessionKey = `script_${scriptId}`;
      const agent = agents.get(sessionKey);
      
      if (!agent) {
        res.status(400).json({ error: "Sessão da IA não encontrada. Inicie o processo novamente." });
        return;
      }

      const result = await agent.generateScript();
      
      // Update script with final content
      if (result.finalScript && result.structure) {
        await storage.updateScript(scriptId, {
          structure: result.structure as any,
          finalScript: result.finalScript,
          status: 'completed',
          duration: result.structure.totalDuration
        });
      }
      
      // Save AI session
      await storage.createAiSession({
        scriptId,
        step: 'generation',
        input: {},
        output: result
      });

      // Clean up agent session
      agents.delete(sessionKey);

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Falha ao gerar roteiro: " + error.message });
    }
  });

  // Regenerate structure
  app.post("/api/scripts/:id/regenerate-structure", async (req, res) => {
    try {
      const scriptId = parseInt(req.params.id);
      const sessionKey = `script_${scriptId}`;
      const agent = agents.get(sessionKey);
      
      if (!agent) {
        res.status(400).json({ error: "Sessão da IA não encontrada. Inicie o processo novamente." });
        return;
      }

      const result = await agent.regenerateStructure();
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Falha ao regenerar estrutura: " + error.message });
    }
  });

  // Get AI session history for a script
  app.get("/api/scripts/:id/ai-sessions", async (req, res) => {
    try {
      const scriptId = parseInt(req.params.id);
      const sessions = await storage.getAiSessionsByScript(scriptId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Falha ao buscar sessões da IA" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "RoteirIA API funcionando" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
