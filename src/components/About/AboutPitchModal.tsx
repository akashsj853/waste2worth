import React, { useState } from 'react';
import {
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Clock,
  Shield,
  BookOpen,
} from 'lucide-react';

export const AboutPitchView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'pitch' | 'architecture' | 'limitations'>('pitch');

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-700">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Hackathon Documentation & Pitch
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
          About Waste2Worth AI & Live Pitch Script
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Full technical disclosure, software architecture, mathematical baselines, and a rehearsed 2-minute live demonstration script for hackathon evaluators.
        </p>

        {/* Tab switcher */}
        <div className="flex gap-2 pt-2 border-t border-stone-100">
          <button
            onClick={() => setActiveSection('pitch')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeSection === 'pitch'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🎤 2-Minute Judge Pitch Script
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeSection === 'architecture'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            🏛️ Software Architecture
          </button>
          <button
            onClick={() => setActiveSection('limitations')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
              activeSection === 'limitations'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            ⚠️ Limitations & Future Work
          </button>
        </div>
      </div>

      {/* Section 1: 2-Minute Judge Pitch Script */}
      {activeSection === 'pitch' && (
        <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-stone-100 border border-stone-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                The 2-Minute Hackathon Demonstration Script
              </h2>
              <p className="text-xs text-stone-400">
                Paced script designed for live presentation to judges
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
              120 Seconds
            </span>
          </div>

          <div className="space-y-6">
            {/* 0:00 - 0:30 */}
            <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 block">
                [0:00 - 0:30] The Hook & The Critical Problem
              </span>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic">
                "Judges, most recycling apps suffer from two fatal flaws: they stop at object identification, and they hallucinate safety-critical rules. If you point an AI at an oily pizza box, it says 'Cardboard: Recycle!' But that oil contaminates entire paper recycling vats. And when students scan a plastic bottle, apps claim 'Saved 20g of plastic!' with zero proof it ever reached a recycler.
                <br />
                We built <strong>Waste2Worth AI</strong> to fix this: <em>Identify it. Recover its value. Measure the impact.</em>"
              </p>
            </div>

            {/* 0:30 - 1:00 */}
            <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700 space-y-2">
              <span className="text-xs font-mono font-bold text-teal-400 block">
                [0:30 - 1:00] Live Multimodal Scan & Uncertainty Guardrail
              </span>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic">
                "Watch our live scanner in action. <em>(Click 'Pizza Box' sample or upload)</em> Notice how our vision model spots the grease contamination and outputs a 64% confidence score. Because it's below our 70% threshold, it triggers an <strong>Uncertainty Guardrail</strong> rather than guessing blindly!
                Our deterministic decision engine then safely reroutes the greasy unbleached cardboard away from paper recycling and into the <strong>Organic Composting Route</strong> as a carbonaceous brown."
              </p>
            </div>

            {/* 1:00 - 1:30 */}
            <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700 space-y-2">
              <span className="text-xs font-mono font-bold text-lime-400 block">
                [1:00 - 1:30] Closed-Loop Compost & Agricultural Connection
              </span>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic">
                "Next, we close the loop. We enter the actual weight — 0.42 kg — and select 'Sent to Compost Tumbler'. Our Organic Agriculture engine immediately calculates the mass balance: at a 30% yield, 70% mass dissipates as moisture and CO₂, yielding 0.13 kg of finished microbial humus. It even calculates that this treats 0.2 m² of our campus garden soil."
              </p>
            </div>

            {/* 1:30 - 2:00 */}
            <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 block">
                [1:30 - 2:00] The 4-Tier Audit Ledger & Impact
              </span>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic">
                "Finally, look at our <strong>Sustainability Impact Ledger</strong>. We enforce a strict 4-Tier verification funnel: Scanned vs. Confirmed vs. Diverted vs. Facility-Verified. We distinguish real measured weights from life-cycle emission estimates based on EPA WARM baselines.
                Waste2Worth AI transforms messy campus and household waste into verified circular value. Thank you!"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Software Architecture */}
      {activeSection === 'architecture' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              End-to-End System Architecture
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Clean separation of visual inference, deterministic logic, and persistent storage
            </p>
          </div>

          <div className="bg-stone-900 text-stone-200 p-6 rounded-2xl font-mono text-xs overflow-x-auto space-y-4">
            <p className="text-emerald-400 font-bold">
              +-----------------------------------------------------------------------------------+
            </p>
            <p className="text-emerald-400 font-bold">
              |                              WASTE2WORTH AI ARCHITECTURE                          |
            </p>
            <p className="text-emerald-400 font-bold">
              +-----------------------------------------------------------------------------------+
            </p>
            <p>
              [ Frontend Layer: React 19 + TypeScript + Tailwind CSS 4 ]
              <br />
              │   ├── CameraUpload.tsx (Drag-drop / Live getUserMedia / 8 Sample presets)
              <br />
              │   ├── RecommendationCard.tsx (Uncertainty threshold, Human-in-loop override)
              <br />
              │   ├── CompostView.tsx (Biological mass balance, C:N ratio, Agronomy guide)
              <br />
              │   ├── ImpactLedgerView.tsx (4-tier verification funnel, EPA WARM baseline)
              <br />
              │   └── HistoryView.tsx (Searchable audit trail, JSON/CSV export)
              <br />
              │
              <br />
              ▼
              <br />
              [ AI Inference Layer: Hybrid Multimodal ]
              <br />
              │   ├── Server-Side: Vite Middleware / Express (/api/classify)
              <br />
              │   │   └── @google/genai SDK (Gemini 3.8 Flash, strict responseSchema JSON)
              <br />
              │   └── Client-Side: FallbackClassifier (100% resilient offline fallback)
              <br />
              │
              <br />
              ▼
              <br />
              [ Smart Waste Decision Engine: Deterministic & Rule-Based ]
              <br />
              │   ├── WasteRulesEngine.ts (Evaluates confidence, contamination, battery hazard)
              <br />
              │   └── disposal_rules.json (8 material streams, preparation protocol)
              <br />
              │
              <br />
              ▼
              <br />
              [ Calculation & Aggregation Engines ]
              <br />
              │   ├── CompostEstimator.ts (Yield = input * 0.30; 55-70% mass loss model)
              <br />
              │   └── ImpactCalculator.ts (4-tier ledger funnel, avoided GHG emissions)
              <br />
              │
              <br />
              ▼
              <br />
              [ Persistence Layer: Local Database ]
              <br />
              │   └── DatabaseService.ts (Versioned schema, seed records, CSV/JSON export)
            </p>
          </div>
        </div>
      )}

      {/* Section 3: Limitations & Future Roadmap */}
      {activeSection === 'limitations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Known Limitations & Production Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Transparent hackathon disclosure of assumptions, constraints, and planned enhancements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-sm text-stone-900">1. Single-Angle Visual Occlusion</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                2D photographs cannot always detect hidden composite internal layers (such as aluminum foil fused inside tetrapaks). The system mandates human verification whenever confidence is below 70%.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-sm text-stone-900">2. Variable Compost Yield</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our demonstration assumes a 0.30 (30%) yield fraction. In real world composting, high-moisture melon rinds yield only ~15%, while fibrous woody yard trimmings yield up to 45%.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-sm text-stone-900">3. Local Municipal Discrepancies</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Some municipalities accept Polypropylene (#5 PP) while others restrict collection exclusively to #1 PET and #2 HDPE. Our app labels municipal verification as mandatory.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-sm text-stone-900">4. Future: IoT Smart Scale Integration</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Roadmap includes Bluetooth scale pairing (BLE weighing load cell) for zero-click automatic weight capture on campus cafeteria sorting belts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
