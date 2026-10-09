import React, { useState } from 'react';
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
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  Palette,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  showDemoRecords: boolean;
  setShowDemoRecords: (val: boolean) => void;
  openSettingsModal: () => void;
  exchangeCount?: number;
  recordsCount?: number;
  onQuickScan?: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean) => void;
}

interface NavItemDef {
  id: NavTab;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
  description: string;
}

interface NavSection {
  title: string;
  items: NavItemDef[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  showDemoRecords,
  setShowDemoRecords,
  openSettingsModal,
  exchangeCount = 0,
  recordsCount = 0,
  onQuickScan,
  isCollapsed: controlledCollapsed,
  setIsCollapsed: setControlledCollapsed,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapsed = () => {
    if (setControlledCollapsed) {
      setControlledCollapsed(!isCollapsed);
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const navSections: NavSection[] = [
    {
      title: 'Core Workspace',
      items: [
        {
          id: 'home',
          label: 'Overview Dashboard',
          shortLabel: 'Overview',
          icon: LayoutDashboard,
          description: 'Macro metrics, recovery pipeline & quick actions',
        },
        {
          id: 'scanner',
          label: 'AI Waste Scanner',
          shortLabel: 'Scanner',
          icon: ScanLine,
          badge: 'Vision AI',
          description: 'Multimodal image analysis & classification',
        },
      ],
    },
    {
      title: 'Circular Solutions',
      items: [
        {
          id: 'exchange',
          label: 'Circular Exchange',
          shortLabel: 'Exchange',
          icon: Repeat,
          count: exchangeCount,
          description: 'Byproduct matchmaking marketplace',
        },
        {
          id: 'compost',
          label: 'Compost Module',
          shortLabel: 'Compost',
          icon: Sprout,
          badge: 'Bio',
          description: 'C:N ratio calculator & batch management',
        },
        {
          id: 'ledger',
          label: 'Impact Ledger',
          shortLabel: 'Ledger',
          icon: BarChart3,
          description: 'CO2e, energy & water reduction analytics',
        },
      ],
    },
    {
      title: 'Intelligence & Audit',
      items: [
        {
          id: 'assistant',
          label: 'Circular AI Advisor',
          shortLabel: 'Advisor',
          icon: Bot,
          badge: 'Gemini',
          description: 'Conversational circular economy co-pilot',
        },
        {
          id: 'explorer',
          label: 'Rules Explorer',
          shortLabel: 'Explorer',
          icon: Compass,
          description: 'Deterministic categorization logic & thresholds',
        },
        {
          id: 'history',
          label: 'Audit & Scan History',
          shortLabel: 'Audit Log',
          icon: History,
          count: recordsCount,
          description: 'Timestamped records with immutable verification logs',
        },
      ],
    },
    {
      title: 'System & Knowledge',
      items: [
        {
          id: 'about',
          label: 'Pitch & Architecture',
          shortLabel: 'Pitch',
          icon: Info,
          badge: 'v2.0',
          description: 'Problem framing, design & market impact',
        },
      ],
    },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* =========================================================================
          MOBILE TOP NAVBAR (Visible only on < lg screens)
          ========================================================================= */}
      <header className="lg:hidden sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open Navigation Menu"
            className="p-2 -ml-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => handleSelectTab('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Waste2Worth <span className="text-emerald-400 font-black">AI</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectTab('scanner')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan</span>
          </button>

          <button
            onClick={openSettingsModal}
            className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MOBILE DRAWER BACKDROP & OVERLAY
          ========================================================================= */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* =========================================================================
          SIDEBAR CONTAINER (Desktop permanent + Mobile slide-over drawer)
          ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-stone-900/95 backdrop-blur-xl border-r border-stone-800 text-stone-200 shadow-2xl transition-all duration-300 ease-in-out
          ${
            /* Mobile drawer behavior */
            isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }
          ${
            /* Desktop responsive width behavior */
            isCollapsed ? 'lg:w-20' : 'lg:w-64'
          }
          w-72 max-w-[85vw]
        `}
      >
        {/* Sidebar Header / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-stone-800/80 shrink-0">
          <div
            className={`flex items-center gap-3 cursor-pointer group overflow-hidden ${
              isCollapsed ? 'lg:justify-center lg:w-full' : ''
            }`}
            onClick={() => handleSelectTab('home')}
            title="Waste2Worth AI"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform shrink-0">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white whitespace-nowrap">
                    Waste2Worth <span className="text-emerald-400 font-black">AI</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-stone-400 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Circular Decision Engine</span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Scan Action CTA Button */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          <button
            onClick={() => {
              if (onQuickScan) onQuickScan();
              else handleSelectTab('scanner');
            }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md active:scale-95 ${
              activeTab === 'scanner'
                ? 'bg-emerald-500 text-stone-950 font-bold shadow-emerald-900/50'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40'
            } ${isCollapsed && !isMobileOpen ? 'px-0' : 'px-3'}`}
            title="Scan Waste with Multimodal Vision"
          >
            <PlusCircle className="w-4 h-4 shrink-0 text-white" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="whitespace-nowrap tracking-wide">Quick Waste Scan</span>
            )}
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6 scrollbar-thin scrollbar-thumb-stone-800">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {/* Section Header */}
              {(!isCollapsed || isMobileOpen) ? (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  {section.title}
                </div>
              ) : (
                <div className="h-2 border-t border-stone-800/60 my-1 mx-2" />
              )}

              {/* Items in section */}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    title={isCollapsed && !isMobileOpen ? `${item.label} — ${item.description}` : undefined}
                    className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-600/90 text-white shadow-md shadow-emerald-950/40 font-semibold'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                    } ${isCollapsed && !isMobileOpen ? 'justify-center px-2' : ''}`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-300 rounded-r-full" />
                    )}

                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-white'
                          : item.id === 'scanner'
                          ? 'text-emerald-400'
                          : item.id === 'exchange'
                          ? 'text-teal-400'
                          : item.id === 'compost'
                          ? 'text-lime-400'
                          : item.id === 'assistant'
                          ? 'text-emerald-300'
                          : 'text-stone-400'
                      }`}
                    />

                    {(!isCollapsed || isMobileOpen) && (
                      <div className="flex-1 text-left flex items-center justify-between min-w-0">
                        <span className="truncate">{item.label}</span>

                        <div className="flex items-center gap-1.5 ml-2 shrink-0">
                          {item.count !== undefined && item.count > 0 && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-stone-800 text-stone-300 border border-stone-700'
                              }`}
                            >
                              {item.count}
                            </span>
                          )}

                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                isActive
                                  ? 'bg-white/25 text-white'
                                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer & Utilities */}
        <div className="p-3 border-t border-stone-800/80 space-y-2 shrink-0 bg-stone-900/40">
          {/* Demo Mode Toggle */}
          {(!isCollapsed || isMobileOpen) ? (
            <div className="flex items-center justify-between px-2.5 py-2 bg-stone-800/70 rounded-xl border border-stone-800 text-[11px]">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    showDemoRecords ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
                  }`}
                />
                <span className="text-stone-300 font-medium">Demo Records</span>
              </div>
              <button
                onClick={() => setShowDemoRecords(!showDemoRecords)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  showDemoRecords
                    ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                    : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                }`}
              >
                {showDemoRecords ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDemoRecords(!showDemoRecords)}
              title={showDemoRecords ? 'Demo Mode Active' : 'Demo Mode Off'}
              className="w-full flex justify-center py-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  showDemoRecords ? 'bg-emerald-400' : 'bg-stone-600'
                }`}
              />
            </button>
          )}

          {/* Quick Settings & Node Status */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={openSettingsModal}
              className={`flex-1 flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-stone-300 hover:text-white hover:bg-stone-800 transition-colors ${
                isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
              }`}
              title="System Settings & Thresholds"
            >
              <Sliders className="w-4 h-4 text-stone-400" />
              {(!isCollapsed || isMobileOpen) && <span>Settings</span>}
            </button>

            {/* Desktop Collapse / Expand toggle */}
            <button
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
