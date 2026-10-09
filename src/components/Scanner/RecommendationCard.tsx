import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Leaf,
  Recycle,
  Trash2,
  Cpu,
  Scissors,
  BookmarkPlus,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  AIClassificationResult,
  DecisionResult,
  WasteCategory,
  WASTE_CATEGORIES,
  DestinationStatus,
  ScanRecord,
} from '../../types/waste';
import { defaultRulesEngine } from '../../engine/wasteRules';
import { CompostEstimator } from '../../engine/compostEstimator';

interface RecommendationCardProps {
  classification: AIClassificationResult;
  uncertaintyThreshold: number;
  onSaveRecord: (record: ScanRecord) => void;
  imagePreviewUrl?: string;
  isDemoRecord: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  classification,
  uncertaintyThreshold,
  onSaveRecord,
  imagePreviewUrl,
  isDemoRecord,
}) => {
  // Human-in-the-loop category state
  const [confirmedCategory, setConfirmedCategory] = useState<WasteCategory>(classification.predictedCategory);
  const [isCorrected, setIsCorrected] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');

  // Weight entry state
  const [weightValue, setWeightValue] = useState<string>('0.25');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'g' | 'lbs'>('kg');

  // Destination & Outcome state
  const [destination, setDestination] = useState<DestinationStatus>(() => {
    if (confirmedCategory === 'Organic food scraps') return 'sent_to_compost';
    if (['Plastic', 'Metal', 'Glass', 'Paper and cardboard'].includes(confirmedCategory)) return 'sent_to_recycler';
    if (confirmedCategory === 'Electronic waste') return 'sent_to_ewaste';
    if (confirmedCategory === 'Textile') return 'reused_locally';
    return 'sent_to_landfill';
  });
  const [isVerifiedAtFacility, setIsVerifiedAtFacility] = useState(false);
  const [userNotes, setUserNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Evaluate deterministic decision engine based on confirmed category
  const decision: DecisionResult = defaultRulesEngine.evaluate({
    category: confirmedCategory,
    confidence: isCorrected ? 0.98 : classification.confidenceScore,
    uncertaintyThreshold,
    contaminationStatus: classification.contaminationStatus,
    itemComposition: classification.compositionDetail,
    isUserConfirmed: isCorrected,
  });

  const isLowConfidence = classification.confidenceScore < uncertaintyThreshold || classification.predictedCategory === 'Other or unknown';

  // Calculate normalized weight in KG
  const numericWeight = parseFloat(weightValue) || 0;
  let weightInKg = numericWeight;
  if (weightUnit === 'g') weightInKg = numericWeight / 1000;
  if (weightUnit === 'lbs') weightInKg = numericWeight * 0.453592;
  weightInKg = Number(weightInKg.toFixed(3));

  // Calculate estimated compost yield and avoided CO2
  const estimatedCompost = CompostEstimator.calculateYield(
    destination === 'sent_to_compost' ? weightInKg : 0,
    0.30
  );

  let estimatedAvoidedCo2 = 0;
  if (destination === 'sent_to_compost') estimatedAvoidedCo2 = weightInKg * 0.50;
  else if (destination === 'sent_to_recycler') {
    if (confirmedCategory === 'Metal') estimatedAvoidedCo2 = weightInKg * 2.10;
    else if (confirmedCategory === 'Plastic') estimatedAvoidedCo2 = weightInKg * 1.25;
    else if (confirmedCategory === 'Paper and cardboard') estimatedAvoidedCo2 = weightInKg * 0.90;
    else if (confirmedCategory === 'Glass') estimatedAvoidedCo2 = weightInKg * 0.35;
  } else if (destination === 'reused_locally') estimatedAvoidedCo2 = weightInKg * 1.50;
  else if (destination === 'sent_to_ewaste') estimatedAvoidedCo2 = weightInKg * 3.20;

  const handleCategoryOverride = (newCat: WasteCategory) => {
    setConfirmedCategory(newCat);
    setIsCorrected(newCat !== classification.predictedCategory);
    // Auto-update sensible destination
    if (newCat === 'Organic food scraps') setDestination('sent_to_compost');
    else if (['Plastic', 'Metal', 'Glass', 'Paper and cardboard'].includes(newCat)) setDestination('sent_to_recycler');
    else if (newCat === 'Electronic waste') setDestination('sent_to_ewaste');
    else if (newCat === 'Textile') setDestination('reused_locally');
  };

  const handleSaveToLedger = () => {
    const record: ScanRecord = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      imagePreviewUrl,
      predictedCategory: classification.predictedCategory,
      confidenceScore: classification.confidenceScore,
      alternativePredictions: classification.alternativePredictions,
      isUncertain: isLowConfidence,
      uncertaintyThresholdUsed: uncertaintyThreshold,
      detectedItemName: classification.detectedItemName,
      compositionDetail: classification.compositionDetail,
      contaminationStatus: classification.contaminationStatus,
      userConfirmedCategory: confirmedCategory,
      userCorrected: isCorrected,
      reviewStatus: isCorrected ? 'corrected' : 'confirmed',
      recommendation: decision,
      recordedWeightKg: weightInKg,
      destinationStatus: destination,
      verificationStage: isVerifiedAtFacility
        ? 'facility_verified'
        : destination !== 'unspecified'
        ? 'destination_logged'
        : 'user_confirmed',
      isVerifiedOutcome: isVerifiedAtFacility,
      estimatedCompostYieldKg: estimatedCompost.estimatedOutputKg,
      estimatedAvoidedCo2Kg: Number(estimatedAvoidedCo2.toFixed(3)),
      isDemoRecord,
      notes: userNotes || (isCorrected ? `User corrected from ${classification.predictedCategory}: ${correctionReason}` : undefined),
    };

    onSaveRecord(record);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Inference Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              AI Vision Prediction
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              Source: {classification.source === 'gemini_vision' ? 'Gemini 3.8 Flash' : 'Multimodal Fallback'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Confidence Score:</span>
            <span
              className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                classification.confidenceScore >= uncertaintyThreshold
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {(classification.confidenceScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Item Title & Category */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {classification.detectedItemName}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              {classification.compositionDetail}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-xl font-bold text-sm bg-stone-900 text-white shadow-sm flex items-center gap-1.5">
              {confirmedCategory}
              {isCorrected && (
                <span className="text-[10px] text-amber-300 font-normal ml-1 bg-amber-950/60 px-1.5 py-0.5 rounded">
                  Corrected
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Uncertainty Alert Banner */}
        {isLowConfidence && !isCorrected && (
          <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-900">
              <p className="font-bold text-sm">
                Uncertainty Guardrail Triggered (Score &lt; {(uncertaintyThreshold * 100).toFixed(0)}%)
              </p>
              <p className="text-amber-800 leading-relaxed">
                Raw model softmax probability is below the safe autonomous sorting threshold. Human confirmation is required before proceeding to prevent material contamination.
              </p>
            </div>
          </div>
        )}

        {/* Visual notes */}
        <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/60 flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>{classification.visualNotes}</span>
        </div>

        {/* Alternative Candidate Predictions */}
        {classification.alternativePredictions.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Candidate Hypotheses (Softmax Ranking)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {classification.alternativePredictions.map((cand, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs flex items-center justify-between"
                >
                  <span className="font-semibold text-stone-700 truncate">{cand.category}</span>
                  <span className="text-stone-500 font-mono text-[11px] ml-2">
                    {(cand.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Human-In-The-Loop Correction Control */}
      <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              Human-in-the-Loop: Confirm or Override Prediction
            </h3>
            <p className="text-xs text-stone-500">
              Is the AI classification correct? Override with one click to record true ground truth.
            </p>
          </div>
          {isCorrected && (
            <button
              onClick={() => handleCategoryOverride(classification.predictedCategory)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Reset to AI Prediction
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WASTE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryOverride(cat)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                confirmedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span className="truncate">{cat}</span>
              {confirmedCategory === cat && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1" />}
            </button>
          ))}
        </div>

        {isCorrected && (
          <div className="pt-2">
            <label className="text-xs font-semibold text-stone-600 block mb-1">
              Reason for Correction (Optional Audit Note):
            </label>
            <input
              type="text"
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
              placeholder="e.g., Plastic bottle cap was metal; cardboard had oily food contamination"
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* 3. Deterministic Decision Engine Output */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Deterministic Rules Engine Recommendation
            </span>
          </div>

          <div className="flex items-center gap-2">
            {decision.localRuleVerificationRequired && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Verify Local Rules
              </span>
            )}
            {decision.isProvisional && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-800 border border-red-200">
                Provisional
              </span>
            )}
          </div>
        </div>

        {/* Action Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            decision.action === 'Organic Composting Route'
              ? 'bg-lime-50/80 border-lime-300 text-lime-950'
              : decision.action === 'Recycling Collection'
              ? 'bg-teal-50/80 border-teal-300 text-teal-950'
              : decision.action === 'Specialized E-Waste Drop-off' || decision.action === 'Hazardous Material Handling'
              ? 'bg-red-50/80 border-red-300 text-red-950'
              : decision.action === 'Textile Upcycling / Drop-off'
              ? 'bg-pink-50/80 border-pink-300 text-pink-950'
              : decision.action === 'Human Verification Required'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : 'bg-stone-50 border-stone-300 text-stone-900'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/80 shadow-xs flex items-center justify-center shrink-0">
            {decision.action === 'Organic Composting Route' && <Leaf className="w-5 h-5 text-lime-700" />}
            {decision.action === 'Recycling Collection' && <Recycle className="w-5 h-5 text-teal-700" />}
            {decision.action === 'Residual Waste Disposal' && <Trash2 className="w-5 h-5 text-stone-700" />}
            {decision.action === 'Specialized E-Waste Drop-off' && <Cpu className="w-5 h-5 text-red-700" />}
            {decision.action === 'Hazardous Material Handling' && <ShieldAlert className="w-5 h-5 text-red-700" />}
            {decision.action === 'Textile Upcycling / Drop-off' && <Scissors className="w-5 h-5 text-pink-700" />}
            {decision.action === 'Human Verification Required' && <AlertTriangle className="w-5 h-5 text-amber-700" />}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider opacity-75">
              Recommended Action
            </span>
            <h4 className="text-lg font-black">{decision.action}</h4>
            <p className="text-xs sm:text-sm leading-relaxed opacity-90">{decision.explanation}</p>
          </div>
        </div>

        {/* Handling Caution */}
        <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Handling Caution & Contamination Prevention:
          </span>
          <p className="leading-relaxed">{decision.handlingCaution}</p>
        </div>

        {/* Step-by-step preparation checklist */}
        {decision.preparationSteps.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Required Material Preparation Steps
            </span>
            <ul className="space-y-1.5">
              {decision.preparationSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. Closed-Loop Outcome Logger (Weigh & Record Destination) */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-850 rounded-3xl p-6 border border-stone-800 text-stone-100 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              Close the Loop: Record Weight & Actual Destination
            </h3>
            <p className="text-xs text-stone-400">
              Log real operational data into the sustainability ledger
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            Audit Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Weight Entry */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">Measured Waste Weight:</label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0.001"
                value={weightValue}
                onChange={(e) => setWeightValue(e.target.value)}
                className="w-full text-sm font-mono font-bold px-3 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <div className="flex bg-stone-800 rounded-xl p-1 border border-stone-700">
                {(['kg', 'g', 'lbs'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setWeightUnit(unit)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      weightUnit === unit ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-400">
              Normalized: <span className="font-mono text-emerald-400 font-bold">{weightInKg} kg</span>
            </p>
          </div>

          {/* Destination Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">Actual Destination:</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value as DestinationStatus)}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="sent_to_compost">Sent to Compost Bin / Tumbler</option>
              <option value="sent_to_recycler">Sent to Material Recovery / Blue Bin</option>
              <option value="reused_locally">Reused Locally / Repurposed</option>
              <option value="sent_to_ewaste">Sent to Certified E-Waste Depot</option>
              <option value="sent_to_landfill">Sent to Residual Waste / Landfill</option>
            </select>
            <p className="text-[11px] text-stone-400">
              Categorizes diversion rate in ledger.
            </p>
          </div>
        </div>

        {/* Verification Checkbox & Notes */}
        <div className="space-y-3 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer bg-stone-800/60 p-3 rounded-xl border border-stone-700/80 hover:bg-stone-800 transition-colors">
            <input
              type="checkbox"
              checked={isVerifiedAtFacility}
              onChange={(e) => setIsVerifiedAtFacility(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-600 bg-stone-700"
            />
            <div className="text-xs">
              <span className="font-bold text-white block">
                Stage 4: Verified by Facility / Composting Manager
              </span>
              <span className="text-stone-400 text-[11px]">
                Check if batch arrival was independently confirmed at tumbler or recycling scale.
              </span>
            </div>
          </label>

          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Audit notes (e.g., Canteen tumbler #2, weighed on hostel kitchen scale)"
            className="w-full text-xs px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-200 placeholder-stone-500 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Impact Live Calculation Preview */}
        <div className="bg-stone-800/90 rounded-2xl p-4 border border-stone-700 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-stone-400 block">Estimated Compost Output (30% Yield):</span>
            <span className="font-bold text-lime-400 text-sm">
              {destination === 'sent_to_compost' ? `${estimatedCompost.estimatedOutputKg} kg` : 'N/A (Not composted)'}
            </span>
          </div>

          <div>
            <span className="text-stone-400 block">Avoided Greenhouse Gas:</span>
            <span className="font-bold text-emerald-400 text-sm">
              ~{estimatedAvoidedCo2.toFixed(2)} kg CO₂e
            </span>
          </div>

          <div>
            <span className="text-stone-400 block">Ledger Verification Level:</span>
            <span className="font-bold text-teal-400 text-sm">
              {isVerifiedAtFacility ? 'Stage 4: Verified' : 'Stage 3: Destination Logged'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSaveToLedger}
          disabled={isSaved}
          className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isSaved
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 hover:scale-[1.01]'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              Recorded in Sustainability Ledger!
            </>
          ) : (
            <>
              <BookmarkPlus className="w-5 h-5" />
              Save Record to Sustainability Impact Ledger
            </>
          )}
        </button>
      </div>
    </div>
  );
};
