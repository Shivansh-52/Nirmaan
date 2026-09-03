'use client';
import { Shield, Users, Activity, CheckCircle, AlertCircle, AlertTriangle, Crosshair, Map, Truck, Plane } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function RescueDashboardPage() {
  const stats = {
    atRisk: 12450,
    safe: 6250,
    needHelp: 1320,
    unreachable: 4880
  };

  const pieData = [
    { name: 'Confirmed Safe', value: stats.safe, color: '#22c55e' },
    { name: 'Need Help (SOS)', value: stats.needHelp, color: '#f97316' },
    { name: 'Unreachable', value: stats.unreachable, color: '#64748b' },
  ];

  const resources = [
    { label: 'NDRF Teams', count: 24, icon: Users },
    { label: 'Rescue Boats', count: 8, icon: Crosshair },
    { label: 'Ambulances', count: 12, icon: Truck },
    { label: 'Drones', count: 6, icon: Plane },
    { label: 'Medical Units', count: 18, icon: Activity },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Live Rescue & Response Command
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Real-time situational awareness and resource tracking</p>
      </div>

      {/* Live Situation Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="card p-4 border-l-4 border-l-blue-500 bg-blue-950/10">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">People at Risk</div>
          <div className="text-3xl font-bold text-slate-100">{formatNumber(stats.atRisk)}</div>
        </div>
        <div className="card p-4 border-l-4 border-l-green-500 bg-green-950/10">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Confirmed Safe</div>
          <div className="text-3xl font-bold text-green-400">{formatNumber(stats.safe)}</div>
          <div className="text-[10px] text-green-500 mt-1">Via App & SMS Check-in</div>
        </div>
        <div className="card p-4 border-l-4 border-l-orange-500 bg-orange-950/10 animate-pulse-slow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Need Help (SOS)</div>
          <div className="text-3xl font-bold text-orange-400">{formatNumber(stats.needHelp)}</div>
          <div className="text-[10px] text-orange-500 mt-1">Priority dispatch active</div>
        </div>
        <div className="card p-4 border-l-4 border-l-slate-500 bg-slate-900/40">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Unreachable</div>
          <div className="text-3xl font-bold text-slate-300">{formatNumber(stats.unreachable)}</div>
          <div className="text-[10px] text-slate-500 mt-1">Last known locations tracked</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 card p-1 flex flex-col">
          <div className="p-3 border-b border-[#2e3a52] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Map className="w-4 h-4 text-blue-400" />
              Live Target Tracking Map
            </h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] text-slate-400"><div className="w-2 h-2 rounded-full bg-orange-500" /> SOS Signals</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500" /> Rescue Teams</span>
            </div>
          </div>
          <div className="flex-1 min-h-[400px] bg-[#0d1526] relative rounded-b-xl overflow-hidden flex items-center justify-center">
            {/* Simulated Map Visual */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#2e3a52 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_#f97316] animate-ping" />
            <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_#f97316] animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_15px_#f97316] animate-ping" style={{ animationDelay: '1s' }} />
            
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white"><Truck className="w-2 h-2" /></div>
            <div className="absolute bottom-1/2 right-1/3 w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white"><Crosshair className="w-2 h-2" /></div>

            <div className="text-slate-500 text-sm font-mono absolute bottom-4 left-4 bg-[#1a2338]/80 p-2 rounded">
              Satellite Tracking Active
            </div>
          </div>
        </div>

        {/* Resources & Breakdown */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-slate-100 mb-4 border-b border-[#2e3a52] pb-2">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#1a2338', border: '1px solid #2e3a52', borderRadius: '8px' }} 
                  itemStyle={{ fontSize: '12px', color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-4 flex-1">
            <h3 className="text-sm font-semibold text-slate-100 mb-4 border-b border-[#2e3a52] pb-2">Resources Deployed</h3>
            <div className="space-y-3">
              {resources.map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-7 h-7 bg-[#2e3a52] rounded flex items-center justify-center">
                      <r.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">{r.label}</span>
                  </div>
                  <span className="font-bold text-slate-100">{r.count}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 btn-secondary text-xs">Request Additional Resources</button>
          </div>
        </div>
      </div>
    </div>
  );
}
