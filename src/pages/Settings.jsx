import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Shield, Key, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card className="bg-card border-border mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-foreground">
            <User className="w-4 h-4 text-primary" />
            PROFILE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-mono">NAME</Label>
            <Input
              value={user?.full_name || ''}
              readOnly
              className="bg-secondary/50 border-border font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-mono">EMAIL</Label>
            <Input
              value={user?.email || ''}
              readOnly
              className="bg-secondary/50 border-border font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-mono">ROLE</Label>
            <div>
              <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary">
                <Shield className="w-3 h-3 mr-1" />
                {user?.role || 'user'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Key placeholder */}
      <Card className="bg-card border-border mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-mono flex items-center gap-2 text-foreground">
            <Key className="w-4 h-4 text-chart-4" />
            API ACCESS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Use API keys to connect your local AI OS instance to Control Room.
          </p>
          <div className="flex items-center gap-2">
            <Input
              value="cr_••••••••••••••••"
              readOnly
              className="bg-secondary/50 border-border font-mono text-sm"
            />
            <Button variant="outline" size="sm" className="border-border text-muted-foreground font-mono text-xs flex-shrink-0">
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6 bg-border" />

      {/* Logout */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="border-destructive/30 text-destructive hover:bg-destructive/10 font-mono text-sm gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
}