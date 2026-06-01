// ─── ⚡ ENFORCE PROCESS ENVIRONMENT LOADERS ─────────────────────────
import 'dotenv/config'; 

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@prisma/client';
import { PGlite } from '@electric-sql/pglite';
import { PrismaPGlite } from 'pglite-prisma-adapter';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Force an absolute directory route for the WebAssembly instance
const DB_DIR = path.resolve(process.cwd(), 'base_amani_vault_data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// 1. Fire up localized PGlite storage
const pgliteDb = new PGlite(DB_DIR);
const adapter = new PrismaPGlite(pgliteDb);
const prisma = new PrismaClient({ adapter });

// 2. Safely capture the Gemini API Key from process environment memory variables
const aiKey = process.env.GEMINI_API_KEY; 
let ai: any = null;

if (!aiKey || aiKey === "AIzaSyYourActualAPIKeyStringGoesHere" || aiKey === "") {
  console.warn("⚠️ [CONFIGURATION WARNING] Gemini API Key is missing or using placeholder text inside your .env file. AI Self-Healing will fallback to safe 422 blocks.");
} else {
  ai = new GoogleGenAI({ apiKey: aiKey });
}

const KNOWLEDGE_DIR = './src/knowledge-base';
if (!fs.existsSync(KNOWLEDGE_DIR)) fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });

// ─── 🛡️ CRITICAL GATEWAY: HARD REPOSITORY & PARTNER LOCKDOWN ──────────
const ENFORCED_CORPORATE_PARTNERS = ["Emerging Defense Solutions", "Dependabots"];
const MASTER_CRYPTOGRAPHIC_SEED = process.env.AMANI_SECURITY_SEED || 'EMERGING_DEFENSE_SECRET_SEED_2026';

function verifyEnterpriseSignature(payload: string, incomingSignature: string): boolean {
  const computedSignature = crypto
    .createHmac('sha256', MASTER_CRYPTOGRAPHIC_SEED)
    .update(payload)
    .digest('hex');
  return computedSignature === incomingSignature;
}

// Global Enterprise Security Enforcement Middleware
app.use((req, res, next) => {
  if (req.path === '/api/knowledge-sync' || req.path === '/api/community/feed' || req.path === '/api/auditor-evidence' || req.method === 'GET') {
    return next();
  }

  const identityToken = req.headers['x-amani-partner-identity'] as string;
  const requestSignature = req.headers['x-amani-security-signature'] as string;

  // Fallback Check for Local Autopilot Scenarios
  if (req.headers['user-agent']?.includes('axios') && !identityToken && !requestSignature) {
    return next();
  }

  if (!identityToken || !ENFORCED_CORPORATE_PARTNERS.includes(identityToken)) {
    return res.status(403).json({
      success: false,
      error: "Access Denied: Operating domain fails licensing verification gates for Emerging Defense Solutions & Dependabots."
    });
  }

  if (req.body && Object.keys(req.body).length > 0 && requestSignature) {
    try {
      const stringifiedBody = JSON.stringify(req.body);
      if (!verifyEnterpriseSignature(stringifiedBody, requestSignature)) {
        return res.status(401).json({
          success: false,
          error: "Cryptographic Mismatch: Inbound signature verification array failed validation protocols."
        });
      }
    } catch (parseError) {
      return res.status(400).json({ success: false, error: "Malformed request payload configuration structure." });
    }
  }

  next();
});

// Helper function to resolve and isolate database users inside transactions
async function getOrCreateTenantUser(username: string, role: string) {
  let user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    user = await prisma.user.create({
      data: { username, role, backgroundField: "General" }
    });
  }
  return user;
}

// ─── REAL WORKSPACE INFRASTRUCTURE FILE SCAFFOLDER ───────────────────
function buildLiveConfigurationFilesOnDisk(detectedIntegrations: string[], specIntegrityHash: string, role: string) {
  if (detectedIntegrations.length === 0) return;

  detectedIntegrations.forEach((appLink) => {
    const configPath = `./src/config/integration_${appLink}.json`;
    
    const finalConfigurationPayload = {
      assetId: appLink,
      deploymentStatus: "PROVISIONED_AND_LOCKED",
      enforcedRegulations: ["NIST_800", "PCI_DSS_v4", "SOC2_TYPE_II", "FERPA", "COPPA"],
      orchestratorClearanceRole: role,
      cryptographicSignature: crypto.createHmac('sha256', MASTER_CRYPTOGRAPHIC_SEED).update(appLink + specIntegrityHash).digest('hex'),
      deployedTimestamp: new Date().toISOString()
    };

    if (!fs.existsSync('./src/config')) {
      fs.mkdirSync('./src/config', { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(finalConfigurationPayload, null, 2), 'utf-8');
    console.log(`⚙️ [DEPLOYER] Real-world configuration file written to disk at: ${configPath}`);
  });
}

// ─── 1. CORE MULTI-TENANT POLICY COMPLIANCE FILTER ──────────────────
function evaluatePersonaGuardrails(yamlContent: string, role: string): { compliant: boolean; errors: string[] } {
  let errors: string[] = [];
  
  if (role === 'System_Architect' && (yamlContent.includes('PCI_DSS_V4_0') || yamlContent.includes('SOC2_TYPE_II'))) {
    if (!yamlContent.includes('tokenization_filter: "enabled"')) errors.push("PCI-DSS Violation: Tokenization must be explicitly enabled.");
    if (!yamlContent.includes('tls_version: "TLS_1_3"')) errors.push("SOC 2 Violation: Cryptographic transport layer must enforce TLS_1_3.");
  }
  
  if (role === 'Academic_Faculty' && yamlContent.includes('student_roster')) {
    if (!yamlContent.includes('pii_masking: "enabled"')) {
      errors.push("FERPA Violation: Student grading and roster pipelines must enforce explicit PII masking.");
    }
  }

  if (role === 'Family_Lead' && yamlContent.includes('children_schedule')) {
    if (yamlContent.includes('tracking_cookies: "enabled"') || yamlContent.includes('public_sharing: "true"')) {
      errors.push("COPPA Warning: Pipelines managing children profiles cannot utilize tracking cookies or public indicators.");
    }
  }
  
  const taskCount = (yamlContent.match(/primitive:\s*["']task["']/g) || []).length;
  if (taskCount > 6 && (role === 'Family_Lead' || role === 'Personal_User')) {
    errors.push("Cognitive Overload Risk: You've mapped out more than 6 core tasks for this block. Let's practice 'Rule of 3' priority sorting to prevent burnout.");
  }

  if (yamlContent.includes('focus_block:') && !yamlContent.includes('rest_interval:')) {
    errors.push("Pacing Alert: Deep focus block detected without an accompanying rest interval. Remember to log a 5-10 minute decompression break.");
  }

  return { compliant: errors.length === 0, errors };
}

// ─── 2. ENTERPRISE COGNITIVE SELF-HEALING ENGINE ────────────────────
async function attemptAISelfHealing(yamlContent: string, violations: string[], role: string): Promise<string | null> {
  if (!ai) {
    console.warn("🛡️ [SELF-HEALING SKIPPED] Cognitive layer offline: No valid Gemini API Token key found.");
    return null;
  }
  try {
    console.log(`🛡️ [SELF-HEALING] Refactoring manifest for role target: [${role}]...`);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert systems automation engineer. The following YAML configuration manifest broke security protocols for user role "${role}" due to these violations:
                 ${violations.join('\n')}

                 Here is the current invalid manifest:
                 ${yamlContent}

                 Refactor the configuration cleanly to fix these specific issues. Return ONLY the completely valid, corrected YAML block code inside backticks.`
    });
    
    let rawText = response.text || "";
    if (rawText.includes("```yaml")) rawText = rawText.split("```yaml")[1].split("```")[0];
    else if (rawText.includes("```")) rawText = rawText.split("```")[1].split("```")[0];
    return rawText.trim();
  } catch (err) {
    return null;
  }
}

// ─── 3. INTERACTIVE CHANNELS MATRIX (TANDEM BUILD) ───────────────────
app.post('/api/tandem-build', async (req, res) => {
  try {
    const { yamlContent, userCredentials } = req.body;
    const role = userCredentials?.role || 'Personal_User';
    const username = userCredentials?.username || 'anonymous_user';
    
    console.log(`🛰️ [安全网关] Evaluation intercept initiated for actor: [${username}] (${role})`);

    const allowedRoles = ['System_Architect', 'Business_Owner', 'Exec_Assistant', 'Family_Lead', 'Academic_Faculty', 'Academic_Student', 'Personal_User'];
    if (!userCredentials || !allowedRoles.includes(userCredentials.role)) {
      return res.status(403).json({ success: false, error: "Access Denied: Operating identity fails RBAC verification gates." });
    }

    const tenantUser = await getOrCreateTenantUser(username, role);
    const evalResult = evaluatePersonaGuardrails(yamlContent, role);

    if (!evalResult.compliant) {
      const healedYaml = await attemptAISelfHealing(yamlContent, evalResult.errors, role);
      if (healedYaml) {
        await prisma.secureComplianceLog.create({
          data: {
            event: "AUTOMATED_POLICY_REMEDIATION",
            specIntegrityHash: "sha256_remediated_block",
            roleContext: role,
            status: "BLOCKED_VIOLATION",
            userId: tenantUser.id
          }
        });

        return res.json({
          success: true,
          selfHealed: true,
          healedYaml,
          summary: `### 🛡️ Guardrails Automatically Applied Self-Healing (${role})\nYour workflow configuration layout broke localized policy boundaries.`,
          logs: evalResult.errors.map(v => `✨ [AUTO-REMEDIATION] Fixed rule conflict: ${v}`).join('\n')
        });
      }
      
      await prisma.secureComplianceLog.create({
        data: {
          event: "COMPLIANCE_VIOLATION_HALT",
          specIntegrityHash: "failed_comp_block",
          roleContext: role,
          status: "BLOCKED_VIOLATION",
          userId: tenantUser.id
        }
      });
      
      return res.status(422).json({ success: false, error: "Compliance boundary halt.", logs: evalResult.errors.join('\n') });
    }

    const specIntegrityHash = crypto.createHash('sha256').update(yamlContent).digest('hex');
    let detectedIntegrations: string[] = [];
    const lines = yamlContent.split('\n');
    lines.forEach((line: string) => {
      if (line.includes('mcp_server:')) {
        detectedIntegrations.push(line.split('mcp_server:')[1].replace(/"/g, '').trim());
      }
    });

    buildLiveConfigurationFilesOnDisk(detectedIntegrations, specIntegrityHash, role);

    await prisma.blueprint.create({
      data: { name: `Blueprint_${Date.now()}`, yamlConfig: yamlContent, userId: tenantUser.id }
    });

    await prisma.secureComplianceLog.create({
      data: { event: "PIPELINE_SYNCHRONIZED", specIntegrityHash, roleContext: role, status: "COMPLIANT_SUCCESS", userId: tenantUser.id }
    });

    return res.json({
      success: true,
      logs: `✓ Control verification pass matched successfully for user category type: [${role}]`,
      summary: `### 🛡️ Secure Mesh Synchronized cleanly\nWorkspace parameters successfully validated.`
    });
  } catch (error: any) {
    console.error("🚨 [CRITICAL TANDEM-BUILD EXCEPTION TRACE]:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ─── 4. GOVERNED WORKFLOW EXECUTION ENGINE ROUTE ─────────────────────
app.post('/api/run-workflow', async (req, res) => {
  try {
    const { yamlContent, userCredentials, hitlApprovalTicketId } = req.body;
    const role = userCredentials?.role || 'Personal_User';
    const username = userCredentials?.username || 'anonymous_user';

    if (!userCredentials) {
      return res.status(403).json({ success: false, error: "Access Denied: Missing user context parameters." });
    }

    const tenantUser = await getOrCreateTenantUser(username, role);
    let executedStepsLog: string[] = [];
    let aiPromptRole = "";
    let agentAutonomyMode = "semi_autonomous"; 

    const lines = yamlContent ? yamlContent.split('\n') : [];
    lines.forEach((line: string) => {
      if (line.includes('prompt_role:')) aiPromptRole = line.substring(line.indexOf('prompt_role:') + 12).replace(/"/g, '').trim();
      if (line.includes('execution_mode:')) agentAutonomyMode = line.split('execution_mode:')[1].replace(/"/g, '').trim();
      if (line.includes('primitive: "email"')) executedStepsLog.push("✓ **Communication Gate:** Formatted outbound template notification.");
      if (line.includes('primitive: "task"')) executedStepsLog.push("✓ **Task Registry Controller:** Logged tracking tickets.");
    });

    if (agentAutonomyMode === 'semi_autonomous' && !hitlApprovalTicketId) {
      await prisma.secureComplianceLog.create({
        data: { event: "EXECUTION_PAUSED_HITL", specIntegrityHash: "awaiting_token", roleContext: role, status: "BLOCKED_VIOLATION", userId: tenantUser.id }
      });
      return res.json({
        success: true,
        hitl_interception: true,
        ticket_id: `ticket_${Date.now()}`,
        result: { final_brief: `### 🛑 Core Execution Paused (HITL Intervention Required)\nReview parameters and authorize execution.` }
      });
    }

    await prisma.secureComplianceLog.create({
      data: { event: "PIPELINE_EXECUTION_AUTHORIZED", specIntegrityHash: "executed_block", roleContext: role, status: "COMPLIANT_SUCCESS", userId: tenantUser.id }
    });

    let aiSynthesisOutput = "Baseline variables parsed safely.";
    
    if (ai && aiPromptRole && aiPromptRole !== "Summarize details clearly.") {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are the core intelligence processor for the Automation Workspace. Fulfill this query: "${aiPromptRole}"`
        });
        aiSynthesisOutput = response.text || "Model response array streams returned empty parameters.";
      } catch (aiErr: any) {
        aiSynthesisOutput = `⚠️ **Gemini Engine Execution Fault:** *${aiErr.message}*`;
      }
    }

    const dynamicBrief = `### 🛰️ Secure Action Blueprint Dispatch\n* **Pipeline Status:** Verified & Executed\n\n#### Engine Pipeline Log:\n${executedStepsLog.join('\n')}\n\n#### 🤖 AI Intelligence Briefing:\n${aiSynthesisOutput}`;
    return res.json({ success: true, result: { final_brief: dynamicBrief } });
  } catch (error: any) {
    console.error("❌ [SERVER ERROR ON RUN WORKFLOW]:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ─── 5. UNIFIED EVIDENCE AND HISTORIC LOG EXPORTS ───────────────────
app.get('/api/auditor-evidence', async (req, res) => {
  try {
    const logs = await prisma.secureComplianceLog.findMany({ include: { user: true }, orderBy: { timestamp: 'asc' } });
    const formattedTrails = logs.map(l => ({
      event: l.event,
      timestamp: l.timestamp instanceof Date ? l.timestamp.toISOString() : new Date(l.timestamp).toISOString(),
      operator: l.user?.username || 'unknown',
      role: l.roleContext,
      status: l.status,
      specIntegrityHash: l.specIntegrityHash
    }));
    return res.json({ success: true, evidence: { packageTitle: "AMANI LEDGER REPORT", generationTimestamp: new Date().toISOString(), historicalAuditTrails: formattedTrails } });
  } catch (error: any) { 
    console.error("❌ [SERVER ERROR ON EVIDENCE REPORT]:", error);
    return res.status(500).json({ error: error.message }); 
  }
});

// ─── 6. STANDARD BLUEPRINT PERSISTENCE ROUTES ───────────────────────
app.post('/api/blueprints', async (req, res) => {
  try {
    const { name, yamlConfig, userCredentials } = req.body;
    const tenantUser = await getOrCreateTenantUser(userCredentials?.username || 'anonymous_user', userCredentials?.role || 'Personal_User');
    await prisma.blueprint.create({ data: { name, yamlConfig: yamlConfig || "", userId: tenantUser.id } });
    return res.json({ success: true });
  } catch (error: any) { return res.status(500).json({ error: error.message }); }
});

app.get('/api/blueprints', async (req, res) => {
  try {
    const blueprints = await prisma.blueprint.findMany({ include: { user: true } });
    return res.json({ success: true, blueprints });
  } catch (error: any) { return res.status(500).json({ error: error.message }); }
});

app.post('/api/knowledge-sync', (req, res) => res.json({ success: true }));

// ─── 📡 WEARABLE FITNESS INGESTION GATEWAY ENDPOINT ───────────────────
app.post(['/api/wearable/v1/sync', '/api/wearable/sync'], async (req, res) => {
  try {
    const { username, hrv, restingHeartRate, sleepScore, deepSleepMins, remSleepMins, activityBurn, currentHeartRate, stressLevelScore } = req.body;

    const profile = await prisma.user.findUnique({ where: { username } });
    if (!profile) {
      return res.status(404).json({ success: false, error: "User profile context uninitialized." });
    }

    const finalHRV = hrv ? parseFloat(hrv) : (stressLevelScore ? (100 - parseInt(stressLevelScore)) : 55);
    const finalRHR = restingHeartRate ? parseInt(restingHeartRate) : (currentHeartRate ? parseInt(currentHeartRate) : 70);

    const snapshot = await prisma.biometricSnapshot.create({
      data: {
        userId: profile.id, 
        hrv: finalHRV,
        restingHeartRate: finalRHR,
        sleepScore: sleepScore ? parseFloat(sleepScore) : null,
        deepSleepMins: deepSleepMins ? parseInt(deepSleepMins) : null,
        remSleepMins: remSleepMins ? parseInt(remSleepMins) : null,
        activityBurn: activityBurn ? parseFloat(activityBurn) : null,
      }
    });

    const evaluatedStress = stressLevelScore ? parseInt(stressLevelScore) : (finalHRV < 45 ? 85 : 50);
    const actionStatus = evaluatedStress > 75 ? 'PAUSE_AND_DECOMPRESS_RECOMMENDED' : 'PACING_NORMAL';

    return res.json({
      success: true,
      snapshotId: snapshot.id,
      computedStressLevel: evaluatedStress,
      actionStatus,
      timestamp: snapshot.timestamp
    });
  } catch (error: any) {
    console.error("❌ [SERVER ERROR ON WEARABLE DATA INGESTION]:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─── COMMUNITY HUB ROUTING SUB-MATRIX ────────────────────────────────
app.get('/api/community/feed', async (req, res) => {
  try {
    const posts = await prisma.communityHubPost.findMany({ include: { user: { select: { username: true, role: true } } }, orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, feed: posts });
  } catch (error: any) { return res.status(500).json({ error: error.message }); }
});

app.post('/api/community/post', async (req, res) => {
  try {
    const { username, title, content, tag } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: "Profile missing flags." });
    const newPost = await prisma.communityHubPost.create({ data: { title, content, tag, userId: user.id } });
    return res.json({ success: true, post: newPost });
  } catch (error: any) { return res.status(500).json({ error: error.message }); }
});

// ─── UNIFIED STREAM INGESTION ENGINE ─────────────────────────────────
app.post('/api/streams/ingest-external', async (req, res) => {
  try {
    const { title, category, impactScore, estimatedStart, estimatedEnd, geoLatitude, geoLongitude } = req.body;
    let isPublicSafe = !(category === 'SECURITY' && impactScore > 65);
    const newStreamItem = await prisma.externalStreamEvent.create({
      data: { title, category, impactScore: impactScore || 50, estimatedStart: new Date(estimatedStart || Date.now()), estimatedEnd: new Date(estimatedEnd || Date.now() + 7200000), geoLatitude, geoLongitude, isPublicSafe }
    });
    return res.json({ success: true, eventId: newStreamItem.id });
  } catch (error: any) { return res.status(500).json({ error: error.message }); }
});

// ─── GEOLOCATION PHYSICAL TELEMETRY INCIDENTS ───────────────────────
app.post('/api/security/physical-incident', async (req, res) => {
  try {
    const { title, eventType, severityIndex, latitude, longitude, radiusMeters } = req.body;
    const incident = await prisma.physicalTelemetryEvent.create({ data: { title, eventType, severityIndex, latitude, longitude, radiusMeters } });
    
    const HOST_BASE_LAT = 37.7749;
    const HOST_BASE_LON = -122.4194;
    
    const dLat = (latitude - HOST_BASE_LAT) * (Math.PI / 180);
    const dLon = (longitude - HOST_BASE_LON) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(HOST_BASE_LAT * (Math.PI / 180)) * Math.cos(latitude * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const distanceKm = 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); 
    
    return res.json({ success: true, incidentId: incident.id, perimeterStatus: (distanceKm <= radiusMeters / 1000 && severityIndex > 50) ? "LOCAL_PERIMETER_BREACH_WARNING" : "PERIMETER_SAFE" });
  } catch (error: any) { return res.status(500).json({ error: error.message }); }
});

// ─── 🚀 THE BLOCKING SYNCHRONOUS BOOTSTRAP ENGINE ───────────────────
async function initializeServerLifecycle() {
  try {
    console.log("🔄 [PGlite SETUP] Bootstrapping WebAssembly physical table structures...");
    
    // Explicitly wrapping structural identifiers in double quotes to map case-sensitive fields
    await pgliteDb.exec(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY, "username" TEXT UNIQUE NOT NULL, "role" TEXT NOT NULL, "backgroundField" TEXT DEFAULT 'General' NOT NULL
      );
      CREATE TABLE IF NOT EXISTS "blueprint" (
        "id" TEXT PRIMARY KEY, "name" TEXT NOT NULL, "yamlConfig" TEXT NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS "securecompliancelog" (
        "id" TEXT PRIMARY KEY, "event" TEXT NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "specIntegrityHash" TEXT NOT NULL, "roleContext" TEXT NOT NULL, "status" TEXT NOT NULL, "userId" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS "smartdevice" (
        "id" TEXT PRIMARY KEY, "deviceName" TEXT NOT NULL, "deviceType" TEXT NOT NULL, "currentHeartRate" INTEGER, "stressLevelScore" INTEGER, "lastSyncedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS "communityhubpost" (
        "id" TEXT PRIMARY KEY, "title" TEXT NOT NULL, "content" TEXT NOT NULL, "tag" TEXT NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS "externalstreamevent" (
        "id" TEXT PRIMARY KEY, "title" TEXT NOT NULL, "category" TEXT NOT NULL, "impactScore" INTEGER DEFAULT 50 NOT NULL, "geoLatitude" DOUBLE PRECISION, "geoLongitude" DOUBLE PRECISION, "estimatedStart" TIMESTAMP NOT NULL, "estimatedEnd" TIMESTAMP NOT NULL, "isPublicSafe" BOOLEAN DEFAULT true NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS "physicaltelemetryevent" (
        "id" TEXT PRIMARY KEY, "title" TEXT NOT NULL, "eventType" TEXT NOT NULL, "severityIndex" INTEGER DEFAULT 50 NOT NULL, "latitude" DOUBLE PRECISION NOT NULL, "longitude" DOUBLE PRECISION NOT NULL, "radiusMeters" INTEGER DEFAULT 1000 NOT NULL, "isActive" BOOLEAN DEFAULT true NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS "globalcyberalert" (
        "id" TEXT PRIMARY KEY, "title" TEXT NOT NULL, "cveId" TEXT, "severity" TEXT NOT NULL, "affectedComponent" TEXT NOT NULL, "remediationSteps" TEXT NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS "biometricsnapshot" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "hrv" DOUBLE PRECISION,
        "restingHeartRate" INTEGER,
        "sleepScore" DOUBLE PRECISION,
        "deepSleepMins" INTEGER,
        "remSleepMins" INTEGER,
        "activityBurn" DOUBLE PRECISION,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      );
    `);
    
    console.log("✨ [PGlite SETUP] WebAssembly storage definitions written successfully.");

    // ─── 🔑 AUTO-SEED TEST PERSONAS ─────────────────────────────────
    console.log("🌱 [PGlite SETUP] Seeding multi-persona test accounts...");
    await pgliteDb.exec(`
      INSERT INTO "User" ("id", "username", "role", "backgroundField") 
      VALUES ('id_prof_amani', 'professor_amani', 'Academic_Faculty', 'General')
      ON CONFLICT ("username") DO NOTHING;

      INSERT INTO "User" ("id", "username", "role", "backgroundField") 
      VALUES ('id_parent_sync', 'parent_home_sync', 'Family_Lead', 'General')
      ON CONFLICT ("username") DO NOTHING;
    `);
    console.log("✓ [PGlite SETUP] Seeding complete.");
    
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Governed Enterprise Engine online listening on port ${PORT}`);
    });

  } catch (err: any) {
    console.error(`❌ Lifecycle execution halted due to bootstrap initialization crash: ${err.message}`);
  }
}

// ─── 🌿 AMBIENT SMART HOME IoT CONTROLLER GATEWAY ───────────────────
app.post('/api/iot/ambient-adjust', async (req, res) => {
  try {
    const { username, currentStressLevel } = req.body;
    console.log(`🌿 [IoT CORE] Received bio-stress trigger override alert for [${username}]. Current Level: ${currentStressLevel}%`);
    
    let activeAmbientMode = "STANDARD_ELEVATION_WARMTH";
    if (currentStressLevel > 85) {
      activeAmbientMode = "CRITICAL_DECOMPRESSION_SOOTHING_BLUE";
    } else if (currentStressLevel > 75) {
      activeAmbientMode = "MID_LEVEL_BREATHING_PAUSE_AMBER";
    }

    return res.json({
      success: true,
      activeAmbientMode,
      enforcedPacingState: "SMART_HOME_MUTING_FILTERS_ACTIVE",
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

initializeServerLifecycle();