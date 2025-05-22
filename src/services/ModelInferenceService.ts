/**
 * ModelInferenceService - Service for running inference with llama.cpp models
 * 
 * This service extends the LlamaService with more advanced inference capabilities
 * including streaming responses, model switching, and inference history.
 */

import { llama, ModelType, InferenceOptions, InferenceResult, ModelConfig } from './LlamaService';

export interface InferenceContext {
  sessionId: string;
  history: InferenceHistoryItem[];
  modelType: ModelType;
}

export interface InferenceHistoryItem {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
  modelType: ModelType;
  modelName: string;
  tokensUsed: number;
  timeTaken: number;
}

export interface StreamingCallback {
  (text: string, isDone: boolean): void;
}

export class ModelInferenceService {
  private activeContext: InferenceContext | null = null;
  private activeStreamingSession: string | null = null;
  
  /**
   * Initialize the ModelInference service
   */
  constructor() {
    console.log('ModelInferenceService initialized');
  }

  /**
   * Create a new inference context
   */
  createContext(modelType: ModelType): InferenceContext {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const context: InferenceContext = {
      sessionId,
      history: [],
      modelType
    };
    
    this.activeContext = context;
    return context;
  }

  /**
   * Run inference on a prompt
   */
  async runInference(
    prompt: string, 
    options: InferenceOptions = {}
  ): Promise<InferenceResult> {
    // Ensure we have an active context
    if (!this.activeContext) {
      this.createContext('text');
    }
    
    const modelType = this.activeContext?.modelType || 'text';
    
    // Make sure the model is loaded
    const activeModel = llama.getActiveModelConfig();
    if (!activeModel || activeModel.type !== modelType) {
      // Need to load the correct model type
      await this.switchModel(modelType);
    }
    
    // Run inference
    const result = await llama.infer(prompt, options);
    
    // Add to history
    const historyItem: InferenceHistoryItem = {
      id: `inference-${Date.now()}`,
      prompt,
      response: result.text,
      timestamp: new Date(),
      modelType,
      modelName: llama.getActiveModelConfig()?.name || 'Unknown',
      tokensUsed: result.tokensUsed,
      timeTaken: result.timeTaken
    };
    
    if (this.activeContext) {
      this.activeContext.history.push(historyItem);
    }
    
    return result;
  }

  /**
   * Run streaming inference
   */
  async runStreamingInference(
    prompt: string,
    callback: StreamingCallback,
    options: InferenceOptions = {}
  ): Promise<void> {
    if (!this.activeContext) {
      this.createContext('text');
    }
    
    const modelType = this.activeContext?.modelType || 'text';
    const sessionId = `streaming-${Date.now()}`;
    this.activeStreamingSession = sessionId;
    
    // Make sure the model is loaded
    const activeModel = llama.getActiveModelConfig();
    if (!activeModel || activeModel.type !== modelType) {
      // Need to load the correct model type
      await this.switchModel(modelType);
    }
    
    // In a real implementation, this would stream chunks from the llama.cpp server
    // For now, simulate streaming with chunks
    const fullResult = await llama.infer(prompt, {
      ...options,
      streamResponse: true
    });
    
    // Only continue if this is still the active streaming session
    if (this.activeStreamingSession !== sessionId) {
      return;
    }
    
    const chunks = this.simulateStreamingChunks(fullResult.text);
    let accumulatedText = '';
    
    for (const chunk of chunks) {
      // Check if the streaming has been cancelled
      if (this.activeStreamingSession !== sessionId) {
        break;
      }
      
      accumulatedText += chunk;
      callback(chunk, false);
      await new Promise(resolve => setTimeout(resolve, 50)); // delay between chunks
    }
    
    // Final callback with isDone=true
    if (this.activeStreamingSession === sessionId) {
      callback('', true);
      this.activeStreamingSession = null;
      
      // Add to history
      if (this.activeContext) {
        const historyItem: InferenceHistoryItem = {
          id: `inference-${Date.now()}`,
          prompt,
          response: accumulatedText,
          timestamp: new Date(),
          modelType,
          modelName: llama.getActiveModelConfig()?.name || 'Unknown',
          tokensUsed: Math.floor(accumulatedText.length / 4), // rough approximation
          timeTaken: chunks.length * 50 // rough approximation
        };
        
        this.activeContext.history.push(historyItem);
      }
    }
  }

  /**
   * Cancel any ongoing streaming inference
   */
  cancelStreaming(): void {
    this.activeStreamingSession = null;
  }

  /**
   * Switch to a different model type
   */
  async switchModel(modelType: ModelType): Promise<boolean> {
    if (this.activeContext) {
      this.activeContext.modelType = modelType;
    }
    
    // First, check if the server is running with the correct model
    const serverStatus = llama.getServerStatus();
    if (serverStatus.running) {
      const activeModel = llama.getActiveModelConfig();
      if (activeModel?.type === modelType) {
        // Already using the right model type
        return true;
      }
    }
    
    // Get the selected model for this type
    const models = llama.getAvailableModels(modelType);
    if (models.length === 0) {
      console.error(`No models available for type: ${modelType}`);
      return false;
    }
    
    // Use the first available model (in a real app, this would use the selected model)
    const modelConfig = models[0];
    
    // Load the model
    try {
      await llama.startServer(modelConfig);
      return true;
    } catch (error) {
      console.error(`Failed to switch to model type ${modelType}:`, error);
      return false;
    }
  }

  /**
   * Get the active inference context
   */
  getActiveContext(): InferenceContext | null {
    return this.activeContext;
  }

  /**
   * Clear the inference history
   */
  clearHistory(): void {
    if (this.activeContext) {
      this.activeContext.history = [];
    }
  }

  /**
   * Helper to simulate streaming chunks
   */
  private simulateStreamingChunks(text: string): string[] {
    const words = text.split(' ');
    const chunks: string[] = [];
    
    let currentChunk = '';
    for (const word of words) {
      currentChunk += word + ' ';
      
      // Create chunks of roughly similar size
      if (currentChunk.length >= 10 || Math.random() > 0.7) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
    }
    
    // Add any remaining text
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  }
}

// Create a singleton instance
export const modelInference = new ModelInferenceService();
