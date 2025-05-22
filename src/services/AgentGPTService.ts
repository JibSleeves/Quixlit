/**
 * AgentGPTService - Service for interfacing with AgentGPT
 * 
 * This service provides functionality to:
 * 1. Start and stop the AgentGPT platform
 * 2. Create and manage agents
 * 3. Run tasks using multi-agent workflows
 */

import { ModelType } from './LlamaService';

export interface AgentGPTConfig {
  enabled: boolean;
  apiBaseUrl: string;
  port: number;
  modelType: ModelType;
}

export interface AgentTaskResult {
  task: string;
  result: string;
  completed: boolean;
  error?: string;
}

export interface AgentTask {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
}

export class AgentGPTService {
  private isRunning = false;
  private serverPid?: number;
  private config: AgentGPTConfig = {
    enabled: false,
    apiBaseUrl: 'http://localhost:8000',
    port: 8000,
    modelType: 'reasoning'
  };
  
  private activeTasks: AgentTask[] = [];

  /**
   * Initialize the AgentGPT service
   */
  constructor() {
    console.log('AgentGPTService initialized');
  }

  /**
   * Start the AgentGPT platform
   */
  async startAgentGPTPlatform(): Promise<boolean> {
    if (this.isRunning) {
      console.log('AgentGPT platform is already running');
      return true;
    }

    console.log('Starting AgentGPT platform...');

    try {
      // In a real implementation, this would start the AgentGPT platform using Tauri APIs
      // For now, just update the state
      this.isRunning = true;
      this.serverPid = 12346; // Mock PID
      this.config.enabled = true;

      console.log(`AgentGPT platform started with PID: ${this.serverPid}`);
      return true;
    } catch (error) {
      console.error('Failed to start AgentGPT platform:', error);
      return false;
    }
  }

  /**
   * Stop the AgentGPT platform
   */
  async stopAgentGPTPlatform(): Promise<boolean> {
    if (!this.isRunning) {
      console.log('AgentGPT platform is not running');
      return true;
    }

    console.log('Stopping AgentGPT platform...');

    try {
      // In a real implementation, this would stop the AgentGPT platform using Tauri APIs
      // For now, just update the state
      this.isRunning = false;
      this.serverPid = undefined;
      this.config.enabled = false;

      console.log('AgentGPT platform stopped');
      return true;
    } catch (error) {
      console.error('Failed to stop AgentGPT platform:', error);
      return false;
    }
  }

  /**
   * Update AgentGPT configuration
   */
  async updateConfig(config: Partial<AgentGPTConfig>): Promise<void> {
    const wasRunning = this.isRunning;
    
    if (wasRunning) {
      await this.stopAgentGPTPlatform();
    }
    
    this.config = {
      ...this.config,
      ...config
    };
    
    if (wasRunning) {
      await this.startAgentGPTPlatform();
    }
  }

  /**
   * Get current AgentGPT configuration
   */
  getConfig(): AgentGPTConfig {
    return { ...this.config };
  }

  /**
   * Check if AgentGPT platform is running
   */
  isAgentGPTRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Create a new agent task
   */
  async createAgentTask(name: string, description: string): Promise<AgentTask> {
    if (!this.isRunning) {
      await this.startAgentGPTPlatform();
    }
    
    const newTask: AgentTask = {
      id: `task-${Date.now()}`,
      name,
      description,
      status: 'pending'
    };
    
    this.activeTasks.push(newTask);
    
    return newTask;
  }

  /**
   * Get a list of active tasks
   */
  getActiveTasks(): AgentTask[] {
    return [...this.activeTasks];
  }

  /**
   * Run an agent task
   */
  async runAgentTask(taskId: string): Promise<AgentTaskResult> {
    const taskIndex = this.activeTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error(`Task ${taskId} not found`);
    }
    
    const task = this.activeTasks[taskIndex];
    
    if (task.status === 'running') {
      throw new Error(`Task ${taskId} is already running`);
    }
    
    if (task.status === 'completed') {
      return {
        task: task.name,
        result: task.result || 'Task completed with no result',
        completed: true
      };
    }
    
    // Update task status
    this.activeTasks[taskIndex] = {
      ...task,
      status: 'running'
    };
    
    try {
      // In a real implementation, this would call the AgentGPT API
      // For now, simulate a delay and return a mock result
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = `Task "${task.name}" completed successfully. The multi-agent workflow has analyzed the request and generated a solution according to the specified requirements.`;
      
      // Update task status
      this.activeTasks[taskIndex] = {
        ...task,
        status: 'completed',
        result
      };
      
      return {
        task: task.name,
        result,
        completed: true
      };
    } catch (error) {
      // Update task status
      this.activeTasks[taskIndex] = {
        ...task,
        status: 'failed',
        result: `Error: ${error instanceof Error ? error.message : String(error)}`
      };
      
      return {
        task: task.name,
        result: this.activeTasks[taskIndex].result || '',
        completed: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}

// Export a singleton instance
export const agentGPT = new AgentGPTService();
