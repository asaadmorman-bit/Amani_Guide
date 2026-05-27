import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TopBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search workflows, templates..."
          className="bg-secondary/50 border-border/50 text-sm h-9 focus-visible:ring-primary/30"
        />
      </div>
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