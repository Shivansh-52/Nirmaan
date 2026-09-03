'use client';
import { useState, useMemo } from 'react';
import { safeSites } from '@/data/safeSites';
import { SafeSite } from '@/types';
import { formatNumber, formatDate } from '@/lib/utils';
import {
  Home, Droplets, Activity, Zap, GraduationCap,
  Heart, Search, X, Info, MapPin, Users
} from 'lucide-react';

const connectivityColor = (c: string) => {
  switch (c) {
    case 'EXCELLENT': return 'text-green-400';
    case 'GOOD': return 'text-blue-400';
    case 'FAIR': return 'text-yellow-400';
    case 'POOR': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

const waterColor = (w: string) => {
  switch (w) {
    case 'EXCELLENT': return 'text-green-400';
    case 'GOOD': return 'text-blue-400';
    case 'FAIR': return 'text-yellow-400';
    case 'POOR': return 'text-red-400';
    default: return 'text-slate-400';
  }
};

function ScoreBar({ label, value, max = 100, color = '#3b5bdb' }: { label: string; value: number; max?: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-medium">{value}{max === 100 ? '/100' : ` km`}</span>
      </div>
      <div className="w-full bg-[#2e3a52] rounded-full h-2">
        <div className="h-2 rounded-full" style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color }} />
      </div>
    </div>
  );
}

function CapacityBar({ site }: { site: SafeSite }) {
  const pct = Math.round((site.existingPopulation / site.totalCapacity) * 100);
  const color = pct > 80 ? '#dc2626' : pct > 60 ? '#f97316' : '#22c55e';
  const status = site.status === 'FULL' ? 'FULL' : site.availableCapacity < 300 ? 'LIMITED' : 'AVAILABLE';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">Capacity Used</span>
        <span className="font-medium" style={{ color }}>{pct}% · {status}</span>
      </div>
      <div className="w-full bg-[#2e3a52] rounded-full h-3 overflow-hidden">
        <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>{formatNumber(site.existingPopulation)} existing</span>
        <span>{formatNumber(site.availableCapacity)} available</span>
      </div>
    </div>
  );
}

export default function SafeSitesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'suitabilityScore' | 'availableCapacity' | 'safetyScore'>('suitabilityScore');
  const [selected, setSelected] = useState<SafeSite | null>(null);

  const filtered = useMemo(() => {
    return safeSites
      .filter(s => {
        const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.district.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || s.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [search, statusFilter, sortBy]);

  const totalCapacity = safeSites.reduce((s, x) => s + x.availableCapacity, 0);
  const available = safeSites.filter(s => s.status === 'AVAILABLE').length;

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Safe Sites & Carrying Capacity</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Potential relocation sites with illustrative capacity assessment ·{' '}
            <span className="text-yellow-400">Estimated / Illustrative Data</span>
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span><span className="text-green-400 font-bold">{available}</span> Available</span>
          <span><span className="text-blue-400 font-bold">{formatNumber(totalCapacity)}</span> Total Capacity</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Safe Sites', value: safeSites.length, icon: Home, color: 'text-blue-400', bg: 'bg-blue-900/30' },
          { label: 'Available Sites', value: available, icon: Activity, color: 'text-green-400', bg: 'bg-green-900/30' },
          { label: 'Total Capacity', value: formatNumber(totalCapacity), icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
          { label: 'Avg. Safety Score', value: Math.round(safeSites.reduce((s, x) => s + x.safetyScore, 0) / safeSites.length) + '/100', icon: Heart, color: 'text-purple-400', bg: 'bg-purple-900/30' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-xl font-bold text-slate-100">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="search" placeholder="Search site or district..." className="input w-full pl-9"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input min-w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="LIMITED">Limited</option>
            <option value="FULL">Full</option>
          </select>
          <select className="input min-w-44" value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
            <option value="suitabilityScore">Sort: Suitability</option>
            <option value="safetyScore">Sort: Safety Score</option>
            <option value="availableCapacity">Sort: Available Capacity</option>
          </select>
          {(search || statusFilter) && (
            <button onClick={() => { setSearch(''); setStatusFilter(''); }} className="btn-secondary flex items-center gap-1 text-xs">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Sites grid */}
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(s => (
              <div
                key={s.id}
                onClick={() => setSelected(selected?.id === s.id ? null : s)}
                className={`card card-hover p-4 cursor-pointer ${selected?.id === s.id ? 'border-blue-600/50 bg-blue-950/10' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm leading-tight">{s.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3 h-3" /> {s.district}
                    </div>
                  </div>
                  <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    s.status === 'AVAILABLE' ? 'bg-green-900/40 text-green-400'
                    : s.status === 'LIMITED' ? 'bg-yellow-900/40 text-yellow-400'
                    : 'bg-red-900/40 text-red-400'
                  }`}>
                    {s.status}
                  </div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center bg-[#2e3a52] rounded-lg p-2">
                    <div className="text-lg font-bold text-green-400">{s.safetyScore}</div>
                    <div className="text-[10px] text-slate-500">Safety</div>
                  </div>
                  <div className="text-center bg-[#2e3a52] rounded-lg p-2">
                    <div className="text-lg font-bold text-blue-400">{s.suitabilityScore}</div>
                    <div className="text-[10px] text-slate-500">Suitability</div>
                  </div>
                </div>

                <CapacityBar site={s} />

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span className={waterColor(s.waterAvailability)}>{s.waterAvailability}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{s.healthcareDistance} km</span>
                  </div>
                  <div className={`flex items-center gap-1 ${connectivityColor(s.roadConnectivity)}`}>
                    <Activity className="w-3 h-3" />
                    <span>{s.roadConnectivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="space-y-4 animate-fade-in">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">Site Details</h3>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-100">{selected.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3 h-3" /> {selected.district}, {selected.state}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#2e3a52] rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{selected.safetyScore}</div>
                    <div className="text-xs text-slate-500">Safety Score</div>
                  </div>
                  <div className="bg-[#2e3a52] rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{selected.suitabilityScore}</div>
                    <div className="text-xs text-slate-500">Suitability</div>
                  </div>
                </div>

                {/* Capacity (detailed) */}
                <div className="bg-[#2e3a52] rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Info className="w-3 h-3" /> Estimated Capacity Assessment
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Sustainable Capacity</span>
                      <span className="font-bold text-slate-100">{formatNumber(selected.totalCapacity)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Existing Population</span>
                      <span className="font-bold text-slate-100">{formatNumber(selected.existingPopulation)}</span>
                    </div>
                    <div className="border-t border-[#3a4a66] pt-2 flex justify-between text-sm">
                      <span className="text-green-400 font-semibold">Available Capacity</span>
                      <span className="font-bold text-green-400">{formatNumber(selected.availableCapacity)}</span>
                    </div>
                  </div>
                  <CapacityBar site={selected} />
                  <p className="text-[10px] text-slate-600 mt-2">
                    * Estimated illustrative capacity — not an official engineering assessment
                  </p>
                </div>

                {/* Infrastructure */}
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Infrastructure & Amenities</div>
                  <div className="space-y-2">
                    <ScoreBar label="Infrastructure Score" value={selected.infrastructureScore} color="#3b5bdb" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Droplets className="w-3 h-3" />
                        <span>Water: </span>
                        <span className={waterColor(selected.waterAvailability)}>{selected.waterAvailability}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Activity className="w-3 h-3" />
                        <span>Roads: </span>
                        <span className={connectivityColor(selected.roadConnectivity)}>{selected.roadConnectivity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Heart className="w-3 h-3" />
                        <span>Healthcare: {selected.healthcareDistance} km</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <GraduationCap className="w-3 h-3" />
                        <span>School: {selected.schoolDistance} km</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Zap className={`w-3 h-3 ${selected.electricityAccess ? 'text-yellow-400' : 'text-red-400'}`} />
                        <span className="text-slate-400">Electricity: </span>
                        <span className={selected.electricityAccess ? 'text-green-400' : 'text-red-400'}>
                          {selected.electricityAccess ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Last verified: {formatDate(selected.lastUpdated)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
