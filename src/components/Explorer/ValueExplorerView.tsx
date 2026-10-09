import React, { useState } from 'react';
import {
  Compass,
  Recycle,
  Leaf,
  Layers,
  Cpu,
  Trash2,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { WASTE_CATEGORIES, WasteCategory, DisposalRuleDefinition } from '../../types/waste';
import disposalRulesData from '../../data/disposal_rules.json';

export const ValueExplorerView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const rules: DisposalRuleDefinition[] = disposalRulesData as DisposalRuleDefinition[];

  const filteredRules = rules.filter((rule) => {
    const matchesCat = selectedCategory === 'ALL' || rule.category === selectedCategory;
    const matchesSearch =
      rule.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-teal-700">
          <Compass className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Circularity Knowledge Base
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Waste-to-Value Directory & Material Rules
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-3xl leading-relaxed">
          Circularity is not one-size-fits-all. Material composition, mechanical recycling limitations, contamination thresholds, and local processing capabilities dictate whether an item can be composted, remelted, or downcycled.
        </p>

        {/* Search & Filter Bar */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search materials, resin codes, cautions, or handling rules..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex overflow-x-auto gap-1.5 scrollbar-none pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Streams ({rules.length})
            </button>
            {WASTE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRules.map((rule) => (
          <div
            key={rule.category}
            className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            {/* Header pill */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-800 border border-stone-200">
                {rule.category}
              </span>

              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                  rule.compostEligible
                    ? 'bg-lime-100 text-lime-800'
                    : rule.recyclableEligible
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {rule.defaultAction}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-stone-900">{rule.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                {rule.explanation}
              </p>
            </div>

            {/* Caution Callout */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Contamination Caution & Pitfall:
              </span>
              <p className="leading-relaxed">{rule.cautions}</p>
            </div>

            {/* Preparation Steps */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Standard Preparation Protocol:
              </span>
              <ul className="space-y-1.5">
                {rule.prepSteps.map((step, idx) => (
                  <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Environmental Factor Footnote */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>
                Avoided GHG Factor: <strong className="text-emerald-700">{rule.carbonFactorKgCo2PerKg} kg CO₂e / kg</strong>
              </span>
              <span>
                {rule.requiresLocalCheck ? '⚠️ Local council check required' : '✅ Standard global protocol'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Plastics Resin Guide Quick Reference (#1 to #7) */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-8 text-stone-100 border border-stone-800 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Plastics Resin Identification Guide (#1 – #7)
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Molded polymer numbers indicate molecular resin structure, not automatic curbside acceptance.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { code: '#1 PETE', name: 'Water Bottles', status: 'Widely Recycled', color: 'text-emerald-400' },
            { code: '#2 HDPE', name: 'Milk Jugs / Shampoo', status: 'Widely Recycled', color: 'text-emerald-400' },
            { code: '#3 PVC', name: 'Pipes / Cling Film', status: 'Rarely Recycled', color: 'text-red-400' },
            { code: '#4 LDPE', name: 'Grocery Bags', status: 'Store Drop-off', color: 'text-amber-400' },
            { code: '#5 PP', name: 'Yogurt Tubs / Caps', status: 'Growing Acceptance', color: 'text-emerald-400' },
            { code: '#6 PS', name: 'Styrofoam / Cutlery', status: 'Residual Landfill', color: 'text-red-400' },
            { code: '#7 OTHER', name: 'Multi-layer / Polycarb', status: 'Check Local Rule', color: 'text-amber-400' },
          ].map((item) => (
            <div key={item.code} className="bg-stone-800/80 p-3 rounded-2xl border border-stone-700 space-y-1">
              <span className={`text-base font-black font-mono block ${item.color}`}>
                {item.code}
              </span>
              <p className="text-xs font-bold text-stone-200 truncate">{item.name}</p>
              <span className="text-[10px] text-stone-400 block">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
