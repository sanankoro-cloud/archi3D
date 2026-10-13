import React, { useState } from 'react';
import { ProjectData } from '../../types/architect';
import { 
  Smartphone, Sparkles, Camera, Compass, Scan, MapPin, 
  Send, Check, Layers, Eye, RefreshCw, Wand2 
} from 'lucide-react';

interface ARSimulatorProps {
  project: ProjectData;
  onApplyAILayout: (newRooms: any[]) => void;
}

export const ARSimulator: React.FC<ARSimulatorProps> = ({
  project,
  onApplyAILayout,
}) => {
  const [activeTab, setActiveTab] = useState<'ar_projection' | 'ai_prompt' | 'sketch_scanner'>('ar_projection');
  const [promptText, setPromptText] = useState<string>('Villa contemporaine 90m² avec 3 chambres et salon ouvert sur jardin plein sud');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [arScale, setArScale] = useState<number>(100); // 100% = échelle 1:1

  const handleRunAILayout = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Génération d'un agencement optimisé
      const generatedRooms = [
        {
          id: `ai-room-1-${Date.now()}`,
          name: 'Grand Séjour Traversant & Baies',
          x: 0,
          y: 0,
          width: 7.0,
          length: 5.5,
          height: 2.7,
          color: '#fef3c7',
          floorMaterial: 'Carrelage Grand Format',
          wallMaterial: 'Peinture Blanche',
        },
        {
          id: `ai-room-2-${Date.now()}`,
          name: 'Cuisine Îlot Central',
          x: 7.0,
          y: 0,
          width: 4.0,
          length: 4.0,
          height: 2.7,
          color: '#dcfce7',
          floorMaterial: 'Carrelage',
          wallMaterial: 'Crédence',
        },
        {
          id: `ai-room-3-${Date.now()}`,
          name: 'Suite Parentale avec Dressing',
          x: 0,
          y: 5.5,
          width: 4.5,
          length: 4.0,
          height: 2.6,
          color: '#e0e7ff',
          floorMaterial: 'Parquet',
          wallMaterial: 'Peinture',
        },
        {
          id: `ai-room-4-${Date.now()}`,
          name: 'Chambre 2 / Bureau Pro',
          x: 4.5,
          y: 5.5,
          width: 3.5,
          length: 3.2,
          height: 2.6,
          color: '#ede9fe',
          floorMaterial: 'Parquet',
          wallMaterial: 'Peinture',
        },
      ];

      onApplyAILayout(generatedRooms);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Module E & Module A.3
            </span>
            <span className="text-xs text-slate-400">Mobile AR & IA Générative</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Réalité Augmentée 1:1 sur Terrain & Assistant IA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Testez la projection du bâtiment in-situ à l'échelle réelle et générez des agencements par IA.
          </p>
        </div>

        {/* Onglets */}
        <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('ar_projection')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'ar_projection'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Projection AR 1:1
          </button>
          <button
            onClick={() => setActiveTab('ai_prompt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'ai_prompt'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Prompt-to-Layout IA
          </button>
          <button
            onClick={() => setActiveTab('sketch_scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'sketch_scanner'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            Scanner de Croquis
          </button>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'ar_projection' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full max-w-2xl bg-slate-950 rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl relative min-h-[420px] flex flex-col justify-between p-6">
            {/* Simulation de flux caméra terrain */}
            <div
              className="absolute inset-0 opacity-40 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80')`,
              }}
            />
            {/* Grille LiDAR Apple RoomPlan superposée */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* En-tête AR Mobile HUD */}
            <div className="relative z-10 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700">
                <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                <span className="font-mono font-bold">Cap : 15° Nord-Est (GPS verrouillé)</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>LiDAR : Détection de sol OK</span>
              </div>
            </div>

            {/* Modèle 3D Holographique projeté sur le sol réel */}
            <div className="relative z-10 self-center my-auto text-center bg-indigo-950/60 backdrop-blur-xs border-2 border-indigo-400/80 rounded-2xl p-6 text-white max-w-md shadow-2xl">
              <div className="text-xs uppercase font-bold text-indigo-300 tracking-wider mb-1">
                Modèle Ancré à l'Échelle Réelle (1:1)
              </div>
              <h3 className="text-lg font-extrabold text-white mb-2">
                {project.name}
              </h3>
              <p className="text-xs text-slate-300 mb-4">
                Emprise : {project.rooms.reduce((acc, r) => acc + (r.width * r.length), 0).toFixed(1)} m² hab. • Hauteur murs : 2,70 m
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 rounded bg-indigo-500/30 text-indigo-200 text-xs font-mono">
                  Échelle active : {arScale}%
                </span>
                <span className="px-3 py-1 rounded bg-emerald-500/30 text-emerald-200 text-xs font-mono">
                  Altitude terrain : 0.0 m
                </span>
              </div>
            </div>

            {/* Pied HUD AR */}
            <div className="relative z-10 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Échelle :</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={arScale}
                  onChange={(e) => setArScale(parseInt(e.target.value, 10))}
                  className="w-24 accent-indigo-500 cursor-pointer"
                />
                <span className="font-mono">{arScale}%</span>
              </div>
              <button
                onClick={() => alert("Capture du jalon enregistrée avec coordonnées GPS et horodatage certifié !")}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg"
              >
                <Camera className="w-4 h-4" />
                Prendre Photo Jalon GPS
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai_prompt' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-2">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Générateur d'Agencement Textuel (Prompt-to-Layout)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Décrivez votre projet en langage naturel. Le modèle génère les pièces, les cotes et l'orientation optimale.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Villa plain-pied 90m² avec 3 chambres..."
              />
              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  onClick={() => setPromptText("Villa 90m² contemporaine avec 3 chambres, cuisine ouverte et salon plein sud")}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                >
                  Exemple : Villa 90m²
                </button>
                <button
                  onClick={() => setPromptText("Pharmacie d'officine avec espace vente 50m², préparatoire aux normes et bureau gestion")}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                >
                  Exemple : Officine Moderne
                </button>
                <button
                  onClick={() => setPromptText("Bâtiment agricole 140m² avec hangar matériel et zone stockage récoltes ventilée")}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                >
                  Exemple : Bâtiment Agricole
                </button>
              </div>
            </div>

            <button
              onClick={handleRunAILayout}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Génération des volumes en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Générer le Plan & Charger dans le Studio
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'sketch_scanner' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Scanner de Croquis Papier (Image-to-Vector)
            </h3>
            <p className="text-xs text-slate-500">
              Prenez en photo un dessin au crayon sur papier millimétré ou une feuille blanche. L'IA vectorise les murs et extrait les cotes réelles.
            </p>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800/40">
              <Camera className="w-8 h-8 text-slate-400" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Glissez une photo de croquis ou cliquez pour capturer
              </div>
              <button
                onClick={() => {
                  alert("Démonstration Scanner IA : Le croquis papier a été vectorisé avec succès et transformé en modèle 3D éditable !");
                  handleRunAILayout();
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 cursor-pointer"
              >
                Tester avec un Croquis Démo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
