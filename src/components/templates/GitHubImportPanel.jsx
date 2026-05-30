import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Loader2, RefreshCw, Download, Lock, LogIn, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const CONNECTOR_ID = '69ed28f97f067570c44d9347';

export default function GitHubImportPanel({ user, onImport }) {
  const [authed, setAuthed] = useState(false);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [importing, setImporting] = useState(null);

  // Rule 2: reusable fetch — also detects connection status
  const fetchRepos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('fetchGithubRepos', {});
      setRepos(res.data.repos || []);
      setAuthed(true);
    } catch {
      setAuthed(false);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Rule 1: check auth before any UI
  useEffect(() => {
    if (!user) return;
    base44.auth.isAuthenticated().then(ok => {
      if (ok) fetchRepos();
    });
  }, [user, fetchRepos]);

  // Rule 3: open OAuth popup, poll for close, re-fetch
  const handleConnect = async () => {
    const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
    const popup = window.open(url, '_blank');
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        fetchRepos();
      }
    }, 500);
  };

  const handleDisconnect = async () => {
    await base44.connectors.disconnectAppUser(CONNECTOR_ID);
    setAuthed(false);
    setRepos([]);
    setSelectedRepo(null);
    setFiles([]);
  };

  const handleSelectRepo = async (repo) => {
    setSelectedRepo(repo);
    setFiles([]);
    setLoadingFiles(true);
    try {
      const res = await base44.functions.invoke('fetchGithubRepos', { repo: repo.full_name });
      setFiles(res.data.files || []);
    } catch {
      toast.error('Could not read repo contents');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleImport = async (file) => {
    setImporting(file.path);
    try {
      await onImport({ name: file.name, yaml_config: file.content });
      toast.success(`"${file.name}" imported to My Workflows`);
    } catch {
      toast.error('Import failed');
    } finally {
      setImporting(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <LogIn className="w-3.5 h-3.5" />
        Sign in to connect GitHub
      </div>
    );
  }

  return (
    <div className="bg-secondary/30 border border-border rounded-xl p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-foreground" />
          <span className="text-sm font-mono font-semibold text-foreground">GitHub Repos</span>
          {authed && (
            <Badge variant="outline" className="text-[10px] font-mono border-chart-2/30 text-chart-2 px-1.5 py-0">
              CONNECTED
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {authed && (
            <>
              <Button variant="ghost" size="sm" onClick={fetchRepos} disabled={loading}
                className="h-7 px-2 text-muted-foreground hover:text-foreground">
                <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDisconnect}
                className="h-7 px-2 text-muted-foreground hover:text-destructive text-xs font-mono">
                Disconnect
              </Button>
            </>
          )}
          {!authed && (
            <Button size="sm" onClick={handleConnect}
              className="h-7 px-3 text-xs font-mono bg-primary text-primary-foreground gap-1.5">
              <Github className="w-3.5 h-3.5" />
              Connect GitHub
            </Button>
          )}
        </div>
      </div>

      {/* Not connected state */}
      {!authed && !loading && (
        <p className="text-xs text-muted-foreground font-mono">
          Connect your GitHub account to import YAML workflow templates directly from your repositories.
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-4 justify-center">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-xs font-mono text-muted-foreground">Loading repos…</span>
        </div>
      )}

      {/* Repo list */}
      {authed && !loading && !selectedRepo && (
        <div className="space-y-1 max-h-52 overflow-y-auto">
          {repos.length === 0 && (
            <p className="text-xs text-muted-foreground font-mono py-2 text-center">No repositories found</p>
          )}
          {repos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => handleSelectRepo(repo)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/60 transition-colors group text-left"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {repo.private && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                  <span className="text-xs font-mono text-foreground truncate">{repo.full_name}</span>
                </div>
                {repo.description && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{repo.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">
                  {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* File list inside a repo */}
      {authed && selectedRepo && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => { setSelectedRepo(null); setFiles([]); }}
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors">
              ← Back
            </button>
            <span className="text-[10px] font-mono text-primary">{selectedRepo.full_name}</span>
          </div>

          {loadingFiles && (
            <div className="flex items-center gap-2 py-3 justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span className="text-xs font-mono text-muted-foreground">Scanning YAML files…</span>
            </div>
          )}

          {!loadingFiles && files.length === 0 && (
            <p className="text-xs text-muted-foreground font-mono py-2 text-center">
              No .yaml / .yml files found at root of this repo
            </p>
          )}

          <div className="space-y-1 max-h-44 overflow-y-auto">
            {files.map((file) => (
              <div key={file.path}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/40">
                <span className="text-xs font-mono text-foreground truncate">{file.name}</span>
                <Button size="sm" variant="ghost"
                  onClick={() => handleImport(file)}
                  disabled={importing === file.path}
                  className="h-6 px-2 text-[10px] font-mono gap-1 text-primary hover:text-primary flex-shrink-0 ml-2">
                  {importing === file.path
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Download className="w-3 h-3" />}
                  Import
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}