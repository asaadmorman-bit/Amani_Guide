import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import NodeCanvas from '../components/workflows/NodeCanvas';
import YamlEditor from '../components/workflows/YamlEditor';

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [yaml, setYaml] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const items = await base44.entities.Workflow.filter({ id });
      if (items.length > 0) {
        setWorkflow(items[0]);
        setYaml(items[0].yaml_config || '');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Workflow.update(workflow.id, { yaml_config: yaml });
    toast.success('Workflow saved');
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground font-mono mb-4">Workflow not found</p>
          <Button onClick={() => navigate('/')} variant="outline" className="font-mono">Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col z-50">
      {/* Top bar */}
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="font-mono font-semibold text-sm text-foreground">{workflow.title}</h2>
            <span className="text-[10px] text-muted-foreground font-mono">WORKFLOW EDITOR</span>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground font-mono text-xs gap-1.5"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Split view */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <NodeCanvas yamlConfig={yaml} />
        </div>
        <div className="w-[480px] flex-shrink-0">
          <YamlEditor value={yaml} onChange={setYaml} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}