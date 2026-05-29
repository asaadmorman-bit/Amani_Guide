import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import NodeCanvas from '../components/workflows/NodeCanvas';
import YamlEditor from '../components/workflows/YamlEditor';
import axios from 'axios';

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(null);
  const [yaml, setYaml] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);

  // Authenticated presentation identity matching server ABAC gates
  const [userCredentials] = useState({
    username: "devsecops_lead_amani",
    role: "System_Architect",
    clearance: "Secret"
  });

  useEffect(() => {
    const load = async () => {
      try {
        const items = await base44.entities.Workflow.filter({ id });
        if (items.length > 0) {
          setWorkflow(items[0]);
          setYaml(items[0].yaml_config || '');
        }
      } catch (err) {
        toast.error("Error fetching remote workflow spec asset.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ─── NEW: TANDEM DEVSECOPS COMPLIANCE & SELF-HEALING GATES ───────────
  const handleValidateAndSave = async () => {
    setSaving(true);
    setValidating(true);
    try {
      // 1. Route the configuration blueprint down to our server guardrail validator
      const checkResponse = await axios.post('http://localhost:3000/api/tandem-build', {
        yamlContent: yaml,
        userCredentials
      });

      let finalYamlToSave = yaml;

      // 2. If the AI engine intercepted an issue and automatically fixed it, hot-reload the changes
      if (checkResponse.data.selfHealed && checkResponse.data.healedYaml) {
        finalYamlToSave = checkResponse.data.healedYaml;
        setYaml(finalYamlToSave);
        toast.info("🛡️ Security Violation Caught! Self-healing applied cleanly.");
      }

      // 3. Commit the fully compliant configuration to your primary database storage endpoint
      await base44.entities.Workflow.update(workflow.id, { yaml_config: finalYamlToSave });
      toast.success('Workflow validated & saved securely.');
    } catch (error) {
      const serverMessage = error.response?.data?.error || "Pipeline validation failure metrics caught.";
      toast.error(`❌ Policy Rejection: ${serverMessage}`);
      console.error(error.response?.data?.logs);
    } finally {
      setSaving(false);
      setValidating(false);
    }
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
      {/* Top bar toolbar */}
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
            <h2 className="font-mono font-semibold text-sm text-foreground flex items-center gap-2">
              {workflow.title} 
              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1 rounded flex items-center gap-0.5"><ShieldCheck className="w-2.5 h-2.5" /> SECURE</span>
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono">CCM CONTEXT: SYSTEM ARCHITECT</span>
          </div>
        </div>
        
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs gap-1.5 shadow-lg"
          onClick={handleValidateAndSave}
          disabled={saving}
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          {validating ? 'Auditing Spec...' : saving ? 'Saving...' : 'Validate & Save'}
        </Button>
      </div>

      {/* Split visual viewport view */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          {/* 🛠️ ADDED: Passing setYaml hook down to keep visual drag-and-drop actions synced with text state */}
          <NodeCanvas yamlConfig={yaml} onChange={setYaml} />
        </div>
        <div className="w-[480px] flex-shrink-0 border-l border-border">
          <YamlEditor value={yaml} onChange={setYaml} onSave={handleValidateAndSave} />
        </div>
      </div>
    </div>
  );
}