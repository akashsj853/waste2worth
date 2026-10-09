import { WasteCategory } from './waste';

export type ListingType = 'supply' | 'demand';

export type MaterialCondition =
  | 'clean_sorted'
  | 'usable_intact'
  | 'requires_cleaning'
  | 'raw_unprocessed'
  | 'shredded';

export interface ExchangeListing {
  id: string;
  type: ListingType; // 'supply' (available surplus) or 'demand' (wanted)
  title: string;
  category: WasteCategory;
  quantity: number;
  unit: 'kg' | 'units' | 'pallets' | 'drums' | 'liters' | 'meters';
  condition: MaterialCondition;
  description: string;
  location: string;
  organization: string;
  contactPerson: string;
  contactEmail: string;
  intendedPathway: string;
  timestamp: string;
  status: 'active' | 'matched' | 'completed';
}

export interface ExchangeMatch {
  id: string;
  supplyListing: ExchangeListing;
  demandListing: ExchangeListing;
  compatibilityScore: number; // 0 to 100%
  matchRationale: string;
  logisticsAdvice: string;
  estimatedWasteAvoidedKg: number;
  estimatedCostSavedUsd: number;
}
