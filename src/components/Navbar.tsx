import React from 'react';
import { Currency, ProjectData } from '../types/architect';
import { CURRENCIES } from '../data/currenciesAndCosts';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';
import { 
  Compass, FileText, Layers, Download, Check, Sparkles, 
  Building2, DollarSign, Eye, ShieldCheck, Box
} from 'lucide-react';

interface NavbarProps {
  activeView: 'prd' | 'studio';
  studioTab: '2d' | '3d' | 'boq' | 'schedule' | 'ar';
  currentProject: ProjectData;
  onSelectView: (view: 'prd' | 'studio') => void;
  onSelectStudioTab: (tab: '2d' | '3d' | 'boq' | 'schedule' | 'ar') => void;
  onSelectProject: (project: ProjectData) => void;
  onSelectCurrency: (currency: Currency) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  studioTab,
  currentProject,
  onSelectView,
  onSelectStudioTab,
  onSelectProject,
  onSelectCurrency,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  ArchEase
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  CPO & 3D SaaS BTP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 hidden md:block">
                L'architecture et la gestion de chantier à la portée de tous.
              </p>
            </div>
          </div>

          {/* Bascule Principale : PRD vs Studio Interactif */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onSelectView('prd')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'prd'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cahier des Charges (PRD)</span>
            </button>
            <button
              onClick={() => onSelectView('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'studio'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Studio Interactif</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/20 text-white font-mono">
                Live
              </span>
            </button>
          </div>

          {/* Outils & Sélecteurs Droite */}
          <div className="flex items-center gap-2.5">
            {/* Choix du projet modèle */}
            <select
              value={currentProject.id}
              onChange={(e) => {
                const found = SAMPLE_PROJECTS.find(p => p.id === e.target.value);
                if (found) onSelectProject(found);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none cursor-pointer hidden sm:block"
            >
              {SAMPLE_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Sélecteur de Devise Rapide */}
            <select
              value={currentProject.currency}
              onChange={(e) => onSelectCurrency(e.target.value as Currency)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none cursor-pointer"
              title="Devise active"
            >
              {Object.values(CURRENCIES).map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sous-navigation pour le Studio (si le mode Studio est actif) */}
        {activeView === 'studio' && (
          <div className="flex items-center gap-1 py-2 border-t border-slate-100 dark:border-slate-800 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
              Module Actif :
            </span>
            <button
              onClick={() => onSelectStudioTab('2d')}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                studioTab === '2d'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              1. Conception 2D (Canva)
            </button>
            <button
              onClick={() => onSelectStudioTab('3d')}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                studioTab === '3d'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              2. Rendu 3D & Solaire
            </button>
            <button
              onClick={() => onSelectStudioTab('boq')}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                studioTab === 'boq'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              3. Métré & Devis BOQ
            </button>
            <button
              onClick={() => onSelectStudioTab('schedule')}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                studioTab === 'schedule'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              4. Chantier & Jalons
            </button>
            <button
              onClick={() => onSelectStudioTab('ar')}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                studioTab === 'ar'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              5. AR 1:1 & IA
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
