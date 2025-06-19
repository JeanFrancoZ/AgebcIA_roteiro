import { Bot } from 'lucide-react';

interface AgentThoughtProps {
  thoughts: string[];
}

export function AgentThought({ thoughts }: AgentThoughtProps) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <Bot className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-2" />
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">Pensamentos da IA</h3>
      </div>
      <ul className="space-y-2">
        {thoughts.map((thought, index) => (
          <li key={index} className="text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up">
            {thought}
          </li>
        ))}
      </ul>
    </div>
  );
}