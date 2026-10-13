import React, { useState } from 'react';
import { PRD_CHAPTERS, PRD_METADATA } from '../data/prdDocument';
import { 
  FileText, Download, Copy, Check, Search, BookOpen, Layers, 
  Cpu, Calculator, Calendar, Smartphone, Database, CheckCircle2,
  Sparkles, ShieldCheck, UserCheck, ChevronRight
} from 'lucide-react';

export const PRDViewer: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<string>('chapitre-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const activeChapter = PRD_CHAPTERS.find(c => c.id === activeChapterId) || PRD_CHAPTERS[0];

  const filteredChapters = PRD_CHAPTERS.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCopyAll = () => {
    const fullText = `# ${PRD_METADATA.title}
Version: ${PRD_METADATA.version} | Rédigé par: ${PRD_METADATA.author}
Date: ${PRD_METADATA.date}

${PRD_CHAPTERS.map(c => c.contentMarkdown).join('\n\n---\n\n')}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const fullText = `# ${PRD_METADATA.title}
Version: ${PRD_METADATA.version}
Auteur: ${PRD_METADATA.author}
Date: ${PRD_METADATA.date}

${PRD_CHAPTERS.map(c => c.contentMarkdown).join('\n\n---\n\n')}`;

    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ArchEase_PRD_CPO_Architecte_${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getChapterIcon = (index: number) => {
    switch (index) {
      case 0: return <BookOpen className="w-4 h-4" />;
      case 1: return <Cpu className="w-4 h-4" />;
      case 2: return <Calculator className="w-4 h-4" />;
      case 3: return <Database className="w-4 h-4" />;
      case 4: return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
      {/* Sidebar Sommaire & Navigation */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
        {/* En-tête métadonnées document */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              {PRD_METADATA.status}
            </span>
            <span className="text-xs text-slate-400 font-mono">v{PRD_METADATA.version}</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight leading-snug">
            Cahier des Charges Technique & Fonctionnel
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Par le CPO & Lead Architecte SaaS BTP/3D
          </p>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={handleCopyAll}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
              title="Copier l'intégralité du document en Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copié !' : 'Copier tout'}
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors shadow-sm"
              title="Télécharger le fichier .md complet"
            >
              <Download className="w-3.5 h-3.5" />
              Télécharger .md
            </button>
          </div>
        </div>

        {/* Barre de recherche dans le PRD */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un terme (ex: BOQ, Three.js, XOF, AR)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Liste des chapitres */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-sm flex flex-col gap-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Sommaire Exécutif
          </div>
          {filteredChapters.map((chapter, idx) => {
            const isActive = chapter.id === activeChapter.id;
            return (
              <button
                key={chapter.id}
                onClick={() => setActiveChapterId(chapter.id)}
                className={`flex items-start gap-3 p-3 text-left rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className={`mt-0.5 p-1.5 rounded-md ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {getChapterIcon(idx)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-slate-400">#{chapter.number}</span>
                    <span className="text-xs font-medium truncate">{chapter.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {chapter.summary}
                  </p>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-indigo-600 shrink-0 self-center" />}
              </button>
            );
          })}
        </div>

        {/* Note pour chef d'entreprise / non-développeur */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Guide Entrepreneur
          </div>
          <p className="leading-relaxed">
            Ce document est directement exploitable pour lancer un appel d'offres technique, guider des développeurs freelances ou une agence tech, et garantir un respect strict des délais et budgets.
          </p>
        </div>
      </div>

      {/* Zone Principale de Lecture du Chapitre */}
      <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Fil d'Ariane & Navigation Rapide */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Chapitre {activeChapter.number}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeChapter.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const currentIndex = PRD_CHAPTERS.findIndex(c => c.id === activeChapter.id);
                if (currentIndex > 0) setActiveChapterId(PRD_CHAPTERS[currentIndex - 1].id);
              }}
              disabled={PRD_CHAPTERS.findIndex(c => c.id === activeChapter.id) === 0}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              ← Précédent
            </button>
            <button
              onClick={() => {
                const currentIndex = PRD_CHAPTERS.findIndex(c => c.id === activeChapter.id);
                if (currentIndex < PRD_CHAPTERS.length - 1) setActiveChapterId(PRD_CHAPTERS[currentIndex + 1].id);
              }}
              disabled={PRD_CHAPTERS.findIndex(c => c.id === activeChapter.id) === PRD_CHAPTERS.length - 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 disabled:opacity-30 hover:opacity-90 transition-colors"
            >
              Suivant →
            </button>
          </div>
        </div>

        {/* Rendu Markdown Stylé & Soigné */}
        <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl">
          <RenderFormattedContent content={activeChapter.contentMarkdown} />
        </div>
      </div>
    </div>
  );
};

// Simple lightweight markdown block formatter for beautiful technical reading
const RenderFormattedContent: React.FC<{ content: string }> = ({ content }) => {
  const sections = content.split('\n\n');

  return (
    <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
      {sections.map((sec, idx) => {
        const trimmed = sec.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('# ')) {
          return <h1 key={idx} className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight pb-2 border-b border-slate-100 dark:border-slate-800">{trimmed.replace('# ', '')}</h1>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-bold text-slate-900 dark:text-white mt-6 pt-2 text-indigo-900 dark:text-indigo-400">{trimmed.replace('## ', '')}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-base font-semibold text-slate-800 dark:text-slate-200 mt-4">{trimmed.replace('### ', '')}</h3>;
        }
        if (trimmed.startsWith('#### ')) {
          return <h4 key={idx} className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-3">{trimmed.replace('#### ', '')}</h4>;
        }
        if (trimmed.startsWith('```')) {
          const lines = trimmed.split('\n');
          const code = lines.slice(1, -1).join('\n');
          return (
            <div key={idx} className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs shadow-inner">
              <div className="bg-slate-900/80 px-4 py-1.5 border-b border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>Code Spécification & Architecture</span>
                <span>Production Ready</span>
              </div>
              <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed">{code}</pre>
            </div>
          );
        }
        if (trimmed.startsWith('|')) {
          // Tableau markdown simplifié
          const rows = trimmed.split('\n').filter(r => !r.includes('---'));
          return (
            <div key={idx} className="overflow-x-auto my-4 border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  {rows.map((row, rIdx) => {
                    const cols = row.split('|').filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
                    const isHeader = rIdx === 0;
                    return (
                      <tr key={rIdx} className={isHeader ? 'bg-slate-100 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-700' : 'border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50'}>
                        {cols.map((col, cIdx) => (
                          <td key={cIdx} className="p-3">
                            <span dangerouslySetInnerHTML={{ __html: col.trim().replace(/<br>/g, '<br/>') }} />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        // Listes à puces
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const items = trimmed.split('\n');
          return (
            <ul key={idx} className="list-disc pl-5 space-y-1.5 my-2 text-slate-700 dark:text-slate-300">
              {items.map((it, iIdx) => (
                <li key={iIdx} className="pl-1">
                  <span dangerouslySetInnerHTML={{ __html: it.replace(/^[\*\-]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>') }} />
                </li>
              ))}
            </ul>
          );
        }

        // Paragraphe normal
        return (
          <p
            key={idx}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: trimmed
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400">$1</code>')
            }}
          />
        );
      })}
    </div>
  );
};
