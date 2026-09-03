'use client';
import Link from 'next/link';
import { Shield, ArrowLeft, CheckCircle, Database, Activity, AlertTriangle, Users, Home, BarChart3, Zap, ChevronRight } from 'lucide-react';

const steps = [
  {
    num: 1, icon: Database, title: 'Data Integration',
    desc: 'NIRMAAN integrates multi-source hazard data including flood maps, landslide susceptibility, rainfall data, historical disaster records, and population census information.',
    color: 'bg-slate-700', iconColor: 'text-slate-300'
  },
  {
    num: 2, icon: Activity, title: 'Multi-Hazard Analysis',
    desc: 'Each habitation is analyzed against multiple hazard types — flood, landslide, cloudburst, and coastal erosion — with combined exposure scoring.',
    color: 'bg-blue-900', iconColor: 'text-blue-300'
  },
  {
    num: 3, icon: AlertTriangle, title: 'Risk Assessment',
    desc: 'A transparent, prototype-level risk score (0–100) is generated per habitation based on hazard intensity, historical frequency, population exposure, vulnerability, and infrastructure.',
    color: 'bg-orange-900', iconColor: 'text-orange-300'
  },
  {
    num: 4, icon: AlertTriangle, title: 'Red Zone Identification',
    desc: 'Habitations scoring above the critical threshold are flagged as Red Zones — areas requiring priority attention and immediate relocation planning.',
    color: 'bg-red-900', iconColor: 'text-red-300'
  },
  {
    num: 5, icon: Users, title: 'Vulnerable Habitation Analysis',
    desc: 'Detailed vulnerability profiling identifies the proportion of at-risk population (elderly, children, low income, differently-abled) to guide targeted interventions.',
    color: 'bg-orange-800', iconColor: 'text-orange-300'
  },
  {
    num: 6, icon: Home, title: 'Safe Site Identification',
    desc: 'Candidate relocation sites outside identified high-risk zones are shortlisted and ranked by safety score, infrastructure, connectivity, water, healthcare, and school access.',
    color: 'bg-green-900', iconColor: 'text-green-300'
  },
  {
    num: 7, icon: BarChart3, title: 'Carrying Capacity Assessment',
    desc: 'Each candidate site receives an illustrative capacity estimate based on available land, existing population, water supply, infrastructure, and emergency accessibility.',
    color: 'bg-teal-900', iconColor: 'text-teal-300'
  },
  {
    num: 8, icon: Activity, title: 'Relocation Prioritization',
    desc: 'Habitations are ranked into Immediate, Short-Term, and Medium-Term priority tiers based on combined risk, vulnerability, and site availability.',
    color: 'bg-purple-900', iconColor: 'text-purple-300'
  },
  {
    num: 9, icon: Shield, title: 'Authority Decision Support',
    desc: 'NIRMAAN generates structured, explainable decision-support recommendations. All final relocation decisions remain with authorized disaster-management authorities.',
    color: 'bg-blue-800', iconColor: 'text-blue-300'
  },
  {
    num: 10, icon: Zap, title: 'Continuous Monitoring',
    desc: 'Risk conditions are dynamically updated as new data arrives — weather, satellite, sensor feeds — triggering re-assessment and authority alerts when conditions change.',
    color: 'bg-cyan-900', iconColor: 'text-cyan-300'
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d1526] text-slate-100">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0d1526]/90 backdrop-blur-sm border-b border-[#2e3a52]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-slate-100">NIRMAAN</span>
          </div>
          <Link href="/login" className="btn-primary text-sm flex items-center gap-1">
            Login <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-700/40 rounded-full px-4 py-1.5 mb-6 text-xs text-blue-300">
            SIH26191 · Ministry of Home Affairs · NDRF
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">How NIRMAAN Works</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
            NIRMAAN enables a fundamental shift from reactive disaster response to proactive,
            evidence-based relocation planning. Here is the end-to-end workflow.
          </p>
        </div>

        {/* Comparison Banner */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          <div className="card p-6">
            <h3 className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">⚠ Current Reactive Approach</h3>
            <div className="space-y-2 text-sm text-slate-300">
              {['Disaster strikes', 'Damage occurs', 'Emergency response deployed', 'Victims displaced', 'Relocation planning begins late', 'Capacity mismatches'].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6 border-blue-700/30 bg-blue-950/20">
            <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">✓ NIRMAAN Proactive Approach</h3>
            <div className="space-y-2 text-sm text-slate-200">
              {['Risk identified before disaster', 'Red Zones mapped proactively', 'Vulnerable populations assessed', 'Safe sites pre-evaluated', 'Capacity confirmed in advance', 'Authorities act before displacement'].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps */}
        <h2 className="text-2xl font-bold text-slate-100 mb-8 text-center">The 10-Step Intelligence Workflow</h2>
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="card p-6 flex gap-5">
              <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                <step.icon className={`w-5 h-5 ${step.iconColor}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-500 font-mono">STEP {step.num.toString().padStart(2, '0')}</span>
                  <h3 className="font-semibold text-slate-100">{step.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 card p-6 border-yellow-700/30 bg-yellow-950/10">
          <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Important: Decision-Support Positioning
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            NIRMAAN is an AI-powered <strong className="text-slate-200">decision-support platform</strong>. All recommendations are evidence-based 
            and advisory in nature. The platform does not automatically order or mandate relocation. 
            Final decisions regarding habitation relocation rest exclusively with authorized disaster-management authorities 
            following established government procedures.
          </p>
          <p className="text-slate-500 text-xs mt-3">
            Risk scores, capacity estimates, and prioritization rankings in this prototype are illustrative and 
            do not represent official government assessments.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/login" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Access Authority Dashboard <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
