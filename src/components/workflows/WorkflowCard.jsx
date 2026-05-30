import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Zap, Clock, ScrollText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import WorkflowLogPanel from './WorkflowLogPanel';

export default function WorkflowCard({ workflow, onToggle, onEdit, onDelete }) {
  const [showLogs, setShowLogs] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      layout
    >
      <Card className="bg-card border-border hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
        {/* Glow effect when active */}
        {workflow.is_active && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        )}
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${workflow.is_active ? 'bg-primary animate-pulse-glow' : 'bg-muted-foreground/30'}`} />
              <h3 className="font-mono font-semibold text-sm text-foreground truncate max-w-[180px]">
                {workflow.title}
              </h3>
            </div>
            <Switch
              checked={workflow.is_active}
              onCheckedChange={(checked) => onToggle(workflow.id, checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[32px]">
            {workflow.description || 'No description'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground px-2 py-0.5">
                <Zap className="w-3 h-3 mr-1" />
                {workflow.is_active ? 'LIVE' : 'OFF'}
              </Badge>
              {workflow.updated_date && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(workflow.updated_date), 'MMM d')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className={`h-7 w-7 transition-colors ${showLogs ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                onClick={() => setShowLogs(v => !v)}
                title="Run history"
              >
                <ScrollText className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={() => onEdit(workflow)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(workflow.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          {showLogs && (
            <WorkflowLogPanel workflowId={workflow.id} workflowTitle={workflow.title} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}