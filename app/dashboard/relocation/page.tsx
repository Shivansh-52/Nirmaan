'use client';
import { useState, useMemo } from 'react';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safeSites';
import { Habitation, RelocationPlan } from '@/types';
import { rankSitesForHabitation, generateRelocationPlan } from '@/lib/relocationEngine';
import { getRiskColor, getPriorityColor, getPriorityLabel, getRiskExplanation } from '@/lib/riskEngine';
import { formatNumber, formatDateTime } from '@/lib/utils';
import {
  Search, AlertTriangle, Users, Home, CheckCircle,
  XCircle, AlertCircle, ChevronRight, MapPin,
  Droplets, Activity, Heart, Zap, Download, Shield, X
} from 'lucide-react';

function CapacityStatusBadge({ status }: { status: 'SUFFICIENT' | 'LIMITED' | 'INSUFFICIENT' }) {
  return status === 'SUFFICIENT'
    ? <span className="flex items-center gap-1.5 text-green-400 font-semibold"><CheckCircle className="w-4 h-4" /> CAPACITY SUFFICIENT</span>
    : status === 'LIMITED'
    ? <span className="flex items-center gap-1.5 text-yellow-400 font-semibold"><AlertCircle className="w-4 h-4" /> LIMITED CAPACITY</span>
    : <span className="flex items-center gap-1.5 text-red-400 font-semibold"><XCircle className="w-4 h-4" /> INSUFFICIENT CAPACITY</span>;
}

export default function RelocationPage() {
  const [search, setSearch] = useState('');
  const [selectedHab, setSelectedHab] = useState<Habitation | null>(null);
  const [plan, setPlan] = useState<RelocationPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  const immediate = habitations.filter(h => h.relocationPriority === 'IMMEDIATE').sort((a, b) => b.riskScore - a.riskScore);

  const filteredHabs = useMemo(() => {
    const s = search.toLowerCase();
    return habitations.filter(h =>
      h.name.toLowerCase().includes(s) || h.district.toLowerCase().includes(s)
    ).sort((a, b) => b.riskScore - a.riskScore);
  }, [search]);

  const rankedSites = useMemo(() => {
    if (!selectedHab) return [];
    return rankSitesForHabitation(selectedHab, safeSites);
  }, [selectedHab]);

  const handleSelectHab = (h: Habitation) => {
    setSelectedHab(h);
    setPlan(null);
    setPlanGenerated(false);
  };

  const handleGeneratePlan = async () => {
    if (!selectedHab) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    const p = generateRelocationPlan(selectedHab, safeSites);
    setPlan(p);
    setPlanGenerated(true);
    setGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Relocation Planning</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          AI-powered decision support for habitation relocation · <span className="text-yellow-400">Advisory — Final decision rests with authorities</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Habitation Selection */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search" placeholder="Select habitation..."
              className="input w-full pl-9"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="text-xs text-slate-500 font-medium uppercase tracking-wider px-1">
            Immediate Priority ({immediate.length})
          </div>

          <div className="card overflow-hidden max-h-[60vh] overflow-y-auto">
            {filteredHabs.map(h => (
              <button
                key={h.id}
                onClick={() => handleSelectHab(h)}
                className={`w-full text-left p-3 border-b border-[#2e3a52] last:border-0 hover:bg-[#2e3a52]/50 transition-colors flex items-center gap-3 ${selectedHab?.id === h.id ? 'bg-blue-950/30 border-l-2 border-l-blue-500' : ''}`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: getRiskColor(h.riskLevel) }}
                >
                  {h.riskScore}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-200 truncate">{h.name}</div>
                  <div className="text-[10px] text-slate-500">{h.district} · {formatNumber(h.population)} pop.</div>
                </div>
                <div
                  className="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: getPriorityColor(h.relocationPriority) + '20', color: getPriorityColor(h.relocationPriority) }}
                >
                  {getPriorityLabel(h.relocationPriority)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {!selectedHab ? (
            <div className="card p-12 text-center">
              <Home className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <div className="text-slate-400 font-medium">Select a habitation to begin relocation planning</div>
              <div className="text-slate-600 text-sm mt-2">
                The system will recommend safe sites, assess capacity, and generate a structured decision-support plan.
              </div>
            </div>
          ) : (
            <>
              {/* Habitation summary */}
              <div className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0"
                      style={{ background: getRiskColor(selectedHab.riskLevel) }}
                    >
                      <span className="text-xl font-bold leading-none">{selectedHab.riskScore}</span>
                      <span className="text-[10px] opacity-80">/100</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-100">{selectedHab.name}</h2>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3 h-3" /> {selectedHab.district}, {selectedHab.state}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {selectedHab.redZone && <span className="text-[10px] bg-red-900/40 text-red-300 border border-red-700/40 px-2 py-0.5 rounded-full">RED ZONE</span>}
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: getPriorityColor(selectedHab.relocationPriority) + '20', color: getPriorityColor(selectedHab.relocationPriority) }}
                        >
                          {getPriorityLabel(selectedHab.relocationPriority)} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedHab(null)} className="text-slate-500 hover:text-slate-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-[#2e3a52] rounded-lg p-2.5 text-center">
                    <div className="text-base font-bold text-slate-100">{formatNumber(selectedHab.population)}</div>
                    <div className="text-[10px] text-slate-500">Total Population</div>
                  </div>
                  <div className="bg-[#2e3a52] rounded-lg p-2.5 text-center">
                    <div className="text-base font-bold text-orange-300">{formatNumber(selectedHab.vulnerablePopulation)}</div>
                    <div className="text-[10px] text-slate-500">Vulnerable</div>
                  </div>
                  <div className="bg-[#2e3a52] rounded-lg p-2.5 text-center">
                    <div className="text-base font-bold text-slate-100">{selectedHab.historicalEvents}</div>
                    <div className="text-[10px] text-slate-500">Disaster Events</div>
                  </div>
                </div>

                {/* Why high risk */}
                <div className="mt-4 p-3 bg-orange-900/10 border border-orange-800/30 rounded-lg">
                  <div className="text-xs font-semibold text-orange-400 mb-1.5">Why this habitation needs relocation:</div>
                  <div className="space-y-1">
                    {getRiskExplanation(selectedHab).slice(0, 3).map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />{r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ranked sites */}
              <div className="card p-4">
                <h3 className="section-title mb-4">Recommended Relocation Sites</h3>
                <div className="space-y-3">
                  {rankedSites.slice(0, 5).map((s, i) => {
                    const pct = Math.round((s.existingPopulation / s.totalCapacity) * 100);
                    return (
                      <div key={s.id} className="p-3 bg-[#2e3a52] rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-blue-900/50 border border-blue-600/40 rounded-full flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0">
                            #{i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-100 text-sm truncate">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.district} · {s.distance} km away</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-green-400">{formatNumber(s.availableCapacity)}</div>
                            <div className="text-[10px] text-slate-500">available</div>
                          </div>
                          <div className="text-center flex-shrink-0">
                            <div className="text-lg font-bold text-blue-400">{s.suitabilityScore}</div>
                            <div className="text-[10px] text-slate-500">suitability</div>
                          </div>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3 h-3" /> {s.waterAvailability}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" /> {s.roadConnectivity} road
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {s.healthcareDistance}km healthcare
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap className={s.electricityAccess ? 'w-3 h-3 text-yellow-400' : 'w-3 h-3 text-red-400'} />
                            {s.electricityAccess ? 'Power' : 'No Power'}
                          </span>
                        </div>

                        {/* Capacity bar */}
                        <div className="mt-2">
                          <div className="w-full bg-[#1a2338] rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
                            <span>{pct}% occupied</span>
                            <span>Safety: {s.safetyScore}/100</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Capacity check */}
                {rankedSites.length > 0 && (
                  <div className="mt-4 p-4 bg-[#1a2338] rounded-xl border border-[#2e3a52]">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Capacity Analysis (Top 2 Sites)</div>
                    <div className="space-y-2 text-sm">
                      {rankedSites.slice(0, 2).map((s, i) => (
                        <div key={s.id} className="flex justify-between">
                          <span className="text-slate-400">#{i + 1} {s.name.split(' ').slice(0, 2).join(' ')}</span>
                          <span className="text-slate-200 font-medium">{formatNumber(s.availableCapacity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#2e3a52] pt-2 flex justify-between font-semibold">
                        <span className="text-slate-300">Combined Capacity</span>
                        <span className="text-blue-400">
                          {formatNumber(rankedSites.slice(0, 2).reduce((s, x) => s + x.availableCapacity, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Required (population)</span>
                        <span className="text-slate-200">{formatNumber(selectedHab.population)}</span>
                      </div>
                      <div className="pt-1">
                        <CapacityStatusBadge status={
                          rankedSites.slice(0, 2).reduce((s, x) => s + x.availableCapacity, 0) >= selectedHab.population
                            ? 'SUFFICIENT' : rankedSites.slice(0, 2).reduce((s, x) => s + x.availableCapacity, 0) >= selectedHab.population * 0.75
                            ? 'LIMITED' : 'INSUFFICIENT'
                        } />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGeneratePlan}
                  disabled={generating || planGenerated}
                  className={`mt-4 w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    planGenerated
                      ? 'bg-green-900/40 text-green-300 border border-green-700/40 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {generating ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Plan...</>
                  ) : planGenerated ? (
                    <><CheckCircle className="w-4 h-4" /> Relocation Plan Generated</>
                  ) : (
                    <><Shield className="w-4 h-4" /> Generate Relocation Plan</>
                  )}
                </button>
              </div>

              {/* Generated Plan */}
              {plan && (
                <div className="card p-5 border-blue-700/30 bg-blue-950/10 animate-slide-up print-section">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <h3 className="font-bold text-slate-100">Decision Support Report</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{formatDateTime(plan.generatedAt)}</span>
                      <button onClick={handlePrint} className="btn-secondary flex items-center gap-1 text-xs no-print">
                        <Download className="w-3 h-3" /> Print/Download
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#1a2338] border border-[#2e3a52] rounded-xl p-4 mb-4">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">NIRMAAN — Relocation Recommendation</div>
                    <div className="text-slate-400 text-xs mb-1">Habitation: <span className="text-slate-200 font-medium">{plan.habitationName}</span></div>
                    <div className="text-slate-400 text-xs mb-1">Priority: <span className="font-semibold" style={{ color: getPriorityColor(plan.priority) }}>{getPriorityLabel(plan.priority)}</span></div>
                    <div className="text-slate-400 text-xs mb-3">Population to Relocate: <span className="text-slate-200 font-medium">{formatNumber(plan.population)}</span></div>
                    <div className={`font-semibold text-sm flex items-center gap-2 ${plan.capacityStatus === 'SUFFICIENT' ? 'text-green-400' : plan.capacityStatus === 'LIMITED' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {plan.capacityStatus === 'SUFFICIENT' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {plan.recommendation}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    {plan.sites.map((s, i) => (
                      <div key={s.siteId} className="bg-[#2e3a52] rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">{i + 1}</div>
                          <span className="text-sm font-semibold text-slate-100">{s.siteName.split(' ').slice(0, 3).join(' ')}</span>
                        </div>
                        <div className="text-xs text-slate-400 mb-2">Capacity: <span className="text-green-400 font-bold">{formatNumber(s.capacity)}</span> · Suitability: <span className="text-blue-400">{s.suitabilityScore}/100</span></div>
                        {s.reasons.slice(0, 2).map((r, j) => (
                          <div key={j} className="flex items-start gap-1.5 text-[10px] text-slate-400 mb-0.5">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />{r}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                    <div className="text-xs font-semibold text-yellow-400 mb-1">⚠ Advisory Notice</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This is an AI-generated decision-support recommendation. All relocation decisions must be validated and authorized by designated disaster-management authorities following established government procedures. Capacity estimates are illustrative and require site-level engineering verification.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
