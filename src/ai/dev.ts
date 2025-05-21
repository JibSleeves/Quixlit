
import { config } from 'dotenv';
config();

import '@/ai/flows/codebase-aware-assistant.ts';
import '@/ai/flows/generate-index.ts';
import '@/ai/flows/refactor-code-flow.ts'; // Add import for the new refactor flow
