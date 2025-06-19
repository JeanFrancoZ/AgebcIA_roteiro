import { apiRequest } from "./queryClient";
import type { Script, AgentState } from "../types/script";

export const api = {
  // Scripts
  async getScripts(): Promise<Script[]> {
    const response = await apiRequest("GET", "/api/scripts");
    return response.json();
  },

  async createScript(data: { title: string; type: string; idea: string }): Promise<Script> {
    const response = await apiRequest("POST", "/api/scripts", data);
    return response.json();
  },

  async getScript(id: number): Promise<Script> {
    const response = await apiRequest("GET", `/api/scripts/${id}`);
    return response.json();
  },

  async updateScript(id: number, data: Partial<Script>): Promise<Script> {
    const response = await apiRequest("PATCH", `/api/scripts/${id}`, data);
    return response.json();
  },

  // AI Operations
  async analyzeScript(scriptId: number): Promise<AgentState> {
    const response = await apiRequest("POST", `/api/scripts/${scriptId}/analyze`);
    return response.json();
  },

  async submitAnswers(scriptId: number, answers: Record<string, string>): Promise<AgentState> {
    const response = await apiRequest("POST", `/api/scripts/${scriptId}/answers`, { answers });
    return response.json();
  },

  async generateScript(scriptId: number): Promise<AgentState> {
    const response = await apiRequest("POST", `/api/scripts/${scriptId}/generate`);
    return response.json();
  },

  async regenerateStructure(scriptId: number): Promise<AgentState> {
    const response = await apiRequest("POST", `/api/scripts/${scriptId}/regenerate-structure`);
    return response.json();
  },

  // Health check
  async health(): Promise<{ status: string; message: string }> {
    const response = await apiRequest("GET", "/api/health");
    return response.json();
  }
};
