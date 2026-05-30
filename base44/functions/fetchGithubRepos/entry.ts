import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CONNECTOR_ID = '69ed28f97f067570c44d9347';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);

    const { repo } = await req.json().catch(() => ({}));

    // If a specific repo is provided, fetch its YAML files
    if (repo) {
      // Get repo contents at root to find YAML files
      const contentsRes = await fetch(`https://api.github.com/repos/${repo}/contents`, {
        headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'ControlRoom' },
      });
      const contents = await contentsRes.json();

      const yamlFiles = Array.isArray(contents)
        ? contents.filter(f => f.type === 'file' && (f.name.endsWith('.yaml') || f.name.endsWith('.yml')))
        : [];

      const fileContents = await Promise.all(
        yamlFiles.slice(0, 20).map(async (f) => {
          const r = await fetch(f.download_url);
          const text = await r.text();
          return { name: f.name.replace(/\.(yaml|yml)$/, ''), path: f.path, content: text };
        })
      );

      return Response.json({ files: fileContents });
    }

    // Otherwise list repos
    const reposRes = await fetch('https://api.github.com/user/repos?per_page=50&sort=updated&type=all', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'ControlRoom' },
    });
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) return Response.json({ error: repos.message || 'Failed to fetch repos' }, { status: 400 });

    return Response.json({
      repos: repos.map(r => ({
        id: r.id,
        full_name: r.full_name,
        description: r.description,
        private: r.private,
        updated_at: r.updated_at,
      })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});