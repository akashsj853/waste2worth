import { ScanRecord, WasteCategory, DestinationStatus, VerificationStage } from '../types/waste';
import { ExchangeListing } from '../types/exchange';
import { BackgroundSettings, DEFAULT_BACKGROUND_SETTINGS } from '../types/background';
import { defaultRulesEngine } from '../engine/wasteRules';
import { INITIAL_EXCHANGE_LISTINGS } from '../data/sampleExchangeListings';

const STORAGE_KEY = 'waste2worth_scans_v1';
const SETTINGS_KEY = 'waste2worth_settings_v1';
const EXCHANGE_KEY = 'waste2worth_exchange_v1';

export interface AppSettings {
  uncertaintyThreshold: number; // default 0.70
  compostYieldFraction: number; // default 0.30
  showDemoRecords: boolean;
  background: BackgroundSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  uncertaintyThreshold: 0.70,
  compostYieldFraction: 0.30,
  showDemoRecords: true,
  background: DEFAULT_BACKGROUND_SETTINGS,
};

// Realistic seed records spanning household, campus canteen, and dorm environments
export const INITIAL_DEMO_RECORDS: ScanRecord[] = [
  {
    id: 'scan-demo-101',
    timestamp: '2026-10-07T08:15:00.000Z',
    predictedCategory: 'Organic food scraps',
    confidenceScore: 0.94,
    alternativePredictions: [
      { category: 'Organic food scraps', confidence: 0.94 },
      { category: 'Other or unknown', confidence: 0.04 },
      { category: 'Paper and cardboard', confidence: 0.02 },
    ],
    isUncertain: false,
    uncertaintyThresholdUsed: 0.70,
    detectedItemName: 'Overripe Banana Peel & Orange Rinds',
    compositionDetail: 'Raw fruit biomass high in potassium, moisture (78%), and nitrogen.',
    contaminationStatus: 'clean',
    userConfirmedCategory: 'Organic food scraps',
    userCorrected: false,
    reviewStatus: 'confirmed',
    recommendation: defaultRulesEngine.evaluate({
      category: 'Organic food scraps',
      confidence: 0.94,
      contaminationStatus: 'clean',
      isUserConfirmed: true,
    }),
    recordedWeightKg: 1.45,
    destinationStatus: 'sent_to_compost',
    verificationStage: 'facility_verified',
    isVerifiedOutcome: true,
    estimatedCompostYieldKg: 0.44,
    estimatedAvoidedCo2Kg: 0.73,
    isDemoRecord: true,
    notes: 'Canteen breakfast prep waste. Weighed on canteen kitchen scale and deposited into campus aerated compost tumbler #1.',
  },
  {
    id: 'scan-demo-102',
    timestamp: '2026-10-07T10:30:00.000Z',
    predictedCategory: 'Plastic',
    confidenceScore: 0.89,
    alternativePredictions: [
      { category: 'Plastic', confidence: 0.89 },
      { category: 'Glass', confidence: 0.08 },
      { category: 'Metal', confidence: 0.03 },
    ],
    isUncertain: false,
    uncertaintyThresholdUsed: 0.70,
    detectedItemName: 'Clear PET Water Bottle (1.5L)',
    compositionDetail: 'Polyethylene Terephthalate (#1 PETE) with HDPE blue screw cap.',
    contaminationStatus: 'clean_rinsed',
    userConfirmedCategory: 'Plastic',
    userCorrected: false,
    reviewStatus: 'confirmed',
    recommendation: defaultRulesEngine.evaluate({
      category: 'Plastic',
      confidence: 0.89,
      contaminationStatus: 'clean_rinsed',
      isUserConfirmed: true,
    }),
    recordedWeightKg: 0.045,
    destinationStatus: 'sent_to_recycler',
    verificationStage: 'destination_logged',
    isVerifiedOutcome: false,
    estimatedCompostYieldKg: 0,
    estimatedAvoidedCo2Kg: 0.056,
    isDemoRecord: true,
    notes: 'Student library common area. Rinsed and deposited into blue plastics container.',
  },
  {
    id: 'scan-demo-103',
    timestamp: '2026-10-07T13:45:00.000Z',
    predictedCategory: 'Paper and cardboard',
    confidenceScore: 0.62, // Low confidence -> triggers uncertainty review!
    alternativePredictions: [
      { category: 'Paper and cardboard', confidence: 0.62 },
      { category: 'Organic food scraps', confidence: 0.28 },
      { category: 'Other or unknown', confidence: 0.10 },
    ],
    isUncertain: true,
    uncertaintyThresholdUsed: 0.70,
    detectedItemName: 'Takeaway Pizza Box with Oily Cheese Stains',
    compositionDetail: 'Corrugated unbleached kraft paperboard stained with vegetable oil and cheese.',
    contaminationStatus: 'light_food_residue',
    userConfirmedCategory: 'Paper and cardboard',
    userCorrected: false,
    reviewStatus: 'confirmed',
    recommendation: defaultRulesEngine.evaluate({
      category: 'Paper and cardboard',
      confidence: 0.62,
      contaminationStatus: 'light_food_residue',
      isUserConfirmed: true,
    }),
    recordedWeightKg: 0.38,
    destinationStatus: 'sent_to_compost',
    verificationStage: 'destination_logged',
    isVerifiedOutcome: false,
    estimatedCompostYieldKg: 0.11,
    estimatedAvoidedCo2Kg: 0.19,
    isDemoRecord: true,
    notes: 'Hostel pizza night. Clean top lid torn for dry paper recycling; greasy base torn and placed into compost bin as carbonaceous brown.',
  },
  {
    id: 'scan-demo-104',
    timestamp: '2026-10-07T16:20:00.000Z',
    predictedCategory: 'Metal',
    confidenceScore: 0.96,
    alternativePredictions: [
      { category: 'Metal', confidence: 0.96 },
      { category: 'Plastic', confidence: 0.03 },
      { category: 'Other or unknown', confidence: 0.01 },
    ],
    isUncertain: false,
    uncertaintyThresholdUsed: 0.70,
    detectedItemName: 'Crushed Aluminum Soda Can (330ml)',
    compositionDetail: 'Wrought 3004 aluminum alloy with pull-tab.',
    contaminationStatus: 'clean_rinsed',
    userConfirmedCategory: 'Metal',
    userCorrected: false,
    reviewStatus: 'confirmed',
    recommendation: defaultRulesEngine.evaluate({
      category: 'Metal',
      confidence: 0.96,
      contaminationStatus: 'clean_rinsed',
      isUserConfirmed: true,
    }),
    recordedWeightKg: 0.015,
    destinationStatus: 'sent_to_recycler',
    verificationStage: 'facility_verified',
    isVerifiedOutcome: true,
    estimatedCompostYieldKg: 0,
    estimatedAvoidedCo2Kg: 0.032,
    isDemoRecord: true,
    notes: 'Collected by campus green club metal salvage program. Delivered to certified aluminum foundry.',
  },
  {
    id: 'scan-demo-105',
    timestamp: '2026-10-08T09:10:00.000Z',
    predictedCategory: 'Electronic waste',
    confidenceScore: 0.91,
    alternativePredictions: [
      { category: 'Electronic waste', confidence: 0.91 },
      { category: 'Plastic', confidence: 0.06 },
      { category: 'Metal', confidence: 0.03 },
    ],
    isUncertain: false,
    uncertaintyThresholdUsed: 0.70,
    detectedItemName: 'Swollen Li-Ion Phone Battery & Damaged USB-C Cable',
    compositionDetail: 'Lithium cobalt oxide (LCO) cell + copper-wired PVC jacket cable.',
    contaminationStatus: 'clean',
    userConfirmedCategory: 'Electronic waste',
    userCorrected: false,
    reviewStatus: 'confirmed',
    recommendation: defaultRulesEngine.evaluate({
      category: 'Electronic waste',
      confidence: 0.91,
      itemComposition: 'Lithium battery cell',
      isUserConfirmed: true,
    }),
    recordedWeightKg: 0.12,
    destinationStatus: 'sent_to_ewaste',
    verificationStage: 'facility_verified',
    isVerifiedOutcome: true,
    estimatedCompostYieldKg: 0,
    estimatedAvoidedCo2Kg: 0.38,
    isDemoRecord: true,
    notes: 'Terminals isolated with insulating tape. Dropped off at campus electronics department WEEE depot.',
  },
  {
    id: 'scan-demo-106',
    timestamp: '2026-10-08T11:50:00.000Z',
    predictedCategory: 'Glass',
    confidenceScore: 0.88,
    alternativePredictions: [
      { category: 'Glass', confidence: 0.88 },
      { category: 'Plastic', confidence: 0.09 },
      { category: 'Other or unknown', confidence: 0.03 },
    ],
    isUncertain: false,
    uncertaintyThresholdUsed: 0.70,
    detectedItemName: 'Flint Glass Olive Oil Jar (500ml)',
    compositionDetail: 'Soda-lime silicate container glass; steel tinplate lid.',
    contaminationStatus: 'clean_rinsed',
    userConfirmedCategory: 'Glass',
    userCorrected: false,
    reviewStatus: 'confirmed',
    recommendation: defaultRulesEngine.evaluate({
      category: 'Glass',
      confidence: 0.88,
      contaminationStatus: 'clean_rinsed',
      isUserConfirmed: true,
    }),
    recordedWeightKg: 0.28,
    destinationStatus: 'sent_to_recycler',
    verificationStage: 'destination_logged',
    isVerifiedOutcome: false,
    estimatedCompostYieldKg: 0,
    estimatedAvoidedCo2Kg: 0.098,
    isDemoRecord: true,
    notes: 'Rinsed with warm dishwater, metal lid removed for scrap bin.',
  },
  {
    id: 'scan-demo-107',
    timestamp: '2026-10-08T14:15:00.000Z',
    predictedCategory: 'Textile',
    confidenceScore: 0.58, // Low confidence -> Human-in-the-loop correction example!
    alternativePredictions: [
      { category: 'Textile', confidence: 0.58 },
      { category: 'Other or unknown', confidence: 0.24 },
      { category: 'Paper and cardboard', confidence: 0.18 },
    ],
    isUncertain: true,
    uncertaintyThresholdUsed: 0.70,
    detectedItemName: 'Worn 100% Cotton Campus T-shirt',
    compositionDetail: 'Pure ring-spun cotton staple fiber (unblended).',
    contaminationStatus: 'clean',
    userConfirmedCategory: 'Textile',
    userCorrected: true, // Demonstrating Human-in-the-loop correction!
    reviewStatus: 'corrected',
    recommendation: defaultRulesEngine.evaluate({
      category: 'Textile',
      confidence: 0.58,
      contaminationStatus: 'clean',
      isUserConfirmed: true,
    }),
    recordedWeightKg: 0.22,
    destinationStatus: 'reused_locally',
    verificationStage: 'destination_logged',
    isVerifiedOutcome: false,
    estimatedCompostYieldKg: 0,
    estimatedAvoidedCo2Kg: 0.83,
    isDemoRecord: true,
    notes: 'Cut into 6 reusable laboratory cleaning cloths instead of discarding.',
  },
  {
    id: 'scan-demo-108',
    timestamp: '2026-10-08T17:30:00.000Z',
    predictedCategory: 'Organic food scraps',
    confidenceScore: 0.95,
    alternativePredictions: [
      { category: 'Organic food scraps', confidence: 0.95 },
      { category: 'Other or unknown', confidence: 0.03 },
      { category: 'Textile', confidence: 0.02 },
    ],
    isUncertain: false,
    uncertaintyThresholdUsed: 0.70,
    detectedItemName: 'Brewed Espresso Coffee Grounds & Paper Filters',
    compositionDetail: 'Spent coffee grounds (pH ~6.5, C:N ~20:1) with unbleached paper filter.',
    contaminationStatus: 'clean',
    userConfirmedCategory: 'Organic food scraps',
    userCorrected: false,
    reviewStatus: 'confirmed',
    recommendation: defaultRulesEngine.evaluate({
      category: 'Organic food scraps',
      confidence: 0.95,
      contaminationStatus: 'clean',
      isUserConfirmed: true,
    }),
    recordedWeightKg: 2.10,
    destinationStatus: 'sent_to_compost',
    verificationStage: 'facility_verified',
    isVerifiedOutcome: true,
    estimatedCompostYieldKg: 0.63,
    estimatedAvoidedCo2Kg: 1.05,
    isDemoRecord: true,
    notes: 'Collected from campus coffee shop. Combined with autumn leaves in vermicompost bin.',
  },
];

export class DatabaseService {
  public static getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          background: {
            ...DEFAULT_BACKGROUND_SETTINGS,
            ...(parsed.background || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = DatabaseService.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
    return updated;
  }

  public static getRecords(): ScanRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with default demo records
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
        return INITIAL_DEMO_RECORDS;
      }
      const parsed: ScanRecord[] = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to read records from database', e);
      return [];
    }
  }

  public static addRecord(record: ScanRecord): ScanRecord[] {
    const existing = DatabaseService.getRecords();
    const updated = [record, ...existing];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save new record', e);
    }
    return updated;
  }

  public static updateRecord(id: string, updates: Partial<ScanRecord>): ScanRecord[] {
    const existing = DatabaseService.getRecords();
    const updated = existing.map((rec) => (rec.id === id ? { ...rec, ...updates } : rec));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update record', e);
    }
    return updated;
  }

  public static deleteRecord(id: string): ScanRecord[] {
    const existing = DatabaseService.getRecords();
    const updated = existing.filter((rec) => rec.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete record', e);
    }
    return updated;
  }

  public static resetToDemoData(): ScanRecord[] {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
    } catch (e) {
      console.error('Failed to reset demo data', e);
    }
    return INITIAL_DEMO_RECORDS;
  }

  public static clearAllData(): ScanRecord[] {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (e) {
      console.error('Failed to clear database', e);
    }
    return [];
  }

  public static exportAsJson(): string {
    const records = DatabaseService.getRecords();
    return JSON.stringify(records, null, 2);
  }

  public static exportAsCsv(): string {
    const records = DatabaseService.getRecords();
    if (records.length === 0) return '';
    const headers = [
      'ID',
      'Timestamp',
      'Predicted Category',
      'Confidence',
      'Confirmed Category',
      'Review Status',
      'Weight (kg)',
      'Destination Status',
      'Verification Stage',
      'Verified Outcome',
      'Avoided CO2 (kg)',
      'Is Demo Record',
      'Item Name',
    ];

    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.timestamp}"`,
      `"${r.predictedCategory}"`,
      r.confidenceScore.toFixed(3),
      `"${r.userConfirmedCategory}"`,
      `"${r.reviewStatus}"`,
      r.recordedWeightKg.toFixed(2),
      `"${r.destinationStatus}"`,
      `"${r.verificationStage}"`,
      r.isVerifiedOutcome ? 'true' : 'false',
      r.estimatedAvoidedCo2Kg.toFixed(2),
      r.isDemoRecord ? 'true' : 'false',
      `"${r.detectedItemName.replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // --- Circular Resource Exchange Storage ---
  public static getExchangeListings(): ExchangeListing[] {
    try {
      const data = localStorage.getItem(EXCHANGE_KEY);
      if (!data) {
        localStorage.setItem(EXCHANGE_KEY, JSON.stringify(INITIAL_EXCHANGE_LISTINGS));
        return INITIAL_EXCHANGE_LISTINGS;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_EXCHANGE_LISTINGS;
    } catch (e) {
      console.error('Failed to read exchange listings', e);
      return INITIAL_EXCHANGE_LISTINGS;
    }
  }

  public static addExchangeListing(listing: ExchangeListing): ExchangeListing[] {
    const existing = DatabaseService.getExchangeListings();
    const updated = [listing, ...existing];
    try {
      localStorage.setItem(EXCHANGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save exchange listing', e);
    }
    return updated;
  }

  public static updateExchangeListing(id: string, updates: Partial<ExchangeListing>): ExchangeListing[] {
    const existing = DatabaseService.getExchangeListings();
    const updated = existing.map((item) => (item.id === id ? { ...item, ...updates } : item));
    try {
      localStorage.setItem(EXCHANGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update exchange listing', e);
    }
    return updated;
  }

  public static resetExchangeListings(): ExchangeListing[] {
    try {
      localStorage.setItem(EXCHANGE_KEY, JSON.stringify(INITIAL_EXCHANGE_LISTINGS));
    } catch (e) {
      console.error('Failed to reset exchange listings', e);
    }
    return INITIAL_EXCHANGE_LISTINGS;
  }
}
