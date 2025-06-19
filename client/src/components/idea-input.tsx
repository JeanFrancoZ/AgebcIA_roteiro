import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface IdeaInputProps {
  idea: string;
  onIdeaChange: (idea: string) => void;
}

const suggestions = [
  {
    title: "Conflito principal",
    description: "Qual é o maior obstáculo do protagonista?"
  },
  {
    title: "Objetivo claro",
    description: "O que o protagonista quer alcançar?"
  },
  {
    title: "Tom da narrativa",
    description: "Comédia, drama, suspense, ação?"
  },
  {
    title: "Público-alvo",
    description: "Para quem é direcionado este conteúdo?"
  }
];

export function IdeaInput({ idea, onIdeaChange }: IdeaInputProps) {
  const [charCount, setCharCount] = useState(idea.length);

  const handleIdeaChange = (value: string) => {
    setCharCount(value.length);
    onIdeaChange(value);
  };

  const handleSuggestionClick = (title: string) => {
    const currentValue = idea;
    const addition = currentValue && !currentValue.endsWith('\n\n') ? '\n\n' : '';
    const newValue = currentValue + addition + `${title}: `;
    handleIdeaChange(newValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="idea-input" className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
          Sua ideia principal
        </Label>
        <Textarea
          id="idea-input"
          value={idea}
          onChange={(e) => handleIdeaChange(e.target.value)}
          rows={6}
          className="resize-none"
          placeholder="Ex: Um jovem empreendedor descobre que sua startup revolucionária pode salvar pequenos negócios durante uma crise econômica..."
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-slate-500">Mínimo 50 caracteres</span>
          <span className="text-sm text-slate-400">{charCount}/500</span>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
        <h4 className="font-medium text-slate-900 dark:text-white mb-3">
          <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
          Sugestões para sua ideia
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-left p-3 h-auto justify-start hover:border-primary/50 hover:bg-primary/5"
              onClick={() => handleSuggestionClick(suggestion.title)}
            >
              <div>
                <div className="font-medium text-slate-900 dark:text-white mb-1">
                  {suggestion.title}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {suggestion.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
