import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ScriptTypeSelector } from "./script-type-selector";
import { IdeaInput } from "./idea-input";
import { AIAnalysisComponent } from "./ai-analysis";
import { ScriptStructureComponent } from "./script-structure";
import { AgentThought } from "./agent-thought";

import { AgentState, Script } from "../types/script";
import { ChevronLeft, ChevronRight, Sparkles, FileText } from "lucide-react";

interface ScriptWizardProps {
  onScriptCreated?: (script: Script) => void;
}

export function ScriptWizard({ onScriptCreated }: ScriptWizardProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [currentScript, setCurrentScript] = useState<Script | null>(null);
  const [agentState, setAgentState] = useState<AgentState | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [agentThoughts, setAgentThoughts] = useState<{ step: string; thought: string }[]>([]);
  const [approvedSections, setApprovedSections] = useState<boolean[]>([]);
  const [, setLocation] = useLocation();
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createScriptMutation = useMutation({
    mutationFn: (data: { title: string; type: string; idea: string }) => api.createScript(data),
    onSuccess: (script) => {
      console.log('Script created:', script);
      setCurrentScript(script);
      onScriptCreated?.(script);
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
      // Call analyzeScriptMutation after script creation
      if (script && script.id) {
        console.log('Starting analysis for script:', script.id);
        analyzeScriptMutation.mutate(script.id);
      } else {
        toast({
          title: "Erro",
          description: "ID do roteiro inválido após a criação.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Create script error:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar roteiro",
        variant: "destructive",
      });
    },
  });

  const analyzeScriptMutation = useMutation({
    mutationFn: (scriptId: number) => api.analyzeScript(scriptId),
    onSuccess: (state) => {
      console.log('Analyze script response:', state);
      setAgentState(state);
      setAgentThoughts(state.thoughts || []);
    },
    onError: (error) => {
      console.error('Analyze script error:', error);
      toast({
        title: "Erro",
        description: "Falha na análise da IA",
        variant: "destructive",
      });
    },
  });

  const submitAnswersMutation = useMutation({
    mutationFn: ({ scriptId, answers }: { scriptId: number; answers: Record<string, string> }) => 
      api.submitAnswers(scriptId, answers),
    onSuccess: (state) => {
      console.log('Submit answers response:', state);
      setAgentState(state);
      setAgentThoughts(state.thoughts || []);
      if (state.structure) {
        console.log('Structure found, setting approved sections:', state.structure.sections.length);
        setApprovedSections(new Array(state.structure.sections.length).fill(false));
      }
    },
    onError: (error) => {
      console.error('Submit answers error:', error);
      toast({
        title: "Erro",
        description: "Falha ao processar respostas",
        variant: "destructive",
      });
    },
  });

  const generateScriptMutation = useMutation({
    mutationFn: (scriptId: number) => api.generateScript(scriptId),
    onSuccess: (state) => {
      setAgentState(state);
      setAgentThoughts(state.thoughts || []);
      if (currentScript) {
        setLocation(`/script/${currentScript.id}`);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
    },
    onError: () => {
      toast({
        title: "Erro", 
        description: "Falha ao gerar roteiro",
        variant: "destructive",
      });
    },
  });

  const regenerateStructureMutation = useMutation({
    mutationFn: (scriptId: number) => api.regenerateStructure(scriptId),
    onSuccess: (state) => {
      setAgentState(state);
      setAgentThoughts(state.thoughts || []);
      if (state.structure) {
        setApprovedSections(new Array(state.structure.sections.length).fill(false));
      }
      toast({
        title: "Sucesso",
        description: "Nova estrutura gerada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao regenerar estrutura",
        variant: "destructive",
      });
    },
  });

  const steps = [
    { name: "Tipo", active: true },
    { name: "Ideia", active: selectedType !== null },
    { name: "Estrutura", active: agentState?.currentStep === 'structure' || agentState?.currentStep === 'generation' || agentState?.currentStep === 'completed' },
  ];

  const canProceedFromStep1 = selectedType !== null;
  const canProceedFromStep2 = idea.length >= 50 && scriptTitle.trim().length > 0;

  const handleStart = () => {
    if (canProceedFromStep1 && canProceedFromStep2) {
      const title = scriptTitle || `Roteiro ${selectedType}`;
      createScriptMutation.mutate({
        title,
        type: selectedType!,
        idea,
      });
    }
  };

  const handleSubmitAnswers = () => {
    if (currentScript && Object.keys(answers).length > 0) {
      submitAnswersMutation.mutate({
        scriptId: currentScript.id,
        answers,
      });
    }
  };

  const handleToggleApproveSection = (sectionIndex: number, isApproved: boolean) => {
    const newApprovedSections = [...approvedSections];
    newApprovedSections[sectionIndex] = isApproved;
    setApprovedSections(newApprovedSections);
  };

  const handleGenerateScript = () => {
    if (currentScript) {
      generateScriptMutation.mutate(currentScript.id);
    }
  };

  const handleEditSection = (sectionIndex: number, newContent: string) => {
    if (agentState && agentState.structure) {
      const newSections = [...agentState.structure.sections];
      newSections[sectionIndex] = { ...newSections[sectionIndex], content: newContent };
      const newStructure = { ...agentState.structure, sections: newSections };
      setAgentState({ ...agentState, structure: newStructure });
    }
  };

  const handleRegenerateStructure = () => {
    if (currentScript) {
      regenerateStructureMutation.mutate(currentScript.id);
    }
  };

  const renderCurrentStep = () => {
    if (agentState) {
      console.log('RenderCurrentStep - AgentState:', agentState);
      console.log('RenderCurrentStep - Current Step:', agentState.currentStep);
      console.log('RenderCurrentStep - Has questions:', !!agentState.questions?.length);
      console.log('RenderCurrentStep - Has structure:', !!agentState.structure);
      
      switch (agentState.currentStep) {
        case 'input':
          return (
            <div className="text-center py-8">
              <p className="text-lg">Processando sua ideia...</p>
            </div>
          );
        case 'structure':
          if (agentState.questions && agentState.questions.length > 0 && !agentState.structure) {
            console.log('RenderCurrentStep - Showing questions form');
            return (
              <div className="space-y-6">
                <AIAnalysisComponent
                  analysis={agentState.analysis!}
                  questions={agentState.questions}
                  answers={answers}
                  onAnswerChange={(questionId: string, answer: string) => {
                    setAnswers(prev => ({ ...prev, [questionId]: answer }));
                  }}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitAnswers}
                    disabled={Object.keys(answers).length === 0 || submitAnswersMutation.isPending}
                  >
                    {submitAnswersMutation.isPending ? 'Processando...' : 'Enviar Respostas'}
                  </Button>
                </div>
              </div>
            );
          } else if (agentState.structure) {
            console.log('RenderCurrentStep - Showing structure component');
            return (
              <ScriptStructureComponent
                structure={agentState.structure}
                approvedSections={approvedSections}
                onToggleApproveSection={handleToggleApproveSection}
                onEditSection={handleEditSection}
                onRegenerateStructure={handleRegenerateStructure}
              />
            );
          }
          return (
            <div className="text-center py-8">
              <p className="text-lg">Analisando sua ideia...</p>
            </div>
          );
        case 'generation':
          return (
            <div className="text-center py-8">
              <p className="text-lg">Gerando seu roteiro...</p>
            </div>
          );
        case 'completed':
          return (
            <div className="text-center py-8">
              <p className="text-lg">Roteiro concluído!</p>
            </div>
          );
        default:
          console.error('Estado desconhecido:', agentState.currentStep);
          return (
            <div className="text-center py-8">
              <p className="text-lg text-red-600">Estado desconhecido: {agentState.currentStep}</p>
              <p className="text-sm text-gray-500 mt-2">Verifique o console para mais detalhes</p>
            </div>
          );
      }
    }

    return (        <>
          <ScriptTypeSelector selectedType={selectedType} onSelect={setSelectedType} />
          {selectedType && (
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="title">Título do Roteiro</Label>
                <input
                  id="title"
                  type="text"
                  value={scriptTitle}
                  onChange={(e) => setScriptTitle(e.target.value)}
                  placeholder={`Roteiro ${selectedType}`}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <IdeaInput idea={idea} onIdeaChange={setIdea} />
            </div>
          )}
        </>
    );
  };

  const showNavigation = !agentState || agentState.currentStep === 'input' || (agentState.currentStep === 'structure' && agentState.structure);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Assistente de Roteiro - Card mais compacto e horizontal */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Assistente de Roteiro</h2>
              <p className="text-sm text-muted-foreground">Siga as etapas para criar seu roteiro.</p>
            </div>
            <div className="flex gap-4">
              {steps.map((step, index) => (
                <div key={index} className={`flex items-center ${step.active ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${step.active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {index + 1}
                  </div>
                  <span className="text-sm">{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Área de Conteúdo Principal */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Escolha o Tipo de Roteiro
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Selecione o formato que melhor se adapta ao seu projeto
            </p>
          </div>
          {renderCurrentStep()}
          {showNavigation && !agentState && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleStart} 
                disabled={!canProceedFromStep1 || !canProceedFromStep2 || createScriptMutation.isPending}
                className="w-full sm:w-auto"
              >
                {createScriptMutation.isPending ? 'Analisando...' : 'Analisar Ideia'}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>

        {/* Botão de Gerar Roteiro Final */}
        {agentState?.currentStep === 'structure' && agentState.structure && (
          <Card className="p-4">
            <Button 
              onClick={handleGenerateScript} 
              disabled={!approvedSections.every(Boolean) || generateScriptMutation.isPending}
              className="w-full"
            >
              {generateScriptMutation.isPending ? 'Gerando...' : 'Gerar Roteiro Final'}
              <FileText className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        )}

        {/* Pensamentos do Agente */}
        {agentThoughts.length > 0 && (
          <Card className="p-4">
            <AgentThought thoughts={agentThoughts.map(t => t.thought)} />
          </Card>
        )}
      </div>
    </div>
  );
}
