import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export default function SlackNode({ id, data }: any) {
  const [channel, setChannel] = useState(data.channel || '#secops-alerts');
  const [message, setMessage] = useState(data.message || 'Workflow finished processing execution.');

  // Bind local state changes back to React Flow's node data object
  data.channel = channel;
  data.message = message;

  return (
    <div className="border border-slate-700 bg-slate-900 rounded-lg p-4 shadow-xl min-w-[250px] text-white">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-fuchsia-500" />
      
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
        <span className="text-xl">💬</span>
        <div>
          <h4 className="font-bold text-sm tracking-wide text-fuchsia-400">SLACK NOTIFIER</h4>
          <p className="text-xs text-slate-500">ID: {id}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Channel</label>
          <input 
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs focus:outline-none focus:border-fuchsia-500 text-slate-200"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Payload Notification</label>
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs focus:outline-none focus:border-fuchsia-500 text-slate-200"
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-fuchsia-500" />
    </div>
  );
}