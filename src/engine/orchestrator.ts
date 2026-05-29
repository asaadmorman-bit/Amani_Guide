import * as yaml from 'js-yaml';
import axios from 'axios';
import OpenAI from 'openai';
import 'dotenv/config';

// We use the OpenAI SDK, but point it directly at Groq's insanely fast servers!
const aiClient = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});
export interface WorkflowConfig {
    name: string;
    agents: AgentDef[];
    tools: { mcp_server: string }[];
    steps: StepDef[];
}

type GraphState = Record<string, any>;

export class AmaniOrchestrator {
    private config: WorkflowConfig;
    private state: GraphState = {};

    constructor(yamlString: string) {
        this.config = yaml.load(yamlString) as WorkflowConfig;
    }

    private formatActionWithState(action: string): string {
        let formattedAction = action;
        for (const [key, value] of Object.entries(this.state)) {
            formattedAction = formattedAction.replace(`{${key}}`, String(value));
        }
        return formattedAction;
    }

    // --- NEW: LIVE TOOL RUNNER ---
    private async runTool(toolName: string): Promise<string> {
        console.log(`\n🛠️  [Executing Live Tool: ${toolName}]`);
        
        if (toolName === "github_api_reader") {
            try {
                const url = "https://api.github.com/repos/asaadmorman-bit/Amani_Guide/issues";
                
                // Axios automatically handles the JSON parsing for you!
               

                    const response = await axios.get(url, {
                        headers: {
                            "Accept": "application/vnd.github+json",
                            "X-GitHub-Api-Version": "2022-11-28",
                            "User-Agent": "Amani-Guide-OS",
                            "Authorization": "Bearer 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" // <--- Add this line
                        }
                    });
                
                const data = response.data;
                
                if (data.length === 0) return "No open issues found in the repository.";
                
                const mappedData = data.map((issue: any) => ({ title: issue.title, state: issue.state }));
                return JSON.stringify(mappedData);
                
            } catch (error: any) {
                return `Tool Execution Failed: ${error.message}`;
            }
        }
        return "Unknown Tool Requested.";
    }
    // --- MOCK AI CALL ---
    private async callLLM(agentRole: string, prompt: string, model: string): Promise<string> {
        // 1. Tool Interception
        if (prompt.startsWith("USE_TOOL:")) {
            const requestedTool = prompt.split(":")[1].trim();
            return await this.runTool(requestedTool);
        }

        // 2. The Real AI Call
        console.log(`\n🤖 [Routing to real LLM via Groq API]`);
        console.log(`   Task: Pondering the data...`);
        
        try {
            // We use Llama 3 (8 Billion parameters) for lightning-fast reasoning
            const response = await aiClient.chat.completions.create({
                model: "llama-3.1-8b-instant", 
                messages: [
                    { role: "system", content: agentRole },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2,
            });

            return response.choices[0].message.content || "Error: No response generated.";
            
        } catch (error: any) {
            console.error("❌ LLM API Error:", error.message);
            return `AI Execution Failed: ${error.message}`;
        }
    }
    public async run() {
        console.log(`\n🚀 STARTING LIVE WORKFLOW: ${this.config.name}`);
        console.log(`-------------------------------------------------`);

        let currentStepId: string | undefined = this.config.steps[0]?.step_id;

        while (currentStepId) {
            const step: StepDef | undefined = this.config.steps.find(s => s.step_id === currentStepId);
            
            if (!step) break;

            console.log(`\n▶ EXECUTING STEP: ${step.step_id}`);
            
            const agent = this.config.agents.find(a => a.id === step.agent);
            if (!agent) break;

            const hydratedAction = this.formatActionWithState(step.action);
            
            // Execute the AI (which now knows how to trigger the live Tool)
            const result = await this.callLLM(agent.role, hydratedAction, agent.model);

            const cleanResult = result.trim();
            this.state[step.output_key] = cleanResult;
            console.log(`💾 Saved output to memory key: {${step.output_key}}`);

            if (step.routing) {
                const nextPath = step.routing[cleanResult];
                currentStepId = nextPath ? nextPath : undefined;
            } else if (step.next_step) {
                currentStepId = step.next_step;
            } else {
                currentStepId = undefined;
            }
        }

        console.log(`\n✅ WORKFLOW EXECUTION TERMINATED. Final State:`);
        console.log(this.state);
        return this.state;
    }
}