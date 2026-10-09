export interface CompostYieldCalculation {
  organicInputKg: number;
  yieldFraction: number; // e.g. 0.30
  estimatedOutputKg: number;
  moistureLossKg: number;
  recommendedBrownsKg: number; // 2:1 dry matter ratio
  potentialGardenAreaSqM: number; // e.g. 1 kg mature compost treats ~0.5 - 1 m² soil
  feedstockGuidance: string;
  applicationGuidance: string[];
  safetyCautions: string[];
  disclaimer: string;
}

export class CompostEstimator {
  public static readonly DEFAULT_YIELD_FRACTION = 0.30;
  public static readonly MIN_YIELD_FRACTION = 0.15;
  public static readonly MAX_YIELD_FRACTION = 0.45;

  /**
   * Calculates illustrative compost output from organic waste input.
   *
   * Formula: Estimated compost output = confirmed organic input sent for composting × configured assumed yield fraction
   *
   * Biological rationale: During active thermophilic aerobic composting, microorganisms
   * metabolize labile carbohydrates, dissipating 55% - 70% of initial wet mass as water vapor (H2O)
   * and respiratory carbon dioxide (CO2).
   */
  public static calculateYield(
    organicInputKg: number,
    yieldFraction: number = CompostEstimator.DEFAULT_YIELD_FRACTION
  ): CompostYieldCalculation {
    const sanitizedInput = Math.max(0, Number(organicInputKg) || 0);
    const clampedYield = Math.min(
      CompostEstimator.MAX_YIELD_FRACTION,
      Math.max(CompostEstimator.MIN_YIELD_FRACTION, Number(yieldFraction) || CompostEstimator.DEFAULT_YIELD_FRACTION)
    );

    const estimatedOutputKg = Number((sanitizedInput * clampedYield).toFixed(2));
    const moistureLossKg = Number((sanitizedInput - estimatedOutputKg).toFixed(2));
    // Rule of thumb: Add approximately 1.5 - 2x dry carbon material (browns) by dry equivalent
    const recommendedBrownsKg = Number((sanitizedInput * 0.75).toFixed(2));
    // Agronomic application: 1 kg finished compost per 1.5 square meters for top-dressing
    const potentialGardenAreaSqM = Number((estimatedOutputKg * 1.5).toFixed(1));

    return {
      organicInputKg: sanitizedInput,
      yieldFraction: clampedYield,
      estimatedOutputKg,
      moistureLossKg,
      recommendedBrownsKg,
      potentialGardenAreaSqM,
      feedstockGuidance:
        'Ideal feedstock mix: 1 part nitrogen-dense wet kitchen scraps (coffee grounds, fruit peels, vegetable ends) to 2 parts carbon-dense dry materials (dry fallen leaves, torn unprinted cardboard, straw) to achieve a balanced 25:1 to 30:1 C:N ratio.',
      applicationGuidance: [
        'Top-dressing: Spread 1 to 2 cm of fully cured compost onto raised garden beds or around the drip line of fruit trees.',
        'Potting blend: Mix 1 part mature compost with 3 parts soil/coir for container herbs and vegetables.',
        'Compost tea: Steep finished compost in aerated water for 24 hours to create a liquid foliar microbe boost.'
      ],
      safetyCautions: [
        'DO NOT apply hot, foul-smelling, or immature compost directly to seeds or young seedlings; volatile fatty acids in uncured compost burn tender plant root systems (phytotoxicity).',
        'Verify compost maturity: Fully cured compost should smell earthy like a forest floor, have ambient temperature (no longer heating internally), and exhibit dark, crumbly texture.',
        'Exclude carnivorous pet waste, diseased foliage, and toxic weeds going to seed.'
      ],
      disclaimer:
        'Illustrative mathematical estimate only. Actual compost yield varies considerably based on moisture content, ambient temperature, microbial activity, pile aeration, and feedstock composition (lignin vs. simple sugar ratios).'
    };
  }
}
