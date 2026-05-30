import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadialBarChart, RadialBar, PieChart, Pie, Legend
} from 'recharts';
import { format, subHours, isAfter } from 'date-fns';
import { Activity, Wifi, WifiOff, Clock, TrendingUp } from 'lucide-react';

// ── Custom tooltip for the ping history bar chart ──────────────────────────
function PingTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="text-primary">{payload[0].value} devices pinged</p>
    </div>
  );
}

// ── Custom tooltip for the activity bar chart ──────────────────────────────
function ActivityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-foreground font-semibold truncate max-w-[140px]">{label}</p>
      <p className="text-chart-2 mt-0.5">Activity: {payload[0].value}%</p>
    </div>
  );
}

export default function GatewayDashboard({ gateways }) {
  const onlineCount  = gateways.filter(g => g.status === 'online').length;
  const offlineCount = gateways.filter(g => g.status === 'offline').length;

  // ── Ping history: bucket last 12 hours into 2-hour windows ────────────────
  const pingHistory = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }, (_, i) => {
      const from = subHours(now, (5 - i + 1) * 2);
      const to   = subHours(now, (5 - i) * 2);
      const label = format(to, 'HH:mm');
      const count = gateways.filter(g => {
        if (!g.last_ping) return false;
        const t = new Date(g.last_ping);
        return isAfter(t, from) && !isAfter(t, to);
      }).length;
      return { label, count };
    });
    return buckets;
  }, [gateways]);

  // ── Per-device activity level (simulated from last_ping recency) ──────────
  const activityData = useMemo(() => {
    const now = new Date();
    return gateways.map(g => {
      let activity = 0;
      if (g.status === 'online') {
        if (g.last_ping) {
          const minutesAgo = (now - new Date(g.last_ping)) / 60000;
          activity = Math.max(0, Math.round(100 - minutesAgo * 0.5));
        } else {
          activity = 85;
        }
      }
      return {
        name: g.device_name.length > 14 ? g.device_name.slice(0, 12) + '…' : g.device_name,
        activity,
        isOnline: g.status === 'online',
      };
    });
  }, [gateways]);

  // ── Donut data for status split ────────────────────────────────────────────
  const statusData = [
    { name: 'Online',  value: onlineCount,  fill: 'hsl(var(--chart-2))' },
    { name: 'Offline', value: offlineCount, fill: 'hsl(var(--muted))' },
  ].filter(d => d.value > 0);

  if (gateways.length === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      {/* ── Row 1: KPI cards + donut ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">Total Devices</p>
            <p className="text-3xl font-mono font-bold text-foreground">{gateways.length}</p>
          </CardContent>
        </Card>

        {/* Online */}
        <Card className="bg-card border-chart-2/20">
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-chart-2 to-transparent" />
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">Online</p>
            <p className="text-3xl font-mono font-bold text-chart-2">{onlineCount}</p>
          </CardContent>
        </Card>

        {/* Offline */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">Offline</p>
            <p className="text-3xl font-mono font-bold text-muted-foreground">{offlineCount}</p>
          </CardContent>
        </Card>

        {/* Uptime % */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">Uptime</p>
            <p className="text-3xl font-mono font-bold text-primary">
              {gateways.length > 0 ? Math.round((onlineCount / gateways.length) * 100) : 0}
              <span className="text-base font-normal text-muted-foreground">%</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Charts ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ping History (2/3 width) */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Ping Activity — Last 12 Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={pingHistory} barSize={28}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                  width={20}
                />
                <Tooltip content={<PingTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {pingHistory.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.count > 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'}
                      opacity={entry.count > 0 ? 1 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status donut (1/3 width) */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-chart-2" />
              Status Split
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={55}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-chart-2 inline-block" />
                <span className="text-[10px] font-mono text-muted-foreground">Online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted inline-block" />
                <span className="text-[10px] font-mono text-muted-foreground">Offline</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Per-device activity bar chart ─────────────────────────── */}
      {activityData.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-accent" />
              Device Activity Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={Math.max(100, activityData.length * 36)}>
              <BarChart data={activityData} layout="vertical" barSize={14}>
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip content={<ActivityTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
                <Bar dataKey="activity" radius={[0, 4, 4, 0]}>
                  {activityData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.isOnline ? 'hsl(var(--chart-2))' : 'hsl(var(--muted))'}
                      opacity={entry.isOnline ? 1 : 0.35}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}