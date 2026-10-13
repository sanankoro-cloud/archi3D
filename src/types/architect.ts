export type Currency = 'EUR' | 'USD' | 'XOF' | 'CAD' | 'GBP' | 'MAD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  rateToEUR: number; // 1 EUR = rateToEUR in this currency
}

export interface CityCostIndex {
  id: string;
  name: string;
  country: string;
  multiplier: number; // relative to base (1.0 = standard european average)
  laborRateHourEUR: number;
}

export interface RoomTemplate {
  id: string;
  name: string;
  category: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'storage' | 'outdoor';
  defaultWidth: number; // meters
  defaultLength: number; // meters
  color: string;
  icon: string;
}

export interface RoomInstance {
  id: string;
  name: string;
  templateId?: string;
  x: number; // meters from origin
  y: number; // meters from origin
  width: number; // meters
  length: number; // meters
  height: number; // ceiling height, meters (default 2.6m)
  color: string;
  floorMaterial: string;
  wallMaterial: string;
}

export interface WallSegment {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  thickness: number; // meters (e.g. 0.20m exterior, 0.10m interior)
  height: number; // meters
  isExterior: boolean;
}

export interface OpeningInstance {
  id: string;
  type: 'door' | 'window' | 'bay_window';
  name: string;
  wallId?: string;
  x: number;
  y: number;
  width: number; // meters
  height: number; // meters
  elevation: number; // sill height from floor
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  width: number;
  length: number;
  rotation: number;
  icon: string;
}

export interface BOQItem {
  id: string;
  category: 'gros_oeuvre' | 'second_oeuvre' | 'finitions' | 'menuiseries' | 'fluides_elec';
  code: string;
  designation: string;
  unit: 'm³' | 'm²' | 'ml' | 'u' | 'kg' | 'forfait';
  quantity: number;
  wasteMarginPercent?: number; // e.g. 10% for tiling
  unitPriceEUR: number;
  totalPriceEUR: number;
  formulaDescription: string;
}

export interface ScheduleTask {
  id: string;
  phase: 'preparations' | 'fondations' | 'gros_oeuvre' | 'clos_couvert' | 'second_oeuvre' | 'finitions' | 'reception';
  title: string;
  durationDays: number;
  progressPercent: number;
  status: 'todo' | 'in_progress' | 'completed' | 'delayed';
  budgetEstimatedEUR: number;
  budgetActualEUR: number;
  responsible: string;
}

export interface ProjectData {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'agricultural' | 'pharmacy';
  location: string;
  currency: Currency;
  cityCostIndexId: string;
  rooms: RoomInstance[];
  walls: WallSegment[];
  openings: OpeningInstance[];
  furniture: FurnitureItem[];
  tasks: ScheduleTask[];
  terrain: {
    width: number;
    length: number;
    orientationNorthDeg: number;
    slopePercent: number;
  };
}
