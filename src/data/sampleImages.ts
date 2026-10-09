import { WasteCategory, ContaminationStatus } from '../types/waste';

export interface SampleWasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  suggestedWeightKg: number;
  composition: string;
  contaminationStatus: ContaminationStatus;
  notes: string;
  badge: string;
  svgIcon: string; // Clean vector data url representing the item
}

export const SAMPLE_WASTE_ITEMS: SampleWasteItem[] = [
  {
    id: 'sample-banana',
    name: 'Banana Peel & Fruit Scraps',
    category: 'Organic food scraps',
    suggestedWeightKg: 0.35,
    composition: 'Musa fruit epicarp with moisture content > 75%, rich in potassium and organic nitrogen.',
    contaminationStatus: 'clean',
    notes: 'Household kitchen prep scrap. High moisture, easily digestible by compost microbes.',
    badge: 'Compost Hero',
    svgIcon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FEF9C3"/><path d="M25,75 C35,78 65,75 80,45 C85,35 85,25 80,20 C75,22 72,30 65,42 C50,65 35,68 25,75 Z" fill="%23EAB308" stroke="%23CA8A04" stroke-width="2.5"/><circle cx="28" cy="74" r="3" fill="%23854D0E"/><circle cx="78" cy="22" r="2.5" fill="%23854D0E"/><path d="M40,65 C55,60 70,45 75,32" stroke="%23854D0E" stroke-width="1.5" stroke-dasharray="2,3" fill="none"/></svg>`,
  },
  {
    id: 'sample-bottle',
    name: 'PET Water Bottle (Clean)',
    category: 'Plastic',
    suggestedWeightKg: 0.04,
    composition: 'Clear Polyethylene Terephthalate (#1 PETE) with blue HDPE bottle cap.',
    contaminationStatus: 'clean_rinsed',
    notes: 'Clean post-consumer drinking water container, easily flaked and extruded into rPET pellets.',
    badge: 'Recyclable #1',
    svgIcon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23E0F2FE"/><rect x="42" y="15" width="16" height="8" rx="2" fill="%230284C7"/><path d="M40,23 L60,23 L68,36 L68,82 C68,85 65,88 62,88 L38,88 C35,88 32,85 32,82 L32,36 Z" fill="%23BAE6FD" stroke="%230284C7" stroke-width="2.5"/><line x1="38" y1="50" x2="62" y2="50" stroke="%2338BDF8" stroke-width="1.5"/><line x1="38" y1="65" x2="62" y2="65" stroke="%2338BDF8" stroke-width="1.5"/><path d="M48,40 L52,40 L52,75 L48,75 Z" fill="%23FFFFFF" opacity="0.6"/></svg>`,
  },
  {
    id: 'sample-cardboard',
    name: 'Corrugated Packaging Box',
    category: 'Paper and cardboard',
    suggestedWeightKg: 0.45,
    composition: 'Unbleached double-wall kraft corrugated containerboard fiber.',
    contaminationStatus: 'clean',
    notes: 'Online delivery box, tape removed, dry, suitable for mill repulping.',
    badge: 'Dry Fiber',
    svgIcon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FEF3C7"/><polygon points="50,18 85,34 50,50 15,34" fill="%23D97706"/><polygon points="15,34 50,50 50,82 15,66" fill="%23B45309"/><polygon points="85,34 50,50 50,82 85,66" fill="%2392400E"/><line x1="50" y1="18" x2="50" y2="50" stroke="%2378350F" stroke-width="2"/></svg>`,
  },
  {
    id: 'sample-can',
    name: 'Aluminum Beverage Can',
    category: 'Metal',
    suggestedWeightKg: 0.015,
    composition: 'Lightweight wrought aluminum 3004 alloy body with 5182 alloy lid and tab.',
    contaminationStatus: 'clean_rinsed',
    notes: 'Infinite circularity metal. Recycled can returns to store shelf in 60 days.',
    badge: 'Infinite Metal',
    svgIcon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23F1F5F9"/><ellipse cx="50" cy="25" rx="22" ry="7" fill="%2394A3B8"/><path d="M28,25 L28,75 C28,82 72,82 72,75 L72,25 Z" fill="%23CBD5E1" stroke="%2364748B" stroke-width="2.5"/><ellipse cx="50" cy="25" rx="14" ry="4" fill="%2364748B"/><rect x="47" y="22" width="6" height="5" rx="1" fill="%23334155"/><line x1="36" y1="35" x2="36" y2="68" stroke="%23FFFFFF" stroke-width="3" opacity="0.6"/></svg>`,
  },
  {
    id: 'sample-jar',
    name: 'Flint Glass Salsa Jar',
    category: 'Glass',
    suggestedWeightKg: 0.26,
    composition: 'Clear soda-lime silicate container glass; reusable or 100% recyclable into cullet.',
    contaminationStatus: 'clean_rinsed',
    notes: 'Clean glass jar without lid. Melts infinitely without loss of purity.',
    badge: '100% Cullet',
    svgIcon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23ECFDF5"/><rect x="36" y="20" width="28" height="8" rx="2" fill="%2310B981"/><path d="M34,28 L66,28 L72,40 L72,78 C72,82 68,86 64,86 L36,86 C32,86 28,82 28,78 L28,40 Z" fill="%23A7F3D0" stroke="%23059669" stroke-width="2.5"/><path d="M35,42 L42,42 L42,75 L35,75 Z" fill="%23FFFFFF" opacity="0.7"/></svg>`,
  },
  {
    id: 'sample-shirt',
    name: 'Torn Cotton T-Shirt',
    category: 'Textile',
    suggestedWeightKg: 0.18,
    composition: '100% post-consumer carded cotton fabric with screenprint ink residue.',
    contaminationStatus: 'clean',
    notes: 'Wear-damaged cotton jersey. Suitable for laboratory wiping rags or fiber shredding.',
    badge: 'Upcycle Match',
    svgIcon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FDF2F8"/><path d="M35,22 L45,30 L55,30 L65,22 L82,35 L74,48 L68,44 L68,82 L32,82 L32,44 L26,48 L18,35 Z" fill="%23F472B6" stroke="%23DB2777" stroke-width="2.5"/><path d="M45,30 C45,36 55,36 55,30" fill="%23FDF2F8" stroke="%23DB2777" stroke-width="2"/><line x1="50" y1="52" x2="50" y2="72" stroke="%23BE185D" stroke-width="2" stroke-dasharray="3,3"/></svg>`,
  },
  {
    id: 'sample-cable',
    name: 'Broken Phone Charger & Cable',
    category: 'Electronic waste',
    suggestedWeightKg: 0.09,
    composition: 'FR-4 PCB with surface-mount capacitors + PVC copper charging cable.',
    contaminationStatus: 'clean',
    notes: 'High precious metal content (copper, gold trace). Must NOT enter regular bins.',
    badge: 'WEEE Depot',
    svgIcon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FFF1F2"/><rect x="25" y="45" width="30" height="30" rx="4" fill="%23E11D48"/><rect x="30" y="35" width="6" height="10" fill="%2394A3B8"/><rect x="44" y="35" width="6" height="10" fill="%2394A3B8"/><path d="M55,60 C75,60 75,30 85,30" stroke="%23BE123C" stroke-width="4" stroke-linecap="round" fill="none"/><rect x="80" y="24" width="12" height="12" rx="2" fill="%2364748B"/></svg>`,
  },
  {
    id: 'sample-pizzabox',
    name: 'Greasy Pizza Box (Contaminated)',
    category: 'Paper and cardboard',
    suggestedWeightKg: 0.42,
    composition: 'Kraft corrugated cardboard soaked with animal fat and melted mozzarella.',
    contaminationStatus: 'light_food_residue',
    notes: 'GREASY: Oil ruins paper recycling pulping vats. Directs to aerobic composting instead!',
    badge: 'Reroute to Compost',
    svgIcon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="20" fill="%23FFFBEB"/><rect x="20" y="35" width="60" height="45" rx="3" fill="%23B45309" stroke="%2378350F" stroke-width="2.5"/><polygon points="20,35 50,15 80,35" fill="%23D97706" stroke="%2378350F" stroke-width="2.5"/><circle cx="50" cy="55" r="14" fill="%23F59E0B"/><circle cx="45" cy="52" r="3" fill="%23DC2626"/><circle cx="56" cy="58" r="2.5" fill="%23DC2626"/><circle cx="52" cy="50" r="2" fill="%2316A34A"/></svg>`,
  },
];
