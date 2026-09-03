'use client';
import { useState, useMemo } from 'react';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safeSites';
import { Habitation } from '@/types';
import { getRiskColor, getPriorityColor, getPriorityLabel, getRiskExplanation } from '@/lib/riskEngine';
import { formatNumber, formatDate } from '@/lib/utils';
import {
  Search, Filter, X, Users, AlertTriangle, MapPin,
  ChevronDown, ChevronRight, Activity, Home, Calendar,
  TrendingUp, Shield
} from 'lucide-react';
import Link from 'next/link';

function RiskBadge({ level, score }: { level: string; score: number }) {
  const colors: Record<string, string> = {
    CRITICAL: 'bg-red-900/50 text-red-300 border-red-700/50',
    VERY_HIGH: 'bg-red-900/30 text-red-400 border-red-800/40',
    HIGH: 'bg-orange-900/50 text-orange-300 border-orange-700/50',
    MODERATE: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
    LOW: 'bg-green-900/50 text-green-300 border-green-700/50',
  };
  return (
    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${colors[level] || ''}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: getRiskColor(level as Habitation['riskLevel']) }} />
      {score}/100 · {level.replace('_', ' ')}
    </div>
  );
}

export default function HabitationsPage() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [hazardFilter, setHazardFilter] = useState('');
  const [selected, setSelected] = useState<Habitation | null>(null);
  const [sortBy, setSortBy] = useState<'riskScore' | 'population' | 'name'>('riskScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const districts = Array.from(new Set(habitations.map(h => h.district))).sort();
  const hazards = ['Flood', 'Landslide', 'Cloudburst', 'Coastal Erosion'];

  const filtered = useMemo(() => {
    return habitations
      .filter(h => {
        const s = search.toLowerCase();
        const matchSearch = !search || h.name.toLowerCase().includes(s) || h.district.toLowerCase().includes(s) || h.state.toLowerCase().includes(s);
        const matchRisk = !riskFilter || h.riskLevel === riskFilter;
        const matchPriority = !priorityFilter || h.relocationPriority === priorityFilter;
        const matchDistrict = !districtFilter || h.district === districtFilter;
        const matchHazard = !hazardFilter || h.primaryHazard.toLowerCase().includes(hazardFilter.toLowerCase());
        return matchSearch && matchRisk && matchPriority && matchDistrict && matchHazard;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'riskScore') diff = a.riskScore - b.riskScore;
        if (sortBy === 'population') diff = a.population - b.population;
        if (sortBy === 'name') diff = a.name.localeCompare(b.name);
        return sortDir === 'desc' ? -diff : diff;
      });
  }, [search, riskFilter, priorityFilter, districtFilter, hazardFilter, sortBy, sortDir]);

  const clearFilters = () => { setSearch(''); setRiskFilter(''); setPriorityFilter(''); setDistrictFilter(''); setHazardFilter(''); };
  const hasFilters = search || riskFilter || priorityFilter || districtFilter || hazardFilter;

  const relatedSites = selected
    ? safeSites.filter(s => selected.recommendedSites.includes(s.id))
    : [];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Vulnerable Habitations</h1>
          <p className="text-sm text-slate-400 mt-0.5">{filtered.length} of {habitations.length} habitations · <span className="text-yellow-400">Demo / Illustrative Data</span></p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Red Zone: {habitations.filter(h => h.redZone).length}
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-2" /> Immediate: {habitations.filter(h => h.relocationPriority === 'IMMEDIATE').length}
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search" placeholder="Search habitation, district..."
              className="input w-full pl-9" value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input min-w-36" value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
            <option value="">Risk Level</option>
            {['CRITICAL', 'VERY_HIGH', 'HIGH', 'MODERATE', 'LOW'].map(r => (
              <option key={r} value={r}>{r.replace('_', ' ')}</option>
            ))}
          </select>
          <select className="input min-w-36" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="">Priority</option>
            {['IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'MONITOR'].map(p => (
              <option key={p} value={p}>{getPriorityLabel(p)}</option>
            ))}
          </select>
          <select className="input min-w-36" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
            <option value="">District</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="input min-w-36" value={hazardFilter} onChange={e => setHazardFilter(e.target.value)}>
            <option value="">Hazard Type</option>
            {hazards.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="btn-secondary flex items-center gap-1.5 text-xs">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="card overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 px-4 py-3 border-b border-[#2e3a52] text-xs text-slate-500 font-medium uppercase tracking-wider">
              <div className="col-span-2">
                <button onClick={() => { setSortBy('name'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }} className="flex items-center gap-1 hover:text-slate-300">
                  Habitation <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="hidden sm:block">District</div>
              <div>
                <button onClick={() => { setSortBy('population'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }} className="flex items-center gap-1 hover:text-slate-300">
                  Population <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div>
                <button onClick={() => { setSortBy('riskScore'); setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }} className="flex items-center gap-1 hover:text-slate-300">
                  Risk <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="hidden sm:block">Hazard</div>
              <div>Priority</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#2e3a52]">
              {filtered.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelected(selected?.id === h.id ? null : h)}
                  className={`w-full grid grid-cols-5 sm:grid-cols-7 gap-2 px-4 py-3 text-left hover:bg-[#2e3a52]/40 transition-colors items-center ${selected?.id === h.id ? 'bg-blue-950/20' : ''}`}
                >
                  <div className="col-span-2">
                    <div className="font-medium text-slate-200 text-sm truncate">{h.name}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {h.redZone && <span className="text-[9px] text-red-400 bg-red-900/30 px-1 rounded">RZ</span>}
                      <span className="text-[10px] text-slate-500 sm:hidden">{h.district}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-xs text-slate-400 truncate">{h.district}</div>
                  <div>
                    <div className="text-xs text-slate-200">{formatNumber(h.population)}</div>
                    <div className="text-[10px] text-orange-400">{formatNumber(h.vulnerablePopulation)} vuln.</div>
                  </div>
                  <div>
                    <div
                      className="text-xs font-bold"
                      style={{ color: getRiskColor(h.riskLevel) }}
                    >
                      {h.riskScore}/100
                    </div>
                    <div className="text-[10px] text-slate-500">{h.riskLevel.replace('_', ' ')}</div>
                  </div>
                  <div className="hidden sm:block text-xs text-slate-400">{h.primaryHazard}</div>
                  <div>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        background: getPriorityColor(h.relocationPriority) + '20',
                        color: getPriorityColor(h.relocationPriority)
                      }}
                    >
                      {getPriorityLabel(h.relocationPriority)}
                    </span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-12 text-center text-slate-500 text-sm">
                  No habitations match the current filters.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="space-y-4 animate-fade-in">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">Risk Profile</h3>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Score */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white"
                  style={{ background: getRiskColor(selected.riskLevel) }}
                >
                  <span className="text-xl font-bold leading-none">{selected.riskScore}</span>
                  <span className="text-[10px] opacity-80">/100</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-100">{selected.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {selected.district}, {selected.state}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {selected.redZone && (
                      <span className="text-[10px] bg-red-900/40 text-red-300 border border-red-700/40 px-2 py-0.5 rounded-full">RED ZONE</span>
                    )}
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: getPriorityColor(selected.relocationPriority) + '20', color: getPriorityColor(selected.relocationPriority) }}
                    >
                      {getPriorityLabel(selected.relocationPriority)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pop stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-[#2e3a52] rounded-lg p-2.5 text-xs">
                  <div className="text-slate-500 mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Total Pop.</div>
                  <div className="font-bold text-slate-100">{formatNumber(selected.population)}</div>
                </div>
                <div className="bg-[#2e3a52] rounded-lg p-2.5 text-xs">
                  <div className="text-orange-400 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Vulnerable</div>
                  <div className="font-bold text-orange-300">{formatNumber(selected.vulnerablePopulation)}</div>
                  <div className="text-slate-600 text-[10px]">{Math.round((selected.vulnerablePopulation / selected.population) * 100)}%</div>
                </div>
              </div>

              {/* Hazards */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Hazard Profile</div>
                {Object.entries(selected.hazards).map(([h, l]) => l !== 'NONE' && (
                  <div key={h} className="flex items-center justify-between py-1 text-xs border-b border-[#2e3a52] last:border-0">
                    <span className="text-slate-400 capitalize">{h.replace(/([A-Z])/g, ' $1')}</span>
                    <span className={`font-medium ${l === 'VERY_HIGH' ? 'text-red-400' : l === 'HIGH' ? 'text-orange-400' : l === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {l.replace('_', ' ')}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-1 text-xs">
                  <span className="text-slate-400">Historical Events</span>
                  <span className="text-slate-200 font-medium">{selected.historicalEvents}</span>
                </div>
              </div>

              {/* Risk factors bars */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Risk Factor Analysis</div>
                {[
                  { label: 'Hazard Intensity (30%)', val: selected.riskFactors.hazardIntensity },
                  { label: 'Historical Freq. (20%)', val: selected.riskFactors.historicalFrequency },
                  { label: 'Population Exposure (20%)', val: selected.riskFactors.populationExposure },
                  { label: 'Vulnerability (20%)', val: selected.riskFactors.vulnerability },
                  { label: 'Infra Risk (10%)', val: selected.riskFactors.infrastructureRisk },
                ].map(f => (
                  <div key={f.label} className="mb-2">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>{f.label}</span><span>{f.val}/100</span>
                    </div>
                    <div className="w-full bg-[#2e3a52] rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{
                        width: `${f.val}%`,
                        background: f.val >= 80 ? '#dc2626' : f.val >= 60 ? '#f97316' : f.val >= 40 ? '#eab308' : '#22c55e'
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Priority Rationale</div>
                <div className="space-y-1.5">
                  {getRiskExplanation(selected).map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended sites */}
              {relatedSites.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recommended Sites</div>
                  {relatedSites.map(s => (
                    <div key={s.id} className="flex items-center justify-between text-xs p-2 bg-[#2e3a52] rounded-lg mb-1.5">
                      <div>
                        <div className="text-slate-200 font-medium">{s.name.split(' ').slice(0, 3).join(' ')}</div>
                        <div className="text-slate-500">{s.district}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">{formatNumber(s.availableCapacity)}</div>
                        <div className="text-slate-500">capacity</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <Link href="/dashboard/relocation" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" /> View Relocation Plan
                </Link>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 justify-center">
                  <Calendar className="w-3 h-3" /> Last updated: {formatDate(selected.lastUpdated)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
