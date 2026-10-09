import { ScanRecord, WasteCategory } from '../types/waste';
import { CompostEstimator } from './compostEstimator';

export interface CategoryMetric {
  category: WasteCategory;
  count: number;
  totalWeightKg: number;
  divertedWeightKg: number;
  percentageOfTotal: number;
}

export interface SustainabilityMetrics {
  // 1. AI-Classified Waste (Total scans)
  totalScans: number;
  totalAiClassifiedWeightKg: number;

  // 2. User-Confirmed Waste
  totalUserConfirmedScans: number;
  totalUserConfirmedWeightKg: number;
  userCorrectionCount: number;
  userCorrectionRatePercent: number;
  uncertaintyFlaggedCount: number;

  // 3. Waste Sent to Destination
  totalDivertedWeightKg: number;
  organicSentToCompostKg: number;
  recyclablesSentToMRFKg: number;
  textileSentToUpcycleKg: number;
  eWasteSentToDepotKg: number;
  landfillResidualWeightKg: number;
  diversionRatePercent: number; // Diverted / Confirmed Weight

  // 4. Verified Processing Outcome
  verifiedOutcomesCount: number;
  verifiedWeightKg: number;
  verifiedCompostHarvestedKg: number;

  // Estimates (transparently labeled)
  estimatedCompostYieldKg: number;
  estimatedAvoidedCo2eKg: number;
  estimatedTippingFeeSavedUsd: number;
  estimatedCommodityValueRecoveredUsd: number;
  totalEconomicValueUsd: number;

  // Annualized Projections (Forecasting)
  annualProjectedDiversionKg: number;
  annualProjectedCo2AvoidedKg: number;
  annualProjectedCostSavingsUsd: number;
  forecastingStatus: 'calibrated' | 'preliminary' | 'insufficient_history';
  forecastingRationale: string;

  // Breakdowns
  categoryBreakdown: CategoryMetric[];
  dailyTrends: {
    date: string;
    scans: number;
    weightKg: number;
    divertedKg: number;
  }[];
}

export class ImpactCalculator {
  public static calculate(records: ScanRecord[], yieldFraction = CompostEstimator.DEFAULT_YIELD_FRACTION): SustainabilityMetrics {
    const totalScans = records.length;
    let totalAiClassifiedWeightKg = 0;
    let totalUserConfirmedScans = 0;
    let totalUserConfirmedWeightKg = 0;
    let userCorrectionCount = 0;
    let uncertaintyFlaggedCount = 0;

    let totalDivertedWeightKg = 0;
    let organicSentToCompostKg = 0;
    let recyclablesSentToMRFKg = 0;
    let textileSentToUpcycleKg = 0;
    let eWasteSentToDepotKg = 0;
    let landfillResidualWeightKg = 0;

    let verifiedOutcomesCount = 0;
    let verifiedWeightKg = 0;
    let verifiedCompostHarvestedKg = 0;

    let estimatedAvoidedCo2eKg = 0;

    const categoryMap = new Map<WasteCategory, { count: number; totalWeightKg: number; divertedWeightKg: number }>();

    // Daily trends map
    const dailyMap = new Map<string, { scans: number; weightKg: number; divertedKg: number }>();

    for (const record of records) {
      const weight = record.recordedWeightKg || 0;
      totalAiClassifiedWeightKg += weight;

      if (record.isUncertain) {
        uncertaintyFlaggedCount++;
      }

      if (record.userCorrected) {
        userCorrectionCount++;
      }

      // Check user confirmation
      const isConfirmed = record.reviewStatus === 'confirmed' || record.reviewStatus === 'corrected' || record.verificationStage !== 'scanned';
      if (isConfirmed) {
        totalUserConfirmedScans++;
        totalUserConfirmedWeightKg += weight;
      }

      const activeCategory = record.userConfirmedCategory || record.predictedCategory;

      // Group by active category
      const currentCat = categoryMap.get(activeCategory) || { count: 0, totalWeightKg: 0, divertedWeightKg: 0 };
      currentCat.count++;
      currentCat.totalWeightKg += weight;

      // Check destination
      const dest = record.destinationStatus;
      const isDiverted = dest === 'sent_to_compost' || dest === 'sent_to_recycler' || dest === 'reused_locally' || dest === 'sent_to_ewaste';

      if (isDiverted) {
        totalDivertedWeightKg += weight;
        currentCat.divertedWeightKg += weight;
      }

      if (dest === 'sent_to_compost') {
        organicSentToCompostKg += weight;
        // Avoided CO2e factor for organics diverted from anaerobic landfill (methane avoidance)
        estimatedAvoidedCo2eKg += weight * 0.50;
      } else if (dest === 'sent_to_recycler') {
        recyclablesSentToMRFKg += weight;
        // Categorical emissions avoided
        if (activeCategory === 'Metal') estimatedAvoidedCo2eKg += weight * 2.10;
        else if (activeCategory === 'Plastic') estimatedAvoidedCo2eKg += weight * 1.25;
        else if (activeCategory === 'Paper and cardboard') estimatedAvoidedCo2eKg += weight * 0.90;
        else if (activeCategory === 'Glass') estimatedAvoidedCo2eKg += weight * 0.35;
      } else if (dest === 'reused_locally') {
        totalDivertedWeightKg += weight;
        estimatedAvoidedCo2eKg += weight * 1.50;
      } else if (dest === 'sent_to_ewaste') {
        eWasteSentToDepotKg += weight;
        estimatedAvoidedCo2eKg += weight * 3.20;
      } else if (dest === 'sent_to_landfill') {
        landfillResidualWeightKg += weight;
      }

      // Concept 4: Verified outcome
      if (record.isVerifiedOutcome || record.verificationStage === 'facility_verified') {
        verifiedOutcomesCount++;
        verifiedWeightKg += weight;
        if (dest === 'sent_to_compost') {
          verifiedCompostHarvestedKg += weight * yieldFraction;
        }
      }

      categoryMap.set(activeCategory, currentCat);

      // Track day
      const dateKey = record.timestamp.split('T')[0] || 'Today';
      const dayData = dailyMap.get(dateKey) || { scans: 0, weightKg: 0, divertedKg: 0 };
      dayData.scans++;
      dayData.weightKg += weight;
      if (isDiverted) dayData.divertedKg += weight;
      dailyMap.set(dateKey, dayData);
    }

    const categoryBreakdown: CategoryMetric[] = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      count: stats.count,
      totalWeightKg: Number(stats.totalWeightKg.toFixed(2)),
      divertedWeightKg: Number(stats.divertedWeightKg.toFixed(2)),
      percentageOfTotal: totalAiClassifiedWeightKg > 0 ? Number(((stats.totalWeightKg / totalAiClassifiedWeightKg) * 100).toFixed(1)) : 0,
    }));

    // Sort categories by total weight descending
    categoryBreakdown.sort((a, b) => b.totalWeightKg - a.totalWeightKg);

    const userCorrectionRatePercent = totalScans > 0 ? Number(((userCorrectionCount / totalScans) * 100).toFixed(1)) : 0;
    const diversionRatePercent = totalUserConfirmedWeightKg > 0 ? Number(((totalDivertedWeightKg / totalUserConfirmedWeightKg) * 100).toFixed(1)) : 0;

    const estimatedCompost = CompostEstimator.calculateYield(organicSentToCompostKg, yieldFraction);

    // Economic metrics:
    // 1. Municipal Landfill Tipping Fee Avoidance ($85 per tonne = $0.085 per kg diverted)
    const estimatedTippingFeeSavedUsd = Number((totalDivertedWeightKg * 0.085).toFixed(2));

    // 2. Recovered Secondary Commodity & Compost Fertilizer Value
    let estimatedCommodityValueRecoveredUsd = 0;
    categoryMap.forEach((stats, cat) => {
      if (cat === 'Metal') estimatedCommodityValueRecoveredUsd += stats.divertedWeightKg * 1.20;
      else if (cat === 'Plastic') estimatedCommodityValueRecoveredUsd += stats.divertedWeightKg * 0.40;
      else if (cat === 'Paper and cardboard') estimatedCommodityValueRecoveredUsd += stats.divertedWeightKg * 0.12;
    });
    // Add value of finished organic compost humus (~$0.20 per kg)
    estimatedCommodityValueRecoveredUsd += estimatedCompost.estimatedOutputKg * 0.20;
    estimatedCommodityValueRecoveredUsd = Number(estimatedCommodityValueRecoveredUsd.toFixed(2));

    const totalEconomicValueUsd = Number((estimatedTippingFeeSavedUsd + estimatedCommodityValueRecoveredUsd).toFixed(2));

    const dailyTrends = Array.from(dailyMap.entries())
      .map(([date, d]) => ({
        date,
        scans: d.scans,
        weightKg: Number(d.weightKg.toFixed(2)),
        divertedKg: Number(d.divertedKg.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Annual Forecasting Engine (Section 12)
    const activeDays = Math.max(1, dailyMap.size);
    const avgDailyDiverted = totalDivertedWeightKg / activeDays;
    const avgDailyCo2Avoided = estimatedAvoidedCo2eKg / activeDays;
    const avgDailyEconomicValue = totalEconomicValueUsd / activeDays;

    const annualProjectedDiversionKg = Number((avgDailyDiverted * 365).toFixed(1));
    const annualProjectedCo2AvoidedKg = Number((avgDailyCo2Avoided * 365).toFixed(1));
    const annualProjectedCostSavingsUsd = Number((avgDailyEconomicValue * 365).toFixed(2));

    const forecastingStatus: 'calibrated' | 'preliminary' | 'insufficient_history' =
      activeDays >= 7 ? 'calibrated' : activeDays >= 2 ? 'preliminary' : 'insufficient_history';

    const forecastingRationale =
      forecastingStatus === 'calibrated'
        ? `Calibrated projection based on ${activeDays} distinct operational daily observations (${avgDailyDiverted.toFixed(2)} kg/day run-rate).`
        : forecastingStatus === 'preliminary'
        ? `Preliminary baseline extrapolation from ${activeDays} observation days. Higher sample size recommended for seasonal variance.`
        : `Insufficient multi-day observation history. Minimum 2 active recording days required for statistical forecasting.`;

    return {
      totalScans,
      totalAiClassifiedWeightKg: Number(totalAiClassifiedWeightKg.toFixed(2)),
      totalUserConfirmedScans,
      totalUserConfirmedWeightKg: Number(totalUserConfirmedWeightKg.toFixed(2)),
      userCorrectionCount,
      userCorrectionRatePercent,
      uncertaintyFlaggedCount,
      totalDivertedWeightKg: Number(totalDivertedWeightKg.toFixed(2)),
      organicSentToCompostKg: Number(organicSentToCompostKg.toFixed(2)),
      recyclablesSentToMRFKg: Number(recyclablesSentToMRFKg.toFixed(2)),
      textileSentToUpcycleKg: Number(textileSentToUpcycleKg.toFixed(2)),
      eWasteSentToDepotKg: Number(eWasteSentToDepotKg.toFixed(2)),
      landfillResidualWeightKg: Number(landfillResidualWeightKg.toFixed(2)),
      diversionRatePercent,
      verifiedOutcomesCount,
      verifiedWeightKg: Number(verifiedWeightKg.toFixed(2)),
      verifiedCompostHarvestedKg: Number(verifiedCompostHarvestedKg.toFixed(2)),
      estimatedCompostYieldKg: estimatedCompost.estimatedOutputKg,
      estimatedAvoidedCo2eKg: Number(estimatedAvoidedCo2eKg.toFixed(2)),
      estimatedTippingFeeSavedUsd,
      estimatedCommodityValueRecoveredUsd,
      totalEconomicValueUsd,
      annualProjectedDiversionKg,
      annualProjectedCo2AvoidedKg,
      annualProjectedCostSavingsUsd,
      forecastingStatus,
      forecastingRationale,
      categoryBreakdown,
      dailyTrends,
    };
  }

  public static generateAuditSummaryReport(metrics: SustainabilityMetrics): string {
    const dateStr = new Date().toISOString().split('T')[0];
    return `================================================================================
WASTE2WORTH AI — EXECUTIVE SUSTAINABILITY & CIRCULAR AUDIT REPORT
Generated on: ${dateStr}
Accounting Baseline: EPA WARM v15 & DEFRA GHG Conversion Guidelines
================================================================================

1. VERIFICATION FUNNEL (4-TIER SEPARATION)
--------------------------------------------------------------------------------
• Stage 1 (AI Scanned Waste):         ${metrics.totalScans} items  |  ${metrics.totalAiClassifiedWeightKg} kg
• Stage 2 (User-Confirmed Waste):     ${metrics.totalUserConfirmedScans} items  |  ${metrics.totalUserConfirmedWeightKg} kg
  - Human Corrections Recorded:       ${metrics.userCorrectionCount} (${metrics.userCorrectionRatePercent}%)
  - Uncertainty Guardrails Flagged:   ${metrics.uncertaintyFlaggedCount} items
• Stage 3 (Sent to Circular Route):   ${metrics.totalDivertedWeightKg} kg (${metrics.diversionRatePercent}% Diversion Efficiency)
• Stage 4 (Facility Verified Audit):  ${metrics.verifiedOutcomesCount} batches |  ${metrics.verifiedWeightKg} kg

2. REVENUE RECOVERY & SOIL RESTORATION
--------------------------------------------------------------------------------
• Organic Input Sent to Compost:      ${metrics.organicSentToCompostKg} kg
• Estimated Humus Output (30% Yield): ${metrics.estimatedCompostYieldKg} kg
• Verified Compost Harvested:         ${metrics.verifiedCompostHarvestedKg} kg
• Recyclables Dispatched to MRF:      ${metrics.recyclablesSentToMRFKg} kg
• Electronic WEEE Safe Drop-off:      ${metrics.eWasteSentToDepotKg} kg

3. GREENHOUSE GAS & ECONOMIC ACCOUNTING
--------------------------------------------------------------------------------
• Avoided Greenhouse Gas (GHG):       ${metrics.estimatedAvoidedCo2eKg} kg CO2e
• Landfill Tipping Fees Avoided:      $${metrics.estimatedTippingFeeSavedUsd} (at $85/tonne MSW)
• Secondary Commodity Recovery:       $${metrics.estimatedCommodityValueRecoveredUsd}
• Total Modeled Economic Value:       $${metrics.totalEconomicValueUsd}

4. ANNUALIZED RUN-RATE FORECAST
--------------------------------------------------------------------------------
• Projected Annual Diversion:         ${metrics.annualProjectedDiversionKg} kg/year
• Projected Annual Avoided GHG:       ${metrics.annualProjectedCo2AvoidedKg} kg CO2e/year
• Projected Annual Budget Savings:    $${metrics.annualProjectedCostSavingsUsd}/year
• Forecast Confidence:                ${metrics.forecastingStatus.toUpperCase()}
  (${metrics.forecastingRationale})

================================================================================
CONFIDENTIAL AUDIT SUMMARY — WASTE2WORTH AI SUSTAINABILITY LEDGER
================================================================================`;
  }
}
