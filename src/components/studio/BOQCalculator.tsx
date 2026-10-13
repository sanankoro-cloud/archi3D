import React, { useState } from 'react';
import { ProjectData, Currency } from '../../types/architect';
import { calculateProjectBOQ } from '../../utils/boqEngine';
import { CURRENCIES, CITY_COST_INDEXES, formatPrice } from '../../data/currenciesAndCosts';
import { 
  Calculator, Download, DollarSign, MapPin, Layers, CheckCircle2, 
  AlertCircle, FileSpreadsheet, ArrowUpRight, HelpCircle, Percent
} from 'lucide-react';

interface BOQCalculatorProps {
  project: ProjectData;
  onUpdateCurrency: (currency: Currency) => void;
  onUpdateCityIndex: (cityId: string) => void;
}

export const BOQCalculator: React.FC<BOQCalculatorProps> = ({
  project,
  onUpdateCurrency,
  onUpdateCityIndex,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFormulaTooltip, setShowFormulaTooltip] = useState<boolean>(false);

  const boqResult = calculateProjectBOQ(project);
  const activeCurrency = CURRENCIES[project.currency] || CURRENCIES.EUR;
  const activeCity = CITY_COST_INDEXES.find(c => c.id === project.cityCostIndexId) || CITY_COST_INDEXES[1];

  const filteredItems = selectedCategory === 'all' 
    ? boqResult.items 
    : boqResult.items.filter(item => item.category === selectedCategory);

  const handleExportCSV = () => {
    const headers = ['Code', 'Désignation', 'Catégorie', 'Unité', 'Quantité', 'Marge Perte (%)', 'Prix Unitaire (EUR)', `Total (${project.currency})`, 'Formule Algorithmique'];
    const rows = boqResult.items.map(i => [
      `"${i.code}"`,
      `"${i.designation}"`,
      `"${i.category}"`,
      `"${i.unit}"`,
      i.quantity,
      i.wasteMarginPercent || 0,
      i.unitPriceEUR,
      (i.totalPriceEUR * activeCurrency.rateToEUR).toFixed(2),
      `"${i.formulaDescription}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ArchEase_BOQ_${project.name.replace(/\s+/g, '_')}_${project.currency}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* En-tête : Sélecteur Multi-Devises & City Cost Index */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Module C : Moteur d'Estimation BOQ
            </span>
            <span className="text-xs text-slate-400">Algorithme BTP certifié</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Estimation Budgétaire & Métré Élément par Élément
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quantités réelles calculées depuis le modèle 2D/3D avec majoration des chutes et coûts indexés localement.
          </p>
        </div>

        {/* Contrôles Devises & Ville */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sélecteur de Devise */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Devise de Facturation
            </label>
            <select
              value={project.currency}
              onChange={(e) => onUpdateCurrency(e.target.value as Currency)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {Object.values(CURRENCIES).map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Sélecteur de Ville / Index BTP */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              Région (City Cost Index)
            </label>
            <select
              value={project.cityCostIndexId}
              onChange={(e) => onUpdateCityIndex(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CITY_COST_INDEXES.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name} (x{city.multiplier})
                </option>
              ))}
            </select>
          </div>

          {/* Bouton Export CSV */}
          <div className="flex flex-col justify-end">
            <label className="text-[11px] text-transparent hidden lg:block">Action</label>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              title="Exporter le devis complet au format CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exporter Devis (CSV)
            </button>
          </div>
        </div>
      </div>

      {/* Cartes Métriques Clés BTP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Devis */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Budget Global Estimé</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {project.currency}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatPrice(boqResult.totalEUR, project.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Soit ~{( (boqResult.totalEUR * activeCurrency.rateToEUR) / (boqResult.totalAreaM2 || 1) ).toFixed(0)} {activeCurrency.symbol}/m² hab.
          </div>
        </div>

        {/* Volume de Béton Total */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Volume Béton Fondations</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {boqResult.totalConcreteVolumeM3} <span className="text-sm font-normal text-slate-500">m³</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Dalle armée 15cm + semelles filantes
          </div>
        </div>

        {/* Surface Nette des Murs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Murs Extérieurs Nets</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
              Baies déduites
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {boqResult.totalWallNetAreaM2} <span className="text-sm font-normal text-slate-500">m²</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Surface maçonnerie réelle hors ouvertures
          </div>
        </div>

        {/* Carrelage + 10% Chutes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Revêtements Sols</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-0.5">
              <Percent className="w-3 h-3" /> +10% chutes
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {boqResult.totalTilingWithWasteM2} <span className="text-sm font-normal text-slate-500">m²</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Emprise ({boqResult.totalAreaM2}m²) majorée pour découpes
          </div>
        </div>
      </div>

      {/* Tableau Détaillé du Bordereau des Prix Quantitatifs (BOQ) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Filtres par corps d'état */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Filtrer :</span>
            {[
              { id: 'all', label: 'Tout le projet' },
              { id: 'gros_oeuvre', label: 'Gros Œuvre' },
              { id: 'menuiseries', label: 'Menuiseries' },
              { id: 'second_oeuvre', label: 'Second Œuvre' },
              { id: 'finitions', label: 'Finitions' },
              { id: 'fluides_elec', label: 'Élec & Plomberie' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            {filteredItems.length} lignes d'éléments calculées
          </div>
        </div>

        {/* Table HTML */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4">Réf. Code</th>
                <th className="p-4">Désignation du Poste</th>
                <th className="p-4 text-center">Unité</th>
                <th className="p-4 text-right">Quantité Calculée</th>
                <th className="p-4 text-right">Prix Unitaire</th>
                <th className="p-4 text-right">Total ({project.currency})</th>
                <th className="p-4">Formule Mathématique Appliquée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => {
                const itemTotalInSelectedCurrency = item.totalPriceEUR * activeCurrency.rateToEUR;
                const itemUnitInSelectedCurrency = item.unitPriceEUR * activeCurrency.rateToEUR;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-semibold text-slate-600 dark:text-slate-400">
                      {item.code}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.designation}
                      </div>
                      {item.wasteMarginPercent ? (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                          +{item.wasteMarginPercent}% majoration chutes de coupe
                        </span>
                      ) : null}
                    </td>
                    <td className="p-4 text-center font-mono font-medium text-slate-500">
                      {item.unit}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.quantity.toLocaleString('fr-FR')} {item.unit}
                    </td>
                    <td className="p-4 text-right font-mono text-slate-600 dark:text-slate-300">
                      {project.currency === 'XOF'
                        ? `${Math.round(itemUnitInSelectedCurrency).toLocaleString('fr-FR')} FCFA`
                        : `${itemUnitInSelectedCurrency.toFixed(2)} ${activeCurrency.symbol}`}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {formatPrice(item.totalPriceEUR, project.currency)}
                    </td>
                    <td className="p-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {item.formulaDescription}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800/90 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                <td colSpan={5} className="p-4 text-right uppercase text-xs">
                  Total Estimé ({selectedCategory === 'all' ? 'Toutes phases' : selectedCategory}) :
                </td>
                <td className="p-4 text-right text-base text-indigo-600 dark:text-indigo-400 font-mono">
                  {formatPrice(
                    filteredItems.reduce((acc, i) => acc + i.totalPriceEUR, 0),
                    project.currency
                  )}
                </td>
                <td className="p-4 text-[11px] text-slate-400">
                  Prix H.T. indexé ({activeCity.name})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
