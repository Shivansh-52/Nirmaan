'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, LayoutDashboard, Map, AlertTriangle, Users,
  Home, Navigation, Star, BarChart3, Bell, Settings,
  ChevronLeft, ChevronRight, X, Radio, Navigation2, LifeBuoy
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/rescue', label: 'Rescue & Response', icon: LifeBuoy },
  { href: '/dashboard/evacuation', label: 'Smart Evacuation', icon: Navigation2 },
  { href: '/dashboard/alerts/dispatch', label: 'Alert Dispatcher', icon: Radio },
  { href: '/dashboard/risk-map', label: 'Risk Map', icon: Map },
  { href: '/dashboard/red-zones', label: 'Red Zones', icon: AlertTriangle },
  { href: '/dashboard/habitations', label: 'Habitations', icon: Users },
  { href: '/dashboard/safe-sites', label: 'Safe Sites', icon: Home },
  { href: '/dashboard/relocation', label: 'Relocation', icon: Navigation },
  { href: '/dashboard/priority', label: 'Priority Cases', icon: Star },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell, badge: 4 },
  { href: '/team', label: 'Our Team', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ collapsed, setCollapsed, mobile, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col bg-[#1a2338] border-r border-[#2e3a52] transition-all duration-300 h-full',
        collapsed && !mobile ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center border-b border-[#2e3a52] px-4', collapsed && !mobile ? 'justify-center py-4' : 'gap-3 py-4 justify-between')}>
        {(!collapsed || mobile) && (
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-100 text-sm leading-none">NIRMAAN</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-none truncate">Disaster Intelligence</div>
            </div>
          </Link>
        )}
        {collapsed && !mobile && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
        )}
        {mobile && onClose ? (
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        ) : !mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={mobile && onClose ? onClose : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative',
                active
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                  : 'text-slate-400 hover:bg-[#2e3a52] hover:text-slate-200',
                collapsed && !mobile ? 'justify-center' : ''
              )}
            >
              <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-blue-400' : '')} />
              {(!collapsed || mobile) && (
                <span className="text-sm font-medium flex-1">{item.label}</span>
              )}
              {(!collapsed || mobile) && item.badge && (
                <span className="bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {collapsed && !mobile && item.badge && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {(!collapsed || mobile) && (
        <div className="p-4 border-t border-[#2e3a52]">
          <div className="text-[10px] text-slate-600 leading-relaxed">
            <div className="font-medium text-slate-500 mb-0.5">SIH26191 · NIRMAAN</div>
            <div>Demo / Illustrative Data</div>
          </div>
        </div>
      )}
    </aside>
  );
}
