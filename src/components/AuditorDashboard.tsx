import ReactMarkdown from 'react-markdown';

interface LogEntry {
  event: string;
  timestamp: string;
  operator: string;
  role: string;
  status: string;
  specIntegrityHash?: string;
}

export interface AuditorDashboardProps {
  logs: LogEntry[];
}

export default function AuditorDashboard({ logs }: AuditorDashboardProps) {
  const totalChecks = logs.length;
  const violationIntercepts = logs.filter(l => l.status === 'BLOCKED_VIOLATION' || l.event.includes('BLOCKED')).length;
  const healthIndex = totalChecks > 0 ? Math.round(((totalChecks - violationIntercepts) / totalChecks) * 100) : 100;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-2xl text-left text-white mt-6 mb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h2 className="text-base font-bold tracking-wider font-mono text-indigo-400">🛡️ SYSTEM RISK & COMPLIANCE REGISTRY</h2>
          <p className="text-[11px] text-slate-400">Continuous Control Monitoring Dashboard (PCI-DSS v4.0 / SOC 2 Type II / FERPA / COPPA)</p>
        </div>
        <span className="text-[10px] font-mono uppercase bg-slate-950 text-slate-500 border border-slate-800 px-2 py-1 rounded">Live Audit Feed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block">Framework Health Index</span>
          <span className={`text-2xl font-black font-mono tracking-tight block mt-1 ${healthIndex > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{healthIndex}% SECURE</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block">Total Operational Checks</span>
          <span className="text-2xl font-black font-mono tracking-tight text-indigo-400 block mt-1">{totalChecks} Verified</span>
        </div>
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block">Intercepted Drift Blocks</span>
          <span className="text-2xl font-black font-mono tracking-tight text-rose-500 block mt-1">{violationIntercepts} Closed</span>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Evidence Ledger Trails</h3>
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-[11px] font-mono">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[9px]">
                <th className="p-2.5">Telemetry Event</th>
                <th className="p-2.5">Actor Operator</th>
                <th className="p-2.5">Tenant Persona Context</th>
                <th className="p-2.5">System Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-slate-300">
              {logs.length > 0 ? (
                logs.slice(-4).reverse().map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/30">
                    <td className="p-2.5 font-bold text-indigo-400">{entry.event}</td>
                    <td className="p-2.5">{entry.operator || entry.authorized_by || 'system_worker'}</td>
                    <td className="p-2.5 text-slate-400">{entry.role || 'System_Architect'}</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${entry.status === 'COMPLIANT_SUCCESS' || !entry.status ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-rose-950 text-rose-400 border border-rose-900'}`}>
                        {entry.status || 'SUCCESS'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-500 italic">No real-time audit logs processed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}