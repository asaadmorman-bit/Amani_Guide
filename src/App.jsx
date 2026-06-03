import React, { useState, useEffect } from 'react';
import UserHomepage from './pages/UserHomepage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for path modifications inside the Base44 preview panel matrix
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // If path is exactly /homepage, or fallback if on root index
  if (currentPath === '/homepage' || currentPath === '/') {
    return (
      <div className="w-screen min-h-screen bg-slate-950 m-0 p-0 overflow-x-hidden">
        <UserHomepage />
      </div>
    );
  }

  // Fallback default container block for Base44 template views
  return (
    <div className="w-screen min-h-screen bg-slate-950 p-6">
      <UserHomepage />
    </div>
  );
}