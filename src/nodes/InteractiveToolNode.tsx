import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export default memo(({ id, data, isConnectable }: any) => {
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (data.onFieldUpdate) data.onFieldUpdate(id, 'tlsVersion', e.target.value);
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (data.onFieldUpdate) {
      data.onFieldUpdate(id, 'tokenizationFilter', e.target.checked ? 'enabled' : 'disabled');
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-slate-700 p-4 rounded-xl shadow-2xl min-w-[240px] text-left text-white select-none">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} style={{ backgroundColor: '#6366f1' }} />
      
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
        <span className="text-base">🔌</span>
        <div>
          <h4 className="text-xs font-bold tracking-wide text-amber-400 uppercase">Connected App Link</h4>
          <p className="text-[9px] text-slate-500 font-mono">ID: {id}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[9px] font-mono uppercase text-slate-400 mb-1">Transport Security:</label>
          <select 
            value={data.tlsVersion || 'TLS_1_2'} 
            onChange={handleDropdownChange}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded p-1 outline-none cursor-pointer font-medium"
          >
            <option value="TLS_1_2">Stale (TLS 1.2)</option>
            <option value="TLS_1_3">Secure (TLS 1.3)</option>
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="text-[9px] font-mono uppercase text-slate-400">Tokenization Filter:</label>
          <input 
            type="checkbox" 
            checked={data.tokenizationFilter === 'enabled'}
            onChange={handleToggleChange}
            className="w-4 h-4 rounded bg-slate-950 border-slate-800 accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} style={{ backgroundColor: '#6366f1' }} />
    </div>
  );
});