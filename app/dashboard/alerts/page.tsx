'use client';
import { useState } from 'react';
import { alerts as initialAlerts } from '@/data/alerts';
import { Alert } from '@/types';
import { Bell, AlertTriangle, Home, Activity, Filter, CheckCircle, X, ChevronRight } from 'lucide-react';
import { timeAgo, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

const TYPE_ICONS = {
  HIGH_RISK: AlertTriangle,
  RED_ZONE: AlertTriangle,
  CAPACITY: Home,
  RELOCATION: Activity,
  SYSTEM: Bell,
};

const SEVERITY_COLORS = {
  CRITICAL: { badge: 'bg-red-900/50 text-red-300 border-red-700/50', dot: 'bg-red-500' },
  HIGH: { badge: 'bg-orange-900/50 text-orange-300 border-orange-700/50', dot: 'bg-orange-500' },
  MEDIUM: { badge: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50', dot: 'bg-yellow-500' },
  LOW: { badge: 'bg-blue-900/50 text-blue-300 border-blue-700/50', dot: 'bg-blue-500' },
};

export default function AlertsPage() {
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [showUnread, setShowUnread] = useState(false);
  const [selected, setSelected] = useState<Alert | null>(null);

  const filtered = alertList.filter(a => {
    const matchType = !typeFilter || a.type === typeFilter;
    const matchSeverity = !severityFilter || a.severity === severityFilter;
    const matchUnread = !showUnread || !a.read;
    return matchType && matchSeverity && matchUnread;
  });

  const markRead = (id: string) => {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, read: true } : null);
  };

  const markAllRead = () => {
    setAlertList(prev => prev.map(a => ({ ...a, read: true })));
    setSelected(null);
  };

  const unreadCount = alertList.filter(a => !a.read).length;

  return (
    <div className="p-4 sm:p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Alert Center</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {unreadCount} unread of {alertList.length} total alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary flex items-center gap-1.5 text-xs">
            <CheckCircle className="w-3.5 h-3.5" /> Mark All Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select className="input min-w-36" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="HIGH_RISK">High Risk Update</option>
            <option value="RED_ZONE">Red Zone Update</option>
            <option value="CAPACITY">Capacity Alert</option>
            <option value="RELOCATION">Relocation Alert</option>
            <option value="SYSTEM">System</option>
          </select>
          <select className="input min-w-36" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
            <option value="">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 accent-blue-500"
              checked={showUnread}
              onChange={e => setShowUnread(e.target.checked)}
            />
            Unread only
          </label>
          {(typeFilter || severityFilter || showUnread) && (
            <button onClick={() => { setTypeFilter(''); setSeverityFilter(''); setShowUnread(false); }} className="btn-secondary flex items-center gap-1 text-xs">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Alert list */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.length === 0 && (
            <div className="card p-12 text-center">
              <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <div className="text-slate-400">No alerts match the current filters.</div>
            </div>
          )}
          {filtered.map(a => {
            const Icon = TYPE_ICONS[a.type];
            const colors = SEVERITY_COLORS[a.severity];
            return (
              <div
                key={a.id}
                onClick={() => { setSelected(a); markRead(a.id); }}
                className={`card card-hover p-4 cursor-pointer ${selected?.id === a.id ? 'border-blue-600/50' : ''} ${!a.read ? 'bg-blue-950/10' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!a.read ? 'bg-blue-900/40' : 'bg-[#2e3a52]'}`}>
                    <Icon className={`w-4 h-4 ${!a.read ? 'text-blue-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${!a.read ? 'text-slate-100' : 'text-slate-300'}`}>{a.title}</span>
                      {!a.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" aria-label="Unread" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{a.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${colors.badge}`}>
                        {a.severity}
                      </span>
                      <span className="text-[10px] text-slate-600">{timeAgo(a.timestamp)}</span>
                      {a.habitationName && (
                        <span className="text-[10px] text-blue-400">{a.habitationName}</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail + summary */}
        <div className="space-y-4">
          {selected ? (
            <div className="card p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-100">Alert Details</h3>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className={`text-xs font-medium px-2 py-1 rounded-full border inline-flex ${SEVERITY_COLORS[selected.severity].badge}`}>
                  {selected.severity} SEVERITY
                </div>

                <h4 className="font-semibold text-slate-100">{selected.title}</h4>

                <p className="text-sm text-slate-300 leading-relaxed">{selected.message}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#2e3a52] rounded-lg p-2">
                    <div className="text-slate-500 mb-0.5">Type</div>
                    <div className="text-slate-200 font-medium">{selected.type.replace('_', ' ')}</div>
                  </div>
                  <div className="bg-[#2e3a52] rounded-lg p-2">
                    <div className="text-slate-500 mb-0.5">Time</div>
                    <div className="text-slate-200 font-medium">{timeAgo(selected.timestamp)}</div>
                  </div>
                </div>

                {selected.habitationName && (
                  <div className="flex items-center justify-between text-xs bg-[#2e3a52] rounded-lg p-2">
                    <span className="text-slate-400">Habitation</span>
                    <span className="text-blue-400 font-medium">{selected.habitationName}</span>
                  </div>
                )}

                <div className="text-[10px] text-slate-600">{formatDateTime(selected.timestamp)}</div>

                <div className="flex gap-2 pt-1">
                  {selected.habitationId && (
                    <Link href="/dashboard/habitations" className="btn-primary flex-1 text-center text-xs">
                      View Habitation
                    </Link>
                  )}
                  {!selected.read && (
                    <button onClick={() => markRead(selected.id)} className="btn-secondary flex items-center gap-1 text-xs">
                      <CheckCircle className="w-3 h-3" /> Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <div className="text-sm text-slate-400">Click an alert to view details</div>
            </div>
          )}

          {/* Summary */}
          <div className="card p-4">
            <h3 className="section-title mb-3">Alert Summary</h3>
            <div className="space-y-2">
              {Object.entries(SEVERITY_COLORS).map(([sev, colors]) => (
                <div key={sev} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className="text-slate-400">{sev}</span>
                  </div>
                  <span className="font-bold text-slate-200">{alertList.filter(a => a.severity === sev).length}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#2e3a52] mt-3 pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Unread</span>
                <span className="text-blue-400 font-bold">{unreadCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
