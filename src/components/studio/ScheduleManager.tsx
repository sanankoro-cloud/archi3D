import React, { useState } from 'react';
import { ProjectData, ScheduleTask } from '../../types/architect';
import { formatPrice } from '../../data/currenciesAndCosts';
import { 
  Calendar, CheckCircle, Clock, AlertTriangle, ArrowRight, 
  CheckCircle2, Plus, User, DollarSign, Activity
} from 'lucide-react';

interface ScheduleManagerProps {
  project: ProjectData;
  onUpdateTasks: (tasks: ScheduleTask[]) => void;
}

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  project,
  onUpdateTasks,
}) => {
  const [tasks, setTasks] = useState<ScheduleTask[]>(project.tasks);

  const handleToggleTaskStatus = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        let newStatus: ScheduleTask['status'] = 'todo';
        let newProgress = 0;
        if (t.status === 'todo') {
          newStatus = 'in_progress';
          newProgress = 50;
        } else if (t.status === 'in_progress') {
          newStatus = 'completed';
          newProgress = 100;
        } else {
          newStatus = 'todo';
          newProgress = 0;
        }
        return { ...t, status: newStatus, progressPercent: newProgress };
      }
      return t;
    });
    setTasks(updated);
    onUpdateTasks(updated);
  };

  const handleUpdateProgress = (taskId: string, progress: number) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const clamped = Math.max(0, Math.min(100, progress));
        const status: ScheduleTask['status'] = clamped === 100 ? 'completed' : clamped > 0 ? 'in_progress' : 'todo';
        return { ...t, progressPercent: clamped, status };
      }
      return t;
    });
    setTasks(updated);
    onUpdateTasks(updated);
  };

  // Calculs globaux
  const totalEstimated = tasks.reduce((acc, t) => acc + t.budgetEstimatedEUR, 0);
  const totalActual = tasks.reduce((acc, t) => acc + t.budgetActualEUR, 0);
  const avgProgress = Math.round(tasks.reduce((acc, t) => acc + t.progressPercent, 0) / (tasks.length || 1));
  const budgetVariance = totalActual - totalEstimated;

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête Statut Chantier */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Module D : Planificateur de Chantier A à Z
            </span>
            <span className="text-xs text-slate-400">Jalons & Suivi de budget</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Chronologie des Travaux & Alertes Budgétaires
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Découpage par corps d'état avec suivi d'avancement physique et contrôle des dépenses en temps réel.
          </p>
        </div>

        {/* Jauges d'avancement */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-400">Avancement Global</div>
            <div className="text-3xl font-extrabold text-indigo-400 font-mono">
              {avgProgress}%
            </div>
            <div className="w-32 bg-slate-800 rounded-full h-2 mt-1 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all"
                style={{ width: `${avgProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cartes Budgétaires du Chantier */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Budget Initial Alloué
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatPrice(totalEstimated, project.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cumul des devis validés</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Dépenses Réelles Constatées
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatPrice(totalActual, project.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Factures engagées à ce jour</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Écart Budgétaire (Variance)
          </div>
          <div className={`text-2xl font-extrabold flex items-center gap-1.5 ${
            budgetVariance > 0 ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            {budgetVariance > 0 ? '+' : ''}{formatPrice(budgetVariance, project.currency)}
            {budgetVariance > 0 ? (
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {budgetVariance > 0 ? 'Alerte dépassement budgétaire' : 'Budget maîtrisé dans les clous'}
          </div>
        </div>
      </div>

      {/* Chronologie des Jalons par Corps d'État */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Jalons & Planning Opérationnel
          </span>
          <span className="text-xs text-slate-400">
            Cliquez sur un statut pour le faire progresser
          </span>
        </div>

        <div className="space-y-4">
          {tasks.map((task, idx) => {
            const isDone = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';
            const isDelayed = task.status === 'delayed';

            return (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all gap-4"
              >
                {/* Numéro & Titre */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                        {task.phase}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {task.durationDays} jours
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {task.responsible}
                      </span>
                      <span>• Devis: {formatPrice(task.budgetEstimatedEUR, project.currency)}</span>
                      {task.budgetActualEUR > 0 && (
                        <span>• Réalisé: {formatPrice(task.budgetActualEUR, project.currency)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Curseur d'avancement & Bouton de statut */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {task.progressPercent}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={task.progressPercent}
                      onChange={(e) => handleUpdateProgress(task.id, parseInt(e.target.value, 10))}
                      className="w-28 accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => handleToggleTaskStatus(task.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                        : isInProgress
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terminé
                      </>
                    ) : isInProgress ? (
                      <>
                        <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> En cours
                      </>
                    ) : (
                      <>À faire</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
