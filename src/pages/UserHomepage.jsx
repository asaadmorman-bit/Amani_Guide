import React, { useState } from 'react';

export default function UserHomepage() {
  // Catch incoming tokens straight from the OAuth redirect parameters
  const urlParams = new URLSearchParams(window.location.search);
  const provider = urlParams.get('provider');
  const token = urlParams.get('token');

  const [userProfile] = useState({
    username: 'professor_amani',
    role: 'Academic_Faculty',
    backgroundField: 'Computer Science',
    isMfaActive: true
  });

  const [blueprints] = useState([
    { id: 'bp_1', name: 'Academic_Grades_v1', status: 'SYNCHRONIZED', date: '2026-06-02' },
    { id: 'bp_2', name: 'Canvas_Sync_Pipeline', status: 'PAUSED_HITL', date: '2026-06-03' }
  ]);

  const [announcements] = useState([
    { id: 1, tag: 'SECURITY', title: 'Zero-Trust Protocol Enforced Globally', desc: 'All administrative and pipeline execution endpoints now require physical security token confirmation.' },
    { id: 2, tag: 'SYSTEM', title: 'PGlite WebAssembly Engine Upgraded', desc: 'Localized database transaction performance optimized for real-time edge processing nodes.' }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-900">
      
      {/* 🧭 Top Navigation Array */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 rounded-full bg-cyan-400"></div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-100">
            AMANI // <span className="text-cyan-400 font-medium">WORKSPACE CORE</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400">
            {userProfile.role}
          </span>
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-slate-950 font-mono">
            PA
          </div>
        </div>
      </header>

      {/* 🏠 Main Dashboard Content Structure */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 📋 Left Column: User Space & Active Pipelines */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 👋 Welcome Banner */}
          <section className="bg-gradient-to-r from-slate-900 to-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-32 h-32 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 16h-2v2h2v-2zm0-6h-2v4h2v-4z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Welcome back, <span className="text-cyan-400 font-mono">@{userProfile.username}</span></h2>
              <p className="text-sm text-slate-400 max-w-xl">
                Your orchestrator grid is secure. All runtime execution pipelines are isolated behind live posture validation gates.
              </p>
            </div>
          </section>

          {/* 🚀 Personal Automation Blueprints Ledger */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">My Automation Blueprints</h3>
              <button className="text-xs bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-1.5 px-3 rounded transition tracking-wide cursor-pointer">
                + Deploy New YAML
              </button>
            </div>
            <div className="divide-y divide-slate-800/60">
              {blueprints.map((bp) => (
                <div key={bp.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="font-mono text-sm font-medium text-slate-200">{bp.name}</div>
                    <div className="text-xs text-slate-500">Last synchronized: {bp.date}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium border ${
                    bp.status === 'SYNCHRONIZED' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                  }`}>
                    {bp.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 📰 Interactive Community & News Matrix */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4">Security Notices & Network Feed</h3>
            <div className="space-y-4">
              {announcements.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      item.tag === 'SECURITY' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 🛡️ Right Column: Biometrics, IoT Status, & Hardware Keys */}
        <div className="space-y-6">
          
          {/* ❤️ Biometric Snapshot Panel */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4">Biometric Strain Index</h3>
            
            {!token ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pair your secure operational workspace with live telemetry updates to gate your pipeline autonomies against stress spikes:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <a href="/api/auth/oura" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded transition text-center block tracking-wide">
                    🦪 Connect Oura Ring Account
                  </a>
                  <a href="/api/auth/whoop" className="bg-slate-100 hover:bg-slate-200 text-slate-950 font-bold text-xs py-2.5 px-4 rounded transition text-center block tracking-wide">
                    🚀 Connect WHOOP Strap Account
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 border border-slate-800/80 rounded-lg">
                    <div className="text-[10px] text-slate-500 font-medium uppercase">HRV Status</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">64 <span className="text-xs text-slate-500 font-normal">ms</span></div>
                  </div>
                  <div className="bg-slate-950 p-3 border border-slate-800/80 rounded-lg">
                    <div className="text-[10px] text-slate-500 font-medium uppercase">Resting HR</div>
                    <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">62 <span className="text-xs text-slate-500 font-normal">bpm</span></div>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Stream: <span className="font-mono text-cyan-400 uppercase font-bold">{provider}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PACING_NORMAL
                  </span>
                </div>
                
                <div className="text-[10px] text-slate-500 font-mono overflow-hidden text-ellipsis whitespace-nowrap bg-slate-950/40 p-2 rounded border border-slate-800/40">
                  Token: {token}
                </div>
              </div>
            )}
          </section>

          {/* 🔑 Cryptographic Hardware Keys Keyring */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-3">Hardware Security Keys</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🛡️</span>
                  <div className="font-mono text-slate-300">Yubikey 5C NFC</div>
                </div>
                <span className="text-emerald-400 text-[10px] font-mono font-bold uppercase">Linked</span>
              </div>
              
              {userProfile.isMfaActive ? (
                <div className="text-[11px] text-emerald-500 bg-emerald-950/10 border border-emerald-900/30 p-2.5 rounded text-center font-medium leading-normal">
                  ✓ FIDO2 Hardware enforcement enabled for all pipeline release scripts.
                </div>
              ) : (
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2 px-4 rounded border border-slate-700 transition cursor-pointer">
                  Register Token Key
                </button>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}