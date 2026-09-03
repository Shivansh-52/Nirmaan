'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle, AlertTriangle, Plus, MapPin, Search, Activity, User, Home, ArrowLeft, Users } from 'lucide-react';

export default function CitizenAppPage() {
  const [status, setStatus] = useState<'NONE' | 'SAFE' | 'SOS' | 'MEDICAL'>('NONE');
  const [locationShared, setLocationShared] = useState(false);

  const handleStatus = (newStatus: 'SAFE' | 'SOS' | 'MEDICAL') => {
    setStatus(newStatus);
    setLocationShared(true); // Automatically share location on status update
  };

  return (
    <div className="min-h-screen bg-[#0d1526] text-slate-100 flex justify-center">
      {/* Mobile-constrained container */}
      <div className="w-full max-w-md bg-[#1a2338] min-h-screen border-x border-[#2e3a52] flex flex-col relative shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#0d1526] p-4 border-b border-[#2e3a52] flex items-center justify-between sticky top-0 z-10">
          <Link href="/" className="text-slate-400 hover:text-slate-200">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-slate-100">NIRMAAN Safety</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-[#2e3a52] flex items-center justify-center">
            <User className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
          
          {/* Active Alert Banner */}
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 animate-pulse-slow">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-300 text-sm">RED ALERT: Heavy Rainfall & Flood Risk</h3>
                <p className="text-xs text-red-200/70 mt-1">
                  Severe waterlogging expected in your area (Chamoli District). Please avoid travel and report your safety status.
                </p>
              </div>
            </div>
          </div>

          {/* Safety Action Buttons */}
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Safety Actions (Opt-in)</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleStatus('SAFE')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  status === 'SAFE' 
                    ? 'bg-green-900/40 border-green-500 text-green-300' 
                    : 'bg-[#2e3a52] border-transparent hover:border-green-500/50 text-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'SAFE' ? 'bg-green-500/20' : 'bg-green-500/10 text-green-400'}`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">I AM SAFE</span>
              </button>

              <button 
                onClick={() => handleStatus('SOS')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  status === 'SOS' 
                    ? 'bg-red-900/40 border-red-500 text-red-300' 
                    : 'bg-[#2e3a52] border-transparent hover:border-red-500/50 text-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'SOS' ? 'bg-red-500/20' : 'bg-red-500/10 text-red-400'}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">SOS / HELP</span>
              </button>

              <button 
                onClick={() => handleStatus('MEDICAL')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  status === 'MEDICAL' 
                    ? 'bg-orange-900/40 border-orange-500 text-orange-300' 
                    : 'bg-[#2e3a52] border-transparent hover:border-orange-500/50 text-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'MEDICAL' ? 'bg-orange-500/20' : 'bg-orange-500/10 text-orange-400'}`}>
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">MEDICAL</span>
              </button>

              <button 
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-transparent bg-[#2e3a52] hover:border-purple-500/50 text-slate-300 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-center">MISSING<br/>PERSON</span>
              </button>
            </div>
          </div>

          {/* Location Engine */}
          <div className="bg-[#2e3a52] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                Last Known Location
              </h2>
              <div className={`text-[10px] px-2 py-1 rounded-full font-bold ${locationShared ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-700 text-slate-400'}`}>
                {locationShared ? 'ACTIVE' : 'OFF'}
              </div>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">
              Sharing your location helps rescue teams optimize their routes and find you faster during a crisis.
            </p>

            {locationShared ? (
              <div className="bg-[#1a2338] rounded-lg p-3 text-xs border border-blue-900/50">
                <div className="flex items-center gap-2 text-slate-300 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Live tracking active
                </div>
                <div className="text-slate-500 font-mono">30.4024° N, 79.3275° E (Accuracy: ~15m)</div>
                <button 
                  onClick={() => setLocationShared(false)}
                  className="mt-3 text-red-400 font-medium hover:text-red-300"
                >
                  Stop Sharing Location
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setLocationShared(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors"
              >
                Share Location Now
              </button>
            )}
          </div>

          {/* Evacuation Route */}
          <div className="bg-[#2e3a52] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#3a4a66]">
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                Nearest Safe Shelter
              </h2>
            </div>
            <div className="h-32 bg-[#1a2338] relative flex items-center justify-center overflow-hidden">
              {/* Dummy Map Visual */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 20,80 Q 50,20 80,40" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="5,5" />
                <circle cx="20" cy="80" r="4" fill="#3b5bdb" />
                <circle cx="80" cy="40" r="5" fill="#22c55e" />
              </svg>
              <div className="absolute top-2 right-2 bg-[#0d1526]/80 backdrop-blur px-2 py-1 rounded text-[10px] text-green-400 font-bold border border-green-900/50">
                ETA: 15 mins (Walking)
              </div>
            </div>
            <div className="p-3 bg-[#1e2a40]">
              <div className="font-semibold text-slate-200 text-sm">Gauchar Relief Camp</div>
              <div className="text-xs text-slate-400 mt-1">2.4 km away · Capacity Available</div>
            </div>
          </div>

        </div>

        {/* Bottom Nav Bar */}
        <div className="bg-[#0d1526] border-t border-[#2e3a52] flex justify-around p-3 pb-safe absolute bottom-0 w-full z-10">
          <button className="flex flex-col items-center gap-1 text-blue-400">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Alerts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-medium">Family</span>
          </button>
        </div>
      </div>
    </div>
  );
}
