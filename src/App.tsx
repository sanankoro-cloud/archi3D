import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PRDViewer } from './components/PRDViewer';
import { Studio2D } from './components/studio/Studio2D';
import { Studio3D } from './components/studio/Studio3D';
import { BOQCalculator } from './components/studio/BOQCalculator';
import { ScheduleManager } from './components/studio/ScheduleManager';
import { ARSimulator } from './components/studio/ARSimulator';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { Currency, ProjectData, ScheduleTask } from './types/architect';
import { BookOpen, Box, Sparkles, ShieldCheck, HeartHandshake, FileText } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'prd' | 'studio'>('prd');
  const [studioTab, setStudioTab] = useState<'2d' | '3d' | 'boq' | 'schedule' | 'ar'>('2d');
  const [currentProject, setCurrentProject] = useState<ProjectData>(SAMPLE_PROJECTS[0]);

  const handleUpdateProject = (updated: ProjectData) => {
    setCurrentProject(updated);
  };

  const handleCurrencyChange = (currency: Currency) => {
    setCurrentProject(prev => ({
      ...prev,
      currency,
    }));
  };

  const handleCityCostIndexChange = (cityCostIndexId: string) => {
    setCurrentProject(prev => ({
      ...prev,
      cityCostIndexId,
    }));
  };

  const handleUpdateTasks = (tasks: ScheduleTask[]) => {
    setCurrentProject(prev => ({
      ...prev,
      tasks,
    }));
  };

  const handleApplyAILayout = (newRooms: any[]) => {
    setCurrentProject(prev => ({
      ...prev,
      rooms: newRooms,
    }));
    setActiveView('studio');
    setStudioTab('2d');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Barre de Navigation */}
      <Navbar
        activeView={activeView}
        studioTab={studioTab}
        currentProject={currentProject}
        onSelectView={setActiveView}
        onSelectStudioTab={setStudioTab}
        onSelectProject={setCurrentProject}
        onSelectCurrency={handleCurrencyChange}
      />

      {/* Bannière de présentation pour l'entrepreneur */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white px-4 sm:px-6 lg:px-8 py-3 text-xs border-b border-indigo-950/60 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-indigo-200">
              CPO & Lead Architecte SaaS BTP/3D :
            </span>
            <span className="text-slate-300">
              PRD technique complet (Production-Ready) + Studio interactif de validation fonctionnelle.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span>Conçu pour : <strong>Particuliers novices & Artisans</strong></span>
            <span>•</span>
            <button
              onClick={() => setActiveView(activeView === 'prd' ? 'studio' : 'prd')}
              className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              {activeView === 'prd' ? 'Tester le Studio 2D/3D →' : 'Consulter le PRD Écrit →'}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'prd' ? (
          <PRDViewer />
        ) : (
          <div className="h-full">
            {studioTab === '2d' && (
              <Studio2D
                project={currentProject}
                onUpdateProject={handleUpdateProject}
                onSwitchTo3D={() => setStudioTab('3d')}
              />
            )}
            {studioTab === '3d' && (
              <Studio3D
                project={currentProject}
                onSwitchTo2D={() => setStudioTab('2d')}
              />
            )}
            {studioTab === 'boq' && (
              <BOQCalculator
                project={currentProject}
                onUpdateCurrency={handleCurrencyChange}
                onUpdateCityIndex={handleCityCostIndexChange}
              />
            )}
            {studioTab === 'schedule' && (
              <ScheduleManager
                project={currentProject}
                onUpdateTasks={handleUpdateTasks}
              />
            )}
            {studioTab === 'ar' && (
              <ARSimulator
                project={currentProject}
                onApplyAILayout={handleApplyAILayout}
              />
            )}
          </div>
        )}
      </main>

      {/* Pied de page Professionnel */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">ArchEase</span>
            <span>— Cahier des Charges Technique & Fonctionnel (PRD v1.0)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Stack : Next.js • Konva.js • Three.js • Prisma • RoomPlan LiDAR</span>
            <span>Multi-devises EUR / USD / XOF / CAD / GBP / MAD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
