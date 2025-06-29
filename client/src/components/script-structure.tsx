import { useState } from "react";
import { ScriptStructure } from "../types/script";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Check, RotateCcw } from "lucide-react";

interface ScriptStructureProps {
  structure: ScriptStructure;
  onToggleApproveSection: (sectionIndex: number, isApproved: boolean) => void;
  onEditSection: (sectionIndex: number, newContent: string) => void;
  onRegenerateStructure: () => void;
  approvedSections: boolean[];
}

const sectionGradients = [
  "from-pink-500 to-purple-600",
  "from-blue-500 to-indigo-600", 
  "from-green-500 to-emerald-600",
  "from-orange-500 to-red-600"
];

const sectionIcons = [
  "fas fa-hook",
  "fas fa-chart-line",
  "fas fa-bullhorn",
  "fas fa-star"
];

export function ScriptStructureComponent({ 
  structure, 
  onToggleApproveSection, 
  onEditSection, 
  onRegenerateStructure,
  approvedSections
}: ScriptStructureProps) {
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleEdit = (index: number, content: string) => {
    setEditingSection(index);
    setEditedContent(content);
  };

  const handleSave = (index: number) => {
    onEditSection(index, editedContent);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditedContent("");
  };
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Estrutura do Roteiro Gerada
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Revise e aprove cada seção do seu roteiro
        </p>
      </div>

      {/* Script Structure Timeline */}
      <div className="space-y-6">
        {structure.sections.map((section, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className={`bg-gradient-to-r ${sectionGradients[index % sectionGradients.length]} text-white px-6 py-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${sectionIcons[index % sectionIcons.length]} text-lg`}></i>
                  <div>
                    <h4 className="font-semibold">{section.name}</h4>
                    <p className="text-sm opacity-90">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-none"
                    onClick={() => handleEdit(index, section.content)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    className={approvedSections[index] ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
                    onClick={() => onToggleApproveSection(index, !approvedSections[index])}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {approvedSections[index] ? "Aprovado" : "Aprovar"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {editingSection === index ? (
                  <div>
                    <textarea
                      aria-label={`Editar conteúdo da seção: ${section.name}`}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={6}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button size="sm" variant="outline" onClick={handleCancel}>Cancelar</Button>
                      <Button size="sm" onClick={() => handleSave(index)}>Salvar</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">
                    {section.content}
                  </div>
                )}
                {section.tips.length > 0 && (
                  <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
                    <h5 className="font-medium text-slate-900 dark:text-white mb-2">Dicas de Produção:</h5>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="bg-slate-50 dark:bg-slate-700 rounded p-3 mt-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="h-4 w-4 inline mr-1" />
                    <strong>Duração estimada:</strong> {section.duration} segundos
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
              Estrutura Completa
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Duração total estimada: {structure.totalDuration} segundos
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onRegenerateStructure}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Gerar Nova Estrutura
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
