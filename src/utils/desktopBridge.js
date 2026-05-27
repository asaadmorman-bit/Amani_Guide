// Utility to check if running inside a Tauri desktop app
export const isDesktopApp = () => {
  return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
};

// Execute an agent tool — routes to Rust bridge on desktop, cloud API in browser
export const executeAgentTool = async (tool, payload) => {
  if (isDesktopApp()) {
    const { invoke } = await import('@tauri-apps/api/core');

    try {
      switch (tool) {
        case 'read_file':
          return await invoke('read_local_file', { path: payload.filePath });

        case 'write_file':
          return await invoke('write_local_file', { path: payload.filePath, content: payload.content });

        case 'list_directory':
          return await invoke('list_directory', { path: payload.dirPath });

        case 'execute_command':
          return await invoke('execute_command', { command: payload.command, args: payload.args ?? [] });

        case 'get_system_info':
          return await invoke('get_system_info');

        default:
          throw new Error(`Unknown tool: "${tool}" — not implemented in Rust bridge`);
      }
    } catch (error) {
      console.error(`[DesktopBridge] Rust bridge error for tool "${tool}":`, error);
      throw error;
    }
  } else {
    // Cloud fallback — routes through Base44 backend function
    const { base44 } = await import('@/api/base44Client');
    const response = await base44.functions.invoke('executeToolCloud', { tool, payload });
    return response.data;
  }
};