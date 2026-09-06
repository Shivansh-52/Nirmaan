'use client';
import Link from 'next/link';
import { Shield, ArrowLeft, Award, ExternalLink, Sparkles, Map, Navigation, LifeBuoy, User } from 'lucide-react';

interface TeamMember {
  name: string;
  role?: string;
  isLeader?: boolean;
  avatarInitials: string;
  gradient: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Shivansh Chaurasiya',
    role: 'Team Leader',
    isLeader: true,
    avatarInitials: 'SC',
    gradient: 'from-sky-500 via-blue-600 to-indigo-700'
  },
  {
    name: 'Samriddhi',
    avatarInitials: 'SA',
    gradient: 'from-emerald-500 to-teal-700'
  },
  {
    name: 'Himanshi',
    avatarInitials: 'HI',
    gradient: 'from-purple-500 to-indigo-700'
  },
  {
    name: 'Yuvraj',
    avatarInitials: 'YU',
    gradient: 'from-amber-500 to-orange-700'
  },
  {
    name: 'Tushar',
    avatarInitials: 'TU',
    gradient: 'from-red-500 to-rose-700'
  },
  {
    name: 'Abhishek',
    avatarInitials: 'AB',
    gradient: 'from-cyan-500 to-blue-700'
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wide text-slate-100">NIRMAAN</span>
              <span className="hidden sm:inline text-xs text-slate-400 font-mono ml-2">SIH26191 TEAM</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5">
              Launch Dashboard <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-sky-950/60 border border-sky-700/60 rounded-full px-4 py-1 text-xs text-sky-300 font-mono font-bold">
            <Award className="w-3.5 h-3.5 text-sky-400" />
            SMART INDIA HACKATHON 2024 · SIH26191
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Our Team
          </h1>
          
          <p className="text-sm text-slate-400 leading-relaxed">
            Ministry of Home Affairs & National Disaster Response Force (NDRF)
          </p>
        </div>

        {/* Clean Name Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className={`card card-hover p-6 flex items-center gap-4 transition-all duration-200 ${
                member.isLeader 
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border-sky-600/60 shadow-xl shadow-sky-950/40 sm:col-span-2 lg:col-span-3' 
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Avatar Circle */}
              <div 
                className={`rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center font-extrabold text-white shadow-lg shrink-0 border border-white/20 ${
                  member.isLeader ? 'w-16 h-16 text-2xl' : 'w-14 h-14 text-xl'
                }`}
              >
                {member.avatarInitials}
              </div>

              {/* Name & Role */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`font-extrabold text-slate-100 truncate ${member.isLeader ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
                    {member.name}
                  </h3>
                  {member.isLeader && (
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-[11px] font-mono font-bold uppercase shadow-sm">
                      ⭐ TEAM LEADER
                    </span>
                  )}
                </div>
                {member.role && (
                  <div className="text-xs font-mono text-sky-400 font-semibold mt-0.5">
                    {member.role}
                  </div>
                )}
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  SIH26191 Team Member
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Launch Strip */}
        <div className="card p-6 bg-slate-950/80 border-slate-800 text-center space-y-3">
          <div className="text-xs text-slate-400 font-mono">
            NIRMAAN — Intelligent Disaster Risk & Relocation Planning Platform
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link href="/dashboard/risk-map" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5" /> GIS Risk Map
            </Link>
            <Link href="/dashboard/relocation" className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Relocation Console
            </Link>
            <Link href="/citizen" className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 text-sky-300 border-sky-700/50">
              <LifeBuoy className="w-3.5 h-3.5 text-sky-400" /> Citizen Portal
            </Link>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 space-y-1 mt-auto">
        <div>SIH26191 · Ministry of Home Affairs · National Disaster Response Force · DM Division</div>
        <div>Team NIRMAAN (Leader: Shivansh Chaurasiya)</div>
      </footer>

    </div>
  );
}
