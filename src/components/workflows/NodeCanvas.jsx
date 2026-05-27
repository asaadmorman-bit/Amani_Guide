import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Database, Brain, Shield, ArrowRight, GripVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NODE_TYPES = {
  trigger: { icon: Zap, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', label: 'Trigger' },
  action: { icon: Database, color: 'text-chart-2', bg: 'bg-chart-2/10', border: 'border-chart-2/30', label: 'Action' },
  ai: { icon: Brain, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30', label: 'AI Model' },
  guard: { icon: Shield, color: 'text-chart-4', bg: 'bg-chart-4/10', border: 'border-chart-4/30', label: 'Guard' },
};

function CanvasNode({ node, index, onDragStart, onRemove, selected, onSelect }) {
  const config = NODE_TYPES[node.type] || NODE_TYPES.action;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "absolute cursor-grab active:cursor-grabbing select-none",
        "w-48 rounded-lg border bg-card p-3 shadow-lg",
        config.border,
        selected && "ring-2 ring-primary"
      )}
      style={{ left: node.x, top: node.y }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(index);
        onDragStart(e, index);
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("w-7 h-7 rounded flex items-center justify-center", config.bg)}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono font-semibold text-foreground truncate">{node.label}</div>
          <div className={cn("text-[10px] font-mono", config.color)}>{config.label}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div className="text-[10px] text-muted-foreground font-mono">{node.description}</div>
      {/* Connection dots */}
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-card border-2 border-primary/50" />
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-card border-2 border-muted-foreground/30" />
    </motion.div>
  );
}

function parseYamlToNodes(yaml) {
  if (!yaml) return [];
  const nodes = [];
  const lines = yaml.split('\n');
  let yPos = 60;
  let inSteps = false;
  let currentStep = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('triggers:')) {
      nodes.push({
        type: 'trigger', label: 'Trigger', description: 'Schedule / Event',
        x: 60, y: yPos
      });
      yPos += 120;
    }
    if (trimmed === 'steps:') { inSteps = true; continue; }
    if (inSteps && trimmed.startsWith('- id:')) {
      currentStep = trimmed.replace('- id:', '').trim();
    }
    if (inSteps && trimmed.startsWith('action:') && currentStep) {
      const action = trimmed.replace('action:', '').trim();
      const type = action.includes('analyze') || action.includes('model') ? 'ai' :
                   action.includes('guard') || action.includes('check') ? 'guard' : 'action';
      nodes.push({
        type, label: currentStep, description: action,
        x: 60 + (nodes.length % 2) * 220, y: yPos
      });
      yPos += 120;
      currentStep = null;
    }
  }
  if (nodes.length === 0) {
    nodes.push({ type: 'trigger', label: 'Start', description: 'Entry point', x: 100, y: 80 });
  }
  return nodes;
}

export default function NodeCanvas({ yamlConfig }) {
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dragging, setDragging] = useState(null);
  const canvasRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setNodes(parseYamlToNodes(yamlConfig));
  }, [yamlConfig]);

  const handleDragStart = useCallback((e, index) => {
    const node = nodes[index];
    dragOffset.current = { x: e.clientX - node.x, y: e.clientY - node.y };
    setDragging(index);
  }, [nodes]);

  const handleMouseMove = useCallback((e) => {
    if (dragging === null) return;
    setNodes(prev => prev.map((n, i) =>
      i === dragging ? { ...n, x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y } : n
    ));
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const addNode = (type) => {
    setNodes(prev => [...prev, {
      type,
      label: `${NODE_TYPES[type].label}_${prev.length + 1}`,
      description: `New ${NODE_TYPES[type].label.toLowerCase()} node`,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    }]);
  };

  const removeNode = (index) => {
    setNodes(prev => prev.filter((_, i) => i !== index));
    setSelectedNode(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Toolbar */}
      <div className="h-12 border-b border-border bg-card/50 flex items-center gap-2 px-4">
        <span className="text-xs text-muted-foreground font-mono mr-2">ADD NODE:</span>
        {Object.entries(NODE_TYPES).map(([type, config]) => (
          <Button
            key={type}
            variant="outline"
            size="sm"
            className="h-7 text-xs font-mono border-border gap-1.5"
            onClick={() => addNode(type)}
          >
            <config.icon className={cn("w-3 h-3", config.color)} />
            {config.label}
          </Button>
        ))}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-auto"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => setSelectedNode(null)}
      >
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.map((node, i) => {
            if (i === 0) return null;
            const prev = nodes[i - 1];
            return (
              <line
                key={i}
                x1={prev.x + 192}
                y1={prev.y + 30}
                x2={node.x}
                y2={node.y + 30}
                stroke="hsl(var(--primary) / 0.2)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            );
          })}
        </svg>

        {nodes.map((node, i) => (
          <CanvasNode
            key={i}
            node={node}
            index={i}
            onDragStart={handleDragStart}
            onRemove={removeNode}
            selected={selectedNode === i}
            onSelect={setSelectedNode}
          />
        ))}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground font-mono">Add nodes from the toolbar above</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}