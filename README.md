# Waste2Worth AI — From Waste Identification to Environmental Action

> **Tagline:** *"Identify it. Recover its value. Measure the impact."*

An AI-powered circular decision-support, material exchange, and sustainability accounting system designed for households, college hostels, dining canteens, and campus communities.

---

## 1. Problem Statement & Motivation

Traditional computer vision recycling apps stop at coarse identification (e.g., labeling an object as "cardboard" or "plastic"). In reality:
1. **Contamination Destroys Batches:** An unrinsed greasy pizza box ruins dry paper recycling pulping vats; yet that same box is an excellent carbonaceous "brown" for aerobic composting.
2. **False Claims ("Wish-cycling"):** Merely pointing a camera at a bottle does not mean it was diverted from a landfill.
3. **Safety-Critical Hazards:** Placing swollen lithium batteries or electronics in standard bins leads to catastrophic collection vehicle compactor fires.
4. **Organic Resource Underutilization:** Dining hall food prep scraps are dumped into anaerobic landfills, generating methane rather than being composted into agricultural humus.
5. **Linear Disposal vs. Circular Exchange:** Departments discard useful materials (wood pallets, spent coffee grounds, HDPE containers) while adjacent labs purchase virgin equivalents.

**Waste2Worth AI solves this** by coupling multimodal vision inference with a **deterministic rules engine**, an **organic compost yield model**, a **Circular Resource Exchange**, an **AI Sustainability Advisor**, and an **auditable 4-Tier verification ledger**.

---

## 2. System Architecture

```text
+-----------------------------------------------------------------------------------+
|                              WASTE2WORTH AI ARCHITECTURE                          |
+-----------------------------------------------------------------------------------+

[ Client Frontend: React 19 + TypeScript + Tailwind CSS 4 ]
 │   ├── CameraUpload.tsx (Drag-drop / Live getUserMedia webcam / 8 Curated Samples)
 │   ├── RecommendationCard.tsx (Uncertainty threshold, Human-in-the-loop override)
 │   ├── ExchangeView.tsx (Circular Resource Exchange, Synergy Match Engine)
 │   ├── AssistantView.tsx (Conversational AI Advisor grounded in audit context)
 │   ├── CompostView.tsx (Biological mass balance, C:N ratio, Agronomy guide)
 │   ├── ImpactLedgerView.tsx (4-tier verification funnel, EPA WARM baseline)
 │   └── HistoryView.tsx (Searchable audit trail, JSON/CSV export)
 │
 ▼
[ AI Inference Layer: Multimodal Vision & Conversation Pipeline ]
 │   ├── Server-Side: Vite Middleware (/api/classify, /api/assistant)
 │   │   └── @google/genai SDK (Gemini 3.8 Flash, strict responseSchema JSON)
 │   └── Client-Side: FallbackClassifier (100% resilient offline fallback)
 │
 ▼
[ Smart Waste Decision Engine: Deterministic & Rule-Based ]
 │   ├── WasteRulesEngine.ts (Evaluates confidence, contamination, battery hazard)
 │   └── disposal_rules.json (8 material streams, preparation protocol)
 │
 ▼
[ Circular Matching & Mathematical Aggregation Engines ]
 │   ├── CircularMatchingEngine.ts (Semantic pairing for supply and demand listings)
 │   ├── CompostEstimator.ts (Yield = input * 0.30; 55-70% mass loss model)
 │   └── ImpactCalculator.ts (4-tier ledger funnel, avoided GHG emissions, financial savings)
 │
 ▼
[ Persistence Layer: Local Persistent Storage ]
     └── DatabaseService.ts (Versioned schema, seed records, CSV/JSON export)
```

---

## 3. Key Capabilities & Differentiators

### A. Multimodal Vision with Uncertainty Guardrails
- Analyzes items into standard categories:
  - `Organic food scraps`
  - `Plastic` (PET #1, HDPE #2, PP #5, Films)
  - `Paper and cardboard`
  - `Metal` (Aluminum, Tinplate steel)
  - `Glass` (Cullet container glass)
  - `Textile` (Cotton, Synthetics)
  - `Electronic waste` (WEEE, Lithium cells)
  - `Other or unknown`
- Configurable **Uncertainty Threshold** (default: `0.70` / 70%): When confidence is below threshold, the system flags `Human Verification Required` rather than hallucinating unsafe directions.

### B. Deterministic Smart Decision Engine
- **Decoupled from LLM hallucinations:** Safety-critical routing is governed by deterministic rules.
- Detects food contamination on paper (reroutes greasy cardboard to composting).
- Enforces strict isolation for hazardous lithium battery chemistries.
- Generates actionable preparation steps (e.g. cold rinse, bottle flattening, removing non-recyclable caps).

### C. Circular Resource Exchange & Matching Engine
- Connects departmental material supply (surplus) with demand (wanted resources):
  - Spent coffee grounds (Dining Hall) ➔ Mushroom cultivation substrate (Biology Lab)
  - Shredded cardboard (Receiving Logistics) ➔ Compost carbon mulch (Community Garden)
  - HT Wooden pallets (Engineering Bay) ➔ Raised garden planter beds (Hostel Council)
  - Clean 20L HDPE drums (Chemistry Stores) ➔ Drip irrigation reservoirs (Permaculture Orchard)
- Automated compatibility scoring engine based on material grade, condition, quantity, and campus logistics routes.

### D. AI Sustainability & Segregation Advisor
- Conversational chat powered by server-side Gemini 3.8 Flash (`/api/assistant`).
- Grounded in live audit metrics, compost chemistry ($25:1$ to $30:1$ C:N ratios), and local segregation rules.
- Provides practical, actionable answers to common disposal queries and troubleshooting.

### E. Organic Waste & Agriculture Module
- Connects dining hall organics directly to soil restoration.
- Formula:
  $$\text{Estimated Compost Output} = \text{Confirmed Organic Input} \times \text{Yield Fraction (default 0.30)}$$
- Explains biological mass balance: 55% to 70% of initial wet mass dissipates as moisture vapor ($H_2O$) and microbial respiration ($CO_2$).
- Provides agronomic application advice ($1 \text{ kg compost treats } \sim 1.5 \text{ m}^2 \text{ soil}$) and phytotoxicity warnings against applying uncured compost.

### F. 4-Tier Sustainability Audit Ledger & Financial Modeling
Strictly separates:
1. **Tier 1 — AI-Classified Waste:** Raw vision detection volume.
2. **Tier 2 — User-Confirmed Waste:** Validated by human inspection (tracking correction rates).
3. **Tier 3 — Sent to Destination:** Material handed off to a composter or recycling bin.
4. **Tier 4 — Facility Verified Outcome:** Independently confirmed at campus compost station or foundry depot.
- **Economic Value Accounting:** Models landfill tipping fees avoided ($85/tonne) and recovered secondary commodity value.

---

## 4. Quick Start & Setup

### Prerequisites
- Node.js 18+ or npm
- Optional: `GEMINI_API_KEY` for live Google GenAI inference (fallback classifier and advisor operate seamlessly if offline or without a key)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-team/waste2worth-ai.git
cd waste2worth-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will launch at `http://localhost:3000`.

---

## 5. Automated Tests

Run the complete test suite:
```bash
npm test
# Or directly via tsx:
npx tsx tests/run_all_tests.ts
```

### Verified Test Coverage (54/54 Passing):
- Category mapping and rule coverage across all 8 waste streams
- Unsupported model labels fallback to conservative actions
- Confidence threshold and uncertainty guardrails
- Battery safety and hazardous material handling
- Contaminated pizza box rerouting from paper recycling to compost
- Compost yield calculations, boundary clamping (0.15 to 0.45), and negative input handling
- Empty database resilience
- 4-Tier ledger metric separation and human correction rate tracking
- End-to-end scan-to-recommendation integration workflow
- Circular Resource Matching Engine (compatibility scoring and intra-campus logistics)
- Economic financial savings valuation (tipping fees & commodity recovery)

---

## 6. Two-Minute Judge Demonstration Script

| Timestamp | Screen / Action | Script |
|---|---|---|
| **0:00 - 0:30** | Home Dashboard | *"Judges, most recycling apps fail because they stop at image labels and hallucinate rules. If you scan an oily pizza box, apps say 'Recycle!' But grease ruins paper recycling vats. We built Waste2Worth AI: Identify it, Recover its value, and Measure the impact."* |
| **0:30 - 1:00** | AI Scanner (Select "Pizza Box" sample) | *"Watch our live scanner. Our multimodal vision spots the food grease and yields a 64% confidence score. Because it's below our 70% threshold, it triggers an Uncertainty Guardrail! Our deterministic rules engine reroutes the greasy unbleached cardboard away from paper recycling and into the Organic Composting Route as a carbonaceous brown."* |
| **1:00 - 1:25** | Circular Exchange | *"Beyond bins, we unlock circular value: our Circular Resource Exchange matches cafeteria spent espresso grounds to the biology department's oyster mushroom lab, and packaging pallets to student garden beds, cutting campus procurement costs."* |
| **1:25 - 1:45** | Compost Module & Advisor | *"We close the loop with science. 0.42 kg of food waste is modeled at 30% biological yield, generating finished humus that feeds campus topsoil. Users can consult our AI Sustainability Advisor for real-time compost chemistry troubleshooting."* |
| **1:45 - 2:00** | Impact Ledger & Audit Log | *"Finally, our Sustainability Ledger enforces a strict 4-Tier verification funnel: Scanned vs. Confirmed vs. Diverted vs. Facility-Verified. We distinguish real measured weights from life-cycle emission baselines. Waste2Worth AI turns messy waste into verified circular value."* |

---

## 7. Known Limitations & Future Roadmap

1. **2D Visual Occlusion:** Optical cameras cannot detect internal multi-layer foil laminates (e.g. inside aseptic cartons). The app mandates human confirmation when uncertain.
2. **Variable Feedstock Yields:** Watermelon rinds yield ~15% finished compost, while fibrous yard trimmings yield ~40%.
3. **Future Hardware Roadmap:** Integration with Bluetooth load-cell scales (BLE smart scales) on cafeteria sorting lines for zero-click automatic weight capture.
