import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Wifi, WifiOff, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GatewayCard({ gateway, index = 0 }) {
  const isOnline = gateway.status === 'online';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn(
        "bg-card border-border transition-all duration-300 relative overflow-hidden",
        isOnline && "border-chart-2/30"
      )}>
        {isOnline && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-chart-2 to-transparent" />
        )}
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isOnline ? "bg-chart-2/10" : "bg-muted"
              )}>
                <Monitor className={cn("w-5 h-5", isOnline ? "text-chart-2" : "text-muted-foreground")} />
              </div>
              <div>
                <h3 className="font-mono font-semibold text-sm text-foreground">{gateway.device_name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  {isOnline
                    ? <Wifi className="w-3 h-3 text-chart-2" />
                    : <WifiOff className="w-3 h-3 text-muted-foreground" />
                  }
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-mono px-1.5 py-0",
                      isOnline ? "border-chart-2/30 text-chart-2" : "border-border text-muted-foreground"
                    )}
                  >
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {gateway.last_ping && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
              <Clock className="w-3 h-3" />
              Last ping: {format(new Date(gateway.last_ping), 'MMM d, HH:mm')}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}