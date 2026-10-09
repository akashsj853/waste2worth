/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/Home/HomeView';
import { ScannerView } from './components/Scanner/ScannerView';
import { ValueExplorerView } from './components/Explorer/ValueExplorerView';
import { CompostView } from './components/Compost/CompostView';
import { ImpactLedgerView } from './components/Ledger/ImpactLedgerView';
import { HistoryView } from './components/History/HistoryView';
import { ExchangeView } from './components/Exchange/ExchangeView';
import { AssistantView } from './components/Assistant/AssistantView';
import { AboutPitchView } from './components/About/AboutPitchModal';
import { SettingsModal } from './components/SettingsModal';
import { RealisticBackground } from './components/Background/RealisticBackground';
import { BackgroundControlWidget } from './components/Background/BackgroundControlWidget';
import { DatabaseService, AppSettings } from './storage/db';
import { ImpactCalculator } from './engine/impactCalculator';
import { ScanRecord } from './types/waste';
import { ExchangeListing } from './types/exchange';
import { BackgroundSettings } from './types/background';
import { Recycle, Heart, ScanLine, Sliders, Sparkles } from 'lucide-react';

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string; category: string }> = {
  home: {
    title: 'Overview Dashboard',
    subtitle: 'Circular material metrics, diverted tonnage & environmental ROI',
    category: 'Core Workspace',
  },
  scanner: {
    title: 'AI Waste Scanner',
    subtitle: 'Multimodal Gemini 2.5 Vision & Deterministic Rules Engine',
    category: 'Core Workspace',
  },
  exchange: {
    title: 'Circular Exchange',
    subtitle: 'Byproduct & secondary material matchmaking marketplace',
    category: 'Circular Solutions',
  },
  compost: {
    title: 'Compost Module',
    subtitle: 'Bio-fraction C:N balancing, batch tracking & soil amendment',
    category: 'Circular Solutions',
  },
  ledger: {
    title: 'Impact Ledger',
    subtitle: 'Audited carbon offset, energy conserved & water savings',
    category: 'Circular Solutions',
  },
  assistant: {
    title: 'Circular AI Advisor',
    subtitle: 'Interactive Gemini sustainability co-pilot & waste triage guidance',
    category: 'Intelligence & Audit',
  },
  explorer: {
    title: 'Rules Explorer',
    subtitle: 'Deterministic taxonomy, municipal policies & uncertainty thresholds',
    category: 'Intelligence & Audit',
  },
  history: {
    title: 'Audit & Scan History',
    subtitle: 'Immutable inspection ledger with verification stages & provenance',
    category: 'Intelligence & Audit',
  },
  about: {
    title: 'Pitch & Architecture',
    subtitle: 'Problem framing, business model, circular economics & tech stack',
    category: 'System & Knowledge',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [exchangeListings, setExchangeListings] = useState<ExchangeListing[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => DatabaseService.getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [preselectedSampleId, setPreselectedSampleId] = useState<string | null>(null);

  // Initialize records and listings from storage
  useEffect(() => {
    const loadedRecords = DatabaseService.getRecords();
    setRecords(loadedRecords);
    const loadedListings = DatabaseService.getExchangeListings();
    setExchangeListings(loadedListings);
  }, []);

  // Filter records based on showDemoRecords
  const activeRecords = useMemo(() => {
    if (settings.showDemoRecords) {
      return records;
    }
    return records.filter((r) => !r.isDemoRecord);
  }, [records, settings.showDemoRecords]);

  // Compute live sustainability metrics
  const metrics = useMemo(() => {
    return ImpactCalculator.calculate(activeRecords, settings.compostYieldFraction);
  }, [activeRecords, settings.compostYieldFraction]);

  // Record handlers
  const handleRecordSaved = (newRecord: ScanRecord) => {
    const updated = DatabaseService.addRecord(newRecord);
    setRecords(updated);
    // Switch to ledger or keep in scanner
    setActiveTab('ledger');
  };

  const handleUpdateRecord = (id: string, updates: Partial<ScanRecord>) => {
    const updated = DatabaseService.updateRecord(id, updates);
    setRecords(updated);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = DatabaseService.deleteRecord(id);
    setRecords(updated);
  };

  const handleResetDemoData = () => {
    const updated = DatabaseService.resetToDemoData();
    setRecords(updated);
  };

  const handleClearAllData = () => {
    const updated = DatabaseService.clearAllData();
    setRecords(updated);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = DatabaseService.saveSettings(newSettings);
    setSettings(updated);
  };

  const handleExportCsv = () => {
    const csv = DatabaseService.exportAsCsv();
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `waste2worth_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const json = DatabaseService.exportAsJson();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `waste2worth_ledger_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddExchangeListing = (listing: ExchangeListing) => {
    const updated = DatabaseService.addExchangeListing(listing);
    setExchangeListings(updated);
  };

  const handleUpdateExchangeListing = (id: string, updates: Partial<ExchangeListing>) => {
    const updated = DatabaseService.updateExchangeListing(id, updates);
    setExchangeListings(updated);
  };

  const handleSelectSampleForScan = (sampleId: string) => {
    setPreselectedSampleId(sampleId);
    setActiveTab('scanner');
  };

  const handleUpdateBackgroundSettings = (newBg: Partial<BackgroundSettings>) => {
    handleUpdateSettings({
      background: {
        ...settings.background,
        ...newBg,
      },
    });
  };

  const isTwilight = settings.background.theme === 'twilight-slate';

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950 overflow-x-hidden ${
        isTwilight ? 'text-stone-100' : 'text-stone-900'
      }`}
    >
      {/* Realistic Multi-Layered Atmosphere & Tactile Background */}
      <RealisticBackground settings={settings.background} />

      {/* Floating Interactive Background & Atmosphere Control Widget */}
      <BackgroundControlWidget
        settings={settings.background}
        onUpdateSettings={handleUpdateBackgroundSettings}
      />

      {/* Persistent Desktop & Responsive Drawer Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showDemoRecords={settings.showDemoRecords}
        setShowDemoRecords={(val) => handleUpdateSettings({ showDemoRecords: val })}
        openSettingsModal={() => setIsSettingsOpen(true)}
        exchangeCount={exchangeListings.length}
        recordsCount={activeRecords.length}
        onQuickScan={() => {
          setPreselectedSampleId(null);
          setActiveTab('scanner');
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Viewport (adjusted left padding to accommodate fixed sidebar on desktop) */}
      <div
        className={`relative z-10 flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Sleek Contextual Desktop Topbar */}
        <header
          className={`hidden lg:flex items-center justify-between h-16 px-6 sm:px-8 border-b backdrop-blur-md sticky top-0 z-30 transition-colors shadow-xs ${
            isTwilight
              ? 'bg-stone-900/80 border-stone-800 text-stone-100'
              : 'bg-white/75 border-stone-200/80 text-stone-900'
          }`}
        >
          {/* Breadcrumb & Section Info */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-md border border-emerald-200/60 shadow-xs">
              {TAB_TITLES[activeTab].category}
            </span>
            <span className="text-stone-300 font-light">/</span>
            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-tight leading-none truncate flex items-center gap-2">
                {TAB_TITLES[activeTab].title}
              </h1>
              <p className="text-[11px] text-stone-500 truncate mt-1">
                {TAB_TITLES[activeTab].subtitle}
              </p>
            </div>
          </div>

          {/* Quick Actions in Topbar */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live / Demo Mode Pill */}
            <button
              onClick={() => handleUpdateSettings({ showDemoRecords: !settings.showDemoRecords })}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1.5 ${
                settings.showDemoRecords
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 shadow-xs'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              title="Toggle seed demonstration records"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.showDemoRecords ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'
                }`}
              />
              {settings.showDemoRecords ? 'Demo Mode Active' : 'Live Mode'}
            </button>

            {/* Quick Scan CTA Button */}
            {activeTab !== 'scanner' && (
              <button
                onClick={() => {
                  setPreselectedSampleId(null);
                  setActiveTab('scanner');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>New Waste Scan</span>
              </button>
            )}

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200/80 bg-white/80"
              title="Application Settings & Thresholds"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'home' && (
            <HomeView
              metrics={metrics}
              recentScans={activeRecords}
              onNavigate={setActiveTab}
              onSelectSampleForScan={handleSelectSampleForScan}
            />
          )}

          {activeTab === 'scanner' && (
            <ScannerView
              uncertaintyThreshold={settings.uncertaintyThreshold}
              setUncertaintyThreshold={(val) => handleUpdateSettings({ uncertaintyThreshold: val })}
              onRecordSaved={handleRecordSaved}
              showDemoRecords={settings.showDemoRecords}
              preselectedSampleId={preselectedSampleId}
            />
          )}

          {activeTab === 'exchange' && (
            <ExchangeView
              listings={exchangeListings}
              onAddListing={handleAddExchangeListing}
              onUpdateListing={handleUpdateExchangeListing}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantView metrics={metrics} />
          )}

          {activeTab === 'explorer' && <ValueExplorerView />}

          {activeTab === 'compost' && (
            <CompostView
              metrics={metrics}
              compostYieldFraction={settings.compostYieldFraction}
              setCompostYieldFraction={(val) => handleUpdateSettings({ compostYieldFraction: val })}
            />
          )}

          {activeTab === 'ledger' && (
            <ImpactLedgerView
              metrics={metrics}
              onExportCsv={handleExportCsv}
              onExportJson={handleExportJson}
              showDemoRecords={settings.showDemoRecords}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              records={activeRecords}
              onUpdateRecord={handleUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onResetDemoData={handleResetDemoData}
              onClearAllData={handleClearAllData}
              onExportCsv={handleExportCsv}
              onExportJson={handleExportJson}
            />
          )}

          {activeTab === 'about' && <AboutPitchView />}
        </main>

        {/* Global Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetDemoData={handleResetDemoData}
          onClearAllData={handleClearAllData}
        />

        {/* Footer */}
        <footer className="border-t border-stone-200/80 bg-white/80 backdrop-blur-md py-8 text-stone-500 text-xs mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-medium">
              <Recycle className="w-4 h-4 text-emerald-600" />
              <span>Waste2Worth AI — Circular Decision Support System</span>
            </div>

            <div className="flex items-center gap-4 text-stone-400">
              <span>Deterministic Rules Engine</span>
              <span>•</span>
              <span>Multimodal Vision</span>
              <span>•</span>
              <span>4-Tier Impact Ledger</span>
            </div>

            <p className="text-stone-400">
              National Sustainability Hackathon Build
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
