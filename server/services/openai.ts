import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ScriptAnalysis {
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

export interface ScriptStructure {
  sections: {
    name: string;
    description: string;
    duration: number;
    content: string;
    tips: string[];
  }[];
  totalDuration: number;
  format: string;
}

export async function analyzeScriptIdea(
  idea: string, 
  scriptType: string
): Promise<ScriptAnalysis> {
  try {
    const prompt = `
Você é um consultor dramatúrgico especializado em roteiros para o mercado brasileiro. 
Analise a seguinte ideia de roteiro para ${getScriptTypeInPortuguese(scriptType)}:

IDEIA: "${idea}"

Forneça uma análise detalhada em português brasileiro com:
1. Conflitos identificados
2. Pontos fortes da narrativa
3. Pontos fracos ou áreas para melhorar
4. Estrutura narrativa sugerida
5. Tom da narrativa
6. Público-alvo brasileiro

Responda em JSON com este formato:
{
  "conflicts": ["conflito1", "conflito2"],
  "strengths": ["ponto forte1", "ponto forte2"],
  "weakPoints": ["ponto fraco1", "ponto fraco2"],
  "suggestedStructure": "estrutura sugerida",
  "tone": "tom identificado",
  "targetAudience": "público-alvo"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    throw new Error(`Falha ao analisar ideia: ${error.message}`);
  }
}

export async function generateQuestions(
  idea: string,
  scriptType: string,
  analysis: ScriptAnalysis
): Promise<AIQuestion[]> {
  try {
    const prompt = `
Baseado na análise da ideia de roteiro para ${getScriptTypeInPortuguese(scriptType)}, 
gere 3-5 perguntas específicas em português brasileiro para refinar o roteiro.

IDEIA: "${idea}"
ANÁLISE: ${JSON.stringify(analysis)}

As perguntas devem ser conversacionais e ajudar a:
- Esclarecer conflitos
- Desenvolver personagens
- Definir objetivos específicos
- Identificar o tom desejado
- Determinar call-to-action (para formatos digitais)

Responda em JSON com este formato:
{
  "questions": [
    {
      "id": "1",
      "question": "pergunta em português",
      "context": "contexto da pergunta",
      "placeholder": "exemplo de resposta"
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.questions || [];
  } catch (error) {
    throw new Error(`Falha ao gerar perguntas: ${error.message}`);
  }
}

export async function generateScriptStructure(
  idea: string,
  scriptType: string,
  answers: Record<string, string>
): Promise<ScriptStructure> {
  try {
    const structurePrompt = getStructurePrompt(scriptType);
    
    const prompt = `
Você é um roteirista experiente especializado em ${getScriptTypeInPortuguese(scriptType)} para o mercado brasileiro.

IDEIA ORIGINAL: "${idea}"
RESPOSTAS DO USUÁRIO: ${JSON.stringify(answers)}

Crie uma estrutura detalhada seguindo o padrão ${structurePrompt}.

Para cada seção, forneça:
- Nome da seção
- Descrição do que acontece
- Duração estimada em segundos
- Conteúdo específico (diálogos, ações)
- Dicas de produção

Responda em JSON com este formato:
{
  "sections": [
    {
      "name": "Nome da Seção",
      "description": "descrição",
      "duration": 10,
      "content": "conteúdo específico",
      "tips": ["dica1", "dica2"]
    }
  ],
  "totalDuration": 60,
  "format": "${scriptType}"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    throw new Error(`Falha ao gerar estrutura: ${error.message}`);
  }
}

export async function generateFinalScript(
  idea: string,
  scriptType: string,
  structure: ScriptStructure,
  answers: Record<string, string>
): Promise<string> {
  try {
    const formatGuide = getScriptFormatGuide(scriptType);
    
    const prompt = `
Você é um roteirista profissional especializado em conteúdo para o mercado brasileiro.

Crie o roteiro COMPLETO baseado em:
IDEIA: "${idea}"
TIPO: ${getScriptTypeInPortuguese(scriptType)}
ESTRUTURA: ${JSON.stringify(structure)}
RESPOSTAS: ${JSON.stringify(answers)}

FORMATO REQUIRED: ${formatGuide}

O roteiro deve:
- Estar em português brasileiro
- Seguir padrões profissionais de formatação
- Incluir diálogos naturais e brasileiros
- Ter indicações técnicas específicas
- Incluir notas de produção relevantes
- Ser otimizado para o formato ${scriptType}

Crie um roteiro completo e profissional, sem usar marcadores JSON - apenas o texto do roteiro formatado.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 2000,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    throw new Error(`Falha ao gerar roteiro final: ${error.message}`);
  }
}

function getScriptTypeInPortuguese(type: string): string {
  const types = {
    tiktok: "TikTok/Reels",
    youtube: "YouTube",
    marketing: "Marketing/Publicidade",
    shortfilm: "Curta-metragem"
  };
  return types[type] || type;
}

function getStructurePrompt(type: string): string {
  const structures = {
    tiktok: "Gancho (3-5s) → Desenvolvimento (40-50s) → Call-to-Action (5-7s)",
    youtube: "Introdução (10-15%) → Desenvolvimento (70-80%) → Conclusão (10-15%)",
    marketing: "Atenção → Interesse → Desejo → Ação (AIDA)",
    shortfilm: "Três Atos: Apresentação → Confrontação → Resolução"
  };
  return structures[type] || "estrutura narrativa clássica";
}

function getScriptFormatGuide(type: string): string {
  const formats = {
    tiktok: "Formato Master Scenes com indicações para vertical (9:16), transições rápidas, legendas",
    youtube: "Formato de roteiro para YouTube com marcações de tempo, B-roll, gráficos",
    marketing: "Formato publicitário com CTA claro, indicações visuais, copy persuasivo",
    shortfilm: "Formato cinematográfico padrão (Master Scenes ou Shot List)"
  };
  return formats[type] || "formato padrão de roteiro";
}
