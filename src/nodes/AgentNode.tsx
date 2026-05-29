import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useState } from 'react';

export default function AgentNode({ id, data }: any) {
  const [tier, setTier] = useState(data.model === 'llama-3.3-70b-versatile' ? 'quality' : 'speed');
  const [role, setRole] = useState(data.role || 'Summarize the data into clear bullet points.');
  const [execMode, setExecMode] = useState(data.executionMode || 'semi_autonomous');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { setNodes } = useReactFlow();

  const updateGlobalNodeData = (updatedFields: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...updatedFields } } : node))
    );
  };

  const handleTierChange = (newTier: 'speed' | 'quality') => {
    setTier(newTier);
    const modelString = newTier === 'quality' ? 'llama-3.3-70b-versatile' : 'llama-3.1-8b-instant';
    data.model = modelString;
    updateGlobalNodeData({ model: modelString });
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    data.role = newRole;
    updateGlobalNodeData({ role: newRole });
  };

  const handleExecModeChange = (mode: string) => {
    setExecMode(mode);
    data.executionMode = mode;
    updateGlobalNodeData({ executionMode: mode });
  };

  return (
    <div className="border border-slate-700 bg-slate-900 rounded-xl p-4 shadow-2xl min-w-[280px] text-white transition-all hover:border-indigo-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-indigo-500" />
      
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
        <span className="text-xl">🛡️</span>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400">Governed AI Assistant</h4>
          <p className="text-[10px] text-slate-500">Bound by SOC2 / CMMC Guardrails</p>
        </div>
      </div>

      <div className="space-y-3.5 text-left">
        {/* Simple Priority Choice Selector */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Compute Priority</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => handleTierChange('speed')}
              className={`py-1 text-center font-bold text-[10px] rounded transition-all cursor-pointer ${
                tier === 'speed' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Fast Speed
            </button>
            <button
              type="button"
              onClick={() => handleTierChange('quality')}
              className={`py-1 text-center font-bold text-[10px] rounded transition-all cursor-pointer ${
                tier === 'quality' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧠 Deep Quality
            </button>
          </div>
        </div>

        {/* New Autonomy & Policy Boundaries Section */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Governance Mode</label>
          <select
            value={execMode}
            onChange={(e) => handleExecModeChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="manual">Manual Execution Only</option>
            <option value="semi_autonomous">Semi-Autonomous (HITL Gate)</option>
            <option value="autonomous">Fully Autonomous (Warning)</option>
          </select>
        </div>

        {/* Plain-English Persona Instruction Input */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Agent Assignment Objective</label>
          <textarea 
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            rows={2}
            placeholder="e.g., Read this infrastructure data and audit security parameters."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-200 resize-none placeholder-slate-600 font-medium"
          />
        </div>

        {/* Compliance Metadata Expansion Accordion */}
        <div className="pt-1 border-t border-slate-800/60">
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[9px] font-bold text-slate-500 hover:text-slate-400 tracking-wider uppercase flex items-center justify-between w-full cursor-pointer"
          >
            {showAdvanced ? 'Hide Governance Audits ▲' : 'Show Governance Audits ▼'}
          </button>
          {showAdvanced && (
            <div className="mt-2 bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[9px] text-slate-400 space-y-1 select-text">
              <p>Security Classification: <span className="text-amber-500">SECRET // CMMC L3</span></p>
              <p>Data Sovereignty Bound: <span className="text-slate-300">US-EAST-1 (ITAR)</span></p>
              <p>Audit Logging: <span className="text-emerald-500">Immutable Cryptographic Active</span></p>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-indigo-500" />
    </div>
  );
}