import { useLocation, useRouter } from 'wouter'; // Alterado de react-router-dom para wouter
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Download, Share, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function FinalScriptPage() {
  const [location] = useLocation(); // useLocation de wouter retorna um array
  const router = useRouter();
  const { toast } = useToast();

  // Acessar o state passado pela navegação
  // Em wouter, o state não é diretamente acessível via location.state como no react-router-dom v6
  // Para passar dados complexos, geralmente se usa query params ou um contexto global/store
  // Por simplicidade, e dado que o script pode ser longo, vamos assumir que o wizard
  // poderia salvar o script temporariamente (ex: localStorage ou Zustand/Context) e a página final o leria de lá.
  // Ou, se o estado FOI passado via router.push(path, state), ele pode estar em router.location.state
  // No entanto, a navegação foi feita com navigate(path, { state: ... }) que é padrão react-router-dom.
  // Para wouter, a forma de passar estado é diferente. Vamos tentar ler de `history.state` que é onde wouter pode colocar.
  const pageState = (window.history.state as any)?.state || {};

  const {
    script = 'Nenhum roteiro para exibir.',
    title = 'Roteiro Indisponível',
    type = '',
    duration = 0,
  } = pageState;

  const handleGoBack = () => {
    router.hook((_, path) => path)('/'); // Navega para a home, ou pode ser -1 se o histórico permitir
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(script);
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

  const handleDownloadScript = () => {
    const element = document.createElement('a');
    const file = new Blob([script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}_roteiro.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: 'Download iniciado',
      description: 'Seu roteiro está sendo baixado',
    });
  };

  const handleShareScript = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Roteiro: ${title}`,
          text: script,
        });
      } catch (error) {
        // Fallback to copy
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={handleGoBack} // Alterado para handleGoBack
          className="mb-6 dark:text-white dark:border-slate-600 hover:dark:bg-slate-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o Início
        </Button>

        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
              <span>Tipo: {getTypeDisplayName(type)}</span>
              {duration && <span>Duração Estimada: {duration} segundos</span>}
            </div>

            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert mb-8">
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {script}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-4 sm:mb-0">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Roteiro gerado com sucesso
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={handleCopyScript} className="dark:text-white dark:border-slate-600 hover:dark:bg-slate-700">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                  <Button variant="outline" onClick={handleDownloadScript} className="dark:text-white dark:border-slate-600 hover:dark:bg-slate-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={handleShareScript} className="bg-primary hover:bg-primary/90">
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}