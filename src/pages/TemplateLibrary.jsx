import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Library, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import TemplateCard from '../components/templates/TemplateCard';

const CATEGORIES = ['All', 'SecOps', 'Daily Organization', 'DevOps', 'Data Pipeline', 'Monitoring', 'Communication'];

export default function TemplateLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.list('-downloads'),
  });

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.author_name?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleClone = async (template) => {
    if (!user?.email) {
      toast.error('Please log in first');
      return;
    }
    await base44.entities.Workflow.create({
      user_id: user.email,
      title: `${template.title} (Clone)`,
      description: `Cloned from template by ${template.author_name || 'Community'}`,
      is_active: false,
      yaml_config: template.yaml_config || '',
    });
    // Update download count
    await base44.entities.Template.update(template.id, {
      downloads: (template.downloads || 0) + 1,
    });
    queryClient.invalidateQueries({ queryKey: ['templates'] });
    queryClient.invalidateQueries({ queryKey: ['workflows'] });
    toast.success('Template cloned to My Workflows');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono text-foreground tracking-tight">Template Library</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse and clone community-built workflow templates</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="pl-9 bg-secondary/50 border-border font-mono text-sm h-9"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            className={cn(
              "font-mono text-xs flex-shrink-0 h-8 border-border",
              activeCategory === cat
                ? "bg-primary/10 text-primary border-primary/30"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <Library className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-mono font-semibold text-foreground mb-1">No templates found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTemplates.map((template, i) => (
            <TemplateCard key={template.id} template={template} onClone={handleClone} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}