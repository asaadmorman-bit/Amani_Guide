import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export default function ToolNode({ id, data }: any) {
  const [toolType, setToolType] = useState(data.toolType || 'github_api_reader');
  const [description, setDescription] = useState(data.description || 'Gathers active repository metrics.');

  data.toolType = toolType;
  data.description = description;

  // Clean friendly names for our list options
  const appMeta: Record<string, { title: string; icon: string }> = {
    github_api_reader: { title: 'GitHub Repository Data', icon: '🐙' },
    slack_notifier: { title: 'Slack Messaging Channel', icon: '💬' },
    custom_webhook: { title: 'Custom App Webhook (HTTP)', icon: '🔗' }
  };

  return (
    <div className="border border-slate-700 bg-slate-900 rounded-xl p-4 shadow-2xl min-w-[260px] text-white transition-all hover:border-amber-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-amber-500" />
      
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
        <span className="text-xl">{appMeta[toolType]?.icon || '🔌'}</span>
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">Connected App Source</h4>
          <p className="text-[10px] text-slate-500">Brings external live information in</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Application</label>
          <select 
            value={toolType}
            onChange={(e) => setToolType(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200 cursor-pointer font-medium"
          >
            <option value="github_api_reader">🐙 GitHub Repository Reader</option>
            <option value="slack_notifier">💬 Slack Notifier</option>
            <option value="custom_webhook">🔗 Custom App HTTP Webhook</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Purpose Note</label>
          <input 
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what data this should focus on"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500 text-slate-200 font-medium placeholder-slate-600"
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-amber-500" />
    </div>
  );
}