'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Eye, EyeOff, AlertTriangle, Lock, User, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ department: '', officialId: '', password: '', otp: '' });
  const [error, setError] = useState('');

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1200));
    localStorage.setItem('nirmaan_auth', JSON.stringify({
      id: 'demo_authority',
      name: 'Demo Authority',
      department: 'NDRF — National Demo Division',
      region: 'Uttarakhand & Multi-State',
      role: 'STATE_AUTHORITY',
      loginTime: new Date().toISOString(),
    }));
    router.push('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.department || !form.officialId || !form.password) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1000));
    setError('Demo mode: use "Demo Authority Login" button below.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1526] flex flex-col">
      {/* Top bar */}
      <div className="bg-[#1a2338] border-b border-[#2e3a52] py-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <div>
            <div className="text-xs text-slate-400">Ministry of Home Affairs</div>
            <div className="text-xs text-slate-400">National Disaster Response Force — DM Division</div>
          </div>
        </div>
        <div className="text-xs text-slate-500 hidden sm:block">SIH26191 · Prototype System</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">NIRMAAN</h1>
            <p className="text-slate-400 text-sm mt-1">Intelligent Disaster Risk & Relocation Platform</p>
            <div className="mt-3 text-xs text-slate-500">Authority Access Portal</div>
          </div>

          {/* Demo Banner */}
          <div className="card p-4 mb-6 border-blue-700/40 bg-blue-950/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-blue-300 text-xs font-semibold mb-1">Prototype / Demo System</div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  This is a demonstration prototype. Use the "Demo Authority Login" button to access all features with pre-loaded illustrative data.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-6">
            <h2 className="text-slate-100 font-semibold mb-5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              Authority Login
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700/40 rounded-lg text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Department / Authority</label>
                <select
                  className="input w-full"
                  value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                >
                  <option value="">Select Department</option>
                  <option>NDRF — National Disaster Response Force</option>
                  <option>SDMA — State Disaster Management Authority</option>
                  <option>DDMA — District Disaster Management Authority</option>
                  <option>Revenue & Disaster Management</option>
                  <option>Ministry of Home Affairs</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Official ID</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter your official ID"
                    className="input w-full pl-9"
                    value={form.officialId}
                    onChange={e => setForm(f => ({ ...f, officialId: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="input w-full pl-9 pr-9"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">OTP Verification</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="input w-full"
                  value={form.otp}
                  onChange={e => setForm(f => ({ ...f, otp: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
              <button type="submit" className="btn-secondary w-full" disabled={loading}>
                Login with Official Credentials
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2e3a52]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#1e2a40] px-3 text-xs text-slate-500">OR</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Authenticating...</>
              ) : (
                <><Shield className="w-4 h-4" /> Use Demo Authority Login <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
