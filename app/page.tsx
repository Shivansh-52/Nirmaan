'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Shield, Map, AlertTriangle, Users, Home, BarChart3,
  ChevronRight, ArrowRight, CheckCircle, Activity,
  Zap, Globe, Database, Lock, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { icon: Map, title: 'Multi-Hazard Risk Intelligence', desc: 'Integrated analysis of flood, landslide, cloudburst, and coastal erosion risks.', color: 'text-blue-400' },
    { icon: AlertTriangle, title: 'Dynamic Red Zone Mapping', desc: 'Real-time identification and boundary management of critical hazard zones.', color: 'text-red-400' },
    { icon: Users, title: 'Vulnerable Habitation Analysis', desc: 'Population exposure and vulnerability scoring for targeted interventions.', color: 'text-orange-400' },
    { icon: Home, title: 'Safe Site Identification', desc: 'Evidence-based shortlisting of safer relocation locations.', color: 'text-green-400' },
    { icon: BarChart3, title: 'Carrying Capacity Assessment', desc: 'Illustrative capacity evaluation across land, water, healthcare, and infrastructure.', color: 'text-purple-400' },
    { icon: Activity, title: 'Relocation Prioritization', desc: 'Immediate, short-term, and medium-term priority ranking for authorities.', color: 'text-yellow-400' },
    { icon: CheckCircle, title: 'Explainable Recommendations', desc: 'Transparent, evidence-based decision support for authorized authorities.', color: 'text-teal-400' },
    { icon: Zap, title: 'Continuous Risk Monitoring', desc: 'Dynamic updates as new hazard data, weather, and conditions change.', color: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0d1526] text-slate-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1526]/90 backdrop-blur-sm border-b border-[#2e3a52]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-100 tracking-wide">NIRMAAN</span>
                <div className="text-[10px] text-slate-500 leading-none">SIH26191 · MHA · NDRF</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">How It Works</Link>
              <Link href="/citizen" className="btn-secondary flex items-center gap-2 border-blue-500/30 text-blue-300 bg-blue-900/20 hover:bg-blue-900/40">
                Citizen Portal
              </Link>
              <Link href="/login" className="btn-primary flex items-center gap-2">
                Authority Login <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <button className="md:hidden p-2 text-slate-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a2338] border-t border-[#2e3a52] px-4 py-4 space-y-3">
            <Link href="/about" className="block text-sm text-slate-300" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link href="/login" className="block btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>Authority Login</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-1.5 mb-8 text-xs text-blue-300">
            <Shield className="w-3 h-3" />
            SIH26191 · Ministry of Home Affairs · NDRF
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-100 mb-6 leading-tight">
            NIRMAAN
          </h1>
          <p className="text-xl sm:text-2xl text-blue-400 font-medium mb-6">
            From Risk Identification to Safer Relocation
          </p>
          <p className="text-slate-400 max-w-3xl mx-auto text-base sm:text-lg mb-10 leading-relaxed">
            An AI-powered GIS decision-support platform for identifying hazard-based Red Zones, assessing
            vulnerable habitations, evaluating safer relocation sites, and prioritizing proactive relocation
            planning for disaster-management authorities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
              Explore Risk Intelligence <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/about" className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
              How It Works
            </Link>
          </div>
        </div>

        {/* Map Preview */}
        <div className="mt-16 relative rounded-2xl overflow-hidden border border-[#2e3a52] bg-[#1a2338]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1526]/60 z-10 pointer-events-none" />
          <div className="h-64 sm:h-96 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-8 opacity-40">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`w-16 h-16 rounded-full ${['bg-red-600', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-700', 'bg-orange-600'][i]} opacity-70 blur-sm`} />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <Map className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">Interactive GIS Risk Intelligence Map</p>
                <p className="text-slate-500 text-sm mt-1">Hazard zones · Vulnerable habitations · Safe sites</p>
                <Link href="/login" className="mt-4 btn-primary inline-flex items-center gap-2 text-sm">
                  Launch Dashboard <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Comparison */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current */}
          <div className="card p-6">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6">Current Approach</h3>
            <div className="space-y-3">
              {['Disaster Occurs', 'Damage Assessment', 'Emergency Response', 'Relocation Planning'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-red-900/40 border border-red-700/40 flex items-center justify-center text-xs text-red-400 font-bold flex-shrink-0">{i + 1}</div>
                  <span className="text-slate-300 text-sm">{step}</span>
                  {i < 3 && <ArrowRight className="w-3 h-3 text-slate-600 ml-auto" />}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-xs text-red-400">
              ⚠ Reactive — Action taken only after disaster strikes
            </div>
          </div>

          {/* NIRMAAN */}
          <div className="card p-6 border-blue-700/30 bg-blue-950/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-blue-300 text-sm font-medium uppercase tracking-wider">NIRMAAN Approach</h3>
            </div>
            <div className="space-y-3">
              {['Risk Detection & Analysis', 'Red Zone Identification', 'Vulnerable Population Assessment', 'Safe Site Capacity Analysis', 'Proactive Relocation Planning'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-900/40 border border-blue-600/40 flex items-center justify-center text-xs text-blue-400 font-bold flex-shrink-0">{i + 1}</div>
                  <span className="text-slate-200 text-sm">{step}</span>
                  {i < 4 && <ArrowRight className="w-3 h-3 text-blue-600/50 ml-auto" />}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-900/20 border border-green-800/30 rounded-lg text-xs text-green-400">
              ✓ Proactive — Planning before disaster strikes
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Platform Capabilities</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Integrated intelligence across the complete disaster-risk and relocation planning workflow.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="card card-hover p-5">
              <f.icon className={`w-6 h-6 ${f.color} mb-3`} />
              <h3 className="text-sm font-semibold text-slate-100 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-100 mb-4">Decision Workflow</h2>
          <p className="text-slate-400">Evidence-based intelligence at every stage of the relocation decision process.</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-0">
          {[
            { label: 'Hazard Data', icon: Database, color: 'bg-slate-700' },
            { label: 'Risk Analysis', icon: Activity, color: 'bg-blue-800' },
            { label: 'Red Zone ID', icon: AlertTriangle, color: 'bg-red-800' },
            { label: 'Habitation Analysis', icon: Users, color: 'bg-orange-800' },
            { label: 'Safe Site ID', icon: Home, color: 'bg-green-800' },
            { label: 'Capacity Assessment', icon: BarChart3, color: 'bg-teal-800' },
            { label: 'Authority Decision', icon: Shield, color: 'bg-blue-700' },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-0">
              <div className={`${step.color} rounded-xl px-4 py-3 text-center min-w-[100px]`}>
                <step.icon className="w-4 h-4 text-white mx-auto mb-1" />
                <span className="text-xs text-white font-medium">{step.label}</span>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block mx-1" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="card p-6 sm:p-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <Globe className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="font-bold text-2xl text-slate-100">1,248</div>
              <div className="text-xs text-slate-400 mt-1">Habitations Analyzed <br/><span className="text-slate-600">(Demo data)</span></div>
            </div>
            <div>
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="font-bold text-2xl text-slate-100">86</div>
              <div className="text-xs text-slate-400 mt-1">Red Zones Identified <br/><span className="text-slate-600">(Demo data)</span></div>
            </div>
            <div>
              <Lock className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="font-bold text-2xl text-slate-100">92,400</div>
              <div className="text-xs text-slate-400 mt-1">Relocation Capacity <br/><span className="text-slate-600">(Demo data)</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">Ready to Explore the Platform?</h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm">Log in with the demo authority account to access the full NIRMAAN decision-support dashboard.</p>
        <Link href="/login" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
          Access Authority Dashboard <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2e3a52] py-8 px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <Shield className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-slate-200">NIRMAAN</span>
        </div>
        <p className="text-xs text-slate-500">
          SIH26191 · Ministry of Home Affairs · National Disaster Response Force · DM Division
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Demo / Prototype — All data is illustrative. Final decisions rest with authorized authorities.
        </p>
      </footer>
    </div>
  );
}
