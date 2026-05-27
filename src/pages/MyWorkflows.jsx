import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Workflow, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import WorkflowCard from '../components/workflows/WorkflowCard';
import CreateWorkflowDialog from '../components/workflows/CreateWorkflowDialog';

export default function MyWorkflows() {
  const [showCreate, setShowCreate] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: workflows = [], isLoading } = useQuery({
    queryKey: ['workflows', user?.email],
    queryFn: () => base44.entities.Workflow.filter({ user_id: user?.email }, '-updated_date'),
    enabled: !!user?.email,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Workflow.create({ ...data, user_id: user.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow created');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => base44.entities.Workflow.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Workflow.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      toast.success('Workflow deleted');
    },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground tracking-tight">My Workflows</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and monitor your AI automations</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-primary-foreground font-mono text-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          New Workflow
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-8 pb-6 border-b border-border">
        <div>
          <span className="text-2xl font-mono font-bold text-foreground">{workflows.length}</span>
          <span className="text-xs text-muted-foreground ml-2">Total</span>
        </div>
        <div>
          <span className="text-2xl font-mono font-bold text-primary">{workflows.filter(w => w.is_active).length}</span>
          <span className="text-xs text-muted-foreground ml-2">Active</span>
        </div>
        <div>
          <span className="text-2xl font-mono font-bold text-muted-foreground">{workflows.filter(w => !w.is_active).length}</span>
          <span className="text-xs text-muted-foreground ml-2">Inactive</span>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Workflow className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-mono font-semibold text-foreground mb-1">No workflows yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Create your first AI automation</p>
          <Button onClick={() => setShowCreate(true)} className="bg-primary text-primary-foreground font-mono text-sm gap-2">
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {workflows.map((wf) => (
              <WorkflowCard
                key={wf.id}
                workflow={wf}
                onToggle={(id, checked) => toggleMutation.mutate({ id, is_active: checked })}
                onEdit={(wf) => navigate(`/editor/${wf.id}`)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <CreateWorkflowDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreate={createMutation.mutateAsync}
      />
    </div>
  );
}