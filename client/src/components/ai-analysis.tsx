import { useState } from "react";
import { AIAnalysis, AIQuestion } from "../types/script";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface AIAnalysisProps {
  analysis: AIAnalysis;
  questions: AIQuestion[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
}

export function AIAnalysisComponent({ analysis, questions, answers, onAnswerChange }: AIAnalysisProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Análise da IA & Refinamento
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Nossa IA analisou sua ideia e tem algumas perguntas para melhorar o roteiro
        </p>
      </div>

      {/* AI Analysis Results */}
      <div className="bg-gradient-to-r from-primary/10 to-blue-50 dark:from-primary/20 dark:to-blue-900/20 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-robot text-white"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Análise Inicial</h4>
            <div className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <div key={`strength-${index}`} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{strength}</span>
                </div>
              ))}
              {analysis.weakPoints.map((weak, index) => (
                <div key={`weak-${index}`} className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{weak}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Questions */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                  {question.question}
                </h4>
                {question.context && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {question.context}
                  </p>
                )}
                
                {question.id === "cta" ? (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => onAnswerChange(question.id, value)}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="like" id="like" />
                        <Label htmlFor="like" className="text-sm">Curtir e compartilhar</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="subscribe" id="subscribe" />
                        <Label htmlFor="subscribe" className="text-sm">Se inscrever no canal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="visit" id="visit" />
                        <Label htmlFor="visit" className="text-sm">Visitar site/produto</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="engage" id="engage" />
                        <Label htmlFor="engage" className="text-sm">Comentar e engajar</Label>
                      </div>
                    </div>
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={answers[question.id] || ""}
                    onChange={(e) => onAnswerChange(question.id, e.target.value)}
                    rows={3}
                    placeholder={question.placeholder}
                    className="resize-none"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
