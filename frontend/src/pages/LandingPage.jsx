import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ShieldCheck,
  Zap,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  ChevronRight,
  Building2,
  FileCheck2,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('student');

  return (
    <div className="min-h-screen bg-[#05080e] text-slate-100 font-sans selection:bg-amber-500 selection:text-black relative overflow-hidden">
      
      {/* Background Gold & Emerald Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-emerald-600/10 blur-3xl pointer-events-none"></div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#05080e]/90 backdrop-blur-xl border-b border-amber-900/20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-[1px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080d17] rounded-[11px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Thesis<span className="text-amber-400 font-sans font-bold">Flow</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400/70 tracking-widest uppercase">
                Academic Review Portal
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-400">
            <a href="#features" className="hover:text-amber-300 transition-colors">Platform Capabilities</a>
            <a href="#roles" className="hover:text-amber-300 transition-colors">Role Dashboards</a>
            <a href="#architecture" className="hover:text-amber-300 transition-colors">System Architecture</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-amber-300 px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black hover:opacity-95 transition-opacity shadow-lg shadow-amber-500/20 flex items-center gap-1.5 font-sans"
            >
              <span>Launch Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            
            {/* Academic Luxury Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional Thesis & Dissertation Management</span>
              <span className="text-amber-700">•</span>
              <span className="text-emerald-400 font-semibold">Production Ready</span>
            </div>

            {/* Editorial Serif Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] text-white">
              Elevate University Thesis Submissions & <span className="font-serif italic font-normal bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-500 bg-clip-text text-transparent">Faculty Reviews.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl font-light">
              Connect Students, Academic Supervisors, and Department Coordinators in one unified real-time workspace with line-by-line feedback, manuscript versioning, and approval workflows.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black font-extrabold text-sm hover:opacity-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2.5 group"
              >
                <span>Access Student & Faculty Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <span>Demo Account Sign In</span>
              </Link>
            </div>

            {/* Academic Badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2 text-amber-400/80">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Role-Based Access Control (RBAC)
              </div>
              <div className="flex items-center gap-2 text-emerald-400/80">
                <Zap className="w-4 h-4 text-emerald-400" />
                Socket.io Real-Time Events
              </div>
              <div className="flex items-center gap-2 text-cyan-400/80">
                <FileText className="w-4 h-4 text-cyan-400" />
                Cloudinary Document Cloud
              </div>
            </div>

          </div>

          {/* Interactive UI Showcase Window */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl p-3 bg-gradient-to-b from-amber-500/20 via-slate-800/40 to-slate-900/60 border border-amber-500/30 shadow-2xl shadow-amber-500/10">
            <div className="bg-[#090d16] rounded-xl overflow-hidden border border-slate-800/80">
              
              {/* Window Header */}
              <div className="bg-[#0e1422] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-amber-400/80">thesisflow.app/workspace/manuscript-v2</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Live Sync Active
                  </span>
                </div>
              </div>

              {/* Mockup Inner Body */}
              <div className="p-6 md:p-8 grid md:grid-cols-12 gap-6 bg-[#070b13]">
                
                {/* Left Panel: Manuscript Meta */}
                <div className="md:col-span-4 space-y-4 border-r border-slate-800/80 pr-6">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    MSc. IT Dissertation
                  </div>
                  <h3 className="font-serif font-bold text-white text-lg leading-snug">
                    Distributed Ledger Protocols in Mobile Financial Settlements
                  </h3>
                  <div className="text-xs text-slate-400 space-y-1 font-sans">
                    <div>Author: <span className="text-slate-200 font-semibold">Gabriel Odai Afotey</span></div>
                    <div>Index No: <span className="text-amber-400/90 font-mono">10293847</span></div>
                    <div>Supervisor: <span className="text-slate-200">Dr. K. Mensah</span></div>
                  </div>

                  <div className="pt-2">
                    <div className="text-[11px] font-mono text-slate-500 mb-1.5 uppercase">Submission Status</div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-amber-400" />
                      IN_REVIEW (v2.4)
                    </span>
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">Version History</div>
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/30 text-xs flex items-center justify-between text-amber-200">
                      <span>v2.4 (Latest Draft)</span>
                      <span className="text-[10px] text-slate-500 font-mono">Today, 14:20</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs flex items-center justify-between text-slate-400">
                      <span>v2.1 (Initial Submission)</span>
                      <span className="text-[10px] text-slate-500 font-mono">3 days ago</span>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Supervisor Notes & Live Comments */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      Supervisor Feedback & Line Review Notes
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                      Socket.io Connected
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-amber-300">Dr. K. Mensah (Supervisor)</span>
                        <span className="text-[10px] font-mono">10 mins ago</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans">
                        "Chapter 3 methodology looks solid. Please expand section 3.2 on transaction latency benchmarks before final thesis defense binding."
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-emerald-400">Gabriel Odai Afotey (Student)</span>
                        <span className="text-[10px] font-mono">Just now</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-sans">
                        "Updated Chapter 3.2 with latency benchmarks under 200ms connection load. Re-submitted manuscript v2.4."
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <div className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500 font-sans">
                      Type review note or approval comment...
                    </div>
                    <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs flex items-center gap-1.5">
                      <span>Post Note</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Role-Based Workflows Showcase */}
      <section id="roles" className="py-24 bg-[#070b13] relative border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Role Academic Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              Tailored Portals for Every Academic Role
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mt-3 font-light">
              ThesisFlow provides dedicated permission-controlled dashboards custom-built for Students, Supervisors, and Department Coordinators.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-xl mx-auto mb-12">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Portal
            </button>
            <button
              onClick={() => setActiveTab('supervisor')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'supervisor'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              Supervisor Desk
            </button>
            <button
              onClick={() => setActiveTab('coordinator')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'coordinator'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Department Coordinator
            </button>
          </div>

          {/* Role Content Display */}
          <div className="max-w-4xl mx-auto rounded-2xl p-8 bg-slate-900/40 border border-amber-500/20">
            {activeTab === 'student' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">Student Submission Portal</h3>
                    <p className="text-xs text-slate-400">Streamlining thesis manuscript uploads and supervisory tracking</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      25MB Document Upload Engine
                    </div>
                    <p className="text-xs text-slate-400">
                      Upload `.pdf` and `.docx` manuscripts directly to Cloudinary cloud storage with automated versioning.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      Live Status Transitions
                    </div>
                    <p className="text-xs text-slate-400">
                      Track your manuscript lifecycle from `SUBMITTED` ➔ `IN_REVIEW` ➔ `REVISION_REQUIRED` ➔ `APPROVED`.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      Embedded PDF / Word Viewer
                    </div>
                    <p className="text-xs text-slate-400">
                      Preview submitted drafts directly in-browser using Google Docs embedded viewer with zero downloads.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      Real-Time Notification Badges
                    </div>
                    <p className="text-xs text-slate-400">
                      Receive instant WebSocket alerts whenever your supervisor leaves feedback or updates review status.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'supervisor' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">Supervisor Review Desk</h3>
                    <p className="text-xs text-slate-400">Empowering faculty to conduct efficient line-by-line feedback</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Assigned Student Roster
                    </div>
                    <p className="text-xs text-slate-400">
                      Overview of all assigned thesis candidates, submission deadlines, and pending draft reviews.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Inline Feedback Notes
                    </div>
                    <p className="text-xs text-slate-400">
                      Post precise revision notes and section feedback directly onto candidate submission versions.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Approval & Revision Actions
                    </div>
                    <p className="text-xs text-slate-400">
                      Request manuscript revisions or grant official supervisory approval in a single click.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Version Comparison Timeline
                    </div>
                    <p className="text-xs text-slate-400">
                      Compare current candidate drafts against previous submissions to ensure requested edits were made.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'coordinator' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">Department Coordinator Oversight</h3>
                    <p className="text-xs text-slate-400">Faculty-wide oversight, user management, & reporting</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Student-Supervisor Allocations
                    </div>
                    <p className="text-xs text-slate-400">
                      Assign faculty supervisors to undergraduate and postgraduate candidates across academic departments.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Institutional Index Tracking
                    </div>
                    <p className="text-xs text-slate-400">
                      Enforce unique 8-digit student index number validation and department registry lookups.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      Department Completion Analytics
                    </div>
                    <p className="text-xs text-slate-400">
                      View real-time department metrics on thesis completion rates, pending reviews, and faculty workload.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      User & Role Management
                    </div>
                    <p className="text-xs text-slate-400">
                      Manage institutional user accounts, update role permissions, and issue password reset credentials.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section id="features" className="py-24 relative overflow-hidden bg-[#05080e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>Full-Stack Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              Enterprise Features Built for Scale
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mt-3 font-light">
              Engineered with modern full-stack practices: robust relational database schemas, real-time WebSocket event rooms, and cloud file pipelines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            <div className="p-7 rounded-2xl bg-slate-900/40 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Role-Based Access Control</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Strict RBAC authorization logic isolating Student, Supervisor, and Coordinator permissions across API endpoints and database queries.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900/40 border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Socket.io Event Architecture</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Real-time WebSocket event rooms (`user`, `thesis`, `submission`) for instant unread notification badges, status updates, and feedback threads.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900/40 border border-cyan-500/20 hover:border-cyan-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Cloudinary & Google Viewer</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Seamless 25MB document upload handling paired with Google Docs Embedded Viewer for instant in-browser manuscript reading.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 relative bg-gradient-to-b from-[#070b13] to-[#040609] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            Ready to Modernise Your Institution's Thesis Lifecycle?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-light">
            Experience the production-ready academic workflow platform built for higher education.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black font-extrabold text-sm hover:opacity-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:text-white transition-colors"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030508] border-t border-slate-900 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-semibold">ThesisFlow Platform</span>
            <span>•</span>
            <span>Academic Workflow & Review SaaS</span>
          </div>
          <div>
            <span>Developed by Gabriel Odai Afotey</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
