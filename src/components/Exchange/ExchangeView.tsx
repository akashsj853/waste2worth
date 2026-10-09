import React, { useState, useMemo } from 'react';
import {
  Repeat,
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Building,
  Mail,
  User,
  ExternalLink,
  ShieldAlert,
  Scale,
  DollarSign,
  PackageCheck,
  X,
  Share2,
} from 'lucide-react';
import { ExchangeListing, ExchangeMatch, ListingType, MaterialCondition } from '../../types/exchange';
import { WasteCategory, WASTE_CATEGORIES } from '../../types/waste';
import { CircularMatchingEngine } from '../../engine/matchingEngine';

interface ExchangeViewProps {
  listings: ExchangeListing[];
  onAddListing: (listing: ExchangeListing) => void;
  onUpdateListing: (id: string, updates: Partial<ExchangeListing>) => void;
}

export const ExchangeView: React.FC<ExchangeViewProps> = ({
  listings,
  onAddListing,
  onUpdateListing,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'supply' | 'demand'>('matches');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<ExchangeMatch | null>(null);
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string | null>(null);

  // New Listing Form State
  const [newType, setNewType] = useState<ListingType>('supply');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<WasteCategory>('Organic food scraps');
  const [newQuantity, setNewQuantity] = useState('25');
  const [newUnit, setNewUnit] = useState<ExchangeListing['unit']>('kg');
  const [newCondition, setNewCondition] = useState<MaterialCondition>('clean_sorted');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPathway, setNewPathway] = useState('');

  // Calculate Matches via Matching Engine
  const matches = useMemo(() => {
    return CircularMatchingEngine.findMatches(listings);
  }, [listings]);

  // Aggregate stats
  const totalPotentialDivertedKg = useMemo(() => {
    return matches.reduce((acc, m) => acc + m.estimatedWasteAvoidedKg, 0);
  }, [matches]);

  const totalCostSavedUsd = useMemo(() => {
    return matches.reduce((acc, m) => acc + m.estimatedCostSavedUsd, 0);
  }, [matches]);

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const matchesType = activeTab === 'supply' ? l.type === 'supply' : l.type === 'demand';
    const matchesCat = categoryFilter === 'ALL' || l.category === categoryFilter;
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCat && matchesSearch;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newOrg) return;

    const listing: ExchangeListing = {
      id: `list-${Date.now().toString(36)}`,
      type: newType,
      title: newTitle,
      category: newCategory,
      quantity: parseFloat(newQuantity) || 1,
      unit: newUnit,
      condition: newCondition,
      description: newDescription,
      location: newLocation,
      organization: newOrg,
      contactPerson: newContact || 'Authorized Representative',
      contactEmail: newEmail || 'sustainability@campus.edu',
      intendedPathway: newPathway || 'Secondary circular repurposing',
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    onAddListing(listing);
    setIsPostModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewOrg('');
  };

  const handleExpressInterest = (match: ExchangeMatch) => {
    setSelectedMatch(match);
    setContactSuccessMsg(null);
  };

  const handleSendInquiry = () => {
    setContactSuccessMsg(
      `Inquiry dispatched! Connected ${selectedMatch?.demandListing.organization} with ${selectedMatch?.supplyListing.organization}. An intra-campus transfer manifest ticket has been generated.`
    );
    setTimeout(() => {
      setSelectedMatch(null);
      setContactSuccessMsg(null);
    }, 3500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-950 via-stone-900 to-emerald-950 rounded-3xl p-6 sm:p-10 border border-teal-800/40 text-stone-100 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-900/60 text-teal-300 border border-teal-700/60">
              <Repeat className="w-3.5 h-3.5 text-teal-400" />
              Circular Economy Resource Exchange
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Byproduct & Material Matching
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              One department's waste is another's raw material. Connect cafeteria spent coffee grounds to biology mushroom labs, warehouse wooden pallets to student garden planters, and packaging cardboard to compost tumblers.
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-black text-sm shadow-lg shadow-teal-950/40 flex items-center gap-2 self-start sm:self-auto cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <PlusCircle className="w-4 h-4 text-stone-950" />
            Post Material Listing
          </button>
        </div>

        {/* Circular Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-teal-900/60">
          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block font-medium">Active Listings</span>
            <span className="text-2xl font-black text-white font-mono">{listings.length}</span>
            <span className="text-[11px] text-teal-400 block mt-0.5">Supply & Demand</span>
          </div>

          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block font-medium">AI Circular Matches</span>
            <span className="text-2xl font-black text-teal-300 font-mono">{matches.length}</span>
            <span className="text-[11px] text-teal-400 block mt-0.5">Automated pairings</span>
          </div>

          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block font-medium">Waste Diverted Potential</span>
            <span className="text-2xl font-black text-lime-400 font-mono">
              {totalPotentialDivertedKg.toFixed(0)} <span className="text-xs text-stone-400">kg</span>
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Kept in active use</span>
          </div>

          <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-xs text-stone-400 block font-medium">Procurement Value Saved</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ${totalCostSavedUsd.toFixed(0)}
            </span>
            <span className="text-[11px] text-emerald-300/80 block mt-0.5">Displaced virgin buying</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Matches vs Supply vs Demand) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-stone-200/80 p-1.5 rounded-2xl border border-stone-300">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-300" />
            AI Matched Synergies ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'supply'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            Available Surplus ({listings.filter((l) => l.type === 'supply').length})
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'demand'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            Materials Wanted ({listings.filter((l) => l.type === 'demand').length})
          </button>
        </div>

        {/* Filter & Search */}
        {activeTab !== 'matches' && (
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings..."
                className="text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="ALL">All Categories</option>
              {WASTE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: AI Circular Matches */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              Ranked pairings calculated by the <strong>Circular Matching Engine</strong> based on chemical compatibility, cleanliness condition, and campus logistics:
            </span>
            <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              Zero Waste to Landfill
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Match header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                      {match.compatibilityScore}% Synergy Score
                    </span>
                    <span className="text-xs text-stone-500">
                      Material Category: <strong className="text-stone-800">{match.supplyListing.category}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5" />
                      {match.estimatedWasteAvoidedKg} kg diverted
                    </span>
                    <span className="text-teal-700 font-bold flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      ~${match.estimatedCostSavedUsd} saved
                    </span>
                  </div>
                </div>

                {/* Supply vs Demand flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Source (Supply) */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-900 bg-teal-100/80 px-2 py-0.5 rounded">
                        Available Surplus (Supply)
                      </span>
                      <span className="font-mono font-bold text-stone-700">
                        {match.supplyListing.quantity} {match.supplyListing.unit}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {match.supplyListing.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {match.supplyListing.description}
                    </p>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      <span>{match.supplyListing.organization} ({match.supplyListing.location})</span>
                    </div>
                  </div>

                  {/* Destination (Demand) */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-lime-900 bg-lime-100/80 px-2 py-0.5 rounded">
                        Wanted Requirement (Demand)
                      </span>
                      <span className="font-mono font-bold text-stone-700">
                        {match.demandListing.quantity} {match.demandListing.unit}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {match.demandListing.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {match.demandListing.description}
                    </p>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      <span>{match.demandListing.organization} ({match.demandListing.location})</span>
                    </div>
                  </div>
                </div>

                {/* Match Rationale & Logistics */}
                <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-200/80 text-xs text-teal-950 space-y-1.5">
                  <span className="font-bold text-teal-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    AI Circular Chemistry & Utilization Rationale:
                  </span>
                  <p className="leading-relaxed opacity-95">{match.matchRationale}</p>
                  <p className="text-[11px] text-teal-800 font-mono pt-1">
                    📍 Logistics: {match.logisticsAdvice}
                  </p>
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleExpressInterest(match)}
                    className="px-4 py-2 rounded-xl text-xs font-black bg-stone-900 hover:bg-stone-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Connect Departments & Initiate Transfer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2 & 3: Supply or Demand Listings Grid */}
      {activeTab !== 'matches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {listing.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      listing.condition === 'clean_sorted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {listing.condition.replace(/_/g, ' ')}
                  </span>
                </div>

                <h3 className="font-bold text-base text-stone-900 line-clamp-2">
                  {listing.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Quantity</span>
                  <span className="font-bold font-mono text-stone-900">
                    {listing.quantity} {listing.unit}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-500 text-[11px] truncate">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{listing.location}</span>
                </div>

                <div className="flex items-center gap-1.5 text-stone-500 text-[11px] truncate">
                  <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{listing.organization}</span>
                </div>

                <a
                  href={`mailto:${listing.contactEmail}?subject=Circular Exchange Inquiry: ${encodeURIComponent(listing.title)}`}
                  className="w-full mt-2 py-2 rounded-xl text-center text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors block"
                >
                  Contact {listing.contactPerson}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Material Listing Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-teal-600" />
                Post Circular Material Listing
              </h3>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewType('supply')}
                  className={`flex-1 py-2.5 rounded-xl font-bold border transition-colors ${
                    newType === 'supply'
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  We have Surplus (Supply)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('demand')}
                  className={`flex-1 py-2.5 rounded-xl font-bold border transition-colors ${
                    newType === 'demand'
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  We Need Material (Demand)
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Listing Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Clean Rinsed HDPE 20L Drums"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Waste Stream Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as WasteCategory)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none"
                  >
                    {WASTE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Material Condition:</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as MaterialCondition)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none"
                  >
                    <option value="clean_sorted">Clean & Sorted</option>
                    <option value="usable_intact">Intact / Reusable</option>
                    <option value="shredded">Shredded / Downcycled</option>
                    <option value="requires_cleaning">Requires Rinsing</option>
                    <option value="raw_unprocessed">Raw Unprocessed</option>
                  </select>
                </div>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Quantity:</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Unit of Measure:</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value as ExchangeListing['unit'])}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none"
                  >
                    <option value="kg">kg (weight)</option>
                    <option value="units">units (count)</option>
                    <option value="pallets">pallets</option>
                    <option value="drums">drums</option>
                    <option value="liters">liters</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">Description & Specs:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail purity, previous usage, contamination checks..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              {/* Location & Organization */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Campus Location:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Quad Lab 3"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Department / Lab:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chemical Engineering"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Publish Material to Circular Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect / Manifest Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-black text-stone-900">
                Initiate Intra-Campus Material Hand-off
              </h3>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
              <p>
                <strong>Synergy Match:</strong> {selectedMatch.supplyListing.title} ➔ {selectedMatch.demandListing.title}
              </p>
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 space-y-1">
                <span className="font-bold block">Internal Transfer Routing:</span>
                <p>Pick-up: <strong>{selectedMatch.supplyListing.location}</strong> ({selectedMatch.supplyListing.contactPerson})</p>
                <p>Delivery: <strong>{selectedMatch.demandListing.location}</strong> ({selectedMatch.demandListing.contactPerson})</p>
              </div>

              {contactSuccessMsg ? (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  {contactSuccessMsg}
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <p className="text-stone-500">
                    Click below to generate a campus circular transfer ticket and send an electronic dispatch notification to both parties.
                  </p>
                  <button
                    onClick={handleSendInquiry}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Confirm Transfer & Dispatch Manifest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
