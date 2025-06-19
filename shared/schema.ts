import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scripts = pgTable("scripts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'tiktok', 'youtube', 'marketing', 'shortfilm'
  idea: text("idea").notNull(),
  structure: jsonb("structure"), // AI-generated structure
  finalScript: text("final_script"), // Generated script content
  status: text("status").notNull().default("draft"), // 'draft', 'completed'
  duration: integer("duration"), // estimated duration in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiSessions = pgTable("ai_sessions", {
  id: serial("id").primaryKey(),
  scriptId: integer("script_id").references(() => scripts.id).notNull(),
  step: text("step").notNull(), // 'analysis', 'questions', 'structure', 'generation'
  input: jsonb("input").notNull(),
  output: jsonb("output").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertScriptSchema = createInsertSchema(scripts).pick({
  title: true,
  type: true,
  idea: true,
});

export const updateScriptSchema = createInsertSchema(scripts).pick({
  structure: true,
  finalScript: true,
  status: true,
  duration: true,
}).partial();

export const insertAiSessionSchema = createInsertSchema(aiSessions).pick({
  scriptId: true,
  step: true,
  input: true,
  output: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type UpdateScript = z.infer<typeof updateScriptSchema>;
export type Script = typeof scripts.$inferSelect;
export type InsertAiSession = z.infer<typeof insertAiSessionSchema>;
export type AiSession = typeof aiSessions.$inferSelect;
