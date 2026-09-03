'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, ChevronDown, MapPin, Menu, Shield, User, LogOut, Settings } from 'lucide-react';
import { alerts } from '@/data/alerts';

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; department: string; region: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const unread = alerts.filter(a => !a.read).length;

  useEffect(() => {
    const stored = localStorage.getItem('nirmaan_auth');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch { router.push('/login'); }
    } else {
      router.push('/login');
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('nirmaan_auth');
    router.push('/login');
  };

  return (
    <header className="h-16 bg-[#1a2338] border-b border-[#2e3a52] flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
      {/* Mobile menu */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Region */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
        <MapPin className="w-4 h-4 text-blue-400" />
        <span className="text-slate-300 font-medium">{user?.region ?? 'All Regions'}</span>
        <ChevronDown className="w-3 h-3" />
      </div>

      <div className="flex-1" />

      {/* Demo badge */}
      <div className="hidden md:flex items-center gap-1.5 bg-yellow-900/30 border border-yellow-700/40 rounded-full px-3 py-1">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
        <span className="text-[11px] text-yellow-300 font-medium">Demo Mode · Illustrative Data</span>
      </div>

      {/* Alerts bell */}
      <div className="relative">
        <button
          onClick={() => { setShowAlerts(!showAlerts); setShowProfile(false); }}
          className="relative text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-[#2e3a52]"
          aria-label={`Notifications (${unread} unread)`}
        >
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
        {showAlerts && (
          <div className="absolute right-0 top-full mt-1 w-80 card shadow-2xl z-50 max-h-96 overflow-y-auto animate-fade-in">
            <div className="p-3 border-b border-[#2e3a52]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-100">Alerts</span>
                <Link href="/dashboard/alerts" onClick={() => setShowAlerts(false)} className="text-xs text-blue-400 hover:text-blue-300">View All</Link>
              </div>
            </div>
            {alerts.slice(0, 5).map(a => (
              <div key={a.id} className={`p-3 border-b border-[#2e3a52] last:border-0 ${!a.read ? 'bg-blue-950/20' : ''}`}>
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.severity === 'CRITICAL' ? 'bg-red-500' : a.severity === 'HIGH' ? 'bg-orange-500' : a.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div>
                    <div className="text-xs font-medium text-slate-200">{a.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{a.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(!showProfile); setShowAlerts(false); }}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#2e3a52] transition-colors"
          aria-label="Authority profile menu"
        >
          <div className="w-7 h-7 bg-blue-600/40 border border-blue-500/40 rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-blue-300" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-slate-200 leading-none">Demo Authority</div>
            <div className="text-[10px] text-slate-500 leading-none mt-0.5">NDRF Division</div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
        </button>
        {showProfile && (
          <div className="absolute right-0 top-full mt-1 w-56 card shadow-2xl z-50 animate-fade-in">
            <div className="p-3 border-b border-[#2e3a52]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600/40 border border-blue-500/40 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-100">Demo Authority</div>
                  <div className="text-xs text-slate-500">{user?.department}</div>
                </div>
              </div>
            </div>
            <div className="py-1">
              <Link href="/dashboard/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-[#2e3a52] hover:text-slate-100 transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <button onClick={logout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#2e3a52] hover:text-red-300 transition-colors w-full">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
