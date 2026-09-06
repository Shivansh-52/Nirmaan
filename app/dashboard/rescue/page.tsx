'use client';
import { useState } from 'react';
import {
  Shield, Users, Activity, CheckCircle, AlertCircle, AlertTriangle,
  Crosshair, Map, Truck, Plane, Radio, Clock, Navigation, Check,
  ChevronRight, Compass, ShieldAlert, HeartPulse, UserCheck, Flame
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface SOSTicket {
  id: string;
  location: string;
  district: string;
  hazard: string;
  victims: number;
  reportedAt: string;
  severity: 'CRITICAL' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'EVACUATED';
  assignedUnit?: string;
  coordinates: string;
}

const initialTickets: SOSTicket[] = [
  {
    id: 'SOS-9041',
    location: 'Joshimath Lower Ward 4 (Near Alaknanda Bank)',
    district: 'Chamoli',
    hazard: 'Debris Flow & River Surge',
    victims: 14,
    reportedAt: '3 mins ago',
    severity: 'CRITICAL',
    status: 'PENDING',
    coordinates: '30.5564° N, 79.5620° E'
  },
  {
    id: 'SOS-9038',
    location: 'Meppadi Tea Estate Enclave',
    district: 'Wayanad',
    hazard: 'Slope Collapse & Mudslide',
    victims: 32,
    reportedAt: '8 mins ago',
    severity: 'CRITICAL',
    status: 'ACKNOWLEDGED',
    assignedUnit: 'NDRF Battalion 04',
    coordinates: '11.5524° N, 76.1264° E'
  },
  {
    id: 'SOS-9034',
    location: 'Tapovan Hydro Access Road KM 12',
    district: 'Chamoli',
    hazard: 'Bridge Inundation (Medical Need)',
    victims: 8,
    reportedAt: '14 mins ago',
    severity: 'URGENT',
    status: 'DISPATCHED',
    assignedUnit: 'SDRF Quick Inflatable 02',
    coordinates: '30.4912° N, 79.6271° E'
  },
  {
    id: 'SOS-9029',
    location: 'Rambara Valley Pilgrim Waypoint',
    district: 'Rudraprayag',
    hazard: 'Cloudburst Flash Torrent',
    victims: 19,
    reportedAt: '22 mins ago',
    severity: 'HIGH',
    status: 'PENDING',
    coordinates: '30.6890° N, 79.0620° E'
  }
];

export default function RescueDashboardPage() {
  const [tickets, setTickets] = useState<SOSTicket[]>(initialTickets);
  const [stats, setStats] = useState({
    atRisk: 12450,
    safe: 6250,
    needHelp: 1320,
    unreachable: 4880
  });

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const handleAcknowledge = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'ACKNOWLEDGED' } : t));
  };

  const handleDispatch = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'DISPATCHED', assignedUnit: 'NDRF Fast Response Boat Alpha' } : t));
  };

  const handleEvacuated = (id: string) => {
    const t = tickets.find(x => x.id === id);
    if (t) {
      setStats(prev => ({
        ...prev,
        safe: prev.safe + t.victims,
        needHelp: Math.max(0, prev.needHelp - t.victims)
      }));
    }
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'EVACUATED' } : t));
  };

  const pieData = [
    { name: 'Confirmed Safe', value: stats.safe, color: '#10b981' },
    { name: 'Need Help (SOS)', value: stats.needHelp, color: '#ef4444' },
    { name: 'Unreachable / In Transit', value: stats.unreachable, color: '#64748b' },
  ];

  const resources = [
    { label: 'NDRF Rescue Battalions', count: 24, active: 22, icon: Users, color: 'text-sky-400' },
    { label: 'Motorized Inflatable Boats', count: 8, active: 7, icon: Crosshair, color: 'text-emerald-400' },
    { label: 'Emergency Trauma Ambulances', count: 12, active: 11, icon: Truck, color: 'text-amber-400' },
    { label: 'Thermal Reconnaissance Drones', count: 6, active: 6, icon: Plane, color: 'text-purple-400' },
    { label: 'Field Medical Units', count: 18, active: 16, icon: HeartPulse, color: 'text-red-400' },
  ];

  const filteredTickets = tickets.filter(t => filterSeverity === 'ALL' || t.severity === filterSeverity);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/60 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              LIVE DISASTER TRIAGE HQ
            </span>
            <span className="text-xs text-slate-400 font-mono">SECTOR COMMAND: UTTARAKHAND & WESTERN GHATS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-sky-400" />
            Live Rescue & Emergency Response Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time citizen SOS triage, NDRF tactical asset allocation, and live evacuation telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>SATELLITE DOWNLINK: ACTIVE</span>
        </div>
      </div>

      {/* 4 High-Impact Situational KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* At Risk */}
        <div className="card p-4.5 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/30 border-sky-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Monitored At Risk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_#0284c7]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-slate-100 mt-2">{formatNumber(stats.atRisk)}</div>
          <div className="text-[11px] text-sky-400 mt-1 flex items-center gap-1 font-mono">
            <span>Across 8 Red Zones</span>
          </div>
        </div>

        {/* Confirmed Safe */}
        <div className="card p-4.5 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Confirmed Safe</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">{formatNumber(stats.safe)}</div>
          <div className="text-[11px] text-emerald-300 mt-1 flex items-center gap-1 font-mono">
            <CheckCircle className="w-3.5 h-3.5" /> 50.2% verified check-in rate
          </div>
        </div>

        {/* Active SOS */}
        <div className="card p-4.5 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border-red-800/50 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Active SOS Signals</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-ping" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-red-400 mt-2">{formatNumber(stats.needHelp)}</div>
          <div className="text-[11px] text-red-300/90 mt-1 flex items-center gap-1 font-mono">
            <Flame className="w-3.5 h-3.5" /> High priority triage queue
          </div>
        </div>

        {/* Deployed Units */}
        <div className="card p-4.5 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border-purple-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Deployed NDRF Assets</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-300 mt-2">68 Units</div>
          <div className="text-[11px] text-purple-400 mt-1 font-mono">
            91.1% active fleet deployment
          </div>
        </div>
      </div>

      {/* Center Layout: Triage Feed (Left 7 cols) & Tactical Radar / Assets (Right 5 cols) */}
      <div className="grid lg:grid-cols-12 gap-5">
        
        {/* SOS Incoming Triage Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card p-5 space-y-4 bg-slate-900/85">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  Live Incident Triage & Response Feed
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Direct telemetry from Citizen Safety App & emergency SMS broadcasts.</p>
              </div>

              {/* Filter */}
              <div className="flex gap-1.5">
                {['ALL', 'CRITICAL', 'URGENT', 'HIGH'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterSeverity(s)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all ${
                      filterSeverity === s
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Tickets Stream */}
            <div className="space-y-3">
              {filteredTickets.map(ticket => {
                const isEvacuated = ticket.status === 'EVACUATED';
                return (
                  <div
                    key={ticket.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isEvacuated 
                        ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70' 
                        : ticket.severity === 'CRITICAL'
                        ? 'bg-red-950/20 border-red-800/50 shadow-md shadow-red-950/20'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-200">{ticket.id}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono ${
                            ticket.severity === 'CRITICAL' ? 'bg-red-900/60 text-red-300 border border-red-700/60' :
                            ticket.severity === 'URGENT' ? 'bg-amber-900/60 text-amber-300 border border-amber-700/60' :
                            'bg-orange-900/60 text-orange-300 border border-orange-700/60'
                          }`}>
                            {ticket.severity}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" /> {ticket.reportedAt}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-100 mt-1">{ticket.location}</div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{ticket.district} Sector</span>
                          <span className="text-slate-600">|</span>
                          <span className="text-red-400 font-semibold">{ticket.hazard}</span>
                          <span className="text-slate-600">|</span>
                          <span className="font-mono text-slate-300 font-bold">{ticket.victims} Citizens Trapped</span>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full font-mono inline-flex items-center gap-1.5 ${
                          ticket.status === 'EVACUATED' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60' :
                          ticket.status === 'DISPATCHED' ? 'bg-sky-950/60 text-sky-300 border border-sky-700/60' :
                          ticket.status === 'ACKNOWLEDGED' ? 'bg-amber-950/60 text-amber-300 border border-amber-700/60' :
                          'bg-red-950/60 text-red-300 border border-red-700/60 animate-pulse'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            ticket.status === 'EVACUATED' ? 'bg-emerald-400' :
                            ticket.status === 'DISPATCHED' ? 'bg-sky-400' :
                            ticket.status === 'ACKNOWLEDGED' ? 'bg-amber-400' : 'bg-red-400'
                          }`} />
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    {/* Coordinates & Assigned Unit info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
                      <span>GPS: {ticket.coordinates}</span>
                      {ticket.assignedUnit && (
                        <span className="text-sky-300 font-bold">Assigned: {ticket.assignedUnit}</span>
                      )}
                    </div>

                    {/* Triage Action Buttons */}
                    {!isEvacuated && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {ticket.status === 'PENDING' && (
                          <button
                            onClick={() => handleAcknowledge(ticket.id)}
                            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5 text-amber-400" /> Acknowledge Alert
                          </button>
                        )}
                        {(ticket.status === 'PENDING' || ticket.status === 'ACKNOWLEDGED') && (
                          <button
                            onClick={() => handleDispatch(ticket.id)}
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                          >
                            <Navigation className="w-3.5 h-3.5" /> Assign NDRF Rescue Boat
                          </button>
                        )}
                        {ticket.status === 'DISPATCHED' && (
                          <button
                            onClick={() => handleEvacuated(ticket.id)}
                            className="btn-emerald text-xs py-1.5 px-3 flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Mark Evacuated & Safe
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Tactical Telemetry & Assets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Simulated Satellite Radar Map */}
          <div className="card p-1 overflow-hidden">
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400 animate-spin-slow" />
                Live Satellite Vector Radar
              </div>
              <span className="font-mono text-[10px] text-slate-400">CHAMOLI SECTOR</span>
            </div>

            <div className="h-64 bg-[#070b14] relative flex items-center justify-center overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              {/* Radar Rings */}
              <div className="absolute w-48 h-48 rounded-full border border-sky-500/20" />
              <div className="absolute w-32 h-32 rounded-full border border-sky-500/30" />
              <div className="absolute w-16 h-16 rounded-full border border-sky-500/40" />
              
              {/* Radar Sweep Needle */}
              <div className="absolute w-48 h-48 rounded-full radar-sweep pointer-events-none">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-sky-400 absolute top-1/2 left-1/2 transform -translate-y-1/2" />
              </div>

              {/* Active SOS Pings */}
              <div className="absolute top-1/4 left-1/3 flex flex-col items-center">
                <span className="w-3.5 h-3.5 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444] animate-ping" />
                <span className="font-mono text-[9px] text-red-300 bg-slate-950/80 px-1.5 rounded mt-1">SOS: Joshimath</span>
              </div>

              <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center">
                <span className="w-3.5 h-3.5 bg-red-500 rounded-full shadow-[0_0_12px_#ef4444] animate-ping" />
                <span className="font-mono text-[9px] text-red-300 bg-slate-950/80 px-1.5 rounded mt-1">SOS: Meppadi</span>
              </div>

              {/* Deployed Asset Icons */}
              <div className="absolute top-1/3 right-1/3 p-1 rounded bg-sky-600 text-white shadow-lg">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div className="absolute bottom-1/4 left-1/4 p-1 rounded bg-emerald-600 text-white shadow-lg">
                <Crosshair className="w-3.5 h-3.5" />
              </div>

              <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-sky-400">
                SWEEP RATE: 30 RPM
              </div>
            </div>
          </div>

          {/* Breakdown Pie Chart */}
          <div className="card p-4 space-y-3 bg-slate-900/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
              Citizen Triage Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} 
                  itemStyle={{ fontSize: '11px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Resources Deployed */}
          <div className="card p-4 space-y-3 bg-slate-900/80">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Deployed NDRF & SDRF Units
              </h3>
              <span className="font-mono text-xs text-sky-400 font-bold">Active Fleet</span>
            </div>

            <div className="space-y-2.5">
              {resources.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-7 h-7 bg-slate-800/80 rounded-lg flex items-center justify-center">
                      <r.icon className={`w-3.5 h-3.5 ${r.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{r.label}</div>
                      <div className="text-[10px] text-slate-500">{r.active} deployed in sector</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-sm text-slate-100">{r.count}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
