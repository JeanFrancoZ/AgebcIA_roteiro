import { ScriptType } from "../types/script";

interface ScriptTypeSelectorProps {
  selectedType: string | null;
  onSelect: (type: string) => void;
}

const scriptTypes: ScriptType[] = [
  {
    id: "tiktok",
    name: "TikTok/Reels",
    description: "Vídeos curtos e virais",
    duration: "30 segundos a 3 minutos",
    icon: "fab fa-tiktok",
    gradient: "from-pink-500 to-purple-600",
    features: ["Gancho inicial", "Call-to-action", "Ritmo acelerado"]
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Vlogs, tutoriais, ensaios",
    duration: "5-30 minutos",
    icon: "fab fa-youtube",
    gradient: "from-red-500 to-red-600",
    features: ["Introdução envolvente", "Desenvolvimento estruturado", "Conclusão marcante"]
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Anúncios e promocionais",
    duration: "30-120 segundos",
    icon: "fas fa-bullhorn",
    gradient: "from-blue-500 to-indigo-600",
    features: ["Estrutura AIDA", "Copy persuasivo", "CTA claro"]
  },
  {
    id: "shortfilm",
    name: "Curta-Metragem",
    description: "Narrativas cinematográficas",
    duration: "5-20 minutos",
    icon: "fas fa-film",
    gradient: "from-purple-500 to-indigo-600",
    features: ["Três atos", "Desenvolvimento de personagem", "Arco narrativo"]
  }
];

export function ScriptTypeSelector({ selectedType, onSelect }: ScriptTypeSelectorProps) {
  const selectedTypeData = scriptTypes.find(type => type.id === selectedType);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          Escolha o Tipo de Roteiro
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Selecione o formato que melhor se adapta ao seu projeto
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {scriptTypes.map((type) => (
          <div
            key={type.id}
            className={`group cursor-pointer border rounded-lg p-4 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 ${
              selectedType === type.id
                ? "border-primary bg-primary/10 dark:bg-primary/20"
                : "border-slate-200 dark:border-slate-700"
            }`}
            onClick={() => onSelect(type.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${type.gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <i className={`${type.icon} text-white text-xl`}></i>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{type.name}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{type.description}</p>
              <span className="text-xs text-slate-500 dark:text-slate-500">{type.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedTypeData && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-info text-white"></i>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                {selectedTypeData.name}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {selectedTypeData.description} - {selectedTypeData.duration}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedTypeData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-white dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded"
                  >
                    <i className="fas fa-check text-green-500 mr-1"></i>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
