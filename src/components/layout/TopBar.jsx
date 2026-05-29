import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, Search, Sparkles, Terminal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useViewMode } from '../context/ViewContext'; // 🧠 Adjust this path to find your context file!

export default function TopBar() {
  const [user, setUser] = useState(null);
  const { isAmbientMode, setIsAmbientMode } = useViewMode(); // ✨ Connect to global layout state

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 z-40 relative">
      
      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xs">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search space..."
          className="bg-secondary/50 border-border/50 text-sm h-9 focus-visible:ring-primary/30"
        />
      </div>

      {/* 🧘 THE DUAL-MODE SELECTOR PILL SWITCH */}
      <div className="flex items-center bg-secondary/80 p-1 rounded-full border border-border/40 shadow-inner">
        <button 
          onClick={() => setIsAmbientMode(true)}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-300 ${isAmbientMode ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Everyday Mode</span>
        </button>
        <button 
          onClick={() => setIsAmbientMode(false)}
          className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full transition-all duration-300 ${!isAmbientMode ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Terminal className="w-3 h-3" />
          <span>DevSecOps Architect</span>
        </button>
      </div>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-mono">
              {initials}
            </AvatarFallback>
          </Avatar>
          {user && (
            <span className="text-sm text-muted-foreground hidden md:block">{user.full_name}</span>
          )}
        </div>
      </div>

    </header>
  );
}