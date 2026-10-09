import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Sun,
  Wind,
  Compass,
  X,
  Sliders,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  BackgroundSettings,
  BackgroundTheme,
  DEFAULT_BACKGROUND_SETTINGS,
} from '../../types/background';

interface BackgroundControlWidgetProps {
  settings: BackgroundSettings;
  onUpdateSettings: (newSettings: Partial<BackgroundSettings>) => void;
}

const THEME_OPTIONS: Array<{
  id: BackgroundTheme;
  name: string;
  badge: string;
  desc: string;
  gradient: string;
}> = [
  {
    id: 'biosphere',
    name: 'Organic Biosphere',
    badge: 'Compost & Soil',
    desc: 'Nutrient-rich compost soil macro texture with golden sunbeams & biological warmth.',
    gradient: 'from-amber-700 via-amber-800 to-emerald-900',
  },
  {
    id: 'circular-lab',
    name: 'Circular Eco-Facility',
    badge: 'Modern Facility',
    desc: 'Architectural recovery center with living green wall and precision grid.',
    gradient: 'from-emerald-700 via-teal-800 to-stone-800',
  },
  {
    id: 'topographic',
    name: 'GIS Topography',
    badge: 'Elevation GIS',
    desc: 'Vector elevation contours, closed-loop resource loops & surveyor grid.',
    gradient: 'from-sky-700 via-teal-800 to-stone-900',
  },
  {
    id: 'clean-studio',
    name: 'Tactile Studio',
    badge: 'Recycled Fiber',
    desc: 'Minimalist neutral paper stippling and soft diffuse daylight falloff.',
    gradient: 'from-stone-600 via-stone-700 to-stone-900',
  },
  {
    id: 'twilight-slate',
    name: 'Twilight Earth',
    badge: 'Nocturnal Slate',
    desc: 'Deep botanical slate with bioluminescent spore motes and high-contrast focus.',
    gradient: 'from-stone-900 via-emerald-950 to-black',
  },
];

export const BackgroundControlWidget: React.FC<BackgroundControlWidgetProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeTheme = THEME_OPTIONS.find((t) => t.id === settings.theme) || THEME_OPTIONS[0];

  return (
    <aside
      aria-label="Environmental Background Controls"
      className="fixed bottom-4 right-4 z-40 select-none print:hidden"
    >
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-white text-stone-800 border border-stone-200/90 shadow-md hover:shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          title="Customize Environmental Background Atmosphere"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>

          <span className="text-xs font-semibold tracking-tight text-stone-700 group-hover:text-stone-900">
            Environment: <span className="font-bold text-emerald-800">{activeTheme.name}</span>
          </span>

          <span className="p-1 rounded-full bg-stone-100 group-hover:bg-emerald-50 text-stone-500 group-hover:text-emerald-700 transition-colors">
            <Sliders className="w-3.5 h-3.5" />
          </span>
        </button>
      )}

      {/* Floating Interactive Control Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] rounded-3xl bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-stone-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-stone-900">
                  Realistic UI/UX Atmosphere
                </h3>
                <p className="text-[11px] text-stone-500">
                  Environmental tactile backdrop & lighting
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>Environment Theme Preset:</span>
              <span className="text-[11px] font-semibold text-emerald-700">
                {activeTheme.badge}
              </span>
            </label>

            <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = settings.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateSettings({ theme: theme.id })}
                    className={`flex items-start gap-2.5 p-2 rounded-xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500/80 shadow-xs'
                        : 'bg-stone-50/70 border-stone-200/60 hover:bg-stone-100/80 hover:border-stone-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg bg-gradient-to-br ${theme.gradient} shrink-0 mt-0.5 flex items-center justify-center text-white shadow-xs`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {theme.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 leading-tight truncate">
                        {theme.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders: Intensity & Blur */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            {/* Opacity / Exposure */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  Texture Intensity:
                </span>
                <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200">
                  {Math.round(settings.intensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.65"
                step="0.02"
                value={settings.intensity}
                onChange={(e) => onUpdateSettings({ intensity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>10% (Whisper)</span>
                <span>32% (Balanced)</span>
                <span>65% (Rich)</span>
              </div>
            </div>

            {/* Depth of Field Blur */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-stone-500" />
                  Atmospheric Depth (Blur):
                </span>
                <span className="font-mono text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded text-[11px] border border-stone-200">
                  {settings.blurAmount}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={settings.blurAmount}
                onChange={(e) => onUpdateSettings({ blurAmount: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0px (Crisp Focus)</span>
                <span>2px (Macro)</span>
                <span>10px (Cinematic)</span>
              </div>
            </div>
          </div>

          {/* Granular Atmosphere Toggles */}
          <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => onUpdateSettings({ showParticles: !settings.showParticles })}
              className={`p-2 rounded-xl flex items-center justify-between border cursor-pointer transition-colors ${
                settings.showParticles
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                Air Motes
              </span>
              <span className="text-[10px] font-bold">
                {settings.showParticles ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => onUpdateSettings({ showContours: !settings.showContours })}
              className={`p-2 rounded-xl flex items-center justify-between border cursor-pointer transition-colors ${
                settings.showContours
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Compass className="w-3 h-3 text-emerald-600 shrink-0" />
                GIS Contours
              </span>
              <span className="text-[10px] font-bold">
                {settings.showContours ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => onUpdateSettings({ showSunlight: !settings.showSunlight })}
              className={`p-2 rounded-xl flex items-center justify-between border cursor-pointer transition-colors ${
                settings.showSunlight
                  ? 'bg-amber-50/80 border-amber-300 text-amber-900 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Sun className="w-3 h-3 text-amber-600 shrink-0" />
                Sunlight Flare
              </span>
              <span className="text-[10px] font-bold">
                {settings.showSunlight ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={() => onUpdateSettings({ showFiberTexture: !settings.showFiberTexture })}
              className={`p-2 rounded-xl flex items-center justify-between border cursor-pointer transition-colors ${
                settings.showFiberTexture
                  ? 'bg-stone-100 border-stone-300 text-stone-900 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Layers className="w-3 h-3 text-stone-600 shrink-0" />
                Kraft Fiber
              </span>
              <span className="text-[10px] font-bold">
                {settings.showFiberTexture ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Footer Reset & Close */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => onUpdateSettings(DEFAULT_BACKGROUND_SETTINGS)}
              className="text-[11px] text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Reset to Recommended
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
