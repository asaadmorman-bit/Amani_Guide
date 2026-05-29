import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: 'https://potential-doodle-r4jqvq75q7wv3wxjj-3000.app.github.dev', // 🛰️ Routed to your Public port 3000 proxy
  requiresAuth: false,
  appBaseUrl
});
