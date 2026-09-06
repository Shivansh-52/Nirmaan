'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Shield, Map, AlertTriangle, Users, Home, BarChart3,
  ChevronRight, ArrowRight, CheckCircle, Activity,
  Zap, Globe, Database, Lock, Menu, X, Compass, ExternalLink,
  LifeBuoy, Sparkles, Navigation, Radio, Flame, Award, HeartPulse, Building
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const keyPillars = [
    {
      title: 'Real-Time 3D GIS Threat Mapping',
      desc: 'Topographical terrain modeling analyzing glacial lake outbursts, cloudburst torrents, and landslide subsidence across high-risk Himalayan sectors.',
      image: '/images/gis_disaster_command.jpg',
      tag: 'GEO-INTELLIGENCE',
      color: 'text-sky-400 border-sky-600/40 bg-sky-950/30'
    },
    {
      title: 'Rapid NDRF Tactical Rescue Deployment',
      desc: 'Live citizen SOS triage feed and satellite-guided motorized boat dispatches ensuring field rescue teams reach marooned victims within critical golden hours.',
      image: '/images/ndrf_flood_rescue.jpg',
      tag: 'FIELD TACTICAL RESPONSE',
      color: 'text-red-400 border-red-600/40 bg-red-950/30'
    },
    {
      title: 'High-Resilience Safe Relocation Havens',
      desc: 'Evidence-based resettlement on stable high-elevation plateaus with solar microgrids, dedicated water reservoirs, and emergency trauma clinics.',
      image: '/images/resilient_safe_shelter.jpg',
      tag: 'SUSTAINABLE RESETTLEMENT',
      color: 'text-emerald-400 border-emerald-600/40 bg-emerald-950/30'
    }
  ];

  const features = [
    { icon: Map, title: 'Multi-Hazard Risk Intelligence', desc: 'Integrated mathematical modeling of flood, landslide, cloudburst, and coastal erosion threats.', color: 'text-sky-400' },
    { icon: AlertTriangle, title: 'Dynamic Red Zone Mapping', desc: 'Precision polygon buffering calculating population at immediate hazard risk.', color: 'text-red-400' },
    { icon: Users, title: 'Vulnerable Habitation Profiling', desc: 'Demographic exposure scoring prioritizing elderly, children, and differently-abled citizens.', color: 'text-amber-400' },
    { icon: Home, title: 'Safe Site Carrying Capacity', desc: 'Multi-dimensional auditing of water availability, medical proximity, and road access.', color: 'text-emerald-400' },
    { icon: Navigation, title: 'AI Relocation Matching Engine', desc: 'Haversine distance optimization matching displaced habitations to optimal havens.', color: 'text-purple-400' },
    { icon: Radio, title: 'Multi-Channel Alert Broadcast', desc: 'Simultaneous early warnings across Cell Broadcast SMS, sirens, TV, push, and radio.', color: 'text-cyan-400' },
    { icon: CheckCircle, title: 'Statutory Directive Orders', desc: 'One-click printable official government relocation orders with digital audit verification.', color: 'text-teal-400' },
    { icon: LifeBuoy, title: 'Citizen Emergency Portal', desc: 'Mobile-first crisis interface with 1-tap SOS distress beacon and nearest shelter navigation.', color: 'text-rose-400' },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      
      {/* Top Tactical Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-900/50">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-slate-100 tracking-wide">NIRMAAN</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800">
                    SIH26191
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 leading-none">MHA · NDRF Disaster Intelligence</div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-sm font-semibold text-slate-400 hover:text-slate-100 transition-colors">
                How It Works
              </Link>
              <Link href="/team" className="text-sm font-semibold text-slate-400 hover:text-slate-100 transition-colors">
                Our Team
              </Link>
              <Link href="/citizen" className="btn-secondary flex items-center gap-2 border-sky-500/30 text-sky-300 bg-sky-950/40 hover:bg-sky-900/60 text-xs py-1.5 px-3">
                <LifeBuoy className="w-3.5 h-3.5 text-sky-400" /> Citizen Safety App
              </Link>
              <Link href="/login" className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3.5">
                Authority Command <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button 
              className="md:hidden p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-4 space-y-3 animate-slide-up">
            <Link href="/about" className="block text-sm text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link href="/team" className="block text-sm text-slate-300 py-1" onClick={() => setMobileMenuOpen(false)}>Our Team</Link>
            <Link href="/citizen" className="block text-sm text-sky-400 py-1" onClick={() => setMobileMenuOpen(false)}>Citizen Safety App</Link>
            <Link href="/login" className="block btn-primary text-center py-2" onClick={() => setMobileMenuOpen(false)}>Authority Command Login</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-5 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 bg-sky-950/60 border border-sky-700/60 rounded-full px-4 py-1.5 text-xs text-sky-300 font-mono font-bold shadow-md">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            SIH26191 · Ministry of Home Affairs · National Disaster Response Force
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight leading-[1.1]">
            From Risk Identification to <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
              Proactive Resettlement
            </span>
          </h1>

          <p className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
            An AI-powered GIS decision-support platform that transforms disaster response from reactive damage relief into proactive hazard threat detection, dynamic Red Zone mapping, and optimized safe relocation planning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard/risk-map" className="btn-primary flex items-center justify-center gap-2 text-sm px-6 py-3 shadow-lg shadow-sky-900/40 w-full sm:w-auto">
              <Compass className="w-4 h-4" /> Launch GIS Risk Intelligence <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard/relocation" className="btn-secondary flex items-center justify-center gap-2 text-sm px-6 py-3 w-full sm:w-auto">
              <Navigation className="w-4 h-4 text-emerald-400" /> AI Relocation Console
            </Link>
            <Link href="/about" className="btn-secondary flex items-center justify-center gap-2 text-sm px-6 py-3 w-full sm:w-auto">
              How It Works
            </Link>
          </div>
        </div>

        {/* Real Command Center Imagery Display */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 group">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/90 text-sky-400 font-mono text-[11px] font-bold border border-sky-800 backdrop-blur-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ISRO / SENTINEL-1 SATELLITE RADAR OVERLAY
            </span>
          </div>

          <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/90 text-red-400 font-mono text-[11px] font-bold border border-red-800 backdrop-blur-md">
              8 ACTIVE RED ZONES MONITORED
            </span>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
            {/* Real GIS Command Image */}
            <img 
              src="/images/gis_disaster_command.jpg" 
              alt="NIRMAAN 3D Real-Time GIS Disaster Monitoring Command Center for Himalayas"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />
          </div>

          <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-950 border border-sky-700/50 flex items-center justify-center text-sky-400 shrink-0">
                <Map className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-100">Live Himalayan Multi-Hazard Telemetry</div>
                <div className="text-xs text-slate-400">Joshimath · Chamoli · Kedarnath · Rudraprayag · Badrinath Basin</div>
              </div>
            </div>

            <Link href="/dashboard/risk-map" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shrink-0">
              Open Live GIS Map <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Real-World Impact Pillars (With Photorealistic Imagery) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">MISSION-CRITICAL CAPABILITIES</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Designed for Real Ground Operations
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Bridging satellite telemetry, field NDRF boat battalions, and long-term sustainable rehabilitation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {keyPillars.map((pillar, i) => (
            <div 
              key={i} 
              className="card card-hover overflow-hidden flex flex-col bg-slate-900/80 border-slate-800"
            >
              {/* Pillar Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <img 
                  src={pillar.image} 
                  alt={pillar.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border backdrop-blur-md ${pillar.color}`}>
                    {pillar.tag}
                  </span>
                </div>
              </div>

              {/* Pillar Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{pillar.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{pillar.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-400">
                  <span>Ground verified protocol</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Paradigm Shift: Proactive vs Reactive Matrix */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">PARADIGM DISRUPTION</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            The Fundamental Shift
          </h2>
          <p className="text-sm text-slate-400">
            Why pre-disaster algorithmic relocation saves exponentially more lives than post-disaster relief.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Reactive (Old) */}
          <div className="card p-6 border-red-900/40 bg-red-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">Traditional Model</span>
              <span className="text-xs font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">REACTIVE</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {[
                { step: '1. Disaster Strikes', desc: 'Sudden landslide or flash flood occurs without localized habitation risk scoring.' },
                { step: '2. Catastrophic Damage', desc: 'Infrastructure collapse, road washouts, and severe casualties.' },
                { step: '3. Delayed Response', desc: 'Emergency teams struggle with destroyed bridges and lack of safe shelter data.' },
                { step: '4. Chaotic Relocation', desc: 'Displaced survivors crammed into temporary tents with severe capacity deficits.' },
              ].map((s, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-red-900/30">
                  <div className="font-bold text-red-300">{s.step}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Proactive (NIRMAAN) */}
          <div className="card p-6 border-emerald-900/40 bg-emerald-950/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">NIRMAAN Framework</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">PROACTIVE</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {[
                { step: '1. AI Risk Modeling', desc: 'Multi-hazard algorithms detect Red Zones weeks and days before disaster events.' },
                { step: '2. Safe Haven Auditing', desc: 'Candidate relocation sites pre-evaluated for water, power, and medical access.' },
                { step: '3. Statutory Directives', desc: 'District Collectors issue structured statutory relocation orders in advance.' },
                { step: '4. Orderly Resettlement', desc: 'Citizens safely transitioned to permanent, resilient communities with zero casualties.' },
              ].map((s, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-emerald-900/30">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {s.step}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Platform Feature Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">FULL-STACK INTELLIGENCE</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Integrated Crisis Response Capabilities
          </h2>
          <p className="text-sm text-slate-400">
            8 purpose-built modules designed for high-stakes command centers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="card card-hover p-5 bg-slate-900/70 border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center">
                <f.icon className={`w-4 h-4 ${f.color}`} />
              </div>
              <h3 className="text-sm font-bold text-slate-100">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-World Telemetry Counters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="card p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-slate-800">
          <div className="grid sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            <div className="space-y-1">
              <Globe className="w-6 h-6 text-sky-400 mx-auto mb-2" />
              <div className="text-3xl font-extrabold font-mono text-slate-100">1,248</div>
              <div className="text-xs text-slate-400">Habitations Monitored</div>
              <div className="text-[10px] text-slate-600 font-mono">Chamoli, Joshimath, Wayanad</div>
            </div>

            <div className="space-y-1 pt-4 sm:pt-0">
              <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-extrabold font-mono text-red-400">86</div>
              <div className="text-xs text-slate-400">Critical Red Zones Mapped</div>
              <div className="text-[10px] text-slate-600 font-mono">Dynamic Polygon Buffers</div>
            </div>

            <div className="space-y-1 pt-4 sm:pt-0">
              <Building className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-3xl font-extrabold font-mono text-emerald-400">92,400</div>
              <div className="text-xs text-slate-400">Verified Relocation Capacity</div>
              <div className="text-[10px] text-slate-600 font-mono">High-Ground Safe Shelters</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-4xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-sky-600/20 border border-sky-500/40 flex items-center justify-center mx-auto text-sky-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Ready to Test the Decision Intelligence Platform?
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Log in to access the full decision-support console, evaluate live settlement dossiers, and inspect official statutory relocation orders.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/dashboard" className="btn-primary text-sm px-6 py-3 flex items-center gap-2">
            Access Authority Command <ChevronRight className="w-4 h-4" />
          </Link>
          <Link href="/team" className="btn-secondary text-sm px-6 py-3 flex items-center gap-2 text-yellow-300 border-yellow-700/50">
            <Users className="w-4 h-4 text-yellow-400" /> Meet Innovation Team
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-sky-600 rounded flex items-center justify-center text-white">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-slate-200">NIRMAAN</span>
        </div>
        <div>SIH26191 · Ministry of Home Affairs · National Disaster Response Force · Disaster Management Division</div>
        <div className="text-slate-600 text-[11px]">Designed & Engineered by Team NIRMAAN (Lead: Shivansh Chaurasiya)</div>
      </footer>

    </div>
  );
}
