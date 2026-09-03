'use client';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safeSites';
import { redZones } from '@/data/redZones';
import { getPriorityLabel, getRiskColor, getPriorityColor } from '@/lib/riskEngine';
import { formatNumber } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line, CartesianGrid, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';

const TOOLTIP_STYLE = { background: '#1e2a40', border: '1px solid #2e3a52', borderRadius: 8, color: '#f1f5f9', fontSize: 12 };

export default function AnalyticsPage() {
  // 1. Risk Distribution Pie
  const riskDist = Object.entries(habitations.reduce((acc, h) => {
    const key = h.riskLevel.replace('_', ' ');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)).map(([name, value]) => ({ name, value }));
  const RISK_COLORS = { 'CRITICAL': '#dc2626', 'VERY HIGH': '#ef4444', 'HIGH': '#f97316', 'MODERATE': '#eab308', 'LOW': '#22c55e' };

  // 2. Priority distribution
  const priorityDist = ['IMMEDIATE', 'SHORT_TERM', 'MEDIUM_TERM', 'MONITOR'].map(p => ({
    name: getPriorityLabel(p),
    value: habitations.filter(h => h.relocationPriority === p).length,
    fill: getPriorityColor(p),
  }));

  // 3. Population by hazard
  const hazardPop = habitations.reduce((acc, h) => {
    const hz = h.primaryHazard;
    acc[hz] = (acc[hz] || 0) + h.vulnerablePopulation;
    return acc;
  }, {} as Record<string, number>);
  const hazardPopData = Object.entries(hazardPop).map(([hazard, pop]) => ({ hazard, population: pop }));

  // 4. District risk bars
  const districtRisk = Object.values(habitations.reduce((acc, h) => {
    if (!acc[h.district]) acc[h.district] = { district: h.district.split(' ')[0], totalScore: 0, count: 0 };
    acc[h.district].totalScore += h.riskScore;
    acc[h.district].count++;
    return acc;
  }, {} as Record<string, { district: string; totalScore: number; count: number }>))
    .map(d => ({ district: d.district, avgScore: Math.round(d.totalScore / d.count) }))
    .sort((a, b) => b.avgScore - a.avgScore).slice(0, 8);

  // 5. Capacity vs Requirement
  const topHabs = habitations.filter(h => h.relocationPriority === 'IMMEDIATE' || h.relocationPriority === 'SHORT_TERM').slice(0, 6);
  const capacityComparison = topHabs.map(h => {
    const sites = safeSites.filter(s => h.recommendedSites.includes(s.id));
    const cap = sites.reduce((s, x) => s + x.availableCapacity, 0);
    return {
      name: h.name.split(' ')[0],
      required: h.population,
      capacity: cap || Math.round(h.population * 0.8),
    };
  });

  // 6. Historical disaster frequency
  const histFreq = habitations.map(h => ({ name: h.name.split(' ')[0], events: h.historicalEvents }))
    .sort((a, b) => b.events - a.events).slice(0, 8);

  // 7. Safe site capacity overview
  const siteCapacity = safeSites.slice(0, 8).map(s => ({
    name: s.name.split(' ')[0],
    available: s.availableCapacity,
    occupied: s.existingPopulation,
  }));

  // 8. Radar: multi-hazard
  const radarData = [
    { hazard: 'Flood', count: habitations.filter(h => h.hazards.flood === 'HIGH' || h.hazards.flood === 'VERY_HIGH').length },
    { hazard: 'Landslide', count: habitations.filter(h => h.hazards.landslide === 'HIGH' || h.hazards.landslide === 'VERY_HIGH').length },
    { hazard: 'Cloudburst', count: habitations.filter(h => h.hazards.cloudburst === 'HIGH' || h.hazards.cloudburst === 'VERY_HIGH').length },
    { hazard: 'Coastal', count: habitations.filter(h => h.hazards.coastalErosion === 'HIGH' || h.hazards.coastalErosion === 'VERY_HIGH').length },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Analytics & Reports</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Risk intelligence visualization · <span className="text-yellow-400">Demo / Illustrative Data</span>
        </p>
      </div>

      {/* Summary numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Avg. Risk Score', value: Math.round(habitations.reduce((s, h) => s + h.riskScore, 0) / habitations.length) + '/100' },
          { label: 'Total Vulnerable Pop.', value: formatNumber(habitations.reduce((s, h) => s + h.vulnerablePopulation, 0)) },
          { label: 'Red Zone Habitations', value: habitations.filter(h => h.redZone).length },
          { label: 'Avg. Site Suitability', value: Math.round(safeSites.reduce((s, x) => s + x.suitabilityScore, 0) / safeSites.length) + '/100' },
        ].map((s, i) => (
          <div key={i} className="card p-4 text-center">
            <div className="text-2xl font-bold text-slate-100">{s.value}</div>
            <div className="text-xs text-slate-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Risk Distribution */}
        <div className="card p-4">
          <h2 className="section-title mb-1">Risk Distribution</h2>
          <p className="section-sub mb-4">Habitations by risk level</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskDist} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${value}`}>
                {riskDist.map((entry, i) => (
                  <Cell key={i} fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [v, 'Habitations']} />
              <Legend formatter={v => <span style={{ fontSize: 10, color: '#94a3b8' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Relocation Priority */}
        <div className="card p-4">
          <h2 className="section-title mb-1">Relocation Priority</h2>
          <p className="section-sub mb-4">Habitations by priority tier</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityDist}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Habitations">
                {priorityDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vulnerable Population by Hazard */}
        <div className="card p-4">
          <h2 className="section-title mb-1">Vulnerable Population by Hazard</h2>
          <p className="section-sub mb-4">Total exposed population</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hazardPopData}>
              <XAxis dataKey="hazard" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + 'k'} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [formatNumber(v as number), 'Vulnerable Population']} />
              <Bar dataKey="population" fill="#f97316" radius={[4, 4, 0, 0]} name="Vulnerable Population" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* District Risk */}
        <div className="card p-4">
          <h2 className="section-title mb-1">District-wise Risk Score</h2>
          <p className="section-sub mb-4">Average risk score by district</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={districtRisk} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={60} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [v + '/100', 'Avg. Risk Score']} />
              <Bar dataKey="avgScore" fill="#3b5bdb" radius={[0, 4, 4, 0]} name="Avg Risk Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Capacity vs Requirement */}
        <div className="card p-4">
          <h2 className="section-title mb-1">Relocation Capacity vs Requirement</h2>
          <p className="section-sub mb-4">Population vs available site capacity</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={capacityComparison}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + 'k'} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [formatNumber(v as number), '']} />
              <Bar dataKey="required" fill="#ef4444" name="Required" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacity" fill="#22c55e" name="Available" radius={[4, 4, 0, 0]} />
              <Legend formatter={v => <span style={{ fontSize: 10, color: '#94a3b8' }}>{v}</span>} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Disaster Frequency */}
        <div className="card p-4">
          <h2 className="section-title mb-1">Historical Disaster Frequency</h2>
          <p className="section-sub mb-4">Recorded events per habitation</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={histFreq}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [v, 'Disaster Events']} />
              <Bar dataKey="events" fill="#dc2626" radius={[4, 4, 0, 0]} name="Events" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Safe Site Capacity */}
        <div className="card p-4 xl:col-span-2">
          <h2 className="section-title mb-1">Safe Site Capacity Overview</h2>
          <p className="section-sub mb-4">Available vs occupied capacity per site</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={siteCapacity}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => (v / 1000).toFixed(0) + 'k'} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [formatNumber(v as number), '']} />
              <Bar dataKey="available" fill="#22c55e" name="Available" stackId="a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="occupied" fill="#3b5bdb" name="Occupied" stackId="a" />
              <Legend formatter={v => <span style={{ fontSize: 10, color: '#94a3b8' }}>{v}</span>} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Multi-hazard radar */}
        <div className="card p-4">
          <h2 className="section-title mb-1">Multi-Hazard Exposure</h2>
          <p className="section-sub mb-4">Habitations with HIGH/VERY HIGH rating</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius={70} data={radarData}>
              <PolarGrid stroke="#2e3a52" />
              <PolarAngleAxis dataKey="hazard" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar name="Habitations" dataKey="count" stroke="#3b5bdb" fill="#3b5bdb" fillOpacity={0.3} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => [v, 'High-risk habitations']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-4 border-yellow-700/30 bg-yellow-950/10">
        <p className="text-xs text-slate-400">
          <span className="text-yellow-400 font-semibold">⚠ Data Notice:</span>{' '}
          All analytics are based on demo/illustrative data for prototype demonstration purposes.
          Charts use seeded sample data and do not represent official government statistics.
          The NIRMAAN platform is designed to integrate real government datasets, satellite imagery,
          and census data in production deployment.
        </p>
      </div>
    </div>
  );
}
