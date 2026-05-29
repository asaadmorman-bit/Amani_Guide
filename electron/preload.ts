import { contextBridge, ipcRenderer } from 'electron';

// Expose secure, sandboxed OS channels to your React window context
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => "2026.2.0-desktop",
  getSystemEnvironment: () => process.platform,
  onLogTelemetry: (callback: (event: any, value: string) => void) => {
    ipcRenderer.on('telemetry-tick', callback);
  }
});