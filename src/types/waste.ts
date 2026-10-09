export type WasteCategory =
  | 'Organic food scraps'
  | 'Plastic'
  | 'Paper and cardboard'
  | 'Metal'
  | 'Glass'
  | 'Textile'
  | 'Electronic waste'
  | 'Other or unknown';

export const WASTE_CATEGORIES: WasteCategory[] = [
  'Organic food scraps',
  'Plastic',
  'Paper and cardboard',
  'Metal',
  'Glass',
  'Textile',
  'Electronic waste',
  'Other or unknown',
];

export type ContaminationStatus =
  | 'clean_rinsed'
  | 'clean'
  | 'light_food_residue'
  | 'heavily_soiled'
  | 'mixed_materials';

export type DisposalAction =
  | 'Organic Composting Route'
  | 'Recycling Collection'
  | 'Reuse & Repurpose'
  | 'Specialized E-Waste Drop-off'
  | 'Textile Upcycling / Drop-off'
  | 'Residual Waste Disposal'
  | 'Human Verification Required'
  | 'Hazardous Material Handling';

export interface PredictionCandidate {
  category: WasteCategory;
  confidence: number; // 0.0 to 1.0
  reasoning?: string;
}

export interface AIClassificationResult {
  predictedCategory: WasteCategory;
  confidenceScore: number; // 0.0 to 1.0 (raw model score)
  alternativePredictions: PredictionCandidate[];
  isUncertain: boolean;
  detectedItemName: string;
  compositionDetail: string;
  contaminationStatus: ContaminationStatus;
  visualNotes: string;
  source: 'gemini_vision' | 'fallback_inference';
}

export interface DecisionResult {
  action: DisposalAction;
  explanation: string;
  handlingCaution: string;
  preparationSteps: string[];
  localRuleVerificationRequired: boolean;
  isProvisional: boolean;
  potentialValueRoute: string;
  compostEligible: boolean;
  recyclableEligible: boolean;
}

export type DestinationStatus =
  | 'unspecified'
  | 'sent_to_compost'
  | 'sent_to_recycler'
  | 'reused_locally'
  | 'sent_to_ewaste'
  | 'sent_to_landfill';

export type VerificationStage =
  | 'scanned'            // Concept 1: AI-classified waste
  | 'user_confirmed'     // Concept 2: User-confirmed waste
  | 'destination_logged' // Concept 3: Waste recorded as sent to destination
  | 'facility_verified'; // Concept 4: Destination/outcome independently verified

export interface ScanRecord {
  id: string;
  timestamp: string; // ISO string
  imagePreviewUrl?: string;
  predictedCategory: WasteCategory;
  confidenceScore: number;
  alternativePredictions: PredictionCandidate[];
  isUncertain: boolean;
  uncertaintyThresholdUsed: number;
  detectedItemName: string;
  compositionDetail: string;
  contaminationStatus: ContaminationStatus;
  userConfirmedCategory: WasteCategory;
  userCorrected: boolean;
  reviewStatus: 'automated' | 'confirmed' | 'corrected';
  recommendation: DecisionResult;
  recordedWeightKg: number;
  destinationStatus: DestinationStatus;
  verificationStage: VerificationStage;
  isVerifiedOutcome: boolean;
  estimatedCompostYieldKg: number;
  estimatedAvoidedCo2Kg: number;
  isDemoRecord: boolean;
  notes?: string;
}

export interface DisposalRuleDefinition {
  category: WasteCategory;
  defaultAction: DisposalAction;
  title: string;
  explanation: string;
  cautions: string;
  prepSteps: string[];
  requiresLocalCheck: boolean;
  compostEligible: boolean;
  recyclableEligible: boolean;
  carbonFactorKgCo2PerKg: number;
  contaminationOverrideAction?: DisposalAction;
}

export interface CompostParameters {
  assumedYieldFraction: number; // e.g. 0.30 (30%)
  feedstockType: 'kitchen_scraps' | 'yard_trimmings' | 'canteen_mixed' | 'coffee_grounds';
  moistureCondition: 'ideal' | 'too_dry' | 'too_wet';
}
