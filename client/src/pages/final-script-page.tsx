import { FC } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share, Clock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

const FinalScriptPage: FC = () => {
  const [, params] = useRoute('/script/:id');
  const scriptId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();

  const { data: scriptData, isLoading, error } = useQuery({
    queryKey: ['/api/scripts', scriptId],
    queryFn: () => (scriptId ? api.getScript(scriptId) : Promise.reject('No script ID')),
    enabled: !!scriptId,
  });

  const handleCopyScript = async () => {
    if (!scriptData?.finalScript) return;
    try {
      await navigator.clipboard.writeText(scriptData.finalScript);
      toast({
        title: 'Copiado!',
        description: 'Roteiro copiado para a área de transferência',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao copiar o roteiro',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPDF = () => {
    if (!scriptData?.finalScript) return;
    const element = document.createElement('a');
    const file = new Blob([scriptData.finalScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${scriptData.title.replace(/\s+/g, '_')}_roteiro.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: 'Download iniciado',
      description: 'Seu roteiro está sendo baixado',
    });
  };

  const handleShare = async () => {
    if (navigator.share && scriptData?.finalScript) {
      try {
        await navigator.share({
          title: `Roteiro: ${scriptData.title}`,
          text: scriptData.finalScript,
        });
      } catch (error) {
        handleCopyScript();
      }
    } else {
      handleCopyScript();
    }
  };

  const getTypeDisplayName = (type: string) => {
    const names: { [key: string]: string } = {
      tiktok: 'TikTok/Reels',
      youtube: 'YouTube',
      marketing: 'Marketing',
      shortfilm: 'Curta-metragem',
    };
    return names[type] || type;
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error || !scriptData) {
    return <div>Erro ao carregar o roteiro.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
        <div className="mb-4">
            <Link href="/">
                <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
            </Link>
        </div>
      <div className="overflow-y-auto">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-6">
            <p>ROTEIRO GERADO PELA IA - {getTypeDisplayName(scriptData.type)}</p>
            <p>Título: \"{scriptData.title}\"</p>
            {scriptData.structure?.totalDuration && <p>Duração Estimada: {scriptData.structure.totalDuration} segundos</p>}
            <p>Formato: {scriptData.type === 'tiktok' ? 'Vertical (9:16)' : 'Padrão'}</p>
          </div>

          <div className="space-y-6">
            <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {scriptData.finalScript}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 mt-6">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <Clock className="h-4 w-4 inline mr-1" />
          Roteiro gerado com sucesso
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleCopyScript}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalScriptPage;