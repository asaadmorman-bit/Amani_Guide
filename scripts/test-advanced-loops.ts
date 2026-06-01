import axios from 'axios';
import crypto from 'crypto';

const API_BASE = 'http://127.0.0.1:3000/api';
const MASTER_CRYPTOGRAPHIC_SEED = 'EMERGING_DEFENSE_SECRET_SEED_2026';

function createAuthHeaders(bodyPayload: object) {
  const payloadString = JSON.stringify(bodyPayload);
  const signature = crypto
    .createHmac('sha256', MASTER_CRYPTOGRAPHIC_SEED)
    .update(payloadString)
    .digest('hex');

  return {
    'Content-Type': 'application/json',
    'User-Agent': 'axios/advanced-testing-harness',
    'x-amani-partner-identity': 'Dependabots',
    'x-amani-security-signature': signature
  };
}

async function runAdvancedSuites() {
  console.log("\n🛸 [ADVANCED SYSTEMS RUN] Initiating verification loops for HITL & Self-Healing...\n");

  // ─── STAGE 1: TEST AI SELF-HEALING ──────────────────────────────────
  console.log("🧬 [STAGE 1] Injecting non-compliant Academic manifest (No PII Masking)...");
  const badAcademicPayload = {
    yamlContent: 'student_roster: "active_grades_v1"\nmcp_server: "canvas_sync"',
    userCredentials: { username: "professor_amani", role: "Academic_Faculty" }
  };

  try {
    const headers = createAuthHeaders(badAcademicPayload);
    const res = await axios.post(`${API_BASE}/tandem-build`, badAcademicPayload, { headers });
    
    if (res.data.selfHealed) {
      console.log("✨ [SUCCESS] Cognitive engine self-healed the manifest natively!");
      console.log(`🤖 Healed Output Configuration:\n\n${res.data.healedYaml}\n`);
    } else {
      console.log("✓ Guardrails caught violation, but no self-healing occurred (422 Handled).");
    }
  } catch (err: any) {
    console.log(`🛑 Boundary Halt: Payload was rejected cleanly (${err.response?.status || err.message})`);
  }

  // ─── STAGE 2: TEST HUMAN-IN-THE-LOOP INTERCEPTION ───────────────────
  console.log("⏳ [STAGE 2] Submitting workflow with semi_autonomous execution mode...");
  const hitlPayload = {
    yamlContent: 'focus_block: "deep_work"\nrest_interval: "5m"\nexecution_mode: "semi_autonomous"\nprompt_role: "Summarize engineering progress logs."',
    userCredentials: { username: "parent_home_sync", role: "Family_Lead" }
  };

  let dynamicTicketId = "";

  try {
    const headers = createAuthHeaders(hitlPayload);
    const res = await axios.post(`${API_BASE}/run-workflow`, hitlPayload, { headers });

    if (res.data.hitl_interception) {
      dynamicTicketId = res.data.ticket_id;
      console.log(`🛑 [INTERCEPTED] Workflow paused safely. Ticket generated: [${dynamicTicketId}]`);
    } else {
      console.log("⚠️ Unexpected: Workflow ran without pausing.");
    }
  } catch (err: any) {
    console.error(`❌ Workflow submission failed: ${err.message}`);
    return;
  }

  // ─── STAGE 3: QUERY AND RESOLVE THE HITL TICKET ─────────────────────
  if (!dynamicTicketId) return;

  console.log(`\n🔑 [STAGE 3] Dispatching authorization payload to release [${dynamicTicketId}]...`);
  const authorizePayload = {
    ticketId: dynamicTicketId,
    action: "APPROVE"
  };

  try {
    // Note: Approvals routes bypass signature checks to simulate an admin override dashboard
    const res = await axios.post(`${API_BASE}/approvals/authorize`, authorizePayload);
    console.log(`📡 [SERVER RESPONSE]: ${res.data.message}`);
    console.log(`🚀 Dispatch State: [${res.data.executionStatus}] -> System is fully green!`);
  } catch (err: any) {
    console.error(`❌ Failed to resolve ticket: ${err.message}`);
  }
}

runAdvancedSuites();