import { defaultRulesEngine, WasteRulesEngine } from '../src/engine/wasteRules';
import { CompostEstimator } from '../src/engine/compostEstimator';
import { ImpactCalculator } from '../src/engine/impactCalculator';
import { WasteCategory, ScanRecord, WASTE_CATEGORIES } from '../src/types/waste';
import { DatabaseService, INITIAL_DEMO_RECORDS } from '../src/storage/db';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`✅ PASS: ${message}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING WASTE2WORTH AI AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Category Mapping
  console.log('--- Suite 1: Category Mapping & Rule Coverage ---');
  for (const cat of WASTE_CATEGORIES) {
    const rule = defaultRulesEngine.getRule(cat);
    assert(rule !== undefined, `Category "${cat}" maps to a valid rule definition`);
    assert(rule!.category === cat, `Rule definition category matches "${cat}"`);
  }

  // Test 2: Unsupported model labels & Fallback to "Other or unknown"
  console.log('\n--- Suite 2: Unsupported Model Labels & Fallback ---');
  const unsupportedResult = defaultRulesEngine.evaluate({
    category: 'NonExistentCategory' as WasteCategory,
    confidence: 0.85,
  });
  assert(
    unsupportedResult.action === 'Human Verification Required' || unsupportedResult.action === 'Residual Waste Disposal',
    'Unsupported category safely falls back to conservative action'
  );

  // Test 3: Confidence Threshold Handling
  console.log('\n--- Suite 3: Confidence Threshold & Uncertainty Guardrail ---');
  const lowConfidenceResult = defaultRulesEngine.evaluate({
    category: 'Plastic',
    confidence: 0.55,
    uncertaintyThreshold: 0.70,
    isUserConfirmed: false,
  });
  assert(lowConfidenceResult.action === 'Human Verification Required', 'Confidence below threshold triggers human verification');
  assert(lowConfidenceResult.isProvisional === true, 'Low confidence result is marked as provisional');

  const highConfidenceResult = defaultRulesEngine.evaluate({
    category: 'Plastic',
    confidence: 0.92,
    uncertaintyThreshold: 0.70,
    isUserConfirmed: false,
  });
  assert(highConfidenceResult.action === 'Recycling Collection', 'High confidence plastic routes to Recycling Collection');
  assert(highConfidenceResult.isProvisional === false, 'High confidence plastic is not provisional');

  // Test 4: Unknown or Ambiguous Classifications
  console.log('\n--- Suite 4: Unknown or Ambiguous Classifications ---');
  const unknownResult = defaultRulesEngine.evaluate({
    category: 'Other or unknown',
    confidence: 0.40,
    uncertaintyThreshold: 0.70,
  });
  assert(unknownResult.action === 'Human Verification Required', 'Other or unknown routes to Human Verification Required');

  // Test 5: Organic Waste Routing
  console.log('\n--- Suite 5: Organic Waste Routing ---');
  const organicResult = defaultRulesEngine.evaluate({
    category: 'Organic food scraps',
    confidence: 0.95,
    contaminationStatus: 'clean',
  });
  assert(organicResult.action === 'Organic Composting Route', 'Clean food scraps route to Organic Composting');
  assert(organicResult.compostEligible === true, 'Clean food scraps are flagged as compost eligible');

  // Test 6: Electronic Waste & Battery Hazard Handling
  console.log('\n--- Suite 6: Electronic Waste & Battery Safety Handling ---');
  const eWasteResult = defaultRulesEngine.evaluate({
    category: 'Electronic waste',
    confidence: 0.88,
    itemComposition: 'Printed circuit board',
  });
  assert(eWasteResult.action === 'Specialized E-Waste Drop-off', 'E-waste routes to Specialized E-Waste Drop-off');
  assert(eWasteResult.localRuleVerificationRequired === true, 'E-waste requires local rule verification');

  const batteryResult = defaultRulesEngine.evaluate({
    category: 'Electronic waste',
    confidence: 0.90,
    itemComposition: 'Lithium polymer battery cell',
  });
  assert(batteryResult.action === 'Hazardous Material Handling', 'Battery component routes to Hazardous Material Handling');
  assert(batteryResult.handlingCaution.includes('SAFETY'), 'Battery caution warns of fire risk');

  // Test 7: Contaminated and Mixed Materials (Greasy Pizza Box)
  console.log('\n--- Suite 7: Contaminated Materials Handling ---');
  const greasyPizzaBox = defaultRulesEngine.evaluate({
    category: 'Paper and cardboard',
    confidence: 0.85,
    contaminationStatus: 'light_food_residue',
    itemComposition: 'Cardboard pizza box stained with grease',
  });
  assert(
    greasyPizzaBox.action === 'Organic Composting Route',
    'Greasy unbleached cardboard is diverted to compost rather than ruined paper recycling'
  );

  const soiledPlastic = defaultRulesEngine.evaluate({
    category: 'Plastic',
    confidence: 0.90,
    contaminationStatus: 'heavily_soiled',
  });
  assert(
    soiledPlastic.action === 'Residual Waste Disposal',
    'Heavily soiled un-rinseable plastic routes to Residual Waste Disposal'
  );

  // Test 8: Compost Yield Calculations
  console.log('\n--- Suite 8: Compost Output Calculations ---');
  const compostCalc1 = CompostEstimator.calculateYield(10, 0.30);
  assert(compostCalc1.estimatedOutputKg === 3.0, '10 kg at 0.30 yield produces exactly 3.0 kg estimated output');
  assert(compostCalc1.moistureLossKg === 7.0, '10 kg input yields 7.0 kg mass loss from moisture/respiration');
  assert(compostCalc1.disclaimer.length > 0, 'Compost estimator provides mandatory scientific disclaimer');

  // Test yield fraction clamping (boundary checks)
  const clampedLow = CompostEstimator.calculateYield(10, 0.05); // below min 0.15
  assert(clampedLow.yieldFraction === CompostEstimator.MIN_YIELD_FRACTION, 'Clamps yield fraction to minimum 0.15');

  const clampedHigh = CompostEstimator.calculateYield(10, 0.99); // above max 0.45
  assert(clampedHigh.yieldFraction === CompostEstimator.MAX_YIELD_FRACTION, 'Clamps yield fraction to maximum 0.45');

  // Test negative input
  const negativeInput = CompostEstimator.calculateYield(-5, 0.30);
  assert(negativeInput.organicInputKg === 0 && negativeInput.estimatedOutputKg === 0, 'Handles negative input safely');

  // Test 9: Empty Dashboard State
  console.log('\n--- Suite 9: Empty Dashboard State Resilience ---');
  const emptyMetrics = ImpactCalculator.calculate([], 0.30);
  assert(emptyMetrics.totalScans === 0, 'Empty record array produces 0 scans');
  assert(emptyMetrics.totalAiClassifiedWeightKg === 0, 'Empty record array produces 0 kg weight');
  assert(emptyMetrics.diversionRatePercent === 0, 'Empty record array produces 0% diversion rate without division by zero');
  assert(emptyMetrics.categoryBreakdown.length === 0, 'Empty record array produces empty category breakdown');

  // Test 10: Measured vs Estimated Metric Separation
  console.log('\n--- Suite 10: Four-Tier Ledger Separation ---');
  const demoMetrics = ImpactCalculator.calculate(INITIAL_DEMO_RECORDS, 0.30);

  // Concept 1: AI Scanned Weight
  assert(demoMetrics.totalAiClassifiedWeightKg > 0, 'Tracks AI-classified total volume (Concept 1)');
  // Concept 2: User Confirmed Weight
  assert(demoMetrics.totalUserConfirmedWeightKg > 0, 'Tracks User-confirmed volume (Concept 2)');
  // Concept 3: Sent to Destination
  assert(demoMetrics.totalDivertedWeightKg > 0, 'Tracks Waste recorded sent to destination (Concept 3)');
  // Concept 4: Verified Outcomes
  assert(demoMetrics.verifiedOutcomesCount > 0, 'Tracks Verified processing outcomes independently (Concept 4)');
  assert(
    demoMetrics.verifiedWeightKg <= demoMetrics.totalDivertedWeightKg,
    'Verified outcome weight is strictly a verified subset of diverted weight'
  );
  assert(demoMetrics.userCorrectionCount > 0, 'Demonstrates human-in-the-loop corrections tracking');

  // Test 11: End-to-End Scan-to-Recommendation Integration Workflow
  console.log('\n--- Suite 11: End-to-End Integration Workflow ---');
  const scannedItem = {
    category: 'Metal' as WasteCategory,
    confidence: 0.96,
    weightKg: 0.015,
  };
  const decision = defaultRulesEngine.evaluate({
    category: scannedItem.category,
    confidence: scannedItem.confidence,
    contaminationStatus: 'clean_rinsed',
  });
  assert(decision.action === 'Recycling Collection', 'E2E workflow generates clean recycling recommendation');
  assert(decision.preparationSteps.length > 0, 'E2E recommendation provides actionable preparation steps');

  // Test 12: Circular Resource Matching Engine
  console.log('\n--- Suite 12: Circular Resource Matching Engine ---');
  const { CircularMatchingEngine } = await import('../src/engine/matchingEngine');
  const { INITIAL_EXCHANGE_LISTINGS } = await import('../src/data/sampleExchangeListings');
  const matches = CircularMatchingEngine.findMatches(INITIAL_EXCHANGE_LISTINGS);
  assert(matches.length > 0, 'Matching engine identifies viable supply-demand circular synergies');
  assert(matches[0].compatibilityScore >= 60, 'Top circular match meets minimum 60% compatibility threshold');
  assert(matches[0].logisticsAdvice.length > 0, 'Generates intra-campus transfer logistics guidance');
  assert(matches[0].estimatedWasteAvoidedKg > 0, 'Calculates non-zero avoided waste weight for exchange match');

  // Test 13: Economic Financial Savings Valuation
  console.log('\n--- Suite 13: Economic Financial Savings Valuation ---');
  assert(demoMetrics.estimatedTippingFeeSavedUsd >= 0, 'Calculates municipal landfill tipping fee savings');
  assert(demoMetrics.totalEconomicValueUsd >= demoMetrics.estimatedTippingFeeSavedUsd, 'Total economic value incorporates secondary commodity value');

  // Test 14: Annual Run-Rate Forecasting
  console.log('\n--- Suite 14: Annual Run-Rate Forecasting ---');
  assert(demoMetrics.annualProjectedDiversionKg >= demoMetrics.totalDivertedWeightKg, 'Annual projected diversion is proportional to run-rate');
  assert(demoMetrics.annualProjectedCo2AvoidedKg >= 0, 'Annual projected avoided CO2 is non-negative');
  assert(demoMetrics.forecastingStatus === 'calibrated' || demoMetrics.forecastingStatus === 'preliminary', 'Forecasting status matches sample data observation days');

  // Test 15: Executive Audit Summary Report Generation
  console.log('\n--- Suite 15: Executive Audit Summary Report Generation ---');
  const auditReport = ImpactCalculator.generateAuditSummaryReport(demoMetrics);
  assert(auditReport.includes('EXECUTIVE SUSTAINABILITY'), 'Generates valid executive audit report header');
  assert(auditReport.includes('EPA WARM'), 'Includes EPA WARM baseline attribution');
  assert(auditReport.includes('4-TIER SEPARATION'), 'Verifies 4-tier separation in generated report');

  console.log('\n====================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} AUTOMATED TESTS PASSED SUCCESSFULLY!`);
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
