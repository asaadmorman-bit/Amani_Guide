import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Router, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import GatewayCard from '../components/gateways/GatewayCard';

export default function Gateways() {
  const [showAdd, setShowAdd] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: gateways = [], isLoading } = useQuery({
    queryKey: ['gateways', user?.email],
    queryFn: () => base44.entities.Connected_Gateway.filter({ user_id: user?.email }, '-last_ping'),
    enabled: !!user?.email,
  });

  const createMutation = useMutation({
    mutationFn: () => base44.entities.Connected_Gateway.create({
      user_id: user.email,
      device_name: deviceName.trim(),
      status: 'offline',
      last_ping: new Date().toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gateways'] });
      toast.success('Gateway registered');
      setDeviceName('');
      setShowAdd(false);
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground tracking-tight">Gateways</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor your connected local AI instances</p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="bg-primary text-primary-foreground font-mono text-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Register Gateway
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-8 pb-6 border-b border-border">
        <div>
          <span className="text-2xl font-mono font-bold text-foreground">{gateways.length}</span>
          <span className="text-xs text-muted-foreground ml-2">Total</span>
        </div>
        <div>
          <span className="text-2xl font-mono font-bold text-chart-2">{gateways.filter(g => g.status === 'online').length}</span>
          <span className="text-xs text-muted-foreground ml-2">Online</span>
        </div>
        <div>
          <span className="text-2xl font-mono font-bold text-muted-foreground">{gateways.filter(g => g.status === 'offline').length}</span>
          <span className="text-xs text-muted-foreground ml-2">Offline</span>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : gateways.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Router className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-mono font-semibold text-foreground mb-1">No gateways connected</h3>
          <p className="text-sm text-muted-foreground mb-4">Register your first local AI instance</p>
          <Button onClick={() => setShowAdd(true)} className="bg-primary text-primary-foreground font-mono text-sm gap-2">
            <Plus className="w-4 h-4" />
            Register Gateway
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {gateways.map((gw, i) => (
            <GatewayCard key={gw.id} gateway={gw} index={i} />
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-foreground">Register Gateway</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground font-mono">DEVICE NAME</Label>
              <Input
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g., Home Lab Server"
                className="bg-secondary/50 border-border font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)} className="border-border text-muted-foreground">
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={!deviceName.trim() || createMutation.isPending}
              className="bg-primary text-primary-foreground"
            >
              {createMutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}