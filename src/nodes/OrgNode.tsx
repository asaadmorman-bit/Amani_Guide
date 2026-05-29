import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export default function OrgNode({ id, data }: any) {
  const [roleTitle, setRoleTitle] = useState(data.roleTitle || 'Security Analyst');
  const [dept, setDept] = useState(data.dept || 'SecOps');
  const [responsibilities, setResponsibilities] = useState(data.responsibilities || 'Monitor repository health alerts.');

  data.roleTitle = roleTitle;
  data.dept = dept;
  data.responsibilities = responsibilities;

  return (
    <div className="border border-slate-700 bg-slate-900 rounded-xl p-4 shadow-2xl min-w-[260px] text-white transition-all hover:border-cyan-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-cyan-500" />
      
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
        <span className="text-xl">🏢</span>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-400">Organization & Roles</h4>
          <p className="text-[10px] text-slate-500">Maps out company responsibilities</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Official Role</label>
            <input 
              type="text" 
              value={roleTitle} 
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" 
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Department</label>
            <input 
              type="text" 
              value={dept} 
              onChange={(e) => setDept(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Key Responsibilities</label>
          <textarea 
            value={responsibilities} 
            onChange={(e) => setResponsibilities(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none" 
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-cyan-500" />
    </div>
  );
}