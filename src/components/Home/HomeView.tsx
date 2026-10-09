import React from 'react';
import {
  ScanLine,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SustainabilityMetrics } from '../../engine/impactCalculator';
import { ScanRecord } from '../../types/waste';
import { NavTab } from '../Navbar';

interface HomeViewProps {
  metrics: SustainabilityMetrics;
  recentScans: ScanRecord[];
  onNavigate: (tab: NavTab) => void;
  onSelectSampleForScan: (sampleId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  metrics,
  recentScans,
  onNavigate,
}) => {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 border border-emerald-800/40 p-6 sm:p-10 shadow-2xl text-stone-100">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI-Powered Circular Decision Support
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Waste2Worth <span className="text-emerald-400">AI</span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-emerald-200/90 max-w-2xl">
            "Identify it. Recover its value. Measure the impact."
          </p>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
            Most waste apps stop after classifying an image. Waste2Worth AI bridges the gap between identification and real-world circular recovery — evaluating contamination, enforcing transparent safety rules, calculating organic compost yields, and maintaining an auditable 4-tier impact ledger.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('scanner')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-all shadow-lg shadow-emerald-900/50 flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <ScanLine className="w-5 h-5 text-stone-950" />
              Scan Waste Item Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('exchange')}
              className="px-5 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-teal-600 hover:bg-teal-500 text-white transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              Circular Exchange
            </button>

            <button
              onClick={() => onNavigate('assistant')}
              className="px-4 py-3.5 rounded-xl font-semibold text-sm bg-stone-800/90 hover:bg-stone-800 text-stone-200 border border-stone-700 transition-colors flex items-center gap-2"
            >
              AI Advisor
            </button>

            <button
              onClick={() => onNavigate('ledger')}
              className="px-4 py-3.5 rounded-xl font-semibold text-sm bg-stone-800/90 hover:bg-stone-800 text-stone-200 border border-stone-700 transition-colors flex items-center gap-2"
            >
              View Ledger
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-[-10%] bottom-[-20%] w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scans Total */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">AI Scans Logged</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 tabular-nums">
            {metrics.totalScans}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {metrics.totalAiClassifiedWeightKg} kg total raw volume
          </p>
        </div>

        {/* Confirmed Diverted Waste */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Diverted from Landfill</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 tabular-nums">
            {metrics.totalDivertedWeightKg} <span className="text-sm font-semibold text-stone-500">kg</span>
          </div>
          <p className="text-xs text-teal-800 font-semibold mt-1">
            {metrics.diversionRatePercent}% diversion efficiency
          </p>
        </div>

        {/* Compost Estimated Output */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Compost Yield (Est.)</span>
            <div className="w-8 h-8 rounded-lg bg-lime-50 text-lime-700 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-lime-800 tabular-nums">
            {metrics.estimatedCompostYieldKg} <span className="text-sm font-semibold text-stone-500">kg</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            From {metrics.organicSentToCompostKg} kg organics @ 30% yield
          </p>
        </div>

        {/* Avoided Carbon Footprint */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avoided GHG (Est.)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 tabular-nums">
            {metrics.estimatedAvoidedCo2eKg} <span className="text-sm font-semibold text-stone-500">kg CO₂e</span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Avoided methane & virgin extraction
          </p>
        </div>
      </div>

      {/* 4-Tier Verification Funnel (Core Hackathon Differentiator) */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-850 rounded-2xl p-6 border border-stone-800 text-stone-100 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              The 4-Tier Audit Ledger: Separating Estimates from Verified Truth
            </h3>
            <p className="text-xs sm:text-sm text-stone-400">
              Unlike generic apps that assume every scanned bottle was recycled, Waste2Worth AI enforces strict funnel verification.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 self-start sm:self-auto">
            Zero Greenwashing
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tier 1 */}
          <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span className="font-bold text-emerald-400">Stage 1</span>
              <span>Raw Scans</span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              AI-Classified Waste
            </div>
            <div className="text-2xl font-black text-stone-200">
              {metrics.totalScans} <span className="text-xs font-normal text-stone-400">scans</span>
            </div>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Initial vision inference. Contains unverified items and flags low-confidence uncertainty triggers.
            </p>
          </div>

          {/* Tier 2 */}
          <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span className="font-bold text-teal-400">Stage 2</span>
              <span>Human in Loop</span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              User-Confirmed
            </div>
            <div className="text-2xl font-black text-teal-300">
              {metrics.totalUserConfirmedScans} <span className="text-xs font-normal text-stone-400">items</span>
            </div>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Verified or corrected by human inspection ({metrics.userCorrectionCount} corrections recorded).
            </p>
          </div>

          {/* Tier 3 */}
          <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
              <span className="font-bold text-lime-400">Stage 3</span>
              <span>Action Hand-off</span>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              Sent to Destination
            </div>
            <div className="text-2xl font-black text-lime-300">
              {metrics.totalDivertedWeightKg} <span className="text-xs font-normal text-stone-400">kg</span>
            </div>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Deposited into dedicated compost tumblers, blue recycling bins, or certified e-waste hubs.
            </p>
          </div>

          {/* Tier 4 */}
          <div className="bg-emerald-950/60 rounded-xl p-4 border border-emerald-700/80">
            <div className="flex items-center justify-between text-xs text-emerald-300 mb-2">
              <span className="font-bold text-emerald-400">Stage 4</span>
              <span>Closed Loop</span>
            </div>
            <div className="text-lg font-bold text-white mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Outcome
            </div>
            <div className="text-2xl font-black text-emerald-300">
              {metrics.verifiedWeightKg} <span className="text-xs font-normal text-emerald-400/80">kg</span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-2 leading-relaxed">
              Independently weighed and confirmed at campus composting station or foundry recovery depot.
            </p>
          </div>
        </div>
      </div>

      {/* How the System Works — 3 Steps */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          How Waste2Worth AI Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-lg">
              1
            </div>
            <h3 className="font-bold text-lg text-stone-900">
              Multimodal Vision & Uncertainty Guardrails
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Upload an image or use your webcam. Our vision pipeline extracts material composition, visible resin symbols, and food contamination. If confidence falls below 70%, the system flags uncertainty rather than guessing.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-lg">
              2
            </div>
            <h3 className="font-bold text-lg text-stone-900">
              Deterministic Decision Engine
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Safety-critical disposal recommendations are never left to hallucinating generative models. A rule-based engine evaluates contamination, grease on paper, battery fire hazards, and local sorting restrictions.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 font-bold flex items-center justify-center text-lg">
              3
            </div>
            <h3 className="font-bold text-lg text-stone-900">
              Organic Compost & Impact Ledger
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Record item weight and actual destination. Food residuals are linked to campus compost tumblers with transparent 30% yield conversion models, agronomic guidelines, and auditable emission savings.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Recent Scans & Actions
          </h2>
          <button
            onClick={() => onNavigate('history')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            View all audit records <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentScans.length === 0 ? (
          <div className="bg-stone-50/80 backdrop-blur-md rounded-2xl p-8 border border-dashed border-stone-300 text-center space-y-3">
            <ScanLine className="w-10 h-10 mx-auto text-stone-400" />
            <p className="text-stone-600 font-medium">No waste items scanned yet.</p>
            <button
              onClick={() => onNavigate('scanner')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500"
            >
              Scan your first item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentScans.slice(0, 3).map((scan) => (
              <div
                key={scan.id}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {scan.userConfirmedCategory}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 text-base line-clamp-1">
                    {scan.detectedItemName}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                    {scan.compositionDetail}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {scan.recordedWeightKg} kg
                  </div>

                  <span
                    className={`font-medium ${
                      scan.destinationStatus === 'sent_to_compost'
                        ? 'text-lime-700'
                        : scan.destinationStatus === 'sent_to_recycler'
                        ? 'text-teal-700'
                        : scan.destinationStatus === 'sent_to_ewaste'
                        ? 'text-red-700'
                        : 'text-stone-600'
                    }`}
                  >
                    {scan.destinationStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                {scan.isUncertain && (
                  <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    Human-in-the-loop review triggered
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
