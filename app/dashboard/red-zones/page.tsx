'use client';
import { useState } from 'react';
import { redZones } from '@/data/redZones';
import { habitations } from '@/data/habitations';
import { AlertTriangle, MapPin, Users, ChevronRight, TrendingUp, Calendar, X } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';
import { RedZone } from '@/types';

function RiskBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-red-900/50 text-red-300 border-red-700/50'
    : score >= 60 ? 'bg-orange-900/50 text-orange-300 border-orange-700/50'
    : 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50';
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>{score}/100</span>;
}

export default function RedZonesPage() {
  const [selected, setSelected] = useState<RedZone | null>(null);

  const totalPop = redZones.reduce((s, r) => s + r.populationAffected, 0);
  const districts = Array.from(new Set(redZones.map(r => r.district)));

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">Red Zone Management</h1>
        <p className="text-sm text-slate-400 mt-0.5">Active hazard-based critical zones requiring priority attention</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Red Zones', value: redZones.length, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/30' },
          { label: 'Active Zones', value: redZones.filter(r => r.status === 'ACTIVE').length, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-900/30' },
          { label: 'Population Affected', value: formatNumber(totalPop), icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
          { label: 'Districts Affected', value: districts.length, icon: MapPin, color: 'text-blue-400', bg: 'bg-blue-900/30' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-xl font-bold text-slate-100">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Red zone list */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="section-title">Active Red Zones</h2>
          {redZones.map(rz => {
            const affected = habitations.filter(h => h.redZone && h.district === rz.district);
            return (
              <div
                key={rz.id}
                onClick={() => setSelected(rz)}
                className={`card card-hover p-4 cursor-pointer transition-all ${selected?.id === rz.id ? 'border-red-600/50 bg-red-950/10' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 bg-red-900/40 border border-red-700/40 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100">{rz.name}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {rz.district}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <RiskBadge score={rz.riskScore} />
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${rz.status === 'ACTIVE' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {rz.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">Primary Hazard</div>
                    <div className="text-slate-200 font-medium mt-0.5">{rz.primaryHazard}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Population</div>
                    <div className="text-slate-200 font-medium mt-0.5">{formatNumber(rz.populationAffected)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Habitations</div>
                    <div className="text-slate-200 font-medium mt-0.5">{rz.habitationCount}</div>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Calendar className="w-3 h-3" /> Updated {formatDate(rz.lastUpdated)}
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="space-y-4">
          {selected ? (
            <div className="card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">Zone Details</h3>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Zone ID</div>
                  <div className="font-mono text-xs text-blue-400">{selected.id.toUpperCase()}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-1">Location</div>
                  <div className="text-sm text-slate-200">{selected.district}</div>
                  <div className="text-xs text-slate-500">
                    {selected.lat.toFixed(4)}°N, {selected.lng.toFixed(4)}°E
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-1">Risk Score</div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-red-900/40 border border-red-700/40 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-red-400">{selected.riskScore}</span>
                    </div>
                    <span className="text-xs text-slate-400">/100 · CRITICAL</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#2e3a52] rounded-lg p-2">
                    <div className="text-slate-500 mb-1">Population</div>
                    <div className="font-bold text-slate-100">{formatNumber(selected.populationAffected)}</div>
                  </div>
                  <div className="bg-[#2e3a52] rounded-lg p-2">
                    <div className="text-slate-500 mb-1">Radius</div>
                    <div className="font-bold text-slate-100">{(selected.radius / 1000).toFixed(1)} km</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 mb-2">Affected Habitations in District</div>
                  {habitations
                    .filter(h => h.district === selected.district && h.redZone)
                    .map(h => (
                      <div key={h.id} className="flex items-center justify-between p-2 bg-[#2e3a52] rounded-lg mb-1 text-xs">
                        <span className="text-slate-200">{h.name}</span>
                        <span className="text-red-400 font-medium">{h.riskScore}/100</span>
                      </div>
                    ))}
                </div>

                <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                  <div className="text-xs text-red-400 font-semibold mb-1">⚠ Zone Status</div>
                  <div className="text-xs text-slate-400">
                    This zone is classified as ACTIVE. All habitations within the zone boundary require immediate risk assessment and relocation planning.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <div className="text-sm text-slate-400">Select a Red Zone to view detailed analysis</div>
            </div>
          )}

          {/* Hazard summary */}
          <div className="card p-4">
            <h3 className="section-title mb-3">Hazard Type Summary</h3>
            <div className="space-y-2">
              {Object.entries(
                redZones.reduce((acc, r) => {
                  acc[r.primaryHazard] = (acc[r.primaryHazard] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([hazard, count]) => (
                <div key={hazard} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{hazard}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-[#2e3a52] rounded-full h-1.5">
                      <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${(count / redZones.length) * 100}%` }} />
                    </div>
                    <span className="text-slate-300 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
