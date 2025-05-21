
import { config } from 'dotenv';
config();

import '@/ai/flows/codebase-aware-assistant.ts';
import '@/ai/flows/generate-index.ts';
import '@/ai/flows/refactor-code-flow.ts';
import '@/ai/flows/generate-code-from-prompt-flow.ts'; // Add import for the new code generation flow

