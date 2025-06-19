import { useState } from "react";
import { Header } from "../components/header";
import { ScriptWizard } from "../components/script-wizard";
import { RecentProjects } from "../components/recent-projects";
import { Script } from "../types/script";

export default function Home() {
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);

  const handleOpenScript = (script: Script) => {
    // For now, just show a toast or console log
    console.log("Opening script:", script);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScriptWizard />
        <RecentProjects onOpenScript={handleOpenScript} />
      </main>
    </div>
  );
}
