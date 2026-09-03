'use client';
import { useState } from 'react';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safeSites';
import { Habitation } from '@/types';
import { getRiskColor, getPriorityColor, getPriorityLabel, getRiskExplanation } from '@/lib/riskEngine';
import { rankSitesForHabitation } from '@/lib/relocationEngine';
import { formatNumber } from '@/lib/utils';
import { AlertTriangle, CheckCircle, ChevronRight, X, Users, Home, Activity, Shield } from 'lucide-react';
import Link from 'next/link';

const PRIORITY_ORDER = ['IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'MONITOR'];
const PRIORITY_ICONS: Record<string, string> = { IMMEDIATE: '🔴', SHORT_TERM: '🟠', MEDIUM_TERM: '🟡', MONITOR: '🔵' };

export default function PriorityPage() {
  const [selected, setSelected] = useState<Habitation | null>(null);
  const [filter, setFilter] = useState('ALL');

  const sorted = [...habitations].sort((a, b) => {
    const pi = PRIORITY_ORDER.indexOf(a.relocationPriority);
    const pj = PRIORITY_ORDER.indexOf(b.relocationPriority);
    if (pi !== pj) return pi - pj;
    return b.riskScore - a.riskScore;
  }).filter(h => filter === 'ALL' || h.relocationPriority === filter);

  const grouped = PRIORITY_ORDER.reduce((acc, p) => {
    acc[p] = habitations.filter(h => h.relocationPriority === p);
    return acc;
  }, {} as Record<string, Habitation[]>);

  const rankedSites = selected ? rankSitesForHabitation(selected, safeSites).slice(0, 3) : [];
  const explanation = selected ? getRiskExplanation(selected) : [];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Relocation Priority Cases</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Evidence-based priority ranking for proactive relocation planning · <span className="text-yellow-400">Advisory / Illustrative</span>
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRIORITY_ORDER.map(p => (
          <button
            key={p}
            onClick={() => setFilter(filter === p ? 'ALL' : p)}
            className={`card p-4 text-left transition-all cursor-pointer ${filter === p ? 'border-blue-600/50 bg-blue-950/10' : 'card-hover'}`}
          >
            <div className="text-2xl mb-1">{PRIORITY_ICONS[p]}</div>
            <div className="text-xl font-bold text-slate-100">{grouped[p]?.length}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: getPriorityColor(p) }}>
              {getPriorityLabel(p)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {p === 'IMMEDIATE' ? '0–1 Year' : p === 'SHORT_TERM' ? '1–3 Years' : p === 'MEDIUM_TERM' ? '3–5 Years' : 'Ongoing'}
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Priority list */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-4 border-b border-[#2e3a52] flex items-center justify-between">
            <h2 className="section-title">Priority Ranking</h2>
            {filter !== 'ALL' && (
              <button onClick={() => setFilter('ALL')} className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                <X className="w-3 h-3" /> Clear filter
              </button>
            )}
          </div>
          <div className="divide-y divide-[#2e3a52]">
            {sorted.map((h, i) => (
              <button
                key={h.id}
                onClick={() => setSelected(selected?.id === h.id ? null : h)}
                className={`w-full text-left p-4 hover:bg-[#2e3a52]/40 transition-colors flex items-center gap-4 ${selected?.id === h.id ? 'bg-blue-950/20' : ''}`}
              >
                {/* Rank */}
                <div className="text-sm font-bold text-slate-500 w-6 flex-shrink-0">#{i + 1}</div>

                {/* Priority icon */}
                <div className="text-xl flex-shrink-0">{PRIORITY_ICONS[h.relocationPriority]}</div>

                {/* Risk circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: getRiskColor(h.riskLevel) }}
                >
                  {h.riskScore}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-100 text-sm truncate">{h.name}</div>
                  <div className="text-xs text-slate-500">{h.district}, {h.state}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Users className="w-3 h-3" /> {formatNumber(h.population)}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-[10px] text-slate-400">{h.primaryHazard}</span>
                    {h.redZone && <span className="text-[9px] text-red-400 bg-red-900/30 px-1 rounded">RZ</span>}
                  </div>
                </div>

                {/* Priority badge */}
                <div className="flex-shrink-0 text-right">
                  <div
                    className="text-[10px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: getPriorityColor(h.relocationPriority) + '20', color: getPriorityColor(h.relocationPriority) }}
                  >
                    {getPriorityLabel(h.relocationPriority)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{h.riskLevel.replace('_', ' ')}</div>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected ? (
            <div className="card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">Priority Explanation</h3>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0"
                  style={{ background: getRiskColor(selected.riskLevel) }}
                >
                  <span className="text-lg font-bold leading-none">{selected.riskScore}</span>
                  <span className="text-[10px] opacity-80">/100</span>
                </div>
                <div>
                  <div className="font-bold text-slate-100">{selected.name}</div>
                  <div
                    className="text-xs font-semibold mt-1"
                    style={{ color: getPriorityColor(selected.relocationPriority) }}
                  >
                    {PRIORITY_ICONS[selected.relocationPriority]} {getPriorityLabel(selected.relocationPriority)} Priority
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Why this priority?
                </div>
                <div className="space-y-2">
                  {explanation.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs p-2 bg-[#2e3a52] rounded-lg">
                      <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{r}</span>
                    </div>
                  ))}
                  {explanation.length === 0 && (
                    <div className="text-xs text-slate-500 p-2 bg-[#2e3a52] rounded-lg">
                      Risk level is within acceptable monitoring threshold.
                    </div>
                  )}
                </div>
              </div>

              {/* Risk factors */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Risk Score Breakdown</div>
                <div className="space-y-2">
                  {[
                    { label: 'Hazard Intensity', val: selected.riskFactors.hazardIntensity },
                    { label: 'Historical Frequency', val: selected.riskFactors.historicalFrequency },
                    { label: 'Population Exposure', val: selected.riskFactors.populationExposure },
                    { label: 'Vulnerability', val: selected.riskFactors.vulnerability },
                    { label: 'Infrastructure Risk', val: selected.riskFactors.infrastructureRisk },
                  ].map(f => (
                    <div key={f.label}>
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>{f.label}</span><span>{f.val}/100</span>
                      </div>
                      <div className="w-full bg-[#2e3a52] rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${f.val}%`, background: f.val >= 80 ? '#dc2626' : f.val >= 60 ? '#f97316' : '#eab308' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top sites */}
              {rankedSites.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Available Safe Sites</div>
                  {rankedSites.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between p-2 bg-[#2e3a52] rounded-lg mb-1.5 text-xs">
                      <div>
                        <span className="text-slate-200 font-medium">#{i + 1} {s.name.split(' ').slice(0, 2).join(' ')}</span>
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

              <Link href="/dashboard/relocation" className="btn-primary w-full flex items-center justify-center gap-2">
                <Home className="w-4 h-4" /> Go to Relocation Planner
              </Link>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <div className="text-sm text-slate-400">Select a habitation to see the priority explanation</div>
            </div>
          )}

          {/* Legend */}
          <div className="card p-4">
            <h3 className="section-title mb-3">Priority Framework</h3>
            <div className="space-y-3 text-xs">
              {[
                { icon: '🔴', label: 'Immediate', desc: '0–1 Year. Score ≥80 or very high historical events.', color: 'text-red-400' },
                { icon: '🟠', label: 'Short-Term', desc: '1–3 Years. Score 60–80.', color: 'text-orange-400' },
                { icon: '🟡', label: 'Medium-Term', desc: '3–5 Years. Score 40–60.', color: 'text-yellow-400' },
                { icon: '🔵', label: 'Monitor', desc: 'Ongoing. Score below 40.', color: 'text-blue-400' },
              ].map(item => (
                <div key={item.label} className="flex gap-2">
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <div>
                    <div className={`font-semibold ${item.color}`}>{item.label}</div>
                    <div className="text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-[#2e3a52] rounded-lg text-[10px] text-slate-500">
              <Shield className="w-3 h-3 inline mr-1" />
              Prototype / Illustrative scoring — not official government methodology
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
