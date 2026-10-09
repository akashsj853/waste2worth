import {
  WasteCategory,
  ContaminationStatus,
  DecisionResult,
  DisposalRuleDefinition,
  DisposalAction,
} from '../types/waste';
import disposalRulesData from '../data/disposal_rules.json';

export class WasteRulesEngine {
  private rules: Map<WasteCategory, DisposalRuleDefinition>;

  constructor(customRules?: DisposalRuleDefinition[]) {
    this.rules = new Map();
    const sourceRules = customRules || (disposalRulesData as DisposalRuleDefinition[]);
    sourceRules.forEach((rule) => {
      this.rules.set(rule.category, rule);
    });
  }

  public getRule(category: WasteCategory): DisposalRuleDefinition | undefined {
    return this.rules.get(category);
  }

  public getAllRules(): DisposalRuleDefinition[] {
    return Array.from(this.rules.values());
  }

  /**
   * Evaluates input parameters deterministically to produce a safe disposal recommendation.
   * Safety critical: Does not rely on generative LLMs for disposal rules.
   */
  public evaluate(params: {
    category: WasteCategory;
    confidence: number;
    uncertaintyThreshold?: number;
    contaminationStatus?: ContaminationStatus;
    itemComposition?: string;
    isUserConfirmed?: boolean;
  }): DecisionResult {
    const {
      category,
      confidence,
      uncertaintyThreshold = 0.70,
      contaminationStatus = 'clean',
      itemComposition = '',
      isUserConfirmed = false,
    } = params;

    const baseRule = this.rules.get(category) || this.rules.get('Other or unknown')!;
    const lowerComposition = itemComposition.toLowerCase();

    // 1. Check for Electronic Waste & Hazardous Lithium/Battery components
    if (category === 'Electronic waste' || lowerComposition.includes('battery') || lowerComposition.includes('lithium')) {
      const isBattery = lowerComposition.includes('battery') || lowerComposition.includes('cell');
      return {
        action: isBattery ? 'Hazardous Material Handling' : 'Specialized E-Waste Drop-off',
        explanation: isBattery
          ? 'Contains volatile battery chemistries prone to thermal runaway compactor fires. Must be dropped off at certified battery take-back points.'
          : baseRule.explanation,
        handlingCaution: 'CRITICAL SAFETY: Never discard in regular rubbish or co-mingled recycling. Tape terminals if exposed.',
        preparationSteps: [
          'Cover battery contact terminals with insulating tape.',
          'Isolate from flammable materials.',
          'Bring to an authorized WEEE depot or battery drop bin.'
        ],
        localRuleVerificationRequired: true,
        isProvisional: !isUserConfirmed && confidence < uncertaintyThreshold,
        potentialValueRoute: 'Recovery of copper, gold, cobalt, and rare earths via certified pyrometallurgy.',
        compostEligible: false,
        recyclableEligible: false,
      };
    }

    // 2. Uncertainty Guardrail: Low confidence or unknown item
    if (!isUserConfirmed && (confidence < uncertaintyThreshold || category === 'Other or unknown')) {
      return {
        action: 'Human Verification Required',
        explanation: `Classifier confidence (${(confidence * 100).toFixed(1)}%) is below the safe autonomous routing threshold of ${(uncertaintyThreshold * 100).toFixed(0)}%. Manual material verification is mandatory to prevent batch contamination.`,
        handlingCaution: 'Do not sort based on automated prediction alone. Check item label, resin stamp, or material texture before disposal.',
        preparationSteps: [
          'Examine item for recycling symbols (#1 to #7) or compostable certifications.',
          'Confirm whether item is single-material or a fused multi-layer composite.',
          'Select the verified category using the manual override button above.'
        ],
        localRuleVerificationRequired: true,
        isProvisional: true,
        potentialValueRoute: 'Pending human verification of composition.',
        compostEligible: false,
        recyclableEligible: false,
      };
    }

    // 3. Contamination: Soiled Paper & Cardboard (Special Case: Greasy pizza box/food container)
    if (category === 'Paper and cardboard' && (contaminationStatus === 'light_food_residue' || contaminationStatus === 'heavily_soiled' || lowerComposition.includes('pizza') || lowerComposition.includes('grease'))) {
      return {
        action: 'Organic Composting Route',
        explanation: 'Food-grade paper and unbleached cardboard saturated with vegetable oils or food residue ruin paper recycling vats (oil cannot be separated during repulping). However, unbleached greasy fiber readily decomposes aerobically in compost piles as a carbonaceous "brown".',
        handlingCaution: 'Ensure there are no plastic tape strips, wax coatings, or glossy laminated films remaining.',
        preparationSteps: [
          'Rip cardboard into small palm-sized pieces.',
          'Ensure dry carbon balance (mix with wet nitrogen food scraps).',
          'If home composting is unavailable and local green bins forbid paper, place in residual waste.'
        ],
        localRuleVerificationRequired: true,
        isProvisional: false,
        potentialValueRoute: 'Provides carbon structure (C:N balance) and aerating bulk density to active compost piles.',
        compostEligible: true,
        recyclableEligible: false,
      };
    }

    // 4. Heavily Soiled Plastic or Metal
    if ((category === 'Plastic' || category === 'Metal') && contaminationStatus === 'heavily_soiled') {
      return {
        action: 'Residual Waste Disposal',
        explanation: `Severely contaminated ${category.toLowerCase()} with putrescible or toxic residue compromises sorting automation and attracts disease vectors at material recovery facilities.`,
        handlingCaution: 'If container cannot be safely rinsed with cold/greywater, do not place into clean recycling stream.',
        preparationSteps: [
          'Attempt quick rinse with wastewater or wipe out heavy residues.',
          'If residue cannot be removed, route to non-divertible residual bin.',
          'Prevent cross-contaminating other dry recyclables in the same bin.'
        ],
        localRuleVerificationRequired: true,
        isProvisional: false,
        potentialValueRoute: 'Energy-from-waste (incineration) or engineered landfill containment.',
        compostEligible: false,
        recyclableEligible: false,
      };
    }

    // 5. Plastic - Rigid vs Film check
    if (category === 'Plastic') {
      const isFilmOrBag = lowerComposition.includes('bag') || lowerComposition.includes('film') || lowerComposition.includes('wrap') || lowerComposition.includes('pouch');
      if (isFilmOrBag) {
        return {
          action: 'Specialized E-Waste Drop-off', // Or store soft plastics drop-off
          explanation: 'Thin plastic film, grocery bags, and plastic pouches snag rotating trommels and disc screens in curbside MRFs, leading to machinery shutdowns.',
          handlingCaution: 'Do not put loose plastic bags in standard curbside mixed recycling.',
          preparationSteps: [
            'Bundle clean, dry film bags inside a single bag.',
            'Take to grocery store front-of-store plastic bag collection receptacles.',
            'If drop-off bins are unavailable locally, discard with residual waste.'
          ],
          localRuleVerificationRequired: true,
          isProvisional: false,
          potentialValueRoute: 'Extruded composite plastic lumber or outdoor decking.',
          compostEligible: false,
          recyclableEligible: false,
        };
      }
    }

    // 6. Default Category-Driven Action
    return {
      action: baseRule.defaultAction,
      explanation: baseRule.explanation,
      handlingCaution: baseRule.cautions,
      preparationSteps: baseRule.prepSteps,
      localRuleVerificationRequired: baseRule.requiresLocalCheck,
      isProvisional: false,
      potentialValueRoute: category === 'Organic food scraps'
        ? 'Nutrient-rich microbial humus to substitute synthetic nitrogen-phosphorus fertilizer.'
        : `Secondary commodity processing yielding certified recycled ${category.toLowerCase()}.`,
      compostEligible: baseRule.compostEligible,
      recyclableEligible: baseRule.recyclableEligible,
    };
  }
}

export const defaultRulesEngine = new WasteRulesEngine();
