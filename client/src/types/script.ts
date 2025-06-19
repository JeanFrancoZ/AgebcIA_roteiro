export interface ScriptType {
  id: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
  gradient: string;
  features: string[];
}

export interface AIAnalysis {
  conflicts: string[];
  strengths: string[];
  weakPoints: string[];
  suggestedStructure: string;
  tone: string;
  targetAudience: string;
}

export interface AIQuestion {
  id: string;
  question: string;
  context: string;
  placeholder: string;
}

export interface ScriptSection {
  name: string;
  description: string;
  duration: number;
  content: string;
  tips: string[];
}

export interface ScriptStructure {
  sections: ScriptSection[];
  totalDuration: number;
  format: string;
}

export interface Script {
  id: number;
  userId: number;
  title: string;
  type: string;
  idea: string;
  structure?: ScriptStructure;
  finalScript?: string;
  status: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentState {
  idea: string;
  scriptType: string;
  analysis?: AIAnalysis;
  questions?: AIQuestion[];
  answers?: Record<string, string>;
  structure?: ScriptStructure;
  finalScript?: string;
  currentStep: 'input' | 'analysis' | 'questions' | 'structure' | 'generation' | 'completed';
  error?: string;
}
