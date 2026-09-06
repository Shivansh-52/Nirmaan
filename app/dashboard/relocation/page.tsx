'use client';
import { useState, useMemo } from 'react';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safeSites';
import { Habitation, RelocationPlan } from '@/types';
import { rankSitesForHabitation, generateRelocationPlan } from '@/lib/relocationEngine';
import { getRiskColor, getPriorityColor, getPriorityLabel, getRiskExplanation } from '@/lib/riskEngine';
import { formatNumber, formatDateTime, formatDate } from '@/lib/utils';
import {
  Search, AlertTriangle, Users, Home, CheckCircle,
  XCircle, AlertCircle, ChevronRight, MapPin,
  Droplets, Activity, Heart, Zap, Download, Shield, X,
  FileText, Printer, Building, ArrowRight, Check, Compass, Radio
} from 'lucide-react';

function CapacityStatusBadge({ status }: { status: 'SUFFICIENT' | 'LIMITED' | 'INSUFFICIENT' }) {
  return status === 'SUFFICIENT' ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 text-xs font-bold shadow-sm">
      <CheckCircle className="w-4 h-4 text-emerald-400" /> CAPACITY SUFFICIENT
    </span>
  ) : status === 'LIMITED' ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-700/60 text-xs font-bold shadow-sm">
      <AlertCircle className="w-4 h-4 text-amber-400" /> LIMITED CAPACITY
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 text-red-300 border border-red-700/60 text-xs font-bold shadow-sm">
      <XCircle className="w-4 h-4 text-red-400" /> INSUFFICIENT CAPACITY
    </span>
  );
}

export default function RelocationPage() {
  const [search, setSearch] = useState('');
  const [selectedHab, setSelectedHab] = useState<Habitation | null>(habitations[0] || null);
  const [plan, setPlan] = useState<RelocationPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

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
  };

  const handleGeneratePlan = async () => {
    if (!selectedHab) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1000));
    const p = generateRelocationPlan(selectedHab, safeSites);
    setPlan(p);
    setGenerating(false);
  };

  const combinedCapacity = useMemo(() => {
    return rankedSites.slice(0, 2).reduce((s, x) => s + x.availableCapacity, 0);
  }, [rankedSites]);

  const capacityStatus = useMemo(() => {
    if (!selectedHab) return 'INSUFFICIENT';
    if (combinedCapacity >= selectedHab.population) return 'SUFFICIENT';
    if (combinedCapacity >= selectedHab.population * 0.75) return 'LIMITED';
    return 'INSUFFICIENT';
  }, [combinedCapacity, selectedHab]);

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-400 border border-sky-800/60 font-bold">
              AI MATCHING CONSOLE
            </span>
            <span className="text-xs text-slate-400 font-mono">NDRF / MHA RESIDENCE DIRECTIVE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Home className="w-6 h-6 text-sky-400" />
            AI Relocation Matching & Capacity Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multi-criteria geospatial optimization matching red-zone habitations with high-capacity safe havens.
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3">
          <div className="card p-3 px-4 text-center border-red-900/40 bg-red-950/20">
            <div className="text-lg font-bold font-mono text-red-400">{immediate.length}</div>
            <div className="text-[10px] text-slate-400 uppercase">Immediate Habitats</div>
          </div>
          <div className="card p-3 px-4 text-center border-emerald-900/40 bg-emerald-950/20">
            <div className="text-lg font-bold font-mono text-emerald-400">{formatNumber(safeSites.reduce((s, x) => s + x.availableCapacity, 0))}</div>
            <div className="text-[10px] text-slate-400 uppercase">Available Safe Beds</div>
          </div>
        </div>
      </div>

      {/* Main Matching Grid */}
      <div className="grid lg:grid-cols-12 gap-5">
        
        {/* Left Pane: Red Zone Habitations (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          
          <div className="card p-3 bg-slate-900/80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search red zone habitations..."
                className="input w-full pl-9 text-xs bg-slate-950/80"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">
            <span>Critical Settlement Roster ({filteredHabs.length})</span>
            <span className="font-mono text-sky-400 text-[11px]">Ranked by Risk</span>
          </div>

          <div className="card overflow-hidden max-h-[calc(100vh-280px)] overflow-y-auto divide-y divide-slate-800/60 p-1.5 space-y-1 bg-slate-900/80 shadow-2xl">
            {filteredHabs.map(h => {
              const isSelected = selectedHab?.id === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => handleSelectHab(h)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                    isSelected 
                      ? 'bg-sky-950/40 border-2 border-sky-500/70 shadow-lg shadow-sky-950/40' 
                      : 'bg-slate-900/40 border border-transparent hover:bg-slate-800/60 hover:border-slate-700/50'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 shadow-md"
                    style={{ background: getRiskColor(h.riskLevel) }}
                  >
                    {h.riskScore}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                      {h.name}
                      {h.redZone && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-900/50 text-red-300 border border-red-700/50">
                          RED ZONE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {h.district} · <span className="font-mono text-slate-300 font-semibold">{formatNumber(h.population)}</span> pop.
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                      style={{ background: getPriorityColor(h.relocationPriority) + '25', color: getPriorityColor(h.relocationPriority) }}
                    >
                      {getPriorityLabel(h.relocationPriority)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Relocation Matching Console (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {selectedHab ? (
            <>
              {/* Target Habitation Profile Banner */}
              <div className="card p-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white flex-shrink-0 shadow-xl"
                      style={{ background: getRiskColor(selectedHab.riskLevel), boxShadow: `0 0 20px ${getRiskColor(selectedHab.riskLevel)}40` }}
                    >
                      <span className="text-2xl font-extrabold font-mono leading-none">{selectedHab.riskScore}</span>
                      <span className="text-[10px] opacity-80 mt-0.5">RISK INDEX</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-slate-100">{selectedHab.name}</h2>
                        {selectedHab.redZone && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 border border-red-700/60 font-bold">
                            ACTIVE RED ZONE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>{selectedHab.district}, {selectedHab.state}</span>
                        <span className="text-slate-600">|</span>
                        <span className="font-mono text-slate-400">{selectedHab.lat.toFixed(4)}°N, {selectedHab.lng.toFixed(4)}°E</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        <span
                          className="text-[11px] px-2.5 py-0.5 rounded-full font-bold"
                          style={{ background: getPriorityColor(selectedHab.relocationPriority) + '30', color: getPriorityColor(selectedHab.relocationPriority) }}
                        >
                          {getPriorityLabel(selectedHab.relocationPriority)} Relocation Priority
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          Primary Hazard: <strong className="text-white">{selectedHab.primaryHazard}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Population Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-center sm:min-w-[200px]">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-base font-bold font-mono text-slate-100">{formatNumber(selectedHab.population)}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Displaced Pop.</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-800/40">
                      <div className="text-base font-bold font-mono text-red-300">{formatNumber(selectedHab.vulnerablePopulation)}</div>
                      <div className="text-[10px] text-red-400 uppercase">High Risk Pop.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Safe Shelters Ranked */}
              <div className="card p-5 space-y-4 bg-slate-900/80">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      Ranked Safe Relocation Havens
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Optimized by distance proximity, infrastructure resilience, and water safety.</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/60">
                    {rankedSites.length} Viable Sites Identified
                  </span>
                </div>

                <div className="space-y-3">
                  {rankedSites.slice(0, 3).map((site, index) => {
                    const capacityPct = Math.min(100, Math.round((site.existingPopulation / site.totalCapacity) * 100));
                    return (
                      <div 
                        key={site.id} 
                        className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-900/40 border border-emerald-600/40 flex items-center justify-center text-xs font-extrabold text-emerald-300 font-mono">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                {site.name}
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                  {site.distance} km away
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">{site.district}, {site.state}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-xs text-slate-400">Available Beds</div>
                              <div className="text-sm font-extrabold font-mono text-emerald-400">
                                {formatNumber(site.availableCapacity)}
                              </div>
                            </div>
                            <div className="text-center p-2 rounded-xl bg-sky-950/40 border border-sky-800/40 min-w-[70px]">
                              <div className="text-xs text-slate-400 leading-none">Match</div>
                              <div className="text-base font-extrabold font-mono text-sky-400 mt-0.5">
                                {site.suitabilityScore}/100
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tactical Infrastructure Signals */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-2 border-t border-slate-800/60">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Droplets className="w-3.5 h-3.5 text-sky-400" />
                            <span>Water: <strong>{site.waterAvailability}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Activity className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Roads: <strong>{site.roadConnectivity}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Heart className="w-3.5 h-3.5 text-red-400" />
                            <span>Clinic: <strong>{site.healthcareDistance} km</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Zap className={`w-3.5 h-3.5 ${site.electricityAccess ? 'text-amber-400' : 'text-slate-600'}`} />
                            <span>Grid: <strong>{site.electricityAccess ? 'Active' : 'Backup'}</strong></span>
                          </div>
                        </div>

                        {/* Capacity Occupancy Bar */}
                        <div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                            <span>Occupancy: {capacityPct}% ({formatNumber(site.existingPopulation)} / {formatNumber(site.totalCapacity)})</span>
                            <span className="text-emerald-400 font-bold">{formatNumber(site.availableCapacity)} Available Capacity</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-emerald-500 transition-all duration-500" 
                              style={{ width: `${capacityPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Capacity Balance Comparison Box */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Capacity Verification (Primary Allocated Shelters)
                    </span>
                    <CapacityStatusBadge status={capacityStatus} />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Total Population Requiring Shelter:</span>
                      <span className="text-slate-100 font-bold">{formatNumber(selectedHab.population)} citizens</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400">Combined Haven Capacity (Top 2 Sites):</span>
                      <span className="text-emerald-400 font-bold">{formatNumber(combinedCapacity)} beds</span>
                    </div>
                    <div className="flex justify-between font-mono border-t border-slate-800/80 pt-1.5">
                      <span className="text-slate-400">Capacity Surplus / Deficit:</span>
                      <span className={`font-bold ${combinedCapacity >= selectedHab.population ? 'text-emerald-400' : 'text-red-400'}`}>
                        {combinedCapacity >= selectedHab.population ? '+' : ''}{formatNumber(combinedCapacity - selectedHab.population)} beds
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleGeneratePlan}
                    disabled={generating}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Optimizing Matching Matrix...</>
                    ) : (
                      <><Shield className="w-4 h-4" /> Run AI Matching Algorithm</>
                    )}
                  </button>

                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                  >
                    <FileText className="w-4 h-4" /> Generate Statutory Relocation Order
                  </button>
                </div>
              </div>

              {/* Generated Plan Details */}
              {plan && (
                <div className="card p-5 border-sky-600/40 bg-sky-950/10 space-y-4 animate-slide-up">
                  <div className="flex items-center justify-between border-b border-sky-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-sky-400" />
                      <h4 className="font-bold text-slate-100">AI Relocation Optimization Report</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{formatDateTime(plan.generatedAt)}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    {plan.recommendation}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {plan.sites.map((s, i) => (
                      <div key={s.siteId} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="text-xs font-bold text-slate-100 flex items-center justify-between">
                          <span>{i + 1}. {s.siteName}</span>
                          <span className="font-mono text-emerald-400">{formatNumber(s.capacity)} beds</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Suitability Index: <strong className="text-sky-400">{s.suitabilityScore}/100</strong></div>
                        <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
                          {s.reasons.slice(0, 2).map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card p-16 text-center space-y-3">
              <Compass className="w-12 h-12 text-slate-600 mx-auto animate-spin-slow" />
              <div className="text-slate-300 font-bold text-lg">Select a Red Zone Settlement</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select any monitored habitation from the left console to run proximity matching and review shelter carrying capacities.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statutory Relocation Order Modal (Official Printable Government Preview) */}
      {showOrderModal && selectedHab && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Modal Actions Top Bar */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">STATUTORY RELOCATION DIRECTIVE PREVIEW</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Export PDF
                </button>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Official Order Printable Sheet */}
            <div className="p-8 sm:p-10 space-y-6 text-slate-900 bg-white print-section font-serif">
              
              {/* Official Seal Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <div className="text-[11px] font-bold tracking-widest uppercase">Government of India · Ministry of Home Affairs</div>
                <div className="text-base font-extrabold tracking-wide uppercase">National Disaster Response Force (NDRF)</div>
                <div className="text-xs font-bold text-slate-700">Disaster Management Division · Emergency Relocation Cell</div>
                <div className="font-mono text-[11px] text-slate-600 mt-2">
                  Order Ref: <strong className="text-black">NDRF/MHA/ORD-2026/09/{selectedHab.district.toUpperCase().slice(0, 3)}-{selectedHab.id.slice(0, 4).toUpperCase()}</strong>
                </div>
              </div>

              {/* Order Metadata Strip */}
              <div className="grid grid-cols-2 text-xs border-y border-slate-300 py-2 font-mono">
                <div>Date of Directive: <strong>{formatDate(new Date().toISOString())}</strong></div>
                <div className="text-right">Classification: <strong className="text-red-700">IMMEDIATE STATUTORY EVACUATION</strong></div>
              </div>

              {/* Executive Directive Text */}
              <div className="space-y-3 text-xs leading-relaxed text-slate-800">
                <p>
                  <strong>WHEREAS</strong>, continuous multi-hazard GIS satellite telemetry and deterministic risk analysis under the <em>NIRMAAN Disaster Intelligence Framework</em> have classified the settlement of <strong>{selectedHab.name}</strong>, District <strong>{selectedHab.district}</strong> ({selectedHab.state}) as an <strong>ACTIVE RED ZONE</strong> with a critical vulnerability index of <strong>{selectedHab.riskScore}/100</strong>;
                </p>
                <p>
                  <strong>NOW, THEREFORE</strong>, under the powers conferred by the Disaster Management Act, the competent authority hereby directs the proactive relocation of the resident population (approx. <strong>{formatNumber(selectedHab.population)} citizens</strong>, including <strong>{formatNumber(selectedHab.vulnerablePopulation)} vulnerable individuals</strong>) to the designated high-resilience safe shelters identified below:
                </p>
              </div>

              {/* Allocated Safe Havens Table */}
              <div className="border border-slate-300 rounded overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2">Designated Safe Shelter</th>
                      <th className="p-2">Location</th>
                      <th className="p-2">Distance</th>
                      <th className="p-2 text-right">Allocated Quota</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {rankedSites.slice(0, 2).map((s, idx) => (
                      <tr key={s.id}>
                        <td className="p-2 font-sans font-bold">{idx + 1}. {s.name}</td>
                        <td className="p-2">{s.district}</td>
                        <td className="p-2">{s.distance} km</td>
                        <td className="p-2 text-right font-bold text-slate-900">{formatNumber(s.availableCapacity)} beds</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Operational Instructions */}
              <div className="space-y-1 text-xs text-slate-700">
                <div className="font-bold text-black uppercase">Logistics & Transportation Directives:</div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>State Disaster Response Force (SDRF) and NDRF Battalions are dispatched along designated Hill Bypass corridors.</li>
                  <li>District Medical Officers to establish primary triage stations at Gauchar & Srinagar reception camps.</li>
                  <li>Civil supplies department instructed to release 30-day emergency food, water, and infant nourishment reserves.</li>
                </ul>
              </div>

              {/* Signature Block */}
              <div className="pt-8 grid grid-cols-2 text-xs border-t border-slate-300">
                <div>
                  <div className="font-mono text-[10px] text-slate-500">DIGITAL AUDIT STAMP</div>
                  <div className="font-bold mt-1 text-slate-800">NIRMAAN AI SYSTEM VERIFIED</div>
                  <div className="text-[10px] text-slate-600">ID: SEC-HASH-77491-DELHI-HQ</div>
                </div>
                <div className="text-right">
                  <div className="font-bold uppercase">Joint Secretary / Relief Commissioner</div>
                  <div className="text-[11px] text-slate-600">Disaster Management Division, MHA</div>
                  <div className="text-[10px] text-slate-500 mt-1">Government of India</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
