import { users, scripts, aiSessions, type User, type Script, type AiSession, type InsertUser, type InsertScript, type UpdateScript, type InsertAiSession } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Script operations
  getScript(id: number): Promise<Script | undefined>;
  getScriptsByUser(userId: number): Promise<Script[]>;
  createScript(script: InsertScript & { userId: number }): Promise<Script>;
  updateScript(id: number, updates: UpdateScript): Promise<Script | undefined>;
  deleteScript(id: number): Promise<boolean>;
  
  // AI session operations
  createAiSession(session: InsertAiSession): Promise<AiSession>;
  getAiSessionsByScript(scriptId: number): Promise<AiSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scripts: Map<number, Script>;
  private aiSessions: Map<number, AiSession>;
  private currentUserId: number;
  private currentScriptId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.scripts = new Map();
    this.aiSessions = new Map();
    this.currentUserId = 1;
    this.currentScriptId = 1;
    this.currentSessionId = 1;
    
    // Create default user for demo
    this.createUser({
      username: "usuario_demo",
      email: "demo@roteiria.com",
      password: "demo123"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getScript(id: number): Promise<Script | undefined> {
    return this.scripts.get(id);
  }

  async getScriptsByUser(userId: number): Promise<Script[]> {
    return Array.from(this.scripts.values())
      .filter(script => script.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createScript(scriptData: InsertScript & { userId: number }): Promise<Script> {
    const id = this.currentScriptId++;
    const script: Script = {
      ...scriptData,
      id,
      structure: null,
      finalScript: null,
      status: "draft",
      duration: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.scripts.set(id, script);
    return script;
  }

  async updateScript(id: number, updates: UpdateScript): Promise<Script | undefined> {
    const script = this.scripts.get(id);
    if (!script) return undefined;

    const updatedScript: Script = {
      ...script,
      ...updates,
      updatedAt: new Date()
    };
    
    this.scripts.set(id, updatedScript);
    return updatedScript;
  }

  async deleteScript(id: number): Promise<boolean> {
    return this.scripts.delete(id);
  }

  async createAiSession(sessionData: InsertAiSession): Promise<AiSession> {
    const id = this.currentSessionId++;
    const session: AiSession = {
      ...sessionData,
      id,
      timestamp: new Date()
    };
    this.aiSessions.set(id, session);
    return session;
  }

  async getAiSessionsByScript(scriptId: number): Promise<AiSession[]> {
    return Array.from(this.aiSessions.values())
      .filter(session => session.scriptId === scriptId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();
