import React from 'react';
import { Sliders, X, RefreshCw, Trash2 } from 'lucide-react';
import { AppSettings } from '../storage/db';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetDemoData: () => void;
  onClearAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDemoData,
  onClearAllData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 text-stone-900 font-extrabold text-base">
            <Sliders className="w-4 h-4 text-emerald-600" />
            Decision Engine & Model Settings
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Uncertainty Threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Autonomous Uncertainty Threshold:</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {(settings.uncertaintyThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.50"
            max="0.90"
            step="0.05"
            value={settings.uncertaintyThreshold}
            onChange={(e) => onUpdateSettings({ uncertaintyThreshold: parseFloat(e.target.value) })}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <p className="text-[11px] text-stone-500 leading-relaxed">
            AI classifications below this confidence score trigger human-in-the-loop inspection.
          </p>
        </div>

        {/* Compost Yield Fraction */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>Assumed Compost Yield Fraction:</span>
            <span className="font-mono text-lime-800 bg-lime-100 px-2 py-0.5 rounded border border-lime-200">
              {(settings.compostYieldFraction * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.15"
            max="0.45"
            step="0.01"
            value={settings.compostYieldFraction}
            onChange={(e) => onUpdateSettings({ compostYieldFraction: parseFloat(e.target.value) })}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-lime-600"
          />
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Illustrative conversion rate for organic waste sent to aerobic composting (default 30%).
          </p>
        </div>

        {/* Environmental Atmosphere & Realistic Background */}
        <div className="pt-2 border-t border-stone-100 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
            <span>Realistic Environment Atmosphere:</span>
            <span className="capitalize text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-semibold">
              {settings.background.theme.replace('-', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {[
              { id: 'biosphere', label: '🌿 Biosphere' },
              { id: 'circular-lab', label: '🏭 Circular Lab' },
              { id: 'topographic', label: '🗺️ Topo GIS' },
              { id: 'clean-studio', label: '☕ Studio' },
              { id: 'twilight-slate', label: '🌙 Twilight' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    background: {
                      ...settings.background,
                      theme: t.id as any,
                    },
                  })
                }
                className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                  settings.background.theme === t.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-stone-600">Backdrop Intensity:</span>
            <span className="text-xs font-mono text-stone-700">
              {Math.round(settings.background.intensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.65"
            step="0.05"
            value={settings.background.intensity}
            onChange={(e) =>
              onUpdateSettings({
                background: {
                  ...settings.background,
                  intensity: parseFloat(e.target.value),
                },
              })
            }
            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Ambient Floating Motes</span>
            <input
              type="checkbox"
              checked={settings.background.showParticles}
              onChange={(e) =>
                onUpdateSettings({
                  background: {
                    ...settings.background,
                    showParticles: e.target.checked,
                  },
                })
              }
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
            />
          </div>
        </div>

        {/* Demo Data Toggle */}
        <div className="pt-2 border-t border-stone-100">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-xs font-bold text-stone-800">
              Include Demonstration Seed Records
            </span>
            <input
              type="checkbox"
              checked={settings.showDemoRecords}
              onChange={(e) => onUpdateSettings({ showDemoRecords: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
            />
          </label>
          <p className="text-[11px] text-stone-500">
            Toggles pre-loaded dorm and canteen audit examples in charts and ledger.
          </p>
        </div>

        {/* Reset & Clear Buttons */}
        <div className="pt-3 border-t border-stone-100 flex gap-2">
          <button
            onClick={() => {
              onResetDemoData();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-stone-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
          <button
            onClick={() => {
              onClearAllData();
              onClose();
            }}
            className="py-2.5 px-3 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-bold text-red-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
