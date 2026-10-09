import React from 'react';
import {
  Recycle,
  ScanLine,
  Compass,
  Sprout,
  BarChart3,
  History,
  Info,
  Sparkles,
  Sliders,
  Repeat,
  Bot,
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'scanner'
  | 'exchange'
  | 'compost'
  | 'ledger'
  | 'history'
  | 'assistant'
  | 'explorer'
  | 'about';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  uncertaintyThreshold: number;
  setUncertaintyThreshold: (val: number) => void;
  showDemoRecords: boolean;
  setShowDemoRecords: (val: boolean) => void;
  openSettingsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  showDemoRecords,
  setShowDemoRecords,
  openSettingsModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  Waste2Worth <span className="text-emerald-400 font-black">AI</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-400" /> Hackathon Build
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Identify it. Recover its value. Measure the impact.
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'scanner'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ScanLine className="w-4 h-4 text-emerald-400" />
              AI Scanner
            </button>
            <button
              onClick={() => setActiveTab('exchange')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'exchange'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Repeat className="w-4 h-4 text-teal-400" />
              Circular Exchange
            </button>
            <button
              onClick={() => setActiveTab('compost')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'compost'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Sprout className="w-4 h-4 text-lime-400" />
              Compost Module
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'ledger'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Impact Ledger
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <History className="w-4 h-4 text-stone-400" />
              Audit Log
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'assistant'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              AI Advisor
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'explorer'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Compass className="w-4 h-4 text-teal-400" />
              Rules Explorer
            </button>
          </nav>

          {/* Quick Actions & Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDemoRecords(!showDemoRecords)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors hidden sm:flex items-center gap-1.5 ${
                showDemoRecords
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
              title="Toggle seed demonstration records"
            >
              <span className={`w-2 h-2 rounded-full ${showDemoRecords ? 'bg-emerald-400' : 'bg-stone-500'}`} />
              {showDemoRecords ? 'Demo Mode On' : 'Live Mode'}
            </button>

            <button
              onClick={openSettingsModal}
              className="p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              title="Configure uncertainty thresholds & parameters"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-emerald-700 text-white border-emerald-600'
                  : 'bg-stone-800 text-emerald-400 border-stone-700 hover:bg-stone-700'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              Pitch & Arch
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 border-t border-stone-800 gap-1 scrollbar-none">
          {[
            { id: 'home', label: 'Home' },
            { id: 'scanner', label: 'Scanner' },
            { id: 'exchange', label: 'Exchange' },
            { id: 'compost', label: 'Compost' },
            { id: 'ledger', label: 'Ledger' },
            { id: 'assistant', label: 'Advisor' },
            { id: 'history', label: 'History' },
            { id: 'explorer', label: 'Explorer' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as NavTab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
