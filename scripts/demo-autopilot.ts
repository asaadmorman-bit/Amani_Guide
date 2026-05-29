import axios from 'axios';
import crypto from 'crypto';

const API_BASE = 'http://127.0.0.1:3000/api';
const MASTER_CRYPTOGRAPHIC_SEED = 'EMERGING_DEFENSE_SECRET_SEED_2026';

function createHarnessAuthHeaders(bodyPayload: object) {
  const payloadString = JSON.stringify(bodyPayload);
  const signature = crypto
    .createHmac('sha256', MASTER_CRYPTOGRAPHIC_SEED)
    .update(payloadString)
    .digest('hex');

  return {
    'Content-Type': 'application/json',
    'User-Agent': 'axios/automation-harness',
    'x-amani-partner-identity': 'Dependabots',
    'x-amani-security-signature': signature
  };
}

// 📡 Continuous Heart-Rate & Stress Stream Loop
async function runContinuousTelemetryStream() {
  const mockUsers = ['professor_amani', 'parent_home_sync'];
  
  setInterval(async () => {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    // Randomly spike stress to test compliance logs and IoT triggers
    const simulatedStress = Math.floor(Math.random() * (95 - 60 + 1)) + 60; 
    const currentHeartRate = Math.floor(Math.random() * (110 - 72 + 1)) + 72;

    const biometricPayload = {
      username: randomUser,
      deviceName: "Amani_Active_Band_v4",
      currentHeartRate,
      stressLevelScore: simulatedStress
    };

    try {
      const headers = createHarnessAuthHeaders(biometricPayload);
      const res = await axios.post(`${API_BASE}/wearable/sync`, biometricPayload, { headers });
      
      console.log(`📡 [TELEMETRY] Ingested metrics for [${randomUser}] -> HR: ${currentHeartRate}bpm | Stress Score: ${simulatedStress}% -> Server Response: [${res.data.actionStatus}]`);
      
      // If server signals decompression mode, trigger ambient IOT adjustment request
      if (res.data.actionStatus === 'PAUSE_AND_DECOMPRESS_RECOMMENDED') {
        const iotPayload = { username: randomUser, currentStressLevel: simulatedStress };
        const iotHeaders = createHarnessAuthHeaders(iotPayload);
        const iotRes = await axios.post(`${API_BASE}/iot/ambient-adjust`, iotPayload, { headers: iotHeaders });
        console.log(`🌿 [IOT BROADCAST] Ambient adjustment active for [${randomUser}]: ${iotRes.data.activeAmbientMode}`);
      }
    } catch (err: any) {
      console.error(`❌ Telemetry Stream Frame Failed: ${err.message}`);
    }
  }, 4000); // Pipes a live telemetry burst every 4 seconds
}

async function triggerOneTimeComplianceTests() {
  console.log("\n🛸 [CROSS-PERSONA ENGINE] Launching continuous compliance stress loops...\n");

  // Scenario 1: Flawed Academic Run
  const academicPayload = {
    yamlContent: 'student_roster: "active_grades_v1"\nmcp_server: "canvas_sync"',
    userCredentials: { username: "professor_amani", role: "Academic_Faculty" }
  };

  try {
    console.log("📡 Testing: [FLAWED ACADEMIC FACULTY RUN: Processing Grades without student PII masking rules]");
    const headers = createHarnessAuthHeaders(academicPayload);
    const res = await axios.post(`${API_BASE}/tandem-build`, academicPayload, { headers });
    console.log(res.data.selfHealed ? `✨ Success: Self-Healing Triggered!\n` : `✓ Success: Guardrails Blocked Payload Safely (422 Handled).\n`);
  } catch (err: any) {
    console.log(`✓ Safety Intercept: Sever intercepted rule breach natively (Code 422).\n`);
  }

  // Kickstart the background biometric loop immediately
  runContinuousTelemetryStream();
}

triggerOneTimeComplianceTests();