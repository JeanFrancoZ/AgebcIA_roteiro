import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScriptTypeSelector } from "./script-type-selector";
import { IdeaInput } from "./idea-input";
import { AIAnalysisComponent } from "./ai-analysis";
import { ScriptStructureComponent } from "./script-structure";
import { FinalScriptModal } from "./final-script-modal";
import { AgentState, Script } from "../types/script";
import { ChevronLeft, ChevronRight, Sparkles, FileText } from "lucide-react";

interface ScriptWizardProps {
  onScriptCreated?: (script: Script) => void;
}

export function ScriptWizard({ onScriptCreated }: ScriptWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const [scriptTitle, setScriptTitle] = useState("");
  const [currentScript, setCurrentScript] = useState<Script | null>(null);
  const [agentState, setAgentState] = useState<AgentState | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFinalScript, setShowFinalScript] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createScriptMutation = useMutation({
    mutationFn: (data: { title: string; type: string; idea: string }) => api.createScript(data),
    onSuccess: (script) => {
      setCurrentScript(script);
      onScriptCreated?.(script);
      queryClient.invalidateQueries({ queryKey: ["/api/scripts"] });
    },
    onError: () => {
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
      setAgentState(state);
      setCurrentStep(3);
    },
    onError: () => {
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
      setAgentState(state);
      setCurrentStep(4);
    },
    onError: () => {
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
      setShowFinalScript(true);
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
    { number: 1, name: "Tipo", active: currentStep >= 1 },
    { number: 2, name: "Ideia", active: currentStep >= 2 },
    { number: 3, name: "Estrutura", active: currentStep >= 3 },
    { number: 4, name: "Roteiro", active: currentStep >= 4 },
  ];

  const canProceedFromStep1 = selectedType !== null;
  const canProceedFromStep2 = idea.length >= 50 && scriptTitle.trim().length > 0;

  const handleNextStep1 = () => {
    if (canProceedFromStep1) {
      setCurrentStep(2);
    }
  };

  const handleNextStep2 = () => {
    if (canProceedFromStep2) {
      const title = scriptTitle || `Roteiro ${selectedType}`;
      createScriptMutation.mutate({
        title,
        type: selectedType!,
        idea,
      });
    }
  };

  const handleAnalyzeIdea = () => {
    if (currentScript) {
      analyzeScriptMutation.mutate(currentScript.id);
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

  const handleGenerateScript = () => {
    if (currentScript) {
      generateScriptMutation.mutate(currentScript.id);
    }
  };

  const handleRegenerateStructure = () => {
    if (currentScript) {
      regenerateStructureMutation.mutate(currentScript.id);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const isLoading = createScriptMutation.isPending || 
                   analyzeScriptMutation.isPending || 
                   submitAnswersMutation.isPending || 
                   generateScriptMutation.isPending ||
                   regenerateStructureMutation.isPending;

  return (
    <>
      <Card className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Progress Indicator */}
        <div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Criar Novo Roteiro</h2>
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  {index > 0 && <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-600"></div>}
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.active 
                        ? "bg-primary text-white" 
                        : "bg-slate-200 dark:bg-slate-600 text-slate-400"
                    }`}>
                      {step.number}
                    </div>
                    <span className={`text-sm ${
                      step.active 
                        ? "text-slate-900 dark:text-white" 
                        : "text-slate-400"
                    }`}>
                      {step.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Script Type Selection */}
          {currentStep === 1 && (
            <div>
              <ScriptTypeSelector
                selectedType={selectedType}
                onSelect={setSelectedType}
              />
              <div className="flex justify-end mt-8">
                <Button 
                  onClick={handleNextStep1}
                  disabled={!canProceedFromStep1}
                >
                  Continuar
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Idea Input */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Descreva Sua Ideia
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Conte-nos sobre o roteiro que você quer criar
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Título do roteiro
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-slate-700 dark:text-white"
                  placeholder="Ex: A História do Empreendedor"
                  value={scriptTitle}
                  onChange={(e) => setScriptTitle(e.target.value)}
                />
              </div>

              <IdeaInput idea={idea} onIdeaChange={setIdea} />

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleNextStep2}
                  disabled={!canProceedFromStep2 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      Analisar Ideia
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: AI Analysis & Questions */}
          {currentStep === 3 && agentState?.analysis && agentState?.questions && (
            <div>
              <AIAnalysisComponent
                analysis={agentState.analysis}
                questions={agentState.questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
              />

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button 
                  onClick={handleSubmitAnswers}
                  disabled={Object.keys(answers).length === 0 || isLoading}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      Gerar Estrutura
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Generated Script Structure */}
          {currentStep === 4 && agentState?.structure && (
            <div>
              <ScriptStructureComponent
                structure={agentState.structure}
                onApproveSection={(index) => {
                  toast({
                    title: "Seção aprovada",
                    description: `Seção ${index + 1} foi aprovada com sucesso`,
                  });
                }}
                onEditSection={(index) => {
                  toast({
                    title: "Edição",
                    description: `Editando seção ${index + 1}`,
                  });
                }}
                onRegenerateStructure={handleRegenerateStructure}
              />

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                      Pronto para gerar o roteiro completo?
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      A IA criará o roteiro final baseado na estrutura aprovada
                    </p>
                  </div>
                  <Button 
                    onClick={handleGenerateScript}
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Gerando...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Gerar Roteiro Completo
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Final Script Modal */}
      {agentState?.finalScript && (
        <FinalScriptModal
          isOpen={showFinalScript}
          onClose={() => setShowFinalScript(false)}
          script={agentState.finalScript}
          title={currentScript?.title || "Roteiro"}
          type={currentScript?.type || ""}
          duration={agentState.structure?.totalDuration}
        />
      )}
    </>
  );
}
