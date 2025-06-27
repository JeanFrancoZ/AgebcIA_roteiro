import { analyzeScriptIdea, generateQuestions, generateScriptStructure, generateFinalScript, ScriptAnalysis, AIQuestion, ScriptStructure } from './openai.js';

export interface AgentState {
  idea: string;
  scriptType: string;
  analysis?: ScriptAnalysis;
  questions?: AIQuestion[];
  answers?: Record<string, string>;
  structure?: ScriptStructure;
  finalScript?: string;
  currentStep: 'input' | 'structure' | 'generation' | 'completed';
  error?: string;
  thoughts?: { step: string; thought: string }[];
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
      console.log('ProcessIdea - Starting analysis for:', this.state.idea, this.state.scriptType);
      this.state.thoughts?.push({ step: 'analysis', thought: 'Hmm, que ideia interessante! Deixa eu analisar isso mais a fundo...' });
      
      console.log('ProcessIdea - Calling analyzeScriptIdea...');
      this.state.analysis = await analyzeScriptIdea(this.state.idea, this.state.scriptType);
      console.log('ProcessIdea - Analysis completed:', this.state.analysis);
      
      this.state.thoughts?.push({ step: 'questions', thought: 'Tenho algumas perguntas para entender melhor o que você precisa. Lá vai!' });
      this.state.currentStep = 'structure';  
      
      console.log('ProcessIdea - Calling generateQuestions...');
      this.state.questions = await generateQuestions(
        this.state.idea, 
        this.state.scriptType, 
        this.state.analysis
      );
      console.log('ProcessIdea - Questions generated:', this.state.questions);
      
      console.log('ProcessIdea - Final state:', this.state);
      return this.state;
    } catch (error) {
      console.error('ProcessIdea - Error:', error);
      this.state.error = (error as Error).message;
      return this.state;
    }
  }

  async processAnswers(answers: Record<string, string>): Promise<AgentState> {
    try {
      console.log('ProcessAnswers - Starting with answers:', answers);
      this.state.answers = answers;
      this.state.thoughts?.push({ step: 'structure', thought: 'Boas respostas! Agora vou começar a montar o esqueleto do seu roteiro.' });
      this.state.currentStep = 'structure';
      
      console.log('ProcessAnswers - Calling generateScriptStructure...');
      this.state.structure = await generateScriptStructure(
        this.state.idea,
        this.state.scriptType,
        answers
      );
      console.log('ProcessAnswers - Structure generated:', this.state.structure);
      
      console.log('ProcessAnswers - Final state:', this.state);
      return this.state;
    } catch (error) {
      console.error('ProcessAnswers - Error:', error);
      this.state.error = (error as Error).message;
      return this.state;
    }
  }

  async generateScript(): Promise<AgentState> {
    try {
      if (!this.state.structure || !this.state.answers) {
        throw new Error('Estrutura ou respostas não disponíveis');
      }
      
      this.state.thoughts?.push({ step: 'generation', thought: 'Tudo pronto! Mãos à obra para escrever o roteiro final.' });
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
      this.state.thoughts?.push({ step: 'structure', thought: 'Ok, vamos repensar essa estrutura. Criando uma nova versão.' });
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
