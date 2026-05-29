// Swap out the relative dot-slash for the template's designated root alias token
import Dashboard from '@/pages/Dashboard';

export default function App() {
  return (
    <div className="w-screen min-h-screen bg-slate-950 m-0 p-0 overflow-x-hidden">
      <Dashboard />
    </div>
  );
}