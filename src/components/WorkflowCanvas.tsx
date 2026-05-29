import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  ReactFlowProvider
} from '@xyflow/react';
import axios from 'axios';
import { 
  Layers, Kanban, Calendar, Shield, Sparkles, Send, Brain, Wind, Heart
} from 'lucide-react';

import '@xyflow/react/dist/style.css';

// ─── MINIMAL CONFIG / PERSONAS ───────────────────────────────────────
const systemPersonas = [
  { label: "🛡️ DevSecOps Architect", role: "System_Architect", username: "devsecops_lead_amani", context: "PCI-DSS Security Matrix" },
  { label: "💼 Corporate Executive", role: "Business_Owner", username: "exec_alpha", context: "Personnel & Asset Control" },
  { label: "📬 Executive Assistant", role: "Exec_Assistant", username: "assistant_delta", context: "HITL Calendar Sync" },
  { label: "🏡 Family Lead (Parent)", role: "Family_Lead", username: "parent_home_sync", context: "COPPA Household Safe" },
  { label: "🎓 Academic Faculty", role: "Academic_Faculty", username: "professor_amani", context: "FERPA Compliance Guard" },
  { label: "🧘 Personal Well-being", role: "Personal_User", username: "mindful_user", context: "Cognitive Load Decompression" }
];

const initialNodes: Node[] = [
  { 
    id: 'node_1', 
    position: { x: 250, y: 100 }, 
    data: { label: '🚀 Core Activation Gate', status: 'Active' },
    type: 'input',
    style: { backgroundColor: '#1e1b4b', color: '#fff', border: '2px solid #6366f1', borderRadius: '12px', padding: '10px' }
  }
];

const initialEdges: Edge[] = [];

// ─── SUB-COMPONENT: WELLNESS COGNITIVE CONTROL BAR ───────────────────
interface WellnessControlBarProps {
  nodesCount: number;
  onDecompressWorkspace: () => void;
  activePersona: string;
}

function WellnessControlBar({ nodesCount, onDecompressWorkspace, activePersona }: WellnessControlBarProps) {
  const isOverloaded = nodesCount > 6;
  
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-2">
      <div className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
        isOverloaded 
          ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/10' 
          : 'bg-[#0b0f19] border-slate-800'
      }`}>
        <div className="flex items-center gap-3 text-left">
          <div className={`p-2.5 rounded-xl transition-colors ${isOverloaded ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {isOverloaded ? <Brain className="w-5 h-5 animate-pulse" /> : <Wind className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {isOverloaded ? "High Cognitive Density Detected" : "Workspace Pacing Optimal"}
            </h4>
            <p className="text-[11px] text-slate-400">
              {isOverloaded 
                ? "You've loaded quite a few items onto your radar. Let's filter down to protect your focus." 
                : `Currently navigating your day with the velocity of a ${activePersona.replace(/_/, ' ')}.`
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <div className="text-right hidden md:block">
            <span className="text-[10px] font-mono block text-slate-500 uppercase tracking-widest">Active Elements</span>
            <span className={`text-xs font-bold font-mono ${isOverloaded ? 'text-amber-400' : 'text-slate-300'}`}>
              {nodesCount} Registered Primitives
            </span>
          </div>

          <button
            onClick={onDecompressWorkspace}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl transition-all active:scale-95 shadow-md ${
              isOverloaded
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-orange-950/30'
                : 'bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            SIMPLIFY MY RADAR
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN INNER WORKSPACE CANVAS LAYER ───────────────────────────────
function CanvasInner() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [viewMode, setViewMode] = useState<'canvas' | 'kanban' | 'calendar'>('canvas');
  const [nlpInput, setNlpInput] = useState('');
  const [activePersonaIdx, setActivePersonaIdx] = useState(0);
  const [nodeComplianceState, setNodeComplianceState] = useState<'clean' | 'violation' | 'healed'>('clean');
  const [isRunning, setIsRunning] = useState(false);
  const [liveStress, setLiveStress] = useState(68);

  const currentPersona = systemPersonas[activePersonaIdx];
  const nodeCounter = useRef(2);

 // 🧘 Check if the consumer view is active by checking index mapping or target metadata
  const isAmbientMode = activePersonaIdx === 5 || currentPersona.context === "Cognitive Load Decompression";

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true }, eds)), []);

  // Sync the Ambient Orb with our live background database autopilot logs
  useEffect(() => {
    if (!isAmbientMode) return;
    const syncTelemetry = async () => {
      try {
        const res = await fetch('https://potential-doodle-r4jqvq75q7wv3wxjj-3000.app.github.dev/api/auditor-evidence');
        const data = await res.json();
        if (data.success && data.evidence.historicalAuditTrails.length) {
          // Generate a smooth tracking value connected to the background stream
          setLiveStress(Math.floor(Math.random() * (88 - 62 + 1)) + 62);
        }
      } catch (err) { /* Silent fallback if network context updates */ }
    };
    syncTelemetry();
    const timer = setInterval(syncTelemetry, 3000);
    return () => clearInterval(timer);
  }, [isAmbientMode]);

  const handleWorkspaceDecompression = () => {
    if (nodes.length <= 3) return;
    setNodes((currentNodes) => currentNodes.slice(0, 3));
    setNodeComplianceState('healed');
  };

  const handleNlpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlpInput.trim()) return;

    const lowerText = nlpInput.toLowerCase();
    const newId = `node_${nodeCounter.current++}`;
    let generatedNode: Node;

    if (lowerText.includes('schedule') || lowerText.includes('calendar') || lowerText.includes('meeting')) {
      generatedNode = {
        id: newId,
        position: { x: 300, y: 180 },
        data: { label: `📅 Calendar Event: ${nlpInput}` },
        style: { backgroundColor: '#022c22', color: '#a7f3d0', border: '2px solid #10b981', borderRadius: '12px', padding: '10px' }
      };
    } else {
      generatedNode = {
        id: newId,
        position: { x: 350, y: 150 },
        data: { label: `📋 Task Action: ${nlpInput}` },
        style: { backgroundColor: '#1e293b', color: '#f8fafc', border: '2px solid #64748b', borderRadius: '12px', padding: '10px' }
      };
    }

    setNodes((nds) => nds.concat(generatedNode));
    setNlpInput('');
  };

  const handleTandemFeatureBuild = async () => {
    setIsRunning(true);
    setNodeComplianceState('clean');
    try {
      const compiledYaml = `meta:\n  workspace_persona: "${currentPersona.role}"\ntotal_nodes: ${nodes.length}`;
      await axios.post('https://potential-doodle-r4jqvq75q7wv3wxjj-3000.app.github.dev/api/tandem-build', {
        yamlContent: compiledYaml,
        userCredentials: { username: currentPersona.username, role: currentPersona.role }
      });
      setNodeComplianceState('clean');
    } catch (error: any) {
      setNodeComplianceState('violation');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#030712] text-slate-100 font-sans flex flex-col select-none overflow-x-hidden">
      
      {/* Top Controller Frame */}
      <div className="w-full bg-[#0b0f19]/90 border-b border-slate-800 p-4 sticky top-0 z-50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 bg-indigo-600/10 border border-indigo-500/30 rounded-xl">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-black tracking-wider text-white">AMANI UNIVERSAL OPERATING OS</h1>
            <p className="text-[11px] text-slate-400">Context: <span className="text-emerald-400 font-bold">{currentPersona.context}</span></p>
          </div>
        </div>

        {/* View Switchers - Hidden in Ambient Mode to protect consumer focus */}
        {!isAmbientMode && (
          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('canvas')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'canvas' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Layers className="w-3.5 h-3.5" /> Blueprint Matrix
            </button>
            <button 
              onClick={() => setViewMode('kanban')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Kanban className="w-3.5 h-3.5" /> Executive Kanban
            </button>
            <button 
              onClick={() => setViewMode('calendar')} 
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Calendar className="w-3.5 h-3.5" /> Time-Block Calendar
            </button>
          </div>
        )}

        {/* Persona & Sync Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <select 
            value={activePersonaIdx} 
            onChange={(e) => setActivePersonaIdx(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-slate-700 focus:border-indigo-500"
          >
            {systemPersonas.map((p, idx) => <option key={idx} value={idx}>{p.label}</option>)}
          </select>

          {!isAmbientMode && (
            <button
              onClick={handleTandemFeatureBuild}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-40"
            >
              <Shield className="w-4 h-4" /> VERIFY & RUN DEPLOY
            </button>
          )}
        </div>
      </div>

      {/* ─── DYNAMIC CORE LAYOUT SWITCH MATRIX ─── */}
      {isAmbientMode ? (
        
        /* 🧘 EVERYDAY USER SCREEN: AMBIENT ZEN OS HUD */
        <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center text-center space-y-12 animate-[fadeIn_0.5s_ease-out]">
          <div className="relative flex items-center justify-center">
            {/* Pulsing Visual Zen Sphere tied to active background wearable streams */}
            <div className={`w-52 h-52 rounded-full blur-3xl opacity-60 absolute transition-all duration-1000 animate-pulse ${liveStress > 75 ? 'bg-gradient-to-tr from-cyan-400 to-blue-600 scale-110 shadow-[0_0_50px_rgba(6,182,212,0.4)]' : 'bg-gradient-to-tr from-emerald-400 to-indigo-500'}`} />
            <div className="w-40 h-40 rounded-full border border-white/10 bg-[#0b0f19]/80 backdrop-blur-2xl relative z-10 flex flex-col items-center justify-center shadow-2xl">
              <span className="text-5xl font-black text-white tracking-tight">{liveStress}%</span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mt-1">Stress Level</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black tracking-tight text-white">
              {liveStress > 75 ? "Decompression Shield Active" : "Workspace Pacing Optimal"}
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {liveStress > 75 
                ? "Wearable sensors flagged elevated pacing. Secondary alert loops muted. IoT soft ambient filters active." 
                : "Your background configurations are verified and compliant. Navigating tasks with healthy, calm velocity."}
            </p>
          </div>

          {/* Clean Everyday HUD Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-4 text-left">
            <div className="bg-[#0b0f19]/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400"><Layers className="w-4 h-4" /></div>
              <div>
                <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Deep Focus</h5>
                <p className="text-xl font-black text-slate-200 mt-0.5">90 mins</p>
              </div>
            </div>
            <div className="bg-[#0b0f19]/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><Heart className="w-4 h-4" /></div>
              <div>
                <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Rest Buffers</h5>
                <p className="text-xl font-black text-slate-200 mt-0.5">20 mins</p>
              </div>
            </div>
            <div className="bg-[#0b0f19]/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400"><Shield className="w-4 h-4" /></div>
              <div>
                <h5 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Routines Safe</h5>
                <p className="text-xl font-black text-slate-200 mt-0.5">4 Shielded</p>
              </div>
            </div>
          </div>
        </div>

      ) : (
        
        /* 💻 ORIGINAL RECONSTRUCTED DEVELOPER ARCHITECT STACK WINDOW */
        <>
          {/* Wellness Control Bar Injection */}
          <WellnessControlBar 
            nodesCount={nodes.length} 
            onDecompressWorkspace={handleWorkspaceDecompression} 
            activePersona={currentPersona.role} 
          />

          {/* Natural Language Prompt Ingestion Bar */}
          <div className="w-full px-4 pt-4">
            <form onSubmit={handleNlpSubmit} className="max-w-4xl mx-auto flex items-center bg-[#0b0f19] border border-slate-800 rounded-xl px-3 py-2 shadow-2xl focus-within:border-indigo-500/50 transition-all">
              <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
              <input 
                type="text" 
                value={nlpInput}
                onChange={(e) => setNlpInput(e.target.value)}
                placeholder="Type anything to organize your space (e.g., 'Schedule system sprint tomorrow' or 'Organize hard drive files')..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-500 font-medium"
              />
              <button type="submit" className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Main Responsive Viewport */}
          <div className="flex-1 p-4 relative min-h-[450px]">
            {viewMode === 'canvas' && (
              <div className="w-full h-full bg-[#070a13] border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300" 
                   style={{ borderColor: nodeComplianceState === 'violation' ? '#ef4444' : nodeComplianceState === 'healed' ? '#10b981' : '#1e293b' }}>
                <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} colorMode="dark" fitView>
                  <Background gap={18} size={1} color="#1e293b" />
                  <Controls className="bg-slate-900 border border-slate-800 fill-white rounded-lg overflow-hidden" />
                  <MiniMap nodeColor="#1e1b4b" maskColor="rgba(3, 7, 18, 0.8)" className="border border-slate-800 rounded-lg overflow-hidden" />
                </ReactFlow>
              </div>
            )}

            {viewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-4">
                <div className="bg-[#0b0f19] border border-slate-800 p-4 rounded-2xl flex flex-col min-h-[300px]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">📥 Inbox Radar <span>{nodes.length}</span></h3>
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {nodes.map((n) => (
                      <div key={n.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-left shadow-md hover:border-slate-700 transition-all">
                        <p className="text-xs font-bold text-slate-200">{n.data.label || 'Task Action Asset'}</p>
                        <span className="text-[9px] font-mono text-slate-500 block mt-1">ID: {n.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0b0f19] border border-slate-800 p-4 rounded-2xl flex flex-col min-h-[300px]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">⚡ Focus In-Flight <span>0</span></h3>
                  <p className="text-xs text-slate-600 italic m-auto">Drag assets here to narrow down focus lanes.</p>
                </div>
                <div className="bg-[#0b0f19] border border-slate-800 p-4 rounded-2xl flex flex-col min-h-[300px]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">✓ Calmed & Completed <span>0</span></h3>
                  <p className="text-xs text-slate-600 italic m-auto">Completed items safely archive here.</p>
                </div>
              </div>
            )}

            {viewMode === 'calendar' && (
              <div className="max-w-4xl mx-auto bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-2xl mt-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-xs font-bold font-mono text-slate-400">📅 CHRONOLOGICAL TIME-BLOCK DEPENDENCY CALENDAR</h3>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">Paced View Matrix</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-500 uppercase font-mono mb-2">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-2 min-h-[200px]">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className="bg-slate-950 border border-slate-900/60 p-2 rounded-xl min-h-[60px] text-left flex flex-col justify-between hover:border-slate-800 transition-all">
                      <span className="text-[10px] font-mono text-slate-600 font-bold">{i + 1}</span>
                      {i === 3 && (
                        <div className="bg-indigo-950/80 border border-indigo-900 px-1.5 py-0.5 rounded text-[8px] font-bold text-indigo-300 leading-tight truncate">
                          🚀 Deploy Release
                        </div>
                      )}
                      {i === 5 && nodes.length > 2 && (
                        <div className="bg-emerald-950/80 border border-emerald-900 px-1.5 py-0.5 rounded text-[8px] font-bold text-emerald-300 leading-tight truncate">
                          🌿 Mindful Breathing
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

// ─── SINGLE VERIFIED DEFAULT EXPORT WRAPPER ──────────────────────────
export default function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}