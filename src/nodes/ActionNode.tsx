import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export default function ActionNode({ id, data }: any) {
  const [actionType, setActionType] = useState(data.actionType || 'email');
  const [title, setTitle] = useState(data.title || 'Send Daily Report');
  const [assignee, setAssignee] = useState(data.assignee || 'Ops Team');

  data.actionType = actionType;
  data.title = title;
  data.assignee = assignee;

  return (
    <div className="border border-slate-700 bg-slate-900 rounded-xl p-4 shadow-2xl min-w-[260px] text-white transition-all hover:border-emerald-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-emerald-500" />
      
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
        <span className="text-xl">{actionType === 'email' ? '📬' : '📝'}</span>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">User Action Desk</h4>
          <p className="text-[10px] text-slate-500">Handles tasks, assignments & email</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Function</label>
          <select 
            value={actionType} 
            onChange={(e) => setActionType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="email">📬 Send Automated Email</option>
            <option value="task">📝 Create System Task</option>
            <option value="assignment">🎓 Homework / Assignment Helper</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Subject / Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500" 
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Assignee / Owner</label>
          <input 
            type="text" 
            value={assignee} 
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500" 
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-emerald-500" />
    </div>
  );
}