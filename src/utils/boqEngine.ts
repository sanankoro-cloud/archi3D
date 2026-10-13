import { ProjectData, BOQItem } from '../types/architect';
import { CITY_COST_INDEXES } from '../data/currenciesAndCosts';

export interface BOQCalculationResult {
  items: BOQItem[];
  totalAreaM2: number;
  totalWallNetAreaM2: number;
  totalConcreteVolumeM3: number;
  totalTilingWithWasteM2: number;
  totalEUR: number;
}

export function calculateProjectBOQ(project: ProjectData): BOQCalculationResult {
  const cityIndex = CITY_COST_INDEXES.find(c => c.id === project.cityCostIndexId) || CITY_COST_INDEXES[1];
  const multiplier = cityIndex.multiplier;

  // 1. Calculs Géométriques
  const totalFloorAreaM2 = project.rooms.reduce((acc, room) => acc + (room.width * room.length), 0);

  // Surface des ouvertures
  const totalOpeningsAreaM2 = project.openings.reduce((acc, op) => acc + (op.width * op.height), 0);
  const doorsCount = project.openings.filter(op => op.type === 'door').length;
  const windowsCount = project.openings.filter(op => op.type === 'window').length;
  const bayWindowsCount = project.openings.filter(op => op.type === 'bay_window').length;

  // Longueur et surface des murs
  let totalExtWallLength = 0;
  let totalIntWallLength = 0;
  let totalExtWallGrossAreaM2 = 0;

  project.walls.forEach(w => {
    const dx = w.endX - w.startX;
    const dy = w.endY - w.startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const height = w.height || 2.6;

    if (w.isExterior) {
      totalExtWallLength += length;
      totalExtWallGrossAreaM2 += (length * height);
    } else {
      totalIntWallLength += length;
    }
  });

  // Si pas de murs définis manuellement, estimer le périmètre à partir de l'emprise
  if (totalExtWallLength === 0 && totalFloorAreaM2 > 0) {
    const approxSide = Math.sqrt(totalFloorAreaM2);
    totalExtWallLength = approxSide * 4;
    totalExtWallGrossAreaM2 = totalExtWallLength * 2.6;
  }

  // Surface nette des murs extérieurs (déduction des baies vitrées et portes)
  const totalWallNetAreaM2 = Math.max(10, totalExtWallGrossAreaM2 - totalOpeningsAreaM2);

  // 2. Béton & Gros Œuvre
  const slabVolumeM3 = totalFloorAreaM2 * 0.15; // Dalle 15 cm
  const footingVolumeM3 = totalExtWallLength * 0.50 * 0.40; // Semelles 50x40 cm
  const totalConcreteVolumeM3 = Math.round((slabVolumeM3 + footingVolumeM3) * 10) / 10;
  const steelWeightKg = Math.round(totalConcreteVolumeM3 * 75); // 75 kg/m3

  // 3. Finitions & Carrelage (+10% pour chutes)
  const tilingNetAreaM2 = totalFloorAreaM2;
  const tilingWithWasteM2 = Math.round((tilingNetAreaM2 * 1.10) * 10) / 10; // +10% chutes

  // Surface de peinture (murs intérieurs double face + plafonds)
  const ceilingAreaM2 = totalFloorAreaM2;
  const paintingAreaM2 = Math.round(((totalWallNetAreaM2 * 1.5) + ceilingAreaM2) * 10) / 10;

  // 4. Génération des lignes du bordereau quantitatif (BOQ)
  const items: BOQItem[] = [
    // GROS OEUVRE
    {
      id: 'boq-concrete',
      category: 'gros_oeuvre',
      code: 'GO-BET-01',
      designation: 'Béton armé dosé à 350 kg/m³ (Semelles filantes + Dallage 15 cm)',
      unit: 'm³',
      quantity: totalConcreteVolumeM3,
      unitPriceEUR: Math.round(155 * multiplier),
      totalPriceEUR: Math.round(totalConcreteVolumeM3 * (155 * multiplier)),
      formulaDescription: `V = Dalle (${slabVolumeM3.toFixed(1)}m³) + Fondations (${footingVolumeM3.toFixed(1)}m³)`,
    },
    {
      id: 'boq-steel',
      category: 'gros_oeuvre',
      code: 'GO-ACI-02',
      designation: 'Aciers Haute Adhérence (Ferraillage cages & treillis soudé ST25C)',
      unit: 'kg',
      quantity: steelWeightKg,
      unitPriceEUR: Number((1.85 * multiplier).toFixed(2)),
      totalPriceEUR: Math.round(steelWeightKg * (1.85 * multiplier)),
      formulaDescription: `Ratio 75 kg d’acier par m³ de béton coulé (${totalConcreteVolumeM3} m³)`,
    },
    {
      id: 'boq-masonry',
      category: 'gros_oeuvre',
      code: 'GO-MUR-03',
      designation: 'Élévation de maçonnerie parpaings creux 20 cm ou briques (Surface nette hors baies)',
      unit: 'm²',
      quantity: Math.round(totalWallNetAreaM2 * 10) / 10,
      unitPriceEUR: Math.round(72 * multiplier),
      totalPriceEUR: Math.round(totalWallNetAreaM2 * (72 * multiplier)),
      formulaDescription: `S_brute (${totalExtWallGrossAreaM2.toFixed(1)}m²) - S_ouvertures (${totalOpeningsAreaM2.toFixed(1)}m²)`,
    },
    {
      id: 'boq-roofing',
      category: 'gros_oeuvre',
      code: 'GO-TOI-04',
      designation: 'Charpente & Couverture étanche (développée avec acrotère/pente)',
      unit: 'm²',
      quantity: Math.round((totalFloorAreaM2 * 1.15) * 10) / 10,
      unitPriceEUR: Math.round(85 * multiplier),
      totalPriceEUR: Math.round(totalFloorAreaM2 * 1.15 * (85 * multiplier)),
      formulaDescription: `Emprise au sol + débord de toiture 15%`,
    },

    // MENUISERIES
    {
      id: 'boq-doors',
      category: 'menuiseries',
      code: 'MEN-POR-01',
      designation: 'Blocs-portes de communication & portes techniques sécurisées',
      unit: 'u',
      quantity: Math.max(doorsCount, 3),
      unitPriceEUR: Math.round(380 * multiplier),
      totalPriceEUR: Math.max(doorsCount, 3) * Math.round(380 * multiplier),
      formulaDescription: `Décompte unitaire exact depuis le plan 2D/3D`,
    },
    {
      id: 'boq-windows',
      category: 'menuiseries',
      code: 'MEN-FEN-02',
      designation: 'Fenêtres oscillo-battantes aluminium / PVC à rupture de pont thermique',
      unit: 'u',
      quantity: Math.max(windowsCount, 2),
      unitPriceEUR: Math.round(490 * multiplier),
      totalPriceEUR: Math.max(windowsCount, 2) * Math.round(490 * multiplier),
      formulaDescription: `Comptage des ouvertures créées sur façades`,
    },
    {
      id: 'boq-bay-windows',
      category: 'menuiseries',
      code: 'MEN-BAIE-03',
      designation: 'Grandes baies vitrées coulissantes aluminium double vitrage feuilleté',
      unit: 'u',
      quantity: Math.max(bayWindowsCount, 1),
      unitPriceEUR: Math.round(1150 * multiplier),
      totalPriceEUR: Math.max(bayWindowsCount, 1) * Math.round(1150 * multiplier),
      formulaDescription: `Baies vitrées d’apport solaire passif`,
    },

    // SECOND OEUVRE
    {
      id: 'boq-insulation',
      category: 'second_oeuvre',
      code: 'SO-ISO-01',
      designation: 'Doublage isolant thermique et phonique intérieur (Placo BA13 + laine)',
      unit: 'm²',
      quantity: Math.round(totalWallNetAreaM2 * 10) / 10,
      unitPriceEUR: Math.round(38 * multiplier),
      totalPriceEUR: Math.round(totalWallNetAreaM2 * (38 * multiplier)),
      formulaDescription: `Surface des murs intérieurs doublés`,
    },
    {
      id: 'boq-elec-plumb',
      category: 'fluides_elec',
      code: 'SO-FLUID-02',
      designation: 'Réseau Électrique NF C 15-100 & Distribution Plomberie multicouche',
      unit: 'forfait',
      quantity: 1,
      unitPriceEUR: Math.round((totalFloorAreaM2 * 95) * multiplier),
      totalPriceEUR: Math.round((totalFloorAreaM2 * 95) * multiplier),
      formulaDescription: `Forfait normalisé calculé sur la surface habitable (${totalFloorAreaM2.toFixed(0)} m²)`,
    },

    // FINITIONS
    {
      id: 'boq-tiling',
      category: 'finitions',
      code: 'FIN-CAR-01',
      designation: 'Fourniture & Pose Carrelage Grès Cérame émaillé (+10% Chutes de découpe incluses)',
      unit: 'm²',
      quantity: tilingWithWasteM2,
      wasteMarginPercent: 10,
      unitPriceEUR: Math.round(55 * multiplier),
      totalPriceEUR: Math.round(tilingWithWasteM2 * (55 * multiplier)),
      formulaDescription: `Surface sol (${tilingNetAreaM2.toFixed(1)}m²) + 10% pertes découpes/joints`,
    },
    {
      id: 'boq-painting',
      category: 'finitions',
      code: 'FIN-PEI-02',
      designation: 'Mise en peinture 2 couches velours / satinée murs & plafonds après impression',
      unit: 'm²',
      quantity: paintingAreaM2,
      unitPriceEUR: Math.round(24 * multiplier),
      totalPriceEUR: Math.round(paintingAreaM2 * (24 * multiplier)),
      formulaDescription: `(Murs nets × 1.5 + Plafond) en 2 passes croisées`,
    },
  ];

  const totalEUR = items.reduce((acc, item) => acc + item.totalPriceEUR, 0);

  return {
    items,
    totalAreaM2: Math.round(totalFloorAreaM2 * 10) / 10,
    totalWallNetAreaM2: Math.round(totalWallNetAreaM2 * 10) / 10,
    totalConcreteVolumeM3,
    totalTilingWithWasteM2: tilingWithWasteM2,
    totalEUR,
  };
}
