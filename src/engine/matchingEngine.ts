import { ExchangeListing, ExchangeMatch } from '../types/exchange';

export class CircularMatchingEngine {
  /**
   * Evaluates compatibility between supply (surplus) and demand (wanted) listings.
   * Generates ranked circular matches with rationale, logistics advice, and avoided waste estimates.
   */
  public static findMatches(listings: ExchangeListing[]): ExchangeMatch[] {
    const supplyListings = listings.filter((l) => l.type === 'supply' && l.status === 'active');
    const demandListings = listings.filter((l) => l.type === 'demand' && l.status === 'active');

    const matches: ExchangeMatch[] = [];

    for (const supply of supplyListings) {
      for (const demand of demandListings) {
        // Must match either exact waste category or compatible cross-stream
        const categoryMatch = supply.category === demand.category;
        const crossStreamMatch =
          (supply.category === 'Paper and cardboard' && demand.category === 'Organic food scraps') ||
          (supply.category === 'Other or unknown' && demand.category === 'Other or unknown');

        if (!categoryMatch && !crossStreamMatch) {
          continue;
        }

        let score = 50; // Base compatibility for category alignment

        // Condition compatibility
        if (supply.condition === demand.condition) {
          score += 20;
        } else if (supply.condition === 'clean_sorted') {
          score += 15; // Clean supply is highly versatile
        }

        // Unit and Quantity alignment
        if (supply.unit === demand.unit) {
          score += 10;
          const ratio = Math.min(supply.quantity, demand.quantity) / Math.max(supply.quantity, demand.quantity);
          score += Math.round(ratio * 10);
        }

        // Keyword semantic synergy
        const supplyText = `${supply.title} ${supply.description} ${supply.intendedPathway}`.toLowerCase();
        const demandText = `${demand.title} ${demand.description} ${demand.intendedPathway}`.toLowerCase();

        const synergisticKeywords = [
          'coffee',
          'grounds',
          'mushroom',
          'compost',
          'brown',
          'pallet',
          'hdpe',
          'drum',
          'planter',
          'mulch',
          'cotton',
          'rag',
          'garden',
          'irrigation',
        ];

        let keywordBonus = 0;
        for (const kw of synergisticKeywords) {
          if (supplyText.includes(kw) && demandText.includes(kw)) {
            keywordBonus += 5;
          }
        }
        score = Math.min(98, score + Math.min(15, keywordBonus));

        if (score >= 60) {
          // Calculate estimated waste avoided and financial savings
          let avoidedKg = supply.quantity;
          if (supply.unit === 'pallets') avoidedKg = supply.quantity * 22; // ~22 kg per standard pallet
          if (supply.unit === 'drums') avoidedKg = supply.quantity * 1.5;

          const estimatedCostSavedUsd = Number((avoidedKg * 0.45).toFixed(2));

          let rationale = `Direct material pairing for ${supply.category}. ${supply.organization} has ${supply.quantity} ${supply.unit} matching ${demand.organization}'s requirement.`;
          if (supply.title.toLowerCase().includes('coffee') && demand.title.toLowerCase().includes('mushroom')) {
            rationale = `High-value circular bio-loop: Spent coffee grounds contain high residual cellulose and nitrogen (pH ~6.5), serving as an ideal non-composted substrate for gourmet oyster mushroom mycelium.`;
          } else if (supply.title.toLowerCase().includes('cardboard') && demand.title.toLowerCase().includes('compost')) {
            rationale = `Carbon-Nitrogen balancing: Clean shredded cardboard fulfills the high-carbon 'browns' deficit needed for active thermophilic cafeteria composting without buying virgin straw.`;
          } else if (supply.title.toLowerCase().includes('pallet')) {
            rationale = `Structural wood repurposing: HT-certified softwood pallets bypass landfill chipping fees and provide non-toxic, rot-resistant framing for raised community garden beds.`;
          } else if (supply.title.toLowerCase().includes('hdpe') || supply.title.toLowerCase().includes('container')) {
            rationale = `Container reuse: Food-grade rinsed #2 HDPE drums eliminate the need to purchase virgin polyethylene water harvesting reservoirs.`;
          }

          matches.push({
            id: `match-${supply.id}-${demand.id}`,
            supplyListing: supply,
            demandListing: demand,
            compatibilityScore: score,
            matchRationale: rationale,
            logisticsAdvice: `Intra-campus transfer: ${supply.location} ➔ ${demand.location}. Coordinated hand-off recommended via facilities electric utility cart.`,
            estimatedWasteAvoidedKg: Number(avoidedKg.toFixed(1)),
            estimatedCostSavedUsd,
          });
        }
      }
    }

    // Sort by compatibility score descending
    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}
