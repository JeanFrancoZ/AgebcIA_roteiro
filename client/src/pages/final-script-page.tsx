import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { Script } from '../types/script';

export const FinalScriptPage: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { script, title, type, duration } = (location.state || {}) as { script: Script; title: string; type: string; duration: number };

  if (!script) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Roteiro Não Encontrado</h1>
        <p>Não foi possível carregar o roteiro final. Por favor, tente novamente.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Voltar para o Início
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Roteiro Final</h1>
      </div>

      <Card className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900 dark:text-white">{title || 'Roteiro Gerado'}</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">Tipo: {type || 'N/A'}</p>
          {duration && (
            <p className="text-sm text-slate-600 dark:text-slate-400">Duração Estimada: {duration} segundos</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none dark:prose-invert text-slate-800 dark:text-slate-200">
            <div dangerouslySetInnerHTML={{ __html: script.finalScript }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}