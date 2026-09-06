'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, Map, Navigation, LifeBuoy, Smartphone, Compass,
  Radio, Users, ArrowRight, X, ExternalLink, Award, Sparkles, Check
} from 'lucide-react';

interface EvaluationStep {
  num: string;
  title: string;
  route: string;
  icon: any;
  highlight: string;
  actions: string[];
  color: string;
  badgeBg: string;
}

const evaluationSteps: EvaluationStep[] = [
  {
    num: '01',
    title: 'Multi-Hazard GIS Risk Map',
    route: '/dashboard/risk-map',
    icon: Map,
    highlight: '5-factor deterministic risk algorithm on dark Leaflet GIS',
    actions: [
      'Filter hazards (Floods, Landslides, Cloudbursts) via top chips',
      'Click village markers (e.g., Joshimath) to view tactical risk breakdown'
    ],
    color: 'text-sky-400',
    badgeBg: 'bg-sky-950/60 border-sky-700/50 text-sky-300'
  },
  {
    num: '02',
    title: 'AI Relocation & Statutory Orders',
    route: '/dashboard/relocation',
    icon: Navigation,
    highlight: 'Proximity shelter matching matrix + 1-click legal order generator',
    actions: [
      'Select a Red Zone settlement to rank optimal safe shelters',
      'Click "Generate Statutory Relocation Order" for official NDRF/MHA directive'
    ],
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/60 border-emerald-700/50 text-emerald-300'
  },
  {
    num: '03',
    title: 'Live Rescue Command & SOS Triage',
    route: '/dashboard/rescue',
    icon: LifeBuoy,
    highlight: 'Real-time incident response with dynamic radar sweep',
    actions: [
      'Advance SOS tickets: "Acknowledge" → "Assign NDRF Boat" → "Evacuated"',
      'Monitor live vector radar distress beacons and fleet status'
    ],
    color: 'text-rose-400',
    badgeBg: 'bg-rose-950/60 border-rose-700/50 text-rose-300'
  },
  {
    num: '04',
    title: 'Citizen Emergency Mobile Portal',
    route: '/citizen',
    icon: Smartphone,
    highlight: 'Mobile-first crisis interface for high-stress citizen reporting',
    actions: [
      'Test 1-tap actions: "I AM SAFE", "SOS / RESCUE", and "MEDICAL SOS"',
      'Expand bottom drawer for offline bypass routes & shelter capacity'
    ],
    color: 'text-amber-400',
    badgeBg: 'bg-amber-950/60 border-amber-700/50 text-amber-300'
  },
  {
    num: '05',
    title: 'Smart Evacuation & Damaged Route Bypass',
    route: '/dashboard/evacuation',
    icon: Compass,
    highlight: 'Crowd-aware route calculation with damaged bridge avoidance',
    actions: [
      'Toggle between Primary Safe Route and Alternative Bypass',
      'Inspect drone verification flags & blocked hazard alerts'
    ],
    color: 'text-purple-400',
    badgeBg: 'bg-purple-950/60 border-purple-700/50 text-purple-300'
  },
  {
    num: '06',
    title: 'Multi-Channel Alert Dispatcher',
    route: '/dashboard/alerts/dispatch',
    icon: Radio,
    highlight: 'Simultaneous emergency dissemination across 5 communication channels',
    actions: [
      'Toggle channels: SMS Cell Broadcast, Sirens/PA, Push, TV, and Radio',
      'Click "INITIALIZE BROADCAST" to trigger simulated dispatch'
    ],
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-950/60 border-cyan-700/50 text-cyan-300'
  },
  {
    num: '07',
    title: 'Engineering & Innovation Team',
    route: '/team',
    icon: Users,
    highlight: 'SIH26191 project architecture, team disciplines & vision',
    actions: [
      'Review team leadership, roles, and technical architecture stack',
      'Inspect institutional problem mapping & implementation roadmap'
    ],
    color: 'text-yellow-400',
    badgeBg: 'bg-yellow-950/60 border-yellow-700/50 text-yellow-300'
  }
];

export default function JudgeGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MODULES' | 'RUBRIC'>('OVERVIEW');

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('nirmaan_judge_guide_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('nirmaan_judge_guide_seen', 'true');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Tactical Launcher */}
      <div className="fixed bottom-5 left-5 z-[2500] no-print">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-100 border border-sky-500/50 hover:border-sky-400 shadow-xl backdrop-blur-md transition-all active:scale-95"
          aria-label="Open Evaluation Guide"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
          </span>
          <Award className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold tracking-wide">Judge Guide</span>
          <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800/80">
            SIH26191
          </span>
        </button>
      </div>

      {/* Interactive Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shadow-md">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold font-mono text-sky-400 uppercase tracking-wider">
                      SIH26191 Evaluation Guide
                    </span>
                    <span className="text-[9px] font-mono bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 rounded">
                      MHA / NDRF
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
                    NIRMAAN — AI Disaster Intelligence Platform
                  </h2>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition"
                aria-label="Close guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav Tabs */}
            <div className="flex items-center gap-1.5 px-5 py-2 bg-slate-950/80 border-b border-slate-800 text-xs font-semibold shrink-0">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeTab === 'OVERVIEW'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Overview
              </button>
              <button
                onClick={() => setActiveTab('MODULES')}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeTab === 'MODULES'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Demo Modules (7 Steps)
              </button>
              <button
                onClick={() => setActiveTab('RUBRIC')}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeTab === 'RUBRIC'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. SIH Evaluation Rubric
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Problem & Solution */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5" /> Core Concept & Mission
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Disaster response has traditionally been <span className="text-rose-400 font-semibold">reactive</span>. 
                      <strong className="text-white font-semibold"> NIRMAAN</strong> transforms this into a <span className="text-emerald-400 font-semibold">proactive decision system</span>: 
                      identifying Red Zones via 5-factor GIS risk scoring, pre-matching safe habitations, managing live SOS triage, and dispatching multi-channel alerts before catastrophe strikes.
                    </p>
                  </div>

                  {/* 3 Core Pillars */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <Map className="w-3.5 h-3.5" /> 1. GIS Risk Engine
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Deterministic 5-factor scoring (Hazard, History, Exposure, Vulnerability, Infra).
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" /> 2. Smart Relocation
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Proximity Haversine matching + automated statutory relocation order generator.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <LifeBuoy className="w-3.5 h-3.5" /> 3. Command & Citizen Hub
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Live radar triage for commanders + high-contrast offline portal for citizens.
                      </p>
                    </div>
                  </div>

                  {/* Action Banner */}
                  <div className="pt-1 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">Ready to test the live modules?</span>
                    <button
                      onClick={() => setActiveTab('MODULES')}
                      className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
                    >
                      View 7 Demo Steps <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: DEMO MODULES */}
              {activeTab === 'MODULES' && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-xs text-slate-400">
                    Follow the recommended evaluation sequence or launch any module directly:
                  </p>

                  <div className="space-y-2.5">
                    {evaluationSteps.map((step) => (
                      <div
                        key={step.num}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-500">#{step.num}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${step.badgeBg} flex items-center gap-1`}>
                              <step.icon className="w-3 h-3" /> {step.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-medium">{step.highlight}</p>
                          <div className="text-[11px] text-slate-400 space-y-0.5">
                            {step.actions.map((act, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-sky-400 mt-0.5">•</span>
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Link
                          href={step.route}
                          onClick={handleClose}
                          className="btn-primary text-xs py-1.5 px-3 flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center"
                        >
                          Launch <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: RUBRIC */}
              {activeTab === 'RUBRIC' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs text-slate-400">
                    NIRMAAN covers all 4 core judging dimensions under SIH Problem Statement 2:
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">1. Innovation & Algorithms</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> 100%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Deterministic 5-factor risk scoring, Haversine capacity matching, and 1-click legal relocation order generator.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">2. Technical & GIS Feasibility</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> 100%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Next.js 14, TypeScript, Leaflet geospatial mapping, real-time radar sweep, and responsive SVG visualizers.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">3. Dual Operational UX</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> 100%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Authority command dashboard with SOS triage workflow + high-contrast tactile mobile portal for citizens.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">4. Real Indian Disaster Data</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> 100%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Pre-seeded with real-world scenarios: Joshimath subsidence, Wayanad landslides, Chamoli and Kedarnath flood basins.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Reopen anytime from bottom-left button
              </span>
              <button
                onClick={handleClose}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Continue to Platform
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
