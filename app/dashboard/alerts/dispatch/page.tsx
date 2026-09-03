'use client';
import { Radio, Smartphone, AlertTriangle, RadioReceiver, Monitor, Volume2, CheckCircle, ArrowRight, ShieldAlert, Users } from 'lucide-react';
import { useState } from 'react';

export default function AlertDispatchPage() {
  const [channels, setChannels] = useState({
    sms: true,
    siren: true,
    mobile: true,
    tv: false,
    radio: false
  });
  
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const handleDispatch = () => {
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      setDispatched(true);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Radio className="w-5 h-5 text-blue-400" />
          Multi-Channel Alert Dispatch
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Broadcast early warnings across multiple platforms simultaneously</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Dispatch Form */}
        <div className="card p-5 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Area</label>
            <div className="bg-[#2e3a52] rounded-lg p-3 flex items-center justify-between border border-red-900/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-semibold text-slate-200">Chamoli District (Downstream Villages)</span>
              </div>
              <span className="text-xs bg-red-900/40 text-red-300 px-2 py-0.5 rounded-full border border-red-700/50">CRITICAL RISK</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Alert Message</label>
            <textarea 
              className="input w-full h-24 font-mono text-sm resize-none"
              defaultValue="RED ALERT: Imminent Flash Flood warning for Chamoli district. Evacuate immediately to high ground or designated safe shelters. Do not use blocked South Bridge."
            />
          </div>

          <div>
             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Broadcast Channels</label>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {[
                 { id: 'sms', label: 'SMS / Cell Broadcast', icon: Smartphone, color: 'text-green-400' },
                 { id: 'siren', label: 'Siren / PA System', icon: Volume2, color: 'text-red-400' },
                 { id: 'mobile', label: 'Mobile App Push', icon: ShieldAlert, color: 'text-blue-400' },
                 { id: 'tv', label: 'TV / Social Media', icon: Monitor, color: 'text-purple-400' },
                 { id: 'radio', label: 'Radio / Comm Net', icon: RadioReceiver, color: 'text-orange-400' },
               ].map(c => (
                 <label 
                    key={c.id} 
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${channels[c.id as keyof typeof channels] ? 'bg-blue-950/20 border-blue-500' : 'bg-[#1a2338] border-[#2e3a52] opacity-60'}`}
                 >
                   <input 
                     type="checkbox" 
                     className="sr-only" 
                     checked={channels[c.id as keyof typeof channels]} 
                     onChange={() => setChannels(prev => ({ ...prev, [c.id]: !prev[c.id as keyof typeof channels] }))} 
                   />
                   <c.icon className={`w-6 h-6 mb-2 ${channels[c.id as keyof typeof channels] ? c.color : 'text-slate-500'}`} />
                   <span className="text-[10px] font-bold text-center text-slate-300">{c.label}</span>
                 </label>
               ))}
             </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleDispatch}
              disabled={dispatching || dispatched}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                dispatched 
                  ? 'bg-green-900/50 text-green-300 border border-green-700/50 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {dispatching ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Transmitting...</>
              ) : dispatched ? (
                <><CheckCircle className="w-5 h-5" /> Alert Broadcast Successfully</>
              ) : (
                <><Radio className="w-5 h-5" /> INITIALIZE MULTI-CHANNEL BROADCAST</>
              )}
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-2 flex items-center justify-center gap-1">
               <AlertTriangle className="w-3 h-3" /> This action cannot be undone. Will reach approx <span className="text-slate-300 font-bold">12,450</span> people.
            </p>
          </div>
        </div>

        {/* Workflow Visualization */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-100 mb-4 border-b border-[#2e3a52] pb-2">Automated Alert Workflow</h3>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#2e3a52] before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1e2a40] bg-blue-900 text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-3 bg-[#2e3a52]">
                  <div className="text-xs font-bold text-slate-200">1. Hazard Detected</div>
                  <div className="text-[10px] text-slate-400">Glacial Lake Water Level Rising (AI Sensor)</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1e2a40] bg-orange-900 text-orange-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-3 bg-[#2e3a52]">
                  <div className="text-xs font-bold text-slate-200">2. Risk Confirmed</div>
                  <div className="text-[10px] text-slate-400">Risk Becomes CRITICAL. Downstream impact imminent.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1e2a40] bg-green-900 text-green-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-3 bg-[#2e3a52]">
                  <div className="text-xs font-bold text-slate-200">3. Affected Area Identified</div>
                  <div className="text-[10px] text-slate-400">Geo-fencing targets 5 vulnerable villages.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1e2a40] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500 ${dispatched ? 'bg-red-600 text-white' : 'bg-[#2e3a52] text-slate-500'}`}>
                  <Radio className="w-4 h-4" />
                </div>
                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-3 transition-colors duration-500 ${dispatched ? 'bg-red-900/30 border-red-700/50' : 'bg-[#1a2338]'}`}>
                  <div className={`text-xs font-bold ${dispatched ? 'text-red-400' : 'text-slate-400'}`}>4. Alert Sent</div>
                  <div className="text-[10px] text-slate-500">Multi-channel broadcast executed.</div>
                </div>
              </div>
              
            </div>
          </div>

          <div className="card p-4 flex items-center gap-4 bg-gradient-to-r from-blue-900/20 to-transparent border-blue-900/50">
             <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 flex-shrink-0">
               <Users className="w-5 h-5" />
             </div>
             <div>
               <h4 className="text-sm font-bold text-slate-200">Works Even in Low Connectivity</h4>
               <p className="text-[10px] text-slate-400 mt-1">SMS Cell Broadcast and Siren Systems ensure alerts reach citizens even if internet services fail.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
