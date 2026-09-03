'use client';
import { Map, Activity, Clock, Navigation, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function EvacuationPage() {
  const [selectedRoute, setSelectedRoute] = useState<'SAFE' | 'ALT'>('SAFE');

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6 h-[calc(100vh-64px)] flex flex-col">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-400" />
          Smart Evacuation & Route Planning
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Crowd-aware route optimization and offline routing support</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        
        {/* Map Container */}
        <div className="flex-1 card overflow-hidden relative flex flex-col">
          <div className="p-3 bg-[#1a2338] border-b border-[#2e3a52] flex items-center justify-between z-10 relative">
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Map className="w-4 h-4 text-blue-400" />
              Live Route Network
            </h2>
            <div className="flex gap-3 text-[10px] sm:text-xs">
              <span className="flex items-center gap-1.5 text-slate-300"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500" /> Safe Route</span>
              <span className="flex items-center gap-1.5 text-slate-300"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500" /> Alternative Route</span>
              <span className="flex items-center gap-1.5 text-slate-300"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" /> Blocked Route</span>
            </div>
          </div>
          
          <div className="flex-1 bg-[#0d1526] relative flex items-center justify-center">
             {/* Simulated Map Visual */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
             <svg className="absolute w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
                {/* Blocked Route */}
                <path d="M 20,80 Q 30,50 50,40" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2,2" />
                <circle cx="35" cy="55" r="2.5" fill="#1a2338" stroke="#dc2626" strokeWidth="1" />
                <text x="38" y="55" fill="#dc2626" fontSize="3" fontWeight="bold">BRIDGE DESTROYED</text>

                {/* Safe Route */}
                <path d="M 20,80 C 10,40 40,10 80,20" fill="none" stroke={selectedRoute === 'SAFE' ? "#22c55e" : "#22c55e60"} strokeWidth={selectedRoute === 'SAFE' ? "2" : "1"} />
                
                {/* Alt Route */}
                <path d="M 20,80 C 50,90 90,60 80,20" fill="none" stroke={selectedRoute === 'ALT' ? "#3b5bdb" : "#3b5bdb60"} strokeWidth={selectedRoute === 'ALT' ? "2" : "1"} />

                {/* Nodes */}
                <circle cx="20" cy="80" r="3" fill="#f97316" />
                <text x="10" y="85" fill="#f1f5f9" fontSize="3">Vulnerable Village</text>
                
                <circle cx="80" cy="20" r="3" fill="#22c55e" />
                <text x="83" y="19" fill="#f1f5f9" fontSize="3">Safe Shelter B</text>
             </svg>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 flex flex-col gap-4 overflow-y-auto">
          
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-100 mb-3 border-b border-[#2e3a52] pb-2">Route Analysis</h3>
            
            <div 
              onClick={() => setSelectedRoute('SAFE')}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all mb-3 ${selectedRoute === 'SAFE' ? 'bg-green-950/20 border-green-500' : 'bg-[#1a2338] border-[#2e3a52]'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-green-400 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Primary Safe Route</span>
                <span className="font-mono text-sm text-slate-200">22 min</span>
              </div>
              <div className="text-xs text-slate-400">Via Hill Bypass. Clear path confirmed by drone.</div>
            </div>

            <div 
              onClick={() => setSelectedRoute('ALT')}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all mb-3 ${selectedRoute === 'ALT' ? 'bg-blue-950/20 border-blue-500' : 'bg-[#1a2338] border-[#2e3a52]'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-blue-400">Alternative Route</span>
                <span className="font-mono text-sm text-slate-200">31 min</span>
              </div>
              <div className="text-xs text-slate-400">Via South Valley. Minor waterlogging reported.</div>
            </div>

            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/50">
              <div className="flex items-start gap-2 text-red-400 text-sm font-bold mb-1">
                <AlertTriangle className="w-4 h-4 mt-0.5" /> Route Blocked
              </div>
              <div className="text-xs text-red-300/80">Main highway bridge destroyed due to flash flood. Path impassable.</div>
            </div>
          </div>

          <div className="card p-4 flex-1">
             <h3 className="text-sm font-semibold text-slate-100 mb-3 border-b border-[#2e3a52] pb-2">Evacuation Factors</h3>
             <div className="space-y-3">
               {[
                 { label: 'Real-time Road Conditions', active: true },
                 { label: 'Blocked Route Detection', active: true },
                 { label: 'Crowd-aware Optimization', active: true },
                 { label: 'Works Offline (Low Connectivity)', active: true },
               ].map((f, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                   {f.active ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                   {f.label}
                 </div>
               ))}
             </div>

             <button className="w-full mt-6 btn-primary flex items-center justify-center gap-2">
               <Shield className="w-4 h-4" /> Dispatch Route to Rescue Teams
             </button>
          </div>

        </div>

      </div>
    </div>
  );
}
