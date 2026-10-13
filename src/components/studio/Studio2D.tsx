import React, { useState } from 'react';
import { ProjectData, RoomInstance, OpeningInstance } from '../../types/architect';
import { ROOM_TEMPLATES } from '../../data/currenciesAndCosts';
import { Plus, Trash2, Move, Maximize2, DoorOpen, Eye, Square, Info } from 'lucide-react';

interface Studio2DProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
  onSwitchTo3D: () => void;
}

export const Studio2D: React.FC<Studio2DProps> = ({
  project,
  onUpdateProject,
  onSwitchTo3D,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(project.rooms[0]?.id || null);
  const [zoomLevel, setZoomLevel] = useState<number>(32); // pixels per meter
  const [gridSnap, setGridSnap] = useState<number>(0.5); // 0.5m snap
  const [showDimensions, setShowDimensions] = useState<boolean>(true);

  const selectedRoom = project.rooms.find(r => r.id === selectedRoomId);

  // Surface totale calculée
  const totalFloorArea = project.rooms.reduce((acc, r) => acc + (r.width * r.length), 0);

  const handleAddRoomFromTemplate = (templateId: string) => {
    const template = ROOM_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    // Trouver un emplacement libre (décaler vers la droite)
    const maxX = project.rooms.reduce((max, r) => Math.max(max, r.x + r.width), 0);

    const newRoom: RoomInstance = {
      id: `room-${Date.now()}`,
      name: template.name,
      templateId: template.id,
      x: maxX > 0 ? maxX : 0,
      y: 0,
      width: template.defaultWidth,
      length: template.defaultLength,
      height: 2.6,
      color: template.color,
      floorMaterial: 'Carrelage Standard',
      wallMaterial: 'Peinture Blanche',
    };

    onUpdateProject({
      ...project,
      rooms: [...project.rooms, newRoom],
    });
    setSelectedRoomId(newRoom.id);
  };

  const handleUpdateRoomDimension = (roomId: string, field: 'width' | 'length' | 'x' | 'y' | 'name', value: any) => {
    const updatedRooms = project.rooms.map(r => {
      if (r.id === roomId) {
        return { ...r, [field]: value };
      }
      return r;
    });

    onUpdateProject({
      ...project,
      rooms: updatedRooms,
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    const updatedRooms = project.rooms.filter(r => r.id !== roomId);
    onUpdateProject({
      ...project,
      rooms: updatedRooms,
    });
    if (selectedRoomId === roomId) {
      setSelectedRoomId(updatedRooms[0]?.id || null);
    }
  };

  const handleAddOpening = (type: 'door' | 'window' | 'bay_window') => {
    if (!selectedRoom) return;

    const newOpening: OpeningInstance = {
      id: `op-${Date.now()}`,
      type,
      name: type === 'bay_window' ? 'Grande Baie Vitrée' : type === 'door' ? 'Porte' : 'Fenêtre',
      x: selectedRoom.x + selectedRoom.width / 2,
      y: selectedRoom.y,
      width: type === 'bay_window' ? 2.4 : type === 'door' ? 0.9 : 1.2,
      height: type === 'window' ? 1.2 : 2.15,
      elevation: type === 'window' ? 1.0 : 0.0,
    };

    onUpdateProject({
      ...project,
      openings: [...project.openings, newOpening],
    });
  };

  const handleDeleteOpening = (opId: string) => {
    onUpdateProject({
      ...project,
      openings: project.openings.filter(op => op.id !== opId),
    });
  };

  // Coordonnées maximales pour le canvas
  const canvasWidthMeters = Math.max(16, ...project.rooms.map(r => r.x + r.width + 3));
  const canvasHeightMeters = Math.max(12, ...project.rooms.map(r => r.y + r.length + 3));

  return (
    <div className="flex flex-col xl:flex-row gap-5 h-full">
      {/* Panneau de gauche : Catalogue "Mode Canva" & Outils */}
      <div className="w-full xl:w-72 shrink-0 flex flex-col gap-4">
        {/* Résumé Métrique */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Emprise au Sol</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {project.rooms.length} Pièces
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {totalFloorArea.toFixed(1)} <span className="text-sm font-normal text-slate-400">m² hab.</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
            <span>Ouvertures : {project.openings.length} baies/portes</span>
            <button
              onClick={onSwitchTo3D}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" /> Voir 3D
            </button>
          </div>
        </div>

        {/* Catalogue "Glisser-Déposer" façon Canva */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              + Ajouter une Pièce (Canva)
            </span>
            <span className="text-[10px] text-slate-400">Clic pour ajouter</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
            {ROOM_TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => handleAddRoomFromTemplate(tpl.id)}
                className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 text-left transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: tpl.color }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">
                      {tpl.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tpl.defaultWidth}m × {tpl.defaultLength}m ({(tpl.defaultWidth * tpl.defaultLength).toFixed(1)} m²)
                    </div>
                  </div>
                </div>
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Propriétés de la pièce sélectionnée */}
        {selectedRoom ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5 text-indigo-600" />
                Pièce Sélectionnée
              </span>
              <button
                onClick={() => handleDeleteRoom(selectedRoom.id)}
                className="text-rose-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 p-1"
                title="Supprimer la pièce"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Désignation</label>
                <input
                  type="text"
                  value={selectedRoom.name}
                  onChange={(e) => handleUpdateRoomDimension(selectedRoom.id, 'name', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Largeur (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.5"
                    max="20"
                    value={selectedRoom.width}
                    onChange={(e) => handleUpdateRoomDimension(selectedRoom.id, 'width', parseFloat(e.target.value) || 2)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Longueur (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.5"
                    max="20"
                    value={selectedRoom.length}
                    onChange={(e) => handleUpdateRoomDimension(selectedRoom.id, 'length', parseFloat(e.target.value) || 2)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Position X (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={selectedRoom.x}
                    onChange={(e) => handleUpdateRoomDimension(selectedRoom.id, 'x', parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Position Y (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={selectedRoom.y}
                    onChange={(e) => handleUpdateRoomDimension(selectedRoom.id, 'y', parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Boutons d'ajout d'ouvertures */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="block text-[11px] font-medium text-slate-500 mb-1.5">Insérer une ouverture</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => handleAddOpening('door')}
                    className="py-1 px-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors"
                  >
                    + Porte
                  </button>
                  <button
                    onClick={() => handleAddOpening('window')}
                    className="py-1 px-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors"
                  >
                    + Fenêtre
                  </button>
                  <button
                    onClick={() => handleAddOpening('bay_window')}
                    className="py-1 px-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-[10px] font-semibold text-slate-700 dark:text-slate-300 text-center transition-colors"
                  >
                    + Baie
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Zone Canvas Vectoriel 2D */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Barre d'outils supérieure du Canvas */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Square className="w-4 h-4 text-indigo-600" />
              Vue Vectorielle 2D (Échelle 1m = {zoomLevel}px)
            </span>
            <span className="text-slate-400">|</span>
            <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showDimensions}
                onChange={(e) => setShowDimensions(e.target.checked)}
                className="rounded text-indigo-600"
              />
              Cotes automatiques
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel(Math.max(20, zoomLevel - 4))}
                className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded font-bold"
                title="Dézoomer"
              >
                -
              </button>
              <span className="px-2 text-[11px] font-mono">{zoomLevel}px/m</span>
              <button
                onClick={() => setZoomLevel(Math.min(50, zoomLevel + 4))}
                className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded font-bold"
                title="Zoomer"
              >
                +
              </button>
            </div>

            <button
              onClick={onSwitchTo3D}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Basculer en 3D Temps Réel
            </button>
          </div>
        </div>

        {/* Grille et Pièces 2D Vectorielles */}
        <div className="flex-1 overflow-auto p-8 bg-slate-100/50 dark:bg-slate-950/60 relative select-none min-h-[500px]">
          <div
            className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-sm transition-all"
            style={{
              width: `${canvasWidthMeters * zoomLevel}px`,
              height: `${canvasHeightMeters * zoomLevel}px`,
              backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
              backgroundSize: `${zoomLevel}px ${zoomLevel}px`,
            }}
          >
            {/* Repère Nord */}
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-center text-[10px] font-mono shadow-xs">
              <div className="text-rose-500 font-bold">▲ N</div>
              <div className="text-[9px] text-slate-400">Nord ({project.terrain.orientationNorthDeg}°)</div>
            </div>

            {/* Rendu des Pièces */}
            {project.rooms.map((room) => {
              const isSelected = room.id === selectedRoomId;
              const leftPx = room.x * zoomLevel;
              const topPx = room.y * zoomLevel;
              const widthPx = room.width * zoomLevel;
              const heightPx = room.length * zoomLevel;
              const roomArea = (room.width * room.length).toFixed(1);

              return (
                <div
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoomId(room.id);
                  }}
                  className={`absolute rounded-sm transition-all cursor-pointer flex flex-col items-center justify-center p-2 text-center border-2 ${
                    isSelected
                      ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-400/40 z-20'
                      : 'border-slate-700/80 hover:border-slate-900 z-10'
                  }`}
                  style={{
                    left: `${leftPx}px`,
                    top: `${topPx}px`,
                    width: `${widthPx}px`,
                    height: `${heightPx}px`,
                    backgroundColor: room.color || '#f1f5f9',
                  }}
                >
                  {/* Cotes automatiques du mur haut */}
                  {showDimensions && (
                    <div className="absolute -top-5 left-0 w-full text-center text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 pointer-events-none">
                      {room.width.toFixed(2)} m
                    </div>
                  )}

                  {/* Cotes automatiques du mur gauche */}
                  {showDimensions && (
                    <div className="absolute top-0 -left-6 h-full flex items-center justify-center text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 pointer-events-none -rotate-90">
                      {room.length.toFixed(2)} m
                    </div>
                  )}

                  {/* Contenu textuel de la pièce */}
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {room.name}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-indigo-700 bg-white/70 px-1.5 py-0.5 rounded mt-1 shadow-xs">
                    {roomArea} m²
                  </span>
                </div>
              );
            })}

            {/* Rendu des Ouvertures (Portes et Fenêtres) */}
            {project.openings.map((op) => {
              const leftPx = op.x * zoomLevel;
              const topPx = op.y * zoomLevel;
              const widthPx = Math.max(16, op.width * zoomLevel);
              const isBay = op.type === 'bay_window';
              const isDoor = op.type === 'door';

              return (
                <div
                  key={op.id}
                  className={`absolute z-30 flex items-center justify-center rounded text-[9px] font-bold font-mono transition-transform hover:scale-110 cursor-pointer shadow-md ${
                    isBay
                      ? 'bg-sky-400 text-sky-950 border border-sky-600'
                      : isDoor
                      ? 'bg-amber-400 text-amber-950 border border-amber-600'
                      : 'bg-emerald-400 text-emerald-950 border border-emerald-600'
                  }`}
                  style={{
                    left: `${leftPx}px`,
                    top: `${topPx}px`,
                    width: `${widthPx}px`,
                    height: '14px',
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={`${op.name} (${op.width}m) - Clic pour supprimer`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Supprimer ${op.name} ?`)) {
                      handleDeleteOpening(op.id);
                    }
                  }}
                >
                  {isBay ? 'BAIE' : isDoor ? 'PORTE' : 'FEN.'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Légende en pied de canvas */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-xs border border-amber-600 inline-block" />
              Porte (0.90 m)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-xs border border-emerald-600 inline-block" />
              Fenêtre (1.20 m)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-400 rounded-xs border border-sky-600 inline-block" />
              Baie Vitrée (2.40 m)
            </span>
          </div>
          <span className="text-slate-400">
            Astuce : Cliquez sur une pièce pour ajuster sa longueur, largeur ou position en direct.
          </span>
        </div>
      </div>
    </div>
  );
};
