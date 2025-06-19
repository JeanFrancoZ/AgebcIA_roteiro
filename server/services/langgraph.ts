import { analyzeScriptIdea, generateQuestions, generateScriptStructure, generateFinalScript, ScriptAnalysis, AIQuestion, ScriptStructure } from './openai.js';

export interface AgentState {
  idea: string;
  scriptType: string;
  analysis?: ScriptAnalysis;
  questions?: AIQuestion[];
  answers?: Record<string, string>;
  structure?: ScriptStructure;
  finalScript?: string;
  currentStep: 'input' | 'analysis' | 'questions' | 'structure' | 'generation' | 'completed';
  error?: string;
  thoughts?: string[];
}

export class ScriptingAgent {
  private state: AgentState;

  constructor(idea: string, scriptType: string) {
    this.state = {
      idea,
      scriptType,
      currentStep: 'input',
      thoughts: []
    };
  }

  async processIdea(): Promise<AgentState> {
    try {
      this.state.thoughts?.push('Analisando a ideia inicial do roteiro...');
      this.state.currentStep = 'analysis';
      this.state.analysis = await analyzeScriptIdea(this.state.idea, this.state.scriptType);
      
      this.state.thoughts?.push('Gerando perguntas para refinar a ideia...');
      this.state.currentStep = 'questions';  
      this.state.questions = await generateQuestions(
        this.state.idea, 
        this.state.scriptType, 
        this.state.analysis
      );
      
      return this.state;
    } catch (error) {
      this.state.error = (error as Error).message;
      return this.state;
    }
  }

  async processAnswers(answers: Record<string, string>): Promise<AgentState> {
    try {
      this.state.answers = answers;
      this.state.thoughts?.push('Processando as respostas para gerar a estrutura do roteiro...');
      this.state.currentStep = 'structure';
      
      this.state.structure = await generateScriptStructure(
        this.state.idea,
        this.state.scriptType,
        answers
      );
      
      return this.state;
    } catch (error) {
      this.state.error = (error as Error).message;
      return this.state;
    }
  }

  async generateScript(): Promise<AgentState> {
    try {
      if (!this.state.structure || !this.state.answers) {
        throw new Error('Estrutura ou respostas não disponíveis');
      }
      
      this.state.thoughts?.push('Gerando o roteiro final com base na estrutura e respostas...');
      this.state.currentStep = 'generation';
      
      this.state.finalScript = await generateFinalScript(
        this.state.idea,
        this.state.scriptType,
        this.state.structure,
        this.state.answers
      );
      
      this.state.currentStep = 'completed';
      return this.state;
    } catch (error) {
      this.state.error = (error as Error).message;
      return this.state;
    }
  }

  getState(): AgentState {
    return this.state;
  }

  async regenerateStructure(): Promise<AgentState> {
    if (!this.state.answers) {
      throw new Error('Respostas não disponíveis para regenerar estrutura');
    }
    
    try {
      this.state.thoughts?.push('Regenerando a estrutura do roteiro com base nas respostas...');
      this.state.structure = await generateScriptStructure(
        this.state.idea,
        this.state.scriptType,
        this.state.answers
      );
      return this.state;
    } catch (error) {
      this.state.error = (error as Error).message;
      return this.state;
    }
  }
}
