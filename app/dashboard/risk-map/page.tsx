'use client';
import { useEffect, useRef, useState } from 'react';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safeSites';
import { redZones } from '@/data/redZones';
import { Habitation } from '@/types';
import { getRiskColor, getPriorityColor, getPriorityLabel, getRiskExplanation } from '@/lib/riskEngine';
import { formatNumber } from '@/lib/utils';
import {
  X, Search, Layers, Filter, ChevronRight, AlertTriangle,
  Users, Home, Activity, MapPin
} from 'lucide-react';
import Link from 'next/link';

const hazardLevelColor = (l: string) => {
  switch (l) {
    case 'VERY_HIGH': return 'text-red-400';
    case 'HIGH': return 'text-orange-400';
    case 'MODERATE': return 'text-yellow-400';
    case 'LOW': return 'text-green-400';
    default: return 'text-slate-500';
  }
};

export default function RiskMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);

  const [selected, setSelected] = useState<Habitation | null>(null);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [layers, setLayers] = useState({
    habitations: true, safeSites: true, redZones: true,
    flood: false, landslide: false
  });
  const [panelOpen, setPanelOpen] = useState(false);

  const filtered = habitations.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.district.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'ALL' || h.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then(L => {
      if (!mapRef.current || leafletMap.current) return;

      const map = L.map(mapRef.current, {
        center: [22.5, 78.9],
        zoom: 5,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      leafletMap.current = map;

      // Habitation markers
      habitations.forEach(h => {
        const color = getRiskColor(h.riskLevel);
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:${h.riskLevel === 'CRITICAL' ? 18 : 14}px;height:${h.riskLevel === 'CRITICAL' ? 18 : 14}px;background:${color};border-radius:50%;border:2px solid rgba(255,255,255,0.4);cursor:pointer;box-shadow:0 0 ${h.riskLevel === 'CRITICAL' ? '8px' : '4px'} ${color}"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        const marker = L.marker([h.lat, h.lng], { icon })
          .addTo(map)
          .bindTooltip(`<b>${h.name}</b><br/>Risk: ${h.riskScore}/100 · ${h.riskLevel.replace('_', ' ')}`, {
            className: 'leaflet-tooltip-dark',
          });
        marker.on('click', () => {
          setSelected(h);
          setPanelOpen(true);
        });
        markersRef.current.push(marker);
      });

      // Safe site markers
      safeSites.forEach(s => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:12px;height:12px;background:#22c55e;border-radius:3px;border:2px solid rgba(255,255,255,0.4);cursor:pointer;transform:rotate(45deg)"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindTooltip(`<b>${s.name}</b><br/>Capacity: ${s.availableCapacity} · Safety: ${s.safetyScore}/100`);
      });

      // Red zone circles
      redZones.forEach(rz => {
        const circle = L.circle([rz.lat, rz.lng], {
          radius: rz.radius,
          color: '#dc2626',
          fillColor: '#dc2626',
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4,4',
        }).addTo(map)
          .bindTooltip(`<b>Red Zone: ${rz.name}</b><br/>Primary: ${rz.primaryHazard} · Score: ${rz.riskScore}/100`);
        circlesRef.current.push(circle);
      });
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markersRef.current = [];
        circlesRef.current = [];
      }
    };
  }, []);

  const flyTo = (h: Habitation) => {
    if (leafletMap.current) {
      leafletMap.current.flyTo([h.lat, h.lng], 10, { duration: 1.2 });
    }
    setSelected(h);
    setPanelOpen(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* Left panel - Controls + list */}
      <div className="w-full lg:w-72 xl:w-80 bg-[#1a2338] border-r border-[#2e3a52] flex flex-col shrink-0 order-2 lg:order-1" style={{ maxHeight: '300px', flex: '0 0 auto' }}>
        <div className="p-4 border-b border-[#2e3a52] space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              placeholder="Search habitation..."
              className="input w-full pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Risk filter */}
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'CRITICAL', 'VERY_HIGH', 'HIGH', 'MODERATE', 'LOW'].map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${riskFilter === r ? 'bg-blue-600 text-white' : 'bg-[#2e3a52] text-slate-400 hover:text-slate-200'}`}
              >
                {r === 'ALL' ? 'All' : r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Habitation list */}
        <div className="overflow-y-auto flex-1">
          {filtered.map(h => (
            <button
              key={h.id}
              onClick={() => flyTo(h)}
              className={`w-full text-left p-3 border-b border-[#2e3a52]/50 hover:bg-[#2e3a52]/50 transition-colors flex items-center gap-3 ${selected?.id === h.id ? 'bg-blue-950/30' : ''}`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: getRiskColor(h.riskLevel) }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-slate-200 truncate">{h.name}</div>
                <div className="text-[10px] text-slate-500">{h.district} · {h.riskScore}/100</div>
              </div>
              {h.redZone && (
                <span className="text-[10px] text-red-400 bg-red-900/30 border border-red-700/30 rounded px-1.5 py-0.5 flex-shrink-0">RZ</span>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-slate-500 text-sm">No habitations match the filter.</div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative order-1 lg:order-2 min-h-[60vh] lg:min-h-0">
        <div ref={mapRef} className="w-full h-full" id="risk-map" />

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 card p-3 text-xs space-y-1.5 z-[1000]">
          <div className="font-semibold text-slate-300 mb-2">Risk Legend</div>
          {[
            { label: 'Critical / Red Zone', color: '#dc2626' },
            { label: 'Very High', color: '#ef4444' },
            { label: 'High Risk', color: '#f97316' },
            { label: 'Moderate', color: '#eab308' },
            { label: 'Low Risk', color: '#22c55e' },
            { label: 'Safe Site ◆', color: '#22c55e', shape: 'square' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${l.shape === 'square' ? 'rounded-sm rotate-45' : ''}`} style={{ background: l.color }} />
              <span className="text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Layer toggles */}
        <div className="absolute top-4 right-4 card p-3 text-xs z-[1000] space-y-2">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> Layers
          </div>
          {Object.entries(layers).map(([key, val]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={val}
                onChange={e => setLayers(prev => ({ ...prev, [key]: e.target.checked }))}
                className="w-3 h-3 accent-blue-500"
              />
              <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      {panelOpen && selected && (
        <div className="w-full lg:w-80 xl:w-96 bg-[#1a2338] border-l border-[#2e3a52] flex flex-col order-3 overflow-y-auto animate-slide-in-right max-h-80 lg:max-h-none">
          <div className="p-4 border-b border-[#2e3a52] flex items-center justify-between sticky top-0 bg-[#1a2338] z-10">
            <h3 className="font-semibold text-slate-100">{selected.name}</h3>
            <button onClick={() => setPanelOpen(false)} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Risk Score */}
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white font-bold"
                style={{ background: getRiskColor(selected.riskLevel) }}
              >
                <span className="text-xl leading-none">{selected.riskScore}</span>
                <span className="text-[10px] opacity-80">/100</span>
              </div>
              <div>
                <div className="font-semibold text-slate-100">Risk Score</div>
                <div className="text-xs text-slate-400">{selected.riskLevel.replace('_', ' ')} Risk</div>
                <div className="flex items-center gap-1 mt-1">
                  {selected.redZone && (
                    <span className="text-[10px] text-red-300 bg-red-900/40 border border-red-700/40 rounded px-2 py-0.5">RED ZONE</span>
                  )}
                  <span
                    className="text-[10px] rounded px-2 py-0.5"
                    style={{ background: getPriorityColor(selected.relocationPriority) + '20', color: getPriorityColor(selected.relocationPriority) }}
                  >
                    {getPriorityLabel(selected.relocationPriority)}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              {selected.district}, {selected.state}
            </div>

            {/* Population */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#2e3a52] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Users className="w-3 h-3" /> Population
                </div>
                <div className="text-lg font-bold text-slate-100">{formatNumber(selected.population)}</div>
              </div>
              <div className="bg-[#2e3a52] rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-orange-400 text-xs mb-1">
                  <AlertTriangle className="w-3 h-3" /> Vulnerable
                </div>
                <div className="text-lg font-bold text-orange-300">{formatNumber(selected.vulnerablePopulation)}</div>
              </div>
            </div>

            {/* Hazard breakdown */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Hazard Profile</div>
              <div className="space-y-2">
                {Object.entries(selected.hazards).map(([hazard, level]) => (
                  level !== 'NONE' && (
                    <div key={hazard} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 capitalize">{hazard.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={`text-xs font-medium ${hazardLevelColor(level)}`}>{level.replace('_', ' ')}</span>
                    </div>
                  )
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Historical Events</span>
                  <span className="text-xs font-medium text-slate-200">{selected.historicalEvents}</span>
                </div>
              </div>
            </div>

            {/* Risk factors */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Risk Factor Breakdown</div>
              <div className="space-y-2">
                {[
                  { label: 'Hazard Intensity', val: selected.riskFactors.hazardIntensity, w: '30%' },
                  { label: 'Historical Frequency', val: selected.riskFactors.historicalFrequency, w: '20%' },
                  { label: 'Population Exposure', val: selected.riskFactors.populationExposure, w: '20%' },
                  { label: 'Vulnerability', val: selected.riskFactors.vulnerability, w: '20%' },
                  { label: 'Infrastructure Risk', val: selected.riskFactors.infrastructureRisk, w: '10%' },
                ].map(f => (
                  <div key={f.label}>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>{f.label} <span className="text-slate-600">({f.w})</span></span>
                      <span>{f.val}/100</span>
                    </div>
                    <div className="w-full bg-[#2e3a52] rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${f.val}%`,
                          background: f.val >= 80 ? '#dc2626' : f.val >= 60 ? '#f97316' : f.val >= 40 ? '#eab308' : '#22c55e'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Why High Priority?</div>
              <div className="space-y-1.5">
                {getRiskExplanation(selected).map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0 mt-0.5" />
                    {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <Link
                href="/dashboard/relocation"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> View Relocation Plan
              </Link>
              <Link
                href="/dashboard/habitations"
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" /> Full Risk Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
