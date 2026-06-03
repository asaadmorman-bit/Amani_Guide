import { useState, useEffect } from 'react';
import axios from 'axios';
import WorkflowCanvas from '../components/WorkflowCanvas';
import React, { useState, useEffect } from 'react';
// ... any other existing imports at the top of the file ...

// ─── 📡 DYNAMIC CLOUD ENVIRONMENT GATEWAY RESOLUTION ─────────────────
const isProduction = window.location.hostname === 'amaniguide.eds-360.com';

const BACKEND_URL = isProduction 
  ? import.meta.env.VITE_PROD_API_BASE 
  : import.meta.env.VITE_DEV_API_BASE;

const API_BASE = `${BACKEND_URL}/api`;

console.log(`📡 [AMANI CORE] Routing system telemetry straight to gateway: ${API_BASE}`);
// ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  // Your existing dashboard code continues below...

export default function Dashboard() {
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'gallery' | 'canvas'>('gallery');

  // Fetch saved configurations from cloud database simulator
  const loadCloudLibrary = async () => {
    try {
      const response = await axios.get('/api/blueprints');
      if (response.data.blueprints) {
        setBlueprints(response.data.blueprints);
      }
    } catch (err) {
      console.error("Failed to sync client library layout", err);
    }
  };

  useEffect(() => {
    loadCloudLibrary();
  }, [activeView]);

  // ─── CANVAS DESIGNER SURFACE VIEW ─────────────────────────────────
  if (activeView === 'canvas') {
    return (
      <div className="relative w-screen h-screen">
        {/* Pass the close handler cleanly as a React property */}
        <WorkflowCanvas onClose={() => setActiveView('gallery')} />
      </div>
    );
  }

  // ─── LANDING GALLERY EXECUTIVE HUB VIEW ───────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased p-8 selection:bg-indigo-900">
      {/* Dashboard Top Navigation bar layout */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-slate-900 pb-6 mb-10">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Amani Guide Matrix</span>
          <h1 className="text-2xl font-extrabold tracking-tight mt-1 text-white">Automation Hub</h1>
        </div>
        <button
          onClick={() => setActiveView('canvas')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
        >
          ＋ Create Custom Workflow
        </button>
      </div>

      {/* One-Click Template Library Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Recommended Quick-Start Blueprints</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-900 bg-slate-900/40 p-5 rounded-xl hover:border-slate-800 transition-all group">
            <span className="text-2xl block mb-3">🐙</span>
            <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">GitHub Security Digest</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Scans repository package manifests and builds a summary bulletin report.</p>
            <button onClick={() => setActiveView('canvas')} className="mt-4 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer">Deploy Template →</button>
          </div>

          <div className="border border-slate-900 bg-slate-900/40 p-5 rounded-xl hover:border-slate-800 transition-all group">
            <span className="text-2xl block mb-3">💬</span>
            <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">Slack Incident Watcher</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Listens to metric parameters and routes condensed alerts straight to channels.</p>
            <button onClick={() => setActiveView('canvas')} className="mt-4 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer">Deploy Template →</button>
          </div>

          <div className="border border-slate-900 bg-slate-900/40 p-5 rounded-xl hover:border-slate-800 transition-all group">
            <span className="text-2xl block mb-3">🔗</span>
            <h3 className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">Webhook Data Transformer</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Intercepts incoming API structures and converts raw logic with custom AI logic.</p>
            <button onClick={() => setActiveView('canvas')} className="mt-4 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer">Deploy Template →</button>
          </div>
        </div>
      </div>

      {/* Cloud Synchronized Layout Blueprints Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Your Active Automation Blueprints ({blueprints.length})</h2>
        {blueprints.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs font-medium">
            No workflows configured yet. Click "Create Custom Workflow" above to launch the designer grid.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blueprints.map((bp: any) => (
              <div key={bp.id} className="border border-slate-800 bg-slate-900/80 p-5 rounded-xl flex items-center justify-between shadow-md">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{bp.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Cloud Sync Signature ID: {bp.id}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveView('canvas')}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                  >
                    Open Designer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}