import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, User, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryStyles = {
  SecOps: 'bg-destructive/10 text-destructive border-destructive/20',
  'Daily Organization': 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  DevOps: 'bg-primary/10 text-primary border-primary/20',
  'Data Pipeline': 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  Monitoring: 'bg-accent/10 text-accent border-accent/20',
  Communication: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
};

export default function TemplateCard({ template, onClone, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-card border-border hover:border-primary/20 transition-all duration-300 group h-full">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <Badge
              variant="outline"
              className={`text-[10px] font-mono px-2 py-0.5 ${categoryStyles[template.category] || 'border-border text-muted-foreground'}`}
            >
              {template.category}
            </Badge>
            <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-mono">
              <Download className="w-3 h-3" />
              {template.downloads || 0}
            </div>
          </div>

          <h3 className="font-mono font-semibold text-sm text-foreground mb-2">{template.title}</h3>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-4">
            <User className="w-3 h-3" />
            {template.author_name || 'Community'}
          </div>

          <div className="mt-auto pt-3 border-t border-border">
            <Button
              size="sm"
              className="w-full h-8 text-xs font-mono gap-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => onClone(template)}
            >
              <Copy className="w-3 h-3" />
              Clone to My Workflows
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}