import { CurrencyConfig, CityCostIndex, RoomTemplate } from '../types/architect';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToEUR: 1.0 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToEUR: 1.08 },
  XOF: { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA (UEMOA/CEMAC)', rateToEUR: 655.957 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Dollar Canadien', rateToEUR: 1.48 },
  GBP: { code: 'GBP', symbol: '£', name: 'Livre Sterling', rateToEUR: 0.85 },
  MAD: { code: 'MAD', symbol: 'DH', name: 'Dirham Marocain', rateToEUR: 10.82 },
};

export const CITY_COST_INDEXES: CityCostIndex[] = [
  { id: 'paris', name: 'Île-de-France / Paris (Référence Haute)', country: 'France', multiplier: 1.15, laborRateHourEUR: 52 },
  { id: 'fr_province', name: 'France Régions / Province', country: 'France', multiplier: 1.0, laborRateHourEUR: 42 },
  { id: 'abidjan', name: 'Abidjan / Grand Abidjan', country: 'Côte d’Ivoire', multiplier: 0.65, laborRateHourEUR: 12 },
  { id: 'dakar', name: 'Dakar & Périphérie', country: 'Sénégal', multiplier: 0.68, laborRateHourEUR: 13 },
  { id: 'casablanca', name: 'Casablanca / Rabat', country: 'Maroc', multiplier: 0.72, laborRateHourEUR: 18 },
  { id: 'montreal', name: 'Grand Montréal / Québec', country: 'Canada', multiplier: 1.10, laborRateHourEUR: 58 },
  { id: 'london', name: 'Greater London / UK', country: 'Royaume-Uni', multiplier: 1.30, laborRateHourEUR: 65 },
];

export const ROOM_TEMPLATES: RoomTemplate[] = [
  { id: 'living', name: 'Séjour / Salon', category: 'living', defaultWidth: 5.5, defaultLength: 4.5, color: '#fef3c7', icon: 'Sofa' },
  { id: 'kitchen', name: 'Cuisine', category: 'kitchen', defaultWidth: 3.8, defaultLength: 3.2, color: '#dcfce7', icon: 'Utensils' },
  { id: 'master_bed', name: 'Chambre Parentale', category: 'bedroom', defaultWidth: 4.2, defaultLength: 3.8, color: '#e0e7ff', icon: 'BedDouble' },
  { id: 'bedroom', name: 'Chambre Standard', category: 'bedroom', defaultWidth: 3.5, defaultLength: 3.2, color: '#ede9fe', icon: 'Bed' },
  { id: 'bathroom', name: 'Salle d’eau / Bain', category: 'bathroom', defaultWidth: 2.8, defaultLength: 2.2, color: '#cffafe', icon: 'Bath' },
  { id: 'office', name: 'Bureau / Espace Pro', category: 'office', defaultWidth: 3.4, defaultLength: 3.0, color: '#f1f5f9', icon: 'Briefcase' },
  { id: 'pharmacy_disp', name: 'Zone Délivrance / Officine', category: 'commercial' as any, defaultWidth: 6.0, defaultLength: 4.5, color: '#ccfbf1', icon: 'Cross' },
  { id: 'storage_farm', name: 'Stockage Intrants / Récoltes', category: 'storage', defaultWidth: 6.0, defaultLength: 5.0, color: '#fae8ff', icon: 'Warehouse' },
  { id: 'terrace', name: 'Terrasse Couverte', category: 'outdoor', defaultWidth: 5.0, defaultLength: 3.0, color: '#ffedd5', icon: 'Sun' },
];

export function formatPrice(amountInEUR: number, currencyCode: string = 'EUR'): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.EUR;
  const converted = amountInEUR * config.rateToEUR;

  if (currencyCode === 'XOF') {
    return `${Math.round(converted).toLocaleString('fr-FR')} ${config.symbol}`;
  }

  return `${converted.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} ${config.symbol}`;
}
