'use client';
import { useState } from 'react';
import { Shield, User, Bell, Lock, Globe, Database, ChevronRight, CheckCircle, Info } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Settings & Authority Profile</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your authority account and platform preferences</p>
      </div>

      {/* Demo notice */}
      <div className="card p-4 border-blue-700/30 bg-blue-950/10">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            <span className="text-blue-300 font-semibold">Demo Mode:</span> Settings shown here are illustrative.
            In a production deployment, changes would be persisted to a secure government database with full audit logging.
          </p>
        </div>
      </div>

      {/* Authority Profile */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold text-slate-100">Authority Profile</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Authority Name</label>
            <input defaultValue="Demo Authority" className="input w-full" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Official ID</label>
            <input defaultValue="DEMO-NDRF-001" className="input w-full" readOnly />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Department</label>
            <input defaultValue="NDRF — National Demo Division" className="input w-full" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Designation</label>
            <input defaultValue="District Coordinator" className="input w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-400 mb-1.5">Region / Jurisdiction</label>
            <input defaultValue="Uttarakhand & Multi-State Demo Region" className="input w-full" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold text-slate-100">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Critical Risk Alerts', desc: 'Notify when habitation risk score crosses critical threshold', defaultChecked: true },
            { label: 'New Red Zone Alerts', desc: 'Notify when a new Red Zone is identified in your jurisdiction', defaultChecked: true },
            { label: 'Capacity Updates', desc: 'Notify when site capacity changes significantly', defaultChecked: true },
            { label: 'Relocation Plan Updates', desc: 'Notify when pending plans require action', defaultChecked: false },
            { label: 'System Updates', desc: 'Platform maintenance and data refresh notifications', defaultChecked: false },
          ].map((item, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-0.5 accent-blue-500" defaultChecked={item.defaultChecked} />
              <div>
                <div className="text-sm text-slate-200">{item.label}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold text-slate-100">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#2e3a52] rounded-lg">
            <div>
              <div className="text-sm text-slate-200">Role-Based Access Control</div>
              <div className="text-xs text-slate-500">Current role: STATE_AUTHORITY</div>
            </div>
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#2e3a52] rounded-lg">
            <div>
              <div className="text-sm text-slate-200">Two-Factor Authentication</div>
              <div className="text-xs text-slate-500">OTP verification enabled</div>
            </div>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#2e3a52] rounded-lg">
            <div>
              <div className="text-sm text-slate-200">Audit Logging</div>
              <div className="text-xs text-slate-500">All actions are recorded</div>
            </div>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
        </div>
      </div>

      {/* Data & Integration */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold text-slate-100">Data & Integration</h2>
        </div>
        <div className="space-y-2 text-xs">
          {[
            { name: 'Government Disaster Database', status: 'Demo Mode', color: 'text-yellow-400' },
            { name: 'Weather / Meteorological API', status: 'Not Connected', color: 'text-slate-500' },
            { name: 'Satellite / Remote Sensing', status: 'Not Connected', color: 'text-slate-500' },
            { name: 'Population Census Data', status: 'Demo Mode', color: 'text-yellow-400' },
            { name: 'Infrastructure Database', status: 'Demo Mode', color: 'text-yellow-400' },
            { name: 'IoT Sensor Network', status: 'Not Connected', color: 'text-slate-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#2e3a52] rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-slate-500" />
                <span className="text-slate-300">{item.name}</span>
              </div>
              <span className={`font-medium ${item.color}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button className="btn-secondary">Cancel</button>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all ${saved ? 'bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
