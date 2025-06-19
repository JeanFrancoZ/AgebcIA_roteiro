import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinalScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: string;
  title: string;
  type: string;
  duration?: number;
}

export function FinalScriptModal({ 
  isOpen, 
  onClose, 
  script, 
  title, 
  type, 
  duration 
}: FinalScriptModalProps) {
  const { toast } = useToast();
  const [isGenerating] = useState(false);

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(script);
      toast({
        title: "Copiado!",
        description: "Roteiro copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao copiar o roteiro",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = () => {
    // Create a simple text file download for now
    const element = document.createElement("a");
    const file = new Blob([script], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, "_")}_roteiro.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download iniciado",
      description: "Seu roteiro está sendo baixado",
    });
  };

  const handleShare = async () => {
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
    const names = {
      tiktok: "TikTok/Reels",
      youtube: "YouTube",
      marketing: "Marketing",
      shortfilm: "Curta-metragem"
    };
    return names[type] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Roteiro Finalizado</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-6">
              <p>ROTEIRO GERADO PELA IA - {getTypeDisplayName(type)}</p>
              <p>Título: "{title}"</p>
              {duration && <p>Duração Estimada: {duration} segundos</p>}
              <p>Formato: {type === 'tiktok' ? 'Vertical (9:16)' : 'Padrão'}</p>
            </div>
            
            <div className="space-y-6">
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {script}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
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
      </DialogContent>
    </Dialog>
  );
}
