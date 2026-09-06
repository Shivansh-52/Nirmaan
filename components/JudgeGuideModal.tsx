'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, CheckCircle, ArrowRight, X, Compass, Map, Navigation,
  LifeBuoy, Smartphone, Radio, Users, Sparkles, BookOpen, ExternalLink,
  Flame, Award, Layers, FileText
} from 'lucide-react';

interface EvaluationStep {
  num: string;
  title: string;
  route: string;
  icon: any;
  highlight: string;
  checklist: string[];
  color: string;
}

const evaluationSteps: EvaluationStep[] = [
  {
    num: '01',
    title: 'Multi-Hazard GIS Risk Map',
    route: '/dashboard/risk-map',
    icon: Map,
    highlight: 'Full-bleed Leaflet dark GIS with 5-factor weighted algorithm',
    checklist: [
      'Click top hazard chips (Floods, Landslides, Cloudbursts) to filter markers in real time',
      'Click any village marker (e.g. Joshimath) to open the sliding tactical intelligence drawer',
      'Inspect the 5-factor weighted progress bars (Hazard 30%, History 20%, Exposure 20%, Vulnerability 20%, Infra 10%)'
    ],
    color: 'text-sky-400 bg-sky-950/40 border-sky-700/50'
  },
  {
    num: '02',
    title: 'AI Relocation & Statutory Order Console',
    route: '/dashboard/relocation',
    icon: Navigation,
    highlight: 'Side-by-side matching matrix with government order generator',
    checklist: [
      'Select any Red Zone settlement on the left to review ranked safe shelters',
      'Inspect Haversine distance, water reliability, road access, and capacity balance',
      'Click "Generate Statutory Relocation Order" to open and print the official MHA/NDRF directive'
    ],
    color: 'text-emerald-400 bg-emerald-950/40 border-emerald-700/50'
  },
  {
    num: '03',
    title: 'Live Rescue Command & SOS Triage',
    route: '/dashboard/rescue',
    icon: LifeBuoy,
    highlight: 'Real-time situation awareness & live SOS state transitions',
    checklist: [
      'Inspect 4 situational KPI cards: At Risk, Confirmed Safe, Active SOS, and Deployed Units',
      'Test the interactive SOS tickets: Click "Acknowledge" -> "Assign NDRF Boat" -> "Mark Evacuated"',
      'Watch the live vector radar with simulated 30 RPM sweep and distress beacons'
    ],
    color: 'text-red-400 bg-red-950/40 border-red-700/50'
  },
  {
    num: '04',
    title: 'Citizen Mobile Emergency Portal',
    route: '/citizen',
    icon: Smartphone,
    highlight: 'Mobile-first high-accessibility tactical crisis interface',
    checklist: [
      'Test 4 tactile action cards: "I AM SAFE", "SOS / RESCUE", "MEDICAL SOS", and "REPORT HAZARD"',
      'Click "MEDICAL SOS" to test sub-triage selection (Trauma, Oxygen, Burns)',
      'Click the sticky bottom bar to expand walking bypass routes & Gauchar shelter capacity'
    ],
    color: 'text-amber-400 bg-amber-950/40 border-amber-700/50'
  },
  {
    num: '05',
    title: 'Smart Evacuation & Damaged Route Bypass',
    route: '/dashboard/evacuation',
    icon: Compass,
    highlight: 'Crowd-aware route calculation & obstacle bypass routing',
    checklist: [
      'Toggle between Primary Safe Route and Alternative Bypass Route',
      'Review blocked highway detection (Destroyed Bridge) and drone verification flags'
    ],
    color: 'text-purple-400 bg-purple-950/40 border-purple-700/50'
  },
  {
    num: '06',
    title: 'Multi-Channel Alert Dispatcher',
    route: '/dashboard/alerts/dispatch',
    icon: Radio,
    highlight: 'Multi-channel simultaneous emergency broadcast dissemination',
    checklist: [
      'Configure channels: SMS Cell Broadcast, Sirens/PA, Mobile Push, TV, and Radio',
      'Click "INITIALIZE MULTI-CHANNEL BROADCAST" to trigger simulated transmission'
    ],
    color: 'text-cyan-400 bg-cyan-950/40 border-cyan-700/50'
  },
  {
    num: '07',
    title: 'Meet the Engineering & Innovation Team',
    route: '/team',
    icon: Users,
    highlight: 'SIH26191 Project Team Members & Technical Roles',
    checklist: [
      'Review team leadership (Shivansh Chaurasiya) and specialized engineering disciplines',
      'Inspect project vision, architecture stack, and institutional acknowledgments'
    ],
    color: 'text-yellow-400 bg-yellow-950/40 border-yellow-700/50'
  }
];

export default function JudgeGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'WORKFLOW' | 'CHECKLIST'>('OVERVIEW');
  const pathname = usePathname();

  // Show modal automatically on first visit (unless dismissed in current session)
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('nirmaan_judge_guide_seen');
    if (!hasSeen) {
      // Delay slightly for smooth page entry
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('nirmaan_judge_guide_seen', 'true');
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Persistent Floating Bottom-Left Tactical Button (Always Visible) */}
      <div className="fixed bottom-5 left-5 z-[2500] no-print">
        <button
          onClick={handleOpen}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-sky-500/50 hover:border-sky-400 shadow-2xl backdrop-blur-xl transition-all duration-200 active:scale-95"
          aria-label="Open Judge Evaluation Guide"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
          </span>
          <Award className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold tracking-wide flex items-center gap-1.5">
            Judge Evaluation Guide
            <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-1.5 py-0.2 rounded border border-sky-700/60 hidden sm:inline">
              SIH26191
            </span>
          </span>
        </button>
      </div>

      {/* Interactive Modal Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
            
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-900/40">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold font-mono text-sky-400 uppercase tracking-widest">
                      EVALUATION GUIDE & DEMO TOUR
                    </span>
                    <span className="text-[10px] font-mono bg-red-950/60 text-red-300 border border-red-700/60 px-2 py-0.5 rounded-full font-bold">
                      SIH26191 · MHA / NDRF
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 tracking-tight">
                    NIRMAAN — Intelligent Disaster Intelligence & Relocation Platform
                  </h2>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('OVERVIEW')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'OVERVIEW' 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Problem Statement & Architecture
              </button>
              <button
                onClick={() => setActiveTab('WORKFLOW')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'WORKFLOW' 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Key Evaluation Routes (7 Modules)
              </button>
              <button
                onClick={() => setActiveTab('CHECKLIST')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'CHECKLIST' 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Judge Evaluation Checklist
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-5 animate-fade-in">
                  
                  {/* Problem Statement Card */}
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Smart India Hackathon Problem Statement 2
                    </div>
                    <h3 className="text-base font-bold text-slate-100">
                      Problem Title: AI-Powered Multi-Hazard Decision Support for Red Zone Identification & Proactive Resettlement Planning
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Traditional disaster response is predominantly <strong className="text-red-400">reactive</strong>: authorities wait for a catastrophe to strike before conducting damage assessment and ad-hoc evacuations. <strong>NIRMAAN</strong> fundamentally disrupts this paradigm by creating a <strong className="text-emerald-400">proactive GIS decision-support ecosystem</strong> that identifies critical hazard exposure, maps dynamic Red Zones, assesses socio-economic vulnerability, pre-matches safe relocation havens with infrastructure auditing, and automates multi-channel early warning dispatch.
                    </p>
                  </div>

                  {/* Core Innovation Highlights */}
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                      <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <Map className="w-4 h-4" /> Multi-Hazard GIS
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Deterministic 5-factor scoring model combining flood, landslide, cloudburst, and coastal erosion exposure.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Navigation className="w-4 h-4" /> AI Relocation Engine
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Proximity Haversine optimization evaluating land, water, clinic distance, and grid infrastructure.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Radio className="w-4 h-4" /> Multi-Channel Alert
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Simultaneous dissemination across Cell Broadcast SMS, automated sirens, push, TV, and radio nets.
                      </p>
                    </div>
                  </div>

                  {/* Quick Jump Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-400 font-mono">
                      Ready to inspect live modules?
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('WORKFLOW')}
                        className="btn-primary flex items-center gap-2 text-xs"
                      >
                        Explore 7 Evaluation Modules <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href="/team"
                        onClick={handleClose}
                        className="btn-secondary flex items-center gap-1.5 text-xs text-yellow-300 border-yellow-700/50"
                      >
                        <Users className="w-3.5 h-3.5 text-yellow-400" /> Meet Team
                      </Link>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: 7 KEY EVALUATION MODULES */}
              {activeTab === 'WORKFLOW' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-xs text-slate-400">
                    Click <strong>"Launch Module"</strong> to jump directly into each core feature and test live interactions:
                  </div>

                  <div className="space-y-3">
                    {evaluationSteps.map((step) => (
                      <div
                        key={step.num}
                        className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold text-slate-500">STEP {step.num}</span>
                            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${step.color} flex items-center gap-1.5`}>
                              <step.icon className="w-3.5 h-3.5" /> {step.title}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-slate-200">{step.highlight}</div>
                          <ul className="text-[11px] text-slate-400 space-y-0.5 list-disc list-inside">
                            {step.checklist.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>

                        <Link
                          href={step.route}
                          onClick={handleClose}
                          className="btn-primary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center"
                        >
                          Launch Module <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EVALUATION CRITERIA CHECKLIST */}
              {activeTab === 'CHECKLIST' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      SIH26191 Official Evaluation Rubric Mapping
                    </h3>
                    
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-bold text-slate-200 flex items-center justify-between">
                          <span>1. Innovation & Novelty</span>
                          <span className="text-emerald-400 font-mono font-bold">100% COVERED</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Automated 5-factor risk scoring, Haversine capacity matching, and 1-click Statutory Relocation Order generator with verifiable audit stamps.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-bold text-slate-200 flex items-center justify-between">
                          <span>2. Technical Feasibility & GIS Stack</span>
                          <span className="text-emerald-400 font-mono font-bold">100% COVERED</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Next.js 14 App Router, TypeScript, Leaflet geospatial dark matter basemaps, Recharts dynamic data visualization, and deterministic engines.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-bold text-slate-200 flex items-center justify-between">
                          <span>3. Citizen Engagement & Triage Workflow</span>
                          <span className="text-emerald-400 font-mono font-bold">100% COVERED</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Dual interface: Authority command center with live SOS triage action buttons + Mobile-first citizen emergency reporting portal.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <div className="font-bold text-slate-200 flex items-center justify-between">
                          <span>4. Real-World Disaster Context (India)</span>
                          <span className="text-emerald-400 font-mono font-bold">100% COVERED</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Pre-seeded with real-world disaster zones: Joshimath landslide sinking, Wayanad Meppadi slope collapses, Chamoli Tapovan flash floods, and Kedarnath valley flash floods.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Sticky Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Need help? Reopen this guide anytime using the bottom-left floating button.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Got It, Continue to Platform
                </button>
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
