import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2, XCircle, Loader2, Clock, Play, ChevronDown, ChevronUp, Trash2, Terminal
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

function statusIcon(status) {
  if (status === 'success') return <CheckCircle2 className="w-3.5 h-3.5 text-chart-2" />;
  if (status === 'failed') return <XCircle className="w-3.5 h-3.5 text-destructive" />;
  return <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />;
}

function statusColor(status) {
  if (status === 'success') return 'border-chart-2/30 text-chart-2';
  if (status === 'failed') return 'border-destructive/30 text-destructive';
  return 'border-primary/30 text-primary';
}

function LogRow({ log }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/40 transition-colors text-left"
      >
        {statusIcon(log.status)}
        <span className="flex-1 text-xs font-mono text-foreground truncate">
          {log.trigger_source || 'manual'}
        </span>
        <Badge variant="outline" className={cn('text-[10px] font-mono px-1.5 py-0 hidden sm:inline-flex', statusColor(log.status))}>
          {log.status.toUpperCase()}
        </Badge>
        {log.duration_ms != null && (
          <span className="text-[10px] font-mono text-muted-foreground hidden sm:block w-16 text-right">
            {log.duration_ms < 1000 ? `${log.duration_ms}ms` : `${(log.duration_ms / 1000).toFixed(1)}s`}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground font-mono w-20 text-right flex-shrink-0">
          {log.triggered_at
            ? formatDistanceToNow(new Date(log.triggered_at), { addSuffix: true })
            : formatDistanceToNow(new Date(log.created_date), { addSuffix: true })}
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 bg-secondary/20 border-t border-border space-y-1">
              {log.triggered_at && (
                <p className="text-[10px] font-mono text-muted-foreground">
                  <span className="text-foreground/60">Triggered:</span>{' '}
                  {format(new Date(log.triggered_at), 'MMM d yyyy, HH:mm:ss')}
                </p>
              )}
              {log.message ? (
                <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all bg-secondary/40 rounded p-2 max-h-32 overflow-y-auto">
                  {log.message}
                </pre>
              ) : (
                <p className="text-[10px] font-mono text-muted-foreground italic">No message</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WorkflowLogPanel({ workflowId, workflowTitle }) {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['workflow-logs', workflowId],
    queryFn: () => base44.entities.WorkflowLog.filter({ workflow_id: workflowId }, '-created_date', 50),
    enabled: !!workflowId,
    refetchInterval: 10000,
  });

  const addLogMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkflowLog.create({ workflow_id: workflowId, ...data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflow-logs', workflowId] }),
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(logs.map(l => base44.entities.WorkflowLog.delete(l.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow-logs', workflowId] });
      toast.success('Logs cleared');
    },
  });

  const handleManualTrigger = () => {
    addLogMutation.mutate({
      status: 'success',
      triggered_at: new Date().toISOString(),
      trigger_source: 'manual',
      message: 'Manually triggered test run',
      duration_ms: Math.floor(Math.random() * 800) + 50,
    });
    toast.success('Test run logged');
  };

  const successCount = logs.filter(l => l.status === 'success').length;
  const failCount = logs.filter(l => l.status === 'failed').length;

  return (
    <div className="mt-3 border-t border-border pt-3">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-mono font-semibold text-foreground">Run History</span>
          {logs.length > 0 && (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-[10px] font-mono text-chart-2">{successCount}✓</span>
              {failCount > 0 && <span className="text-[10px] font-mono text-destructive">{failCount}✗</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleManualTrigger}
            disabled={addLogMutation.isPending}
            className="h-6 px-2 text-[10px] font-mono gap-1 text-primary hover:text-primary"
          >
            <Play className="w-2.5 h-2.5" />
            Test
          </Button>
          {logs.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => clearMutation.mutate()}
              disabled={clearMutation.isPending}
              className="h-6 px-2 text-[10px] font-mono text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Log list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
        </div>
      ) : logs.length === 0 ? (
        <div className="flex items-center gap-2 py-3 px-3 rounded-lg bg-secondary/20 border border-border/50">
          <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-[10px] font-mono text-muted-foreground">
            No runs yet — click <span className="text-primary">Test</span> to log a run
          </span>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {logs.map(log => <LogRow key={log.id} log={log} />)}
        </div>
      )}
    </div>
  );
}