'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Shield, CheckCircle, AlertTriangle, Plus, MapPin, Search, Activity,
  User, Home, ArrowLeft, Users, PhoneCall, Compass, Radio, HeartPulse,
  Flame, Navigation, AlertOctagon, Info, ChevronUp, ChevronDown, Check
} from 'lucide-react';

export default function CitizenAppPage() {
  const [status, setStatus] = useState<'NONE' | 'SAFE' | 'SOS' | 'MEDICAL' | 'HAZARD'>('NONE');
  const [locationShared, setLocationShared] = useState(true);
  const [shelterExpanded, setShelterExpanded] = useState(false);
  const [hazardReported, setHazardReported] = useState(false);
  const [medicalTriage, setMedicalTriage] = useState<'FIRST_AID' | 'TRAUMA' | 'OXYGEN' | 'NONE'>('NONE');

  const handleStatus = (newStatus: 'SAFE' | 'SOS' | 'MEDICAL' | 'HAZARD') => {
    setStatus(newStatus);
    setLocationShared(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex justify-center selection:bg-sky-500 selection:text-white">
      
      {/* Mobile-constrained container with defense styling */}
      <div className="w-full max-w-md bg-slate-900/95 min-h-screen border-x border-slate-800/80 flex flex-col relative shadow-2xl overflow-hidden pb-28">
        
        {/* Mobile Header */}
        <div className="bg-slate-950/90 backdrop-blur-md p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
          <Link href="/" className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sky-600 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-100 tracking-wide">NIRMAAN CITIZEN</span>
              <div className="text-[9px] font-mono text-slate-400 leading-none">MHA NDRF SAFETY LINK</div>
            </div>
          </div>
          <a 
            href="tel:112"
            className="px-2.5 py-1 rounded-full bg-red-950/60 border border-red-700/60 text-red-400 font-mono text-[11px] font-bold flex items-center gap-1 animate-pulse"
          >
            <PhoneCall className="w-3 h-3" /> SOS: 112
          </a>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Critical Emergency Broadcast Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/80 via-red-900/40 to-slate-900 border border-red-700/60 shadow-lg shadow-red-950/30 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-ping" />
                <span className="text-xs font-bold text-red-300 uppercase tracking-wide">RED ALERT: FLASH FLOOD & LANDSLIDE RISK</span>
              </div>
              <span className="text-[10px] font-mono bg-red-950 px-2 py-0.5 rounded text-red-400 border border-red-800">
                CHAMOLI SECTOR
              </span>
            </div>
            <p className="text-xs text-red-200/90 leading-relaxed">
              River Alaknanda discharge is rising above danger marks. Move to Gauchar High-Ground Shelter immediately. Avoid valley riverbeds.
            </p>
          </div>

          {/* Tactical 4-Card Emergency Action Grid */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Actions (Instant Transmit)</span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> SAT-LINK SYNCED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              
              {/* 1. I AM SAFE */}
              <button 
                onClick={() => handleStatus('SAFE')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                  status === 'SAFE'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:bg-slate-800/80'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  status === 'SAFE' ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                }`}>
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-extrabold text-sm text-slate-100">I AM SAFE</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Check-in with NDRF</div>
                </div>
              </button>

              {/* 2. SOS / HELP */}
              <button 
                onClick={() => handleStatus('SOS')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                  status === 'SOS'
                    ? 'bg-red-950/60 border-red-500 text-red-300 shadow-lg shadow-red-950/50 beacon-red'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-red-500/50 hover:bg-slate-800/80'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  status === 'SOS' ? 'bg-red-500 text-white' : 'bg-red-950/40 text-red-400 border border-red-800/40'
                }`}>
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-center">
                  <div className="font-extrabold text-sm text-red-400">SOS / RESCUE</div>
                  <div className="text-[10px] text-red-300/80 font-mono mt-0.5">Dispatch NDRF Boat</div>
                </div>
              </button>

              {/* 3. MEDICAL EMERGENCY */}
              <button 
                onClick={() => handleStatus('MEDICAL')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                  status === 'MEDICAL'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:bg-slate-800/80'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  status === 'MEDICAL' ? 'bg-amber-500 text-slate-950' : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                }`}>
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-extrabold text-sm text-amber-300">MEDICAL SOS</div>
                  <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">Trauma / Medics</div>
                </div>
              </button>

              {/* 4. REPORT HAZARD */}
              <button 
                onClick={() => handleStatus('HAZARD')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.97] ${
                  status === 'HAZARD'
                    ? 'bg-sky-950/60 border-sky-500 text-sky-300 shadow-lg shadow-sky-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-sky-500/50 hover:bg-slate-800/80'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  status === 'HAZARD' ? 'bg-sky-500 text-white' : 'bg-sky-950/40 text-sky-400 border border-sky-800/40'
                }`}>
                  <Flame className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-extrabold text-sm text-sky-300">REPORT HAZARD</div>
                  <div className="text-[10px] text-sky-400/80 font-mono mt-0.5">Landslide / Debris</div>
                </div>
              </button>

            </div>
          </div>

          {/* Interactive Medical Sub-triage Drawer if Medical Selected */}
          {status === 'MEDICAL' && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/50 space-y-3 animate-slide-up">
              <div className="text-xs font-bold text-amber-300 uppercase">Select Immediate Medical Need:</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'TRAUMA', label: 'Severe Trauma' },
                  { id: 'OXYGEN', label: 'Oxygen Need' },
                  { id: 'FIRST_AID', label: 'Fracture / Burn' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMedicalTriage(m.id as any)}
                    className={`p-2 rounded-lg text-xs font-bold border transition ${
                      medicalTriage === m.id
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Direct radio transmission sent to Chamoli Base Hospital.
              </div>
            </div>
          )}

          {/* Interactive Hazard Report Options */}
          {status === 'HAZARD' && (
            <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-700/50 space-y-3 animate-slide-up">
              <div className="text-xs font-bold text-sky-300 uppercase">What Hazard Are You Witnessing?</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button onClick={() => setHazardReported(true)} className="p-2.5 rounded bg-slate-900 text-slate-200 border border-slate-700 hover:border-sky-400">
                  Landslide / Road Block
                </button>
                <button onClick={() => setHazardReported(true)} className="p-2.5 rounded bg-slate-900 text-slate-200 border border-slate-700 hover:border-sky-400">
                  Bridge Washed Out
                </button>
                <button onClick={() => setHazardReported(true)} className="p-2.5 rounded bg-slate-900 text-slate-200 border border-slate-700 hover:border-sky-400">
                  Water Surge Rising
                </button>
                <button onClick={() => setHazardReported(true)} className="p-2.5 rounded bg-slate-900 text-slate-200 border border-slate-700 hover:border-sky-400">
                  Power Lines Down
                </button>
              </div>
              {hazardReported && (
                <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Hazard geolocated & routed to District Collector.
                </div>
              )}
            </div>
          )}

          {/* Live GPS Telemetry Status Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400 animate-spin-slow" />
                <span className="text-xs font-bold text-slate-200 uppercase">Your GPS Fix Telemetry</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
                ACCURACY ~8M
              </span>
            </div>

            <div className="font-mono text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center">
              <span>30.4024° N, 79.3275° E</span>
              <span className="text-[10px] text-slate-500">Chamoli Sector</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              Location is automatically shared with NDRF field boats and drone pilots during active crises.
            </p>
          </div>

        </div>

        {/* Sticky Nearest Safe Shelter Bottom Sheet */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 p-4 shadow-2xl z-40 space-y-3">
          
          <div 
            onClick={() => setShelterExpanded(!shelterExpanded)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-900/40 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">Gauchar High-Ground Relief Haven</div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  2.4 km away · <strong>18 mins walking ETA</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 px-2 py-1 rounded border border-emerald-800">
                420 / 600 Beds Open
              </span>
              {shelterExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>
          </div>

          {/* Expandable Route Terrain Alert */}
          {shelterExpanded && (
            <div className="space-y-2 pt-2 border-t border-slate-800/80 animate-slide-up text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-sky-400" /> Safe Bypass Corridor:
                </div>
                <p className="text-[11px] text-slate-400">
                  Follow Upper Hill Path (Trail 3B). <strong>Do NOT cross Lower Alaknanda Causeway</strong> due to flash surge.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Water & Food: <strong className="text-emerald-400">Operational</strong>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Medical Staff: <strong className="text-sky-400">Active on site</strong>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full py-2 flex items-center justify-center gap-2 text-xs"
              >
                <Navigation className="w-3.5 h-3.5" /> Start Walking GPS Navigation
              </a>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
