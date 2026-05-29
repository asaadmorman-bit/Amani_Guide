import * as fs from 'fs';
import { AmaniOrchestrator } from './src/engine/orchestrator';

async function test() {
    // 1. Read the YAML file you created
    const yamlContent = fs.readFileSync('./example-workflow.yaml', 'utf8');
    
    // 2. Feed it into the Amani Engine
    const engine = new AmaniOrchestrator(yamlContent);
    
    // 3. Execute
    await engine.run();
}

test();