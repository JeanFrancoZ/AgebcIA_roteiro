import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Script } from "../types/script";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentProjectsProps {
  onOpenScript: (script: Script) => void;
}

export function RecentProjects({ onOpenScript }: RecentProjectsProps) {
  const { data: scripts, isLoading } = useQuery({
    queryKey: ["/api/scripts"],
    queryFn: () => api.getScripts(),
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      tiktok: { icon: "fab fa-tiktok", gradient: "from-pink-500 to-purple-600" },
      youtube: { icon: "fab fa-youtube", gradient: "from-red-500 to-red-600" },
      marketing: { icon: "fas fa-bullhorn", gradient: "from-blue-500 to-indigo-600" },
      shortfilm: { icon: "fas fa-film", gradient: "from-purple-500 to-indigo-600" }
    };
    return icons[type] || { icon: "fas fa-file-alt", gradient: "from-slate-500 to-slate-600" };
  };

  const getTypeName = (type: string) => {
    const names = {
      tiktok: "TikTok",
      youtube: "YouTube", 
      marketing: "Marketing",
      shortfilm: "Curta-metragem"
    };
    return names[type] || type;
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Projetos Recentes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const recentScripts = scripts?.slice(0, 6) || [];

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Projetos Recentes</h2>
        {scripts && scripts.length > 6 && (
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            Ver todos
            <i className="fas fa-arrow-right ml-1"></i>
          </Button>
        )}
      </div>
      
      {recentScripts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <i className="fas fa-file-alt text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Nenhum projeto ainda
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Crie seu primeiro roteiro para começar!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentScripts.map((script) => {
            const typeInfo = getTypeIcon(script.type);
            const timeAgo = formatDistanceToNow(new Date(script.createdAt), { 
              addSuffix: true, 
              locale: ptBR 
            });
            
            return (
              <Card key={script.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4" onClick={() => onOpenScript(script)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 bg-gradient-to-br ${typeInfo.gradient} rounded-lg flex items-center justify-center`}>
                        <i className={`${typeInfo.icon} text-white text-sm`}></i>
                      </div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {getTypeName(script.type)}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {timeAgo}
                    </span>
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2 line-clamp-1">
                    {script.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {script.idea}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {script.duration ? `${script.duration} segundos` : 'Em progresso'}
                    </span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Abrir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
