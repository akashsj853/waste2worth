import React, { useState } from 'react';
import {
  Sprout,
  Droplet,
  Sun,
  Flame,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Scale,
  Sparkles,
  Info,
  Sliders,
} from 'lucide-react';
import { CompostEstimator } from '../../engine/compostEstimator';
import { SustainabilityMetrics } from '../../engine/impactCalculator';

interface CompostViewProps {
  metrics: SustainabilityMetrics;
  compostYieldFraction: number;
  setCompostYieldFraction: (fraction: number) => void;
}

export const CompostView: React.FC<CompostViewProps> = ({
  metrics,
  compostYieldFraction,
  setCompostYieldFraction,
}) => {
  const [interactiveInputKg, setInteractiveInputKg] = useState<number>(metrics.organicSentToCompostKg || 15);

  const calc = CompostEstimator.calculateYield(interactiveInputKg, compostYieldFraction);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-lime-950 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-10 border border-lime-800/40 text-stone-100 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-lime-900/60 text-lime-300 border border-lime-700/60">
          <Sprout className="w-3.5 h-3.5 text-lime-400" />
          Organic Waste & Agriculture Module
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Soil Recovery & Compost Yield Modeling
        </h1>

        <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          Organic food scraps and agricultural residues are not refuse — they are vital microbial carbon and nitrogen feedstocks. This module converts recorded organic diversions into humified compost estimates to restore soil organic matter (SOM) across campus and community gardens.
        </p>

        {/* Real-time Ledger Stats for Organics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block">Confirmed Organics Diverted</span>
            <span className="text-2xl font-black text-lime-400 font-mono">
              {metrics.organicSentToCompostKg} kg
            </span>
          </div>

          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block">Compost Yield (Est. @ {(compostYieldFraction * 100).toFixed(0)}%)</span>
            <span className="text-2xl font-black text-emerald-300 font-mono">
              {metrics.estimatedCompostYieldKg} kg
            </span>
          </div>

          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block">Independently Verified Harvest</span>
            <span className="text-2xl font-black text-teal-300 font-mono">
              {metrics.verifiedCompostHarvestedKg} kg
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Compost Conversion Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-lime-700" />
              Interactive Compost Yield Simulator
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Adjust assumed yield fraction and feedstock weight to model thermophilic biological breakdown
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 self-start sm:self-auto">
            Configurable Baseline
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Feedstock Input Slider */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700">
                Wet Organic Feedstock Input:
              </label>
              <span className="text-sm font-black font-mono text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                {interactiveInputKg} kg
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={interactiveInputKg}
              onChange={(e) => setInteractiveInputKg(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-lime-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>1 kg (Daily kitchen bowl)</span>
              <span>100 kg (Weekly dining hall batch)</span>
            </div>
          </div>

          {/* Yield Fraction Slider */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700">
                Configured Assumed Yield Fraction:
              </label>
              <span className="text-sm font-black font-mono text-lime-800 bg-lime-100 px-2 py-0.5 rounded border border-lime-200">
                {(compostYieldFraction * 100).toFixed(0)}% ({compostYieldFraction.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.45"
              step="0.01"
              value={compostYieldFraction}
              onChange={(e) => setCompostYieldFraction(parseFloat(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-lime-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>0.15 (High water fruit waste)</span>
              <span>0.45 (High carbon woody solids)</span>
            </div>
          </div>
        </div>

        {/* Biological Mass Balance Card */}
        <div className="bg-lime-50/60 rounded-2xl p-6 border border-lime-200 space-y-4">
          <h3 className="text-sm font-bold text-lime-950 uppercase tracking-wider">
            Biological Mass Balance Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-lime-200/60 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">Initial Wet Biomass</span>
              <span className="text-2xl font-black text-stone-900 font-mono">
                {calc.organicInputKg} kg
              </span>
              <p className="text-[11px] text-stone-400 mt-1">100% Raw Food Discards</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-lime-200/60 shadow-xs">
              <span className="text-xs text-stone-500 block mb-1">Evaporated Moisture & Respiration</span>
              <span className="text-2xl font-black text-amber-700 font-mono">
                ~{calc.moistureLossKg} kg
              </span>
              <p className="text-[11px] text-stone-400 mt-1">H₂O steam + CO₂ microbial respiration</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-lime-300 shadow-xs ring-2 ring-lime-600/20">
              <span className="text-xs text-lime-800 font-bold block mb-1">Estimated Finished Humus</span>
              <span className="text-2xl font-black text-lime-700 font-mono">
                {calc.estimatedOutputKg} kg
              </span>
              <p className="text-[11px] text-lime-800 mt-1">Mature nutrient-rich compost</p>
            </div>
          </div>

          <div className="text-xs text-stone-600 bg-white/80 p-3.5 rounded-xl border border-lime-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-lime-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-lime-900">Recommended Carbon Balancing:</strong> Mix with approximately{' '}
              <span className="font-bold text-stone-900 font-mono">{calc.recommendedBrownsKg} kg</span> of dry brown matter (dry fallen leaves, shredded cardboard, or straw) to maintain an optimal 25:1 to 30:1 C:N ratio and prevent anaerobic sludge.
            </div>
          </div>
        </div>

        {/* Agronomic Application Estimates */}
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            Agronomic Soil Treatment Potential
          </h3>
          <p className="text-xs text-stone-600">
            Applying 1–2 kg of cured compost per square meter replenishes topsoil organic carbon:
          </p>
          <div className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-stone-700">
              Estimated garden soil area treated with {calc.estimatedOutputKg} kg compost:
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
              ~{calc.potentialGardenAreaSqM} m²
            </span>
          </div>
        </div>
      </div>

      {/* Responsible Compost Use & Phytotoxicity Cautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Responsible Application Guidelines */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base">Responsible Application Guidelines</h3>
          </div>
          <ul className="space-y-2.5">
            {calc.applicationGuidance.map((guideline, idx) => (
              <li key={idx} className="text-xs text-stone-700 flex items-start gap-2 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Phytotoxicity & Immature Compost Warning */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4 bg-amber-50/20">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-base">Maturity & Phytotoxicity Warnings</h3>
          </div>
          <ul className="space-y-2.5">
            {calc.safetyCautions.map((caution, idx) => (
              <li key={idx} className="text-xs text-amber-900/90 flex items-start gap-2 leading-relaxed">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  !
                </span>
                <span>{caution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer Banner */}
      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-800">Scientific Model Disclaimer:</strong> {calc.disclaimer} Do not claim that compost is cured or soil yield increased without laboratory volatile organic acid and germination testing.
        </p>
      </div>
    </div>
  );
};
