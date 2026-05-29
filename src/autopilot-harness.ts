import axios from 'axios';
import crypto from 'crypto';

const API_BASE = 'http://localhost:3000/api';
const REPO_SEED = 'EMERGING_DEFENSE_SECRET_SEED_2026';

/**
 * Helper to sign outgoing testing payloads to bypass the server's security lock
 */
function generateTestingSignature(body: object): { token: string; partner: string } {
  const payloadString = JSON.stringify(body);
  const token = crypto.createHmac('sha256', REPO_SEED).update(payloadString).digest('hex');
  return { token, partner: 'Dependabots' };
}

async function runAutopilotLoop() {
  console.log("🤖 [AUTOPILOT] Initializing Shadow Automation Loop...");

  // 1. Simulate Wearable Telemetry (Randomizing heart rate and stress)
  setInterval(async () => {
    const mockTelemetry = {
      username: "mindful_user",
      deviceName: "Garmin_Ecosystem_Simulation",
      currentHeartRate: Math.floor(Math.random() * (110 - 65 + 1)) + 65,
      stressLevelScore: Math.floor(Math.random() * 100)
    };

    const auth = generateTestingSignature(mockTelemetry);
    try {
      const res = await axios.post(`${API_BASE}/wearable/sync`, mockTelemetry, {
        headers: { 'x-amani-security-signature': auth.token, 'x-amani-partner-identity': auth.partner }
      });
      console.log(`[AUTOPILOT] Wearable Sync completed. Status: ${res.data.actionStatus}`);
    } catch (err: any) {
      console.error(`[AUTOPILOT ERR] Wearable stream failed: ${err.message}`);
    }
  }, 15000); // Syncs every 15 seconds

  // 2. Simulate Local Physical Incident Scrapes (Simulating local urban events)
  setInterval(async () => {
    const mockIncident = {
      title: "Simulated Grid Congestion Alert",
      eventType: "INFRASTRUCTURE",
      severityIndex: Math.floor(Math.random() * (90 - 30 + 1)) + 30,
      latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
      longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
      radiusMeters: 1500
    };

    const auth = generateTestingSignature(mockIncident);
    try {
      const res = await axios.post(`${API_BASE}/security/physical-incident`, mockIncident, {
        headers: { 'x-amani-security-signature': auth.token, 'x-amani-partner-identity': auth.partner }
      });
      console.log(`[AUTOPILOT] Physical Incident Injected. Perimeter: ${res.data.perimeterStatus}`);
    } catch (err: any) {
      console.error(`[AUTOPILOT ERR] Incident injection failed: ${err.message}`);
    }
  }, 30000); // Drops an incident every 30 seconds
}

runAutopilotLoop();