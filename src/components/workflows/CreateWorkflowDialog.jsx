import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const DEFAULT_YAML = `# Workflow Configuration
name: my-workflow
version: "1.0"
triggers:
  - type: schedule
    cron: "0 * * * *"
steps:
  - id: step_1
    action: collect_data
    params:
      source: system_logs
  - id: step_2
    action: analyze
    depends_on: step_1
    params:
      model: gpt-4`;

export default function CreateWorkflowDialog({ open, onOpenChange, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await onCreate({
      title: title.trim(),
      description: description.trim(),
      is_active: false,
      yaml_config: DEFAULT_YAML,
    });
    setTitle('');
    setDescription('');
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-foreground">New Workflow</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-mono">TITLE</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Nightly Log Analysis"
              className="bg-secondary/50 border-border font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-mono">DESCRIPTION</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this workflow do?"
              className="bg-secondary/50 border-border text-sm h-20 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border text-muted-foreground">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || loading} className="bg-primary text-primary-foreground">
            {loading ? 'Creating...' : 'Create Workflow'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}