import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  RefreshCw,
  Scale,
  Sparkles,
} from 'lucide-react';
import { ScanRecord, WasteCategory, WASTE_CATEGORIES, DestinationStatus } from '../../types/waste';

interface HistoryViewProps {
  records: ScanRecord[];
  onUpdateRecord: (id: string, updates: Partial<ScanRecord>) => void;
  onDeleteRecord: (id: string) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  records,
  onUpdateRecord,
  onDeleteRecord,
  onResetDemoData,
  onClearAllData,
  onExportCsv,
  onExportJson,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [destinationFilter, setDestinationFilter] = useState<string>('ALL');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.detectedItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.compositionDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'ALL' ||
      r.userConfirmedCategory === categoryFilter ||
      r.predictedCategory === categoryFilter;

    const matchesDestination =
      destinationFilter === 'ALL' || r.destinationStatus === destinationFilter;

    return matchesSearch && matchesCategory && matchesDestination;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-stone-600">
              <History className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Full Lifecycle Traceability
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight mt-1">
              Scan History & Audit Trail
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Filterable transaction ledger with prediction confidence, human corrections, and verified outcomes
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onExportCsv}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={onExportJson}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>
            <button
              onClick={onResetDemoData}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
            <button
              onClick={onClearAllData}
              className="px-3 py-2 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 border border-red-200 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, notes, details..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="ALL">All Categories ({records.length})</option>
            {WASTE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Destination Filter */}
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="text-xs px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="ALL">All Destinations</option>
            <option value="sent_to_compost">Compost Tumbler</option>
            <option value="sent_to_recycler">Material Recovery (Recycler)</option>
            <option value="reused_locally">Reused Locally</option>
            <option value="sent_to_ewaste">Certified E-Waste Depot</option>
            <option value="sent_to_landfill">Landfill / Residual</option>
          </select>
        </div>
      </div>

      {/* Records Table / Cards */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
          <History className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-700">No matching audit records</h3>
          <p className="text-xs text-stone-500">
            Try adjusting your search filters or click "Reset Demo Data" to load example hostel and canteen scans.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                    {r.userConfirmedCategory}
                  </span>

                  {r.userCorrected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Human Corrected (was {r.predictedCategory})
                    </span>
                  )}

                  {r.isUncertain && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Uncertainty Flagged
                    </span>
                  )}

                  <span className="text-[11px] text-stone-400">
                    {new Date(r.timestamp).toLocaleDateString()} {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  {r.isDemoRecord && (
                    <span className="text-[10px] text-stone-400 font-mono">
                      [Demo Seed]
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-stone-900 text-base">
                  {r.detectedItemName}
                </h4>

                <p className="text-xs text-stone-500">
                  {r.compositionDetail}
                </p>

                {r.notes && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-100 font-mono">
                    Audit Note: {r.notes}
                  </p>
                )}
              </div>

              {/* Middle Metrics */}
              <div className="flex items-center gap-6 text-xs shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div>
                  <span className="text-stone-400 block text-[11px]">Weight</span>
                  <span className="font-black font-mono text-stone-800 text-sm">
                    {r.recordedWeightKg} kg
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[11px]">Destination</span>
                  <span className="font-semibold text-emerald-800 capitalize">
                    {r.destinationStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block text-[11px]">Verification</span>
                  <button
                    onClick={() =>
                      onUpdateRecord(r.id, {
                        isVerifiedOutcome: !r.isVerifiedOutcome,
                        verificationStage: !r.isVerifiedOutcome ? 'facility_verified' : 'destination_logged',
                      })
                    }
                    className={`font-semibold text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                      r.isVerifiedOutcome
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {r.isVerifiedOutcome ? 'Stage 4: Verified' : 'Mark Verified'}
                  </button>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteRecord(r.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
