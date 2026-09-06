'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safeSites';
import { redZones } from '@/data/redZones';
import { Habitation } from '@/types';
import { getRiskColor, getPriorityColor, getPriorityLabel, getRiskExplanation } from '@/lib/riskEngine';
import { formatNumber } from '@/lib/utils';
import {
  X, Search, Layers, ChevronRight, AlertTriangle,
  Users, Home, Activity, MapPin, Compass, ShieldAlert,
  Droplets, Mountain, CloudRain, Waves, Navigation2, Crosshair, Radio
} from 'lucide-react';
import Link from 'next/link';

const hazardLevelColor = (l: string) => {
  switch (l) {
    case 'VERY_HIGH': return 'text-red-400 bg-red-950/40 border-red-700/50';
    case 'HIGH': return 'text-orange-400 bg-orange-950/40 border-orange-700/50';
    case 'MODERATE': return 'text-amber-400 bg-amber-950/40 border-amber-700/50';
    case 'LOW': return 'text-emerald-400 bg-emerald-950/40 border-emerald-700/50';
    default: return 'text-slate-500 bg-slate-900 border-slate-700';
  }
};

export default function RiskMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);

  const [selected, setSelected] = useState<Habitation | null>(null);
  const [search, setSearch] = useState('');
  const [hazardFilter, setHazardFilter] = useState<'ALL' | 'flood' | 'landslide' | 'cloudburst' | 'coastalErosion'>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [layers, setLayers] = useState({
    habitations: true,
    safeSites: true,
    redZones: true,
    telemetry: true
  });
  const [panelOpen, setPanelOpen] = useState(false);

  const filtered = useMemo(() => {
    return habitations.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.district.toLowerCase().includes(search.toLowerCase());
      const matchRisk = riskFilter === 'ALL' || h.riskLevel === riskFilter;
      const matchHazard = hazardFilter === 'ALL' || (
        hazardFilter === 'flood' ? (h.hazards.flood === 'HIGH' || h.hazards.flood === 'VERY_HIGH') :
        hazardFilter === 'landslide' ? (h.hazards.landslide === 'HIGH' || h.hazards.landslide === 'VERY_HIGH') :
        hazardFilter === 'cloudburst' ? (h.hazards.cloudburst === 'HIGH' || h.hazards.cloudburst === 'VERY_HIGH') :
        hazardFilter === 'coastalErosion' ? (h.hazards.coastalErosion === 'HIGH' || h.hazards.coastalErosion === 'VERY_HIGH') : true
      );
      return matchSearch && matchRisk && matchHazard;
    });
  }, [search, riskFilter, hazardFilter]);

  // Leaflet map initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    import('leaflet').then(L => {
      if (!mapRef.current || leafletMap.current) return;

      const map = L.map(mapRef.current, {
        center: [30.4024, 79.3275], // Centered on Himalayan Disaster Response Sector (Chamoli/Joshimath)
        zoom: 7,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO &copy; NDRF GIS',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      leafletMap.current = map;

      // Safe site markers
      safeSites.forEach(s => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;background:#10b981;border-radius:3px;border:2px solid #ffffff;cursor:pointer;transform:rotate(45deg);box-shadow:0 0 10px rgba(16,185,129,0.8);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindTooltip(`<b>SAFE SHELTER: ${s.name}</b><br/>Capacity: ${s.availableCapacity.toLocaleString()} beds · Safety Score: ${s.safetyScore}/100`, {
            className: 'leaflet-tooltip-dark',
          });
      });

      // Red zone circles
      redZones.forEach(rz => {
        const circle = L.circle([rz.lat, rz.lng], {
          radius: rz.radius,
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.15,
          weight: 1.8,
          dashArray: '5,5',
        }).addTo(map)
          .bindTooltip(`<b>ACTIVE RED ZONE: ${rz.name}</b><br/>Primary Hazard: ${rz.primaryHazard}<br/>Risk Index: ${rz.riskScore}/100<br/>Affected: ${rz.populationAffected.toLocaleString()}`);
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

  // Update Habitation Markers when filtered list changes
  useEffect(() => {
    if (typeof window === 'undefined' || !leafletMap.current) return;
    import('leaflet').then(L => {
      if (!leafletMap.current) return;

      // Clear existing habitation markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      filtered.forEach(h => {
        const color = getRiskColor(h.riskLevel);
        const isCritical = h.riskLevel === 'CRITICAL' || h.redZone;
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
              ${isCritical ? `<div style="position:absolute;width:24px;height:24px;border-radius:50%;background:${color};opacity:0.4;animation:ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
              <div style="width:${isCritical ? 16 : 12}px;height:${isCritical ? 16 : 12}px;background:${color};border-radius:50%;border:2px solid #ffffff;cursor:pointer;box-shadow:0 0 12px ${color};z-index:2;"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([h.lat, h.lng], { icon })
          .addTo(leafletMap.current!)
          .bindTooltip(`<b>${h.name}</b> (${h.district})<br/>Score: <b>${h.riskScore}/100</b> · ${getPriorityLabel(h.relocationPriority)} Priority`, {
            className: 'leaflet-tooltip-dark',
          });

        marker.on('click', () => {
          setSelected(h);
          setPanelOpen(true);
        });

        markersRef.current.push(marker);
      });
    });
  }, [filtered]);

  const flyTo = (h: Habitation) => {
    if (leafletMap.current) {
      leafletMap.current.flyTo([h.lat, h.lng], 11, { duration: 1.2 });
    }
    setSelected(h);
    setPanelOpen(true);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row relative overflow-hidden bg-[#070b14]">
      
      {/* Left Collapsible Tactical Feed */}
      <div className="w-full lg:w-80 xl:w-96 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col shrink-0 order-2 lg:order-1 z-20 h-[35vh] lg:h-full shadow-2xl">
        {/* Header Telemetry */}
        <div className="p-4 border-b border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400 animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">GIS Command Network</span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search settlements, districts (e.g. Joshimath)..."
              className="input w-full pl-9 pr-3 text-xs bg-slate-950/70 border-slate-700/80"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Severity Filters */}
          <div className="flex gap-1.5 flex-wrap">
            {['ALL', 'CRITICAL', 'VERY_HIGH', 'HIGH', 'MODERATE', 'LOW'].map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                  riskFilter === r 
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/30' 
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                }`}
              >
                {r === 'ALL' ? 'All Risk Tiers' : r.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tactical Habitations Roster */}
        <div className="overflow-y-auto flex-1 divide-y divide-slate-800/50 p-2 space-y-1">
          {filtered.map(h => (
            <button
              key={h.id}
              onClick={() => flyTo(h)}
              className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                selected?.id === h.id 
                  ? 'bg-sky-950/40 border-sky-600/60 shadow-md shadow-sky-950/50' 
                  : 'bg-slate-900/40 border-transparent hover:bg-slate-800/60 hover:border-slate-700/50'
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm"
                style={{ background: getRiskColor(h.riskLevel) }}
              >
                {h.riskScore}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-2">
                  {h.name}
                  {h.redZone && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 border border-red-700/60">
                      RED ZONE
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {h.district} · <span className="font-mono text-slate-300">{formatNumber(h.population)}</span> pop.
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span 
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: getPriorityColor(h.relocationPriority) + '25', color: getPriorityColor(h.relocationPriority) }}
                >
                  {getPriorityLabel(h.relocationPriority)}
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">No settlements matching tactical filter.</div>
          )}
        </div>

        {/* Footer Summary Strip */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Active Nodes: <strong className="text-slate-200">{filtered.length}</strong></span>
          <span>Red Zones: <strong className="text-red-400">{filtered.filter(f => f.redZone).length}</strong></span>
          <span>Safe Sites: <strong className="text-emerald-400">{safeSites.length}</strong></span>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="flex-1 relative order-1 lg:order-2 h-[65vh] lg:h-full">
        <div ref={mapRef} className="w-full h-full" id="risk-map" />

        {/* Floating Top Hazard Control Chips */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2 max-w-[calc(100%-80px)]">
          {[
            { id: 'ALL', label: 'All Hazards', icon: ShieldAlert },
            { id: 'flood', label: 'Floods', icon: Droplets },
            { id: 'landslide', label: 'Landslides', icon: Mountain },
            { id: 'cloudburst', label: 'Cloudbursts', icon: CloudRain },
            { id: 'coastalErosion', label: 'Coastal Erosion', icon: Waves },
          ].map(hz => (
            <button
              key={hz.id}
              onClick={() => setHazardFilter(hz.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all ${
                hazardFilter === hz.id
                  ? 'bg-sky-600/90 text-white border-sky-400/60 shadow-lg shadow-sky-950/50'
                  : 'bg-slate-900/80 text-slate-300 border-slate-700/60 hover:bg-slate-800/90 hover:text-white'
              }`}
            >
              <hz.icon className="w-3.5 h-3.5" />
              <span>{hz.label}</span>
            </button>
          ))}
        </div>

        {/* Floating Layer Controls */}
        <div className="absolute top-4 right-4 card p-3 text-xs z-[1000] space-y-2 bg-slate-900/90 border-slate-800/90 shadow-2xl">
          <div className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Tactical Layers
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100">
            <input
              type="checkbox"
              checked={layers.habitations}
              onChange={e => setLayers(p => ({ ...p, habitations: e.target.checked }))}
              className="w-3.5 h-3.5 accent-sky-500 rounded"
            />
            <span>Habitations ({habitations.length})</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100">
            <input
              type="checkbox"
              checked={layers.safeSites}
              onChange={e => setLayers(p => ({ ...p, safeSites: e.target.checked }))}
              className="w-3.5 h-3.5 accent-emerald-500 rounded"
            />
            <span>Safe Shelters ({safeSites.length})</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100">
            <input
              type="checkbox"
              checked={layers.redZones}
              onChange={e => setLayers(p => ({ ...p, redZones: e.target.checked }))}
              className="w-3.5 h-3.5 accent-red-500 rounded"
            />
            <span>Red Zone Buffers ({redZones.length})</span>
          </label>
        </div>

        {/* Tactical Legend Overlay */}
        <div className="absolute bottom-6 left-6 card p-3.5 text-xs space-y-2 z-[1000] bg-slate-900/90 border-slate-800/90 shadow-2xl backdrop-blur-md">
          <div className="font-bold text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-sky-400" /> Tactical Risk Signals
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444]" />
              <span className="text-slate-300">Critical (81–100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-slate-300">Very High (61–80)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">High (41–60)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Moderate / Low</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-800">
              <span className="w-3 h-3 rounded-sm rotate-45 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <span className="text-emerald-300 font-semibold">Safe Relocation Shelter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Tactical Detail Drawer */}
      {panelOpen && selected && (
        <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 lg:w-[420px] bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800 flex flex-col z-[2000] shadow-2xl animate-slide-in-right overflow-y-auto">
          
          {/* Drawer Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
            <div>
              <div className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">Settlement Intelligence File</div>
              <h3 className="text-base font-bold text-slate-100">{selected.name}</h3>
            </div>
            <button 
              onClick={() => setPanelOpen(false)} 
              className="p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Risk Index Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white font-extrabold shadow-lg"
                  style={{ background: getRiskColor(selected.riskLevel), boxShadow: `0 0 16px ${getRiskColor(selected.riskLevel)}40` }}
                >
                  <span className="text-2xl leading-none font-mono">{selected.riskScore}</span>
                  <span className="text-[10px] opacity-80">/100</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 uppercase">{selected.riskLevel.replace('_', ' ')} SEVERITY</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {selected.redZone && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700/60 font-bold">
                        RED ZONE
                      </span>
                    )}
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded"
                      style={{ background: getPriorityColor(selected.relocationPriority) + '30', color: getPriorityColor(selected.relocationPriority) }}
                    >
                      {getPriorityLabel(selected.relocationPriority)} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographical Telemetry */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-400" /> District</div>
                <div className="font-semibold text-slate-200 mt-0.5">{selected.district}, {selected.state}</div>
              </div>
              <div>
                <div className="text-slate-500 flex items-center gap-1"><Crosshair className="w-3.5 h-3.5 text-sky-400" /> Coordinates</div>
                <div className="font-mono text-slate-200 mt-0.5 text-[11px]">{selected.lat.toFixed(4)}°N, {selected.lng.toFixed(4)}°E</div>
              </div>
            </div>

            {/* Population Quotient */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" /> Total Inhabitants
                </div>
                <div className="text-xl font-bold font-mono text-slate-100">{formatNumber(selected.population)}</div>
              </div>
              <div className="p-3 bg-red-950/20 rounded-xl border border-red-800/40">
                <div className="flex items-center gap-1.5 text-red-400 text-xs mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Vulnerable Group
                </div>
                <div className="text-xl font-bold font-mono text-red-300">{formatNumber(selected.vulnerablePopulation)}</div>
                <div className="text-[10px] text-red-400/80 mt-0.5">
                  ({Math.round((selected.vulnerablePopulation / selected.population) * 100)}% vulnerable ratio)
                </div>
              </div>
            </div>

            {/* 5-Factor Risk Weight Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">5-Factor Risk Breakdown</span>
                <span className="text-[10px] text-slate-500 font-mono">Weighted Algorithm</span>
              </div>
              
              <div className="space-y-2.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                {[
                  { label: 'Hazard Intensity', val: selected.riskFactors.hazardIntensity, weight: '30%' },
                  { label: 'Historical Disaster Frequency', val: selected.riskFactors.historicalFrequency, weight: '20%' },
                  { label: 'Population Exposure Quotient', val: selected.riskFactors.populationExposure, weight: '20%' },
                  { label: 'Socio-Economic Vulnerability', val: selected.riskFactors.vulnerability, weight: '20%' },
                  { label: 'Infrastructure Risk & Deficiency', val: selected.riskFactors.infrastructureRisk, weight: '10%' },
                ].map(f => (
                  <div key={f.label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{f.label} <span className="text-sky-400 font-mono font-semibold">({f.weight})</span></span>
                      <span className="font-mono text-slate-200 font-bold">{f.val}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${f.val}%`,
                          background: f.val >= 75 ? 'linear-gradient(90deg, #f97316, #ef4444)' : f.val >= 50 ? 'linear-gradient(90deg, #eab308, #f97316)' : '#10b981'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Hazard Profile Tags */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Multi-Hazard Exposure Profile</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selected.hazards).map(([hazard, level]) => (
                  <div key={hazard} className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 capitalize">{hazard.replace(/([A-Z])/g, ' $1')}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${hazardLevelColor(level)}`}>
                      {level.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explainable AI Justification */}
            <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Justification for Priority Action
              </div>
              <div className="space-y-1.5">
                {getRiskExplanation(selected).map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Actions */}
            <div className="pt-2 space-y-2.5 sticky bottom-0 bg-slate-900 py-3 border-t border-slate-800">
              <Link
                href="/dashboard/relocation"
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
              >
                <Home className="w-4 h-4" /> Match with Safe Shelters & Plan Relocation
              </Link>
              <Link
                href="/dashboard/evacuation"
                className="btn-secondary w-full flex items-center justify-center gap-2 py-2"
              >
                <Navigation2 className="w-4 h-4 text-sky-400" /> View Live Evacuation Routes
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
