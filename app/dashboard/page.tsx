'use client';
import Link from 'next/link';
import {
  Users, AlertTriangle, Home, Map, Bell, Star,
  TrendingUp, ChevronRight, Activity, Database
} from 'lucide-react';
import { habitations } from '@/data/habitations';
import { safeSites } from '@/data/safeSites';
import { alerts } from '@/data/alerts';
import { getRiskColor, getPriorityColor, getPriorityLabel } from '@/lib/riskEngine';
import { formatNumber, timeAgo } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const kpis = [
  { label: 'Habitations Analyzed', value: '1,248', icon: Database, color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-700/30', sub: 'Across monitored regions' },
  { label: 'Red Zones', value: '86', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-700/30', sub: 'Active critical zones' },
  { label: 'High-Risk Habitations', value: '214', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-900/30', border: 'border-orange-700/30', sub: 'Score > 60/100' },
  { label: 'Vulnerable Population', value: '1,84,520', icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-700/30', sub: 'Estimated exposure' },
  { label: 'Immediate Relocation', value: '32', icon: Star, color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-700/30', sub: 'Priority: Immediate' },
  { label: 'Available Capacity', value: '92,400', icon: Home, color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-700/30', sub: 'Across safe sites' },
];

const RISK_COLORS = { CRITICAL: '#dc2626', VERY_HIGH: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', LOW: '#22c55e' };
const PRIORITY_COLORS = { IMMEDIATE: '#dc2626', SHORT_TERM: '#f97316', MEDIUM_TERM: '#eab308', MONITOR: '#22c55e' };

export default function DashboardPage() {
  // Risk distribution chart data
  const riskDist = Object.entries(
    habitations.reduce((acc, h) => {
      acc[h.riskLevel] = (acc[h.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name: name.replace('_', ' '), value, fill: RISK_COLORS[name as keyof typeof RISK_COLORS] }));

  // Priority distribution
  const priorityDist = Object.entries(
    habitations.reduce((acc, h) => {
      acc[h.relocationPriority] = (acc[h.relocationPriority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name: getPriorityLabel(name),
    value,
    fill: PRIORITY_COLORS[name as keyof typeof PRIORITY_COLORS]
  }));

  // District risk bar chart
  const districtRisk = habitations.reduce((acc, h) => {
    if (!acc[h.district]) acc[h.district] = { district: h.district.split(' ')[0], max: 0, count: 0 };
    acc[h.district].max = Math.max(acc[h.district].max, h.riskScore);
    acc[h.district].count++;
    return acc;
  }, {} as Record<string, { district: string; max: number; count: number }>);
  const districtData = Object.values(districtRisk).sort((a, b) => b.max - a.max).slice(0, 8);

  const highRisk = habitations.filter(h => h.riskScore >= 70).sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  const recentAlerts = alerts.slice(0, 4);
  const topSites = safeSites.slice(0, 4);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Risk Intelligence Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Disaster management command dashboard · <span className="text-yellow-400">Demo / Illustrative Data</span>
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System Operational
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <div key={i} className={`card card-hover p-4 border ${kpi.border}`}>
            <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center mb-3`}>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <div className="text-xl font-bold text-slate-100">{kpi.value}</div>
            <div className="text-xs font-medium text-slate-300 mt-0.5">{kpi.label}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Risk Distribution */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Risk Distribution</h2>
            <span className="text-xs text-slate-500">{habitations.length} habitations</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={riskDist} cx="50%" cy="50%" outerRadius={65} dataKey="value" label={({ name, value }) => `${value}`}>
                {riskDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip formatter={(v) => [v, 'Habitations']} contentStyle={{ background: '#1e2a40', border: '1px solid #2e3a52', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
              <Legend formatter={(v) => <span style={{ fontSize: 10, color: '#94a3b8' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Relocation Priority */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Relocation Priority</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priorityDist} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e2a40', border: '1px solid #2e3a52', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* District Risk */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">District Risk Scores</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={districtData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={60} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e2a40', border: '1px solid #2e3a52', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
              <Bar dataKey="max" fill="#3b5bdb" radius={[0, 4, 4, 0]} name="Max Risk Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* High Risk Habitations */}
        <div className="lg:col-span-2 card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">High-Risk Habitations</h2>
            <Link href="/dashboard/habitations" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {highRisk.map(h => (
              <Link key={h.id} href="/dashboard/habitations" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2e3a52]/50 transition-colors group">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: getRiskColor(h.riskLevel) }}
                >
                  {h.riskScore}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-200 text-sm truncate">{h.name}</div>
                  <div className="text-xs text-slate-500">{h.district}, {h.state}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: getPriorityColor(h.relocationPriority) + '20', color: getPriorityColor(h.relocationPriority) }}
                  >
                    {getPriorityLabel(h.relocationPriority)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{formatNumber(h.population)} pop.</div>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Alerts + Sites */}
        <div className="space-y-4">
          {/* Recent Alerts */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Recent Alerts</h2>
              <Link href="/dashboard/alerts" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentAlerts.map(a => (
                <div key={a.id} className={`flex items-start gap-2 p-2 rounded-lg ${!a.read ? 'bg-blue-950/20' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.severity === 'CRITICAL' ? 'bg-red-500' : a.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                  <div>
                    <div className="text-xs font-medium text-slate-200">{a.title}</div>
                    <div className="text-[10px] text-slate-500">{timeAgo(a.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Site Capacity */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Safe Site Capacity</h2>
              <Link href="/dashboard/safe-sites" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {topSites.map(s => {
                const pct = Math.round((s.existingPopulation / s.totalCapacity) * 100);
                return (
                  <div key={s.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300 truncate">{s.name.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="text-xs text-slate-400">{formatNumber(s.availableCapacity)} avail.</span>
                    </div>
                    <div className="w-full bg-[#2e3a52] rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: pct > 80 ? '#dc2626' : pct > 60 ? '#f97316' : '#3b5bdb'
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{pct}% occupied</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/dashboard/risk-map', icon: Map, label: 'Risk Map', desc: 'Interactive GIS view', color: 'text-blue-400' },
          { href: '/dashboard/red-zones', icon: AlertTriangle, label: 'Red Zones', desc: '8 active zones', color: 'text-red-400' },
          { href: '/dashboard/relocation', icon: TrendingUp, label: 'Relocation Planner', desc: 'Match & plan', color: 'text-green-400' },
          { href: '/dashboard/analytics', icon: Activity, label: 'Analytics', desc: 'Charts & reports', color: 'text-purple-400' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="card card-hover p-4 flex items-center gap-3 group">
            <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-200 group-hover:text-slate-100">{item.label}</div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 ml-auto flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
