import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function YamlEditor({ value, onChange, onSave }) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(value || '');
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSave?.();
    }
  };

  // Line numbers
  const lineCount = (value || '').split('\n').length;

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <span className="text-xs font-mono text-muted-foreground">YAML CONFIG</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs font-mono gap-1.5 text-muted-foreground"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3 h-3 text-chart-2" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs font-mono gap-1.5 bg-primary text-primary-foreground"
            onClick={onSave}
          >
            <Save className="w-3 h-3" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-auto">
        {/* Line numbers */}
        <div className="py-4 px-3 text-right select-none border-r border-border bg-muted/30 flex-shrink-0">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="text-[11px] leading-[20px] font-mono text-muted-foreground/50">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[12px] leading-[20px] font-mono text-foreground p-4 resize-none outline-none focus:ring-0 border-0"
          spellCheck={false}
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}