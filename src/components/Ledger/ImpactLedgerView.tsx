import React, { useState } from 'react';
import {
  BarChart3,
  Layers,
  ShieldCheck,
  Sprout,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Sparkles,
  Download,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { SustainabilityMetrics, ImpactCalculator } from '../../engine/impactCalculator';

interface ImpactLedgerViewProps {
  metrics: SustainabilityMetrics;
  onExportCsv: () => void;
  onExportJson: () => void;
  showDemoRecords: boolean;
}

export const ImpactLedgerView: React.FC<ImpactLedgerViewProps> = ({
  metrics,
  onExportCsv,
  onExportJson,
  showDemoRecords,
}) => {
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  const handleDownloadAuditReport = () => {
    const reportText = ImpactCalculator.generateAuditSummaryReport(metrics);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `waste2worth_audit_report_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Auditable Carbon & Waste Accounting
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1">
              Sustainability Impact Ledger
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Distinguishing raw scans, human confirmations, destination routing, and verified facility outcomes
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowMethodologyModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1.5"
            >
              <Info className="w-4 h-4 text-stone-500" />
              Accounting Methodology
            </button>

            <button
              onClick={handleDownloadAuditReport}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-emerald-700" />
              Audit Report (.txt)
            </button>

            <button
              onClick={onExportCsv}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {showDemoRecords && (
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Displaying hybrid demonstration dataset (8 calibrated dorm/canteen events + live additions)
            </span>
            <span className="font-bold text-[10px] uppercase tracking-wider bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-900">
              Demo Mode Active
            </span>
          </div>
        )}
      </div>

      {/* 4-Tier Verification Funnel (Core Hackathon Standard) */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-800 text-stone-100 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              4-Tier Waste Verification Funnel
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Audit trail showing how initial scans transition into verified closed-loop recovery
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            Strict Separation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tier 1 */}
          <div className="bg-stone-800/80 rounded-2xl p-5 border border-stone-700 space-y-2">
            <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">
              Concept 1 • Scanned
            </div>
            <div className="text-xl font-bold text-white">AI-Classified</div>
            <div className="text-3xl font-black text-stone-100 font-mono">
              {metrics.totalScans} <span className="text-sm font-normal text-stone-400">items</span>
            </div>
            <p className="text-xs text-stone-400 font-mono">
              {metrics.totalAiClassifiedWeightKg} kg scanned
            </p>
            <div className="pt-2 text-[11px] text-stone-400 border-t border-stone-700/80">
              {metrics.uncertaintyFlaggedCount} uncertain items flagged for review
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-stone-800/80 rounded-2xl p-5 border border-stone-700 space-y-2">
            <div className="text-xs text-teal-400 font-bold uppercase tracking-wider">
              Concept 2 • Human Review
            </div>
            <div className="text-xl font-bold text-white">User-Confirmed</div>
            <div className="text-3xl font-black text-teal-300 font-mono">
              {metrics.totalUserConfirmedScans} <span className="text-sm font-normal text-stone-400">items</span>
            </div>
            <p className="text-xs text-stone-400 font-mono">
              {metrics.totalUserConfirmedWeightKg} kg confirmed
            </p>
            <div className="pt-2 text-[11px] text-teal-300 border-t border-stone-700/80">
              {metrics.userCorrectionCount} human corrections ({metrics.userCorrectionRatePercent}%)
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-stone-800/80 rounded-2xl p-5 border border-stone-700 space-y-2">
            <div className="text-xs text-lime-400 font-bold uppercase tracking-wider">
              Concept 3 • Hand-Off
            </div>
            <div className="text-xl font-bold text-white">Sent to Destination</div>
            <div className="text-3xl font-black text-lime-300 font-mono">
              {metrics.totalDivertedWeightKg} <span className="text-sm font-normal text-stone-400">kg</span>
            </div>
            <p className="text-xs text-stone-400">
              Diverted from landfill bin
            </p>
            <div className="pt-2 text-[11px] text-lime-300 border-t border-stone-700/80">
              {metrics.diversionRatePercent}% net diversion efficiency
            </div>
          </div>

          {/* Tier 4 */}
          <div className="bg-emerald-950/60 rounded-2xl p-5 border border-emerald-700/80 space-y-2">
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Concept 4 • Verified
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Facility Outcome
            </div>
            <div className="text-3xl font-black text-emerald-300 font-mono">
              {metrics.verifiedWeightKg} <span className="text-sm font-normal text-emerald-400/80">kg</span>
            </div>
            <p className="text-xs text-emerald-200/80 font-mono">
              {metrics.verifiedOutcomesCount} batches verified
            </p>
            <div className="pt-2 text-[11px] text-emerald-300 border-t border-emerald-800">
              {metrics.verifiedCompostHarvestedKg} kg finished compost harvested
            </div>
          </div>
        </div>
      </div>

      {/* Category Weight Breakdown & Avoided Carbon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-base">
              Recorded Weight by Waste Category
            </h3>
            <span className="text-xs text-stone-500">
              Total: {metrics.totalAiClassifiedWeightKg} kg
            </span>
          </div>

          {metrics.categoryBreakdown.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No recorded category data yet.
            </div>
          ) : (
            <div className="space-y-3">
              {metrics.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-stone-800">{cat.category}</span>
                    <span className="text-stone-600 font-mono">
                      {cat.totalWeightKg} kg ({cat.percentageOfTotal}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full ${
                        cat.category === 'Organic food scraps'
                          ? 'bg-lime-500'
                          : cat.category === 'Plastic'
                          ? 'bg-sky-500'
                          : cat.category === 'Metal'
                          ? 'bg-amber-500'
                          : cat.category === 'Paper and cardboard'
                          ? 'bg-amber-700'
                          : cat.category === 'Glass'
                          ? 'bg-emerald-600'
                          : cat.category === 'Electronic waste'
                          ? 'bg-red-500'
                          : 'bg-stone-500'
                      }`}
                      style={{ width: `${Math.max(4, cat.percentageOfTotal)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avoided Emissions Ledger */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-base">
              Avoided Greenhouse Gas Emissions (Estimate)
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              EPA WARM Baseline
            </span>
          </div>

          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 block">Total Modeled Carbon Avoidance</span>
              <span className="text-3xl font-black text-emerald-800 font-mono">
                {metrics.estimatedAvoidedCo2eKg} kg CO₂e
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
              <span className="text-stone-700">Methane Avoided (Composting Organics)</span>
              <span className="font-bold text-stone-900 font-mono">
                ~{(metrics.organicSentToCompostKg * 0.5).toFixed(2)} kg CO₂e
              </span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl flex items-center justify-between">
              <span className="text-stone-700">Virgin Material Smelting & Extraction Displaced</span>
              <span className="font-bold text-stone-900 font-mono">
                ~{(metrics.estimatedAvoidedCo2eKg - metrics.organicSentToCompostKg * 0.5).toFixed(2)} kg CO₂e
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed">
            *Demonstrates counterfactual avoided lifecycle emissions vs. municipal landfill anaerobic decomposition. Not valid for carbon offset trading.
          </p>
        </div>
      </div>

      {/* Financial & Economic Resource Recovery (Master Prompt Section 12) */}
      <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-teal-950 rounded-3xl p-6 sm:p-8 border border-emerald-800/40 text-stone-100 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Circular Economy Financial & Procurement Savings
            </h3>
            <p className="text-xs text-stone-400">
              Estimated direct budget savings from tipping fee avoidance and recovered secondary materials
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 self-start sm:self-auto">
            Modeled Economic Value
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-xs text-stone-400 block font-medium">Landfill Tipping Fees Avoided</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">
              ${metrics.estimatedTippingFeeSavedUsd}
            </span>
            <p className="text-[11px] text-stone-400 pt-1">
              Based on $85 / metric tonne ($0.085/kg) municipal disposal fee
            </p>
          </div>

          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-xs text-stone-400 block font-medium">Secondary Commodity & Compost Value</span>
            <span className="text-3xl font-black text-teal-300 font-mono">
              ${metrics.estimatedCommodityValueRecoveredUsd}
            </span>
            <p className="text-[11px] text-stone-400 pt-1">
              Valued metal scrap, rPET flake & finished agricultural humus
            </p>
          </div>

          <div className="bg-emerald-950/70 p-5 rounded-2xl border border-emerald-700/80 space-y-1 ring-1 ring-emerald-500/30">
            <span className="text-xs text-emerald-300 block font-medium">Net Circular Financial Value</span>
            <span className="text-3xl font-black text-white font-mono">
              ${metrics.totalEconomicValueUsd}
            </span>
            <p className="text-[11px] text-emerald-300/80 pt-1">
              Direct campus operational & procurement benefit
            </p>
          </div>
        </div>
      </div>

      {/* Annual Run-Rate Forecasting Card (Master Prompt Section 12) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Annualized Run-Rate Projections & Circular Forecasting
            </h3>
            <p className="text-xs text-stone-500">
              Statistical extrapolation modeling 365-day cumulative recovery potential
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${
              metrics.forecastingStatus === 'calibrated'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : metrics.forecastingStatus === 'preliminary'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            {metrics.forecastingStatus.toUpperCase()} FORECAST
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <span className="text-xs text-stone-500 block">Projected Annual Diversion</span>
            <span className="text-2xl font-black text-stone-900 font-mono">
              {metrics.annualProjectedDiversionKg.toLocaleString()} kg/yr
            </span>
            <p className="text-[11px] text-stone-400">Total solid waste diverted from landfill</p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <span className="text-xs text-stone-500 block">Projected Avoided Emissions</span>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {metrics.annualProjectedCo2AvoidedKg.toLocaleString()} kg CO₂e/yr
            </span>
            <p className="text-[11px] text-stone-400">Avoided methane & virgin extraction</p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
            <span className="text-xs text-stone-500 block">Projected Annual Budget Savings</span>
            <span className="text-2xl font-black text-teal-700 font-mono">
              ${metrics.annualProjectedCostSavingsUsd.toLocaleString()}/yr
            </span>
            <p className="text-[11px] text-stone-400">Tipping fee avoidance & commodity yield</p>
          </div>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>{metrics.forecastingRationale}</span>
        </div>
      </div>

      {/* Daily Scans & Diverted Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Daily Activity & Diversion Trend
          </h3>
          <span className="text-xs text-stone-500">
            {metrics.dailyTrends.length} Active Logging Days
          </span>
        </div>

        {metrics.dailyTrends.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-4">No daily logs yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {metrics.dailyTrends.map((d) => (
              <div key={d.date} className="py-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">{d.date}</span>
                <div className="flex items-center gap-6">
                  <span className="text-stone-500">
                    Scans: <strong className="text-stone-800">{d.scans}</strong>
                  </span>
                  <span className="text-stone-500">
                    Recorded: <strong className="text-stone-800 font-mono">{d.weightKg} kg</strong>
                  </span>
                  <span className="text-emerald-700 font-bold font-mono">
                    Diverted: {d.divertedKg} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accounting Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-stone-900">
                Accounting & Calculation Methodology
              </h3>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed max-h-96 overflow-y-auto pr-2">
              <p>
                <strong>1. 4-Tier Separation:</strong> We never treat an image scan as proof of physical recycling. Only items whose destination is logged are classified as "Diverted", and only items with facility confirmation reach "Stage 4: Verified".
              </p>
              <p>
                <strong>2. Compost Output Yield:</strong> Based on the biological decomposition model:
                <br />
                <code className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono block my-1">
                  Estimated Compost = Confirmed Organics Sent × Assumed Yield (Default: 0.30)
                </code>
                55% to 70% of initial organic weight is lost as water vapor and microbial respiration (CO₂).
              </p>
              <p>
                <strong>3. Avoided Carbon Baselines:</strong> Derived from EPA Waste Reduction Model (WARM v15) and DEFRA conversion baselines:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                <li>Organic Food Waste Composted: 0.50 kg CO₂e / kg (avoided anaerobic methane generation in landfill).</li>
                <li>Secondary Aluminum / Metal: 2.10 kg CO₂e / kg (virgin bauxite smelting displacement).</li>
                <li>Recycled Plastics (PET/HDPE): 1.25 kg CO₂e / kg (fossil naphtha cracking displacement).</li>
                <li>Paper / Cardboard: 0.90 kg CO₂e / kg (virgin timber repulping avoidance).</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="w-full py-2.5 bg-stone-900 text-white rounded-xl font-bold text-xs"
              >
                Close Methodology Disclosure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
