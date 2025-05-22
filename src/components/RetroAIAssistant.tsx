"use client";

import { useState, useRef, useEffect } from 'react';
import { RetroWindow } from '@/components/RetroWindow';
import { llama, type ModelType } from '@/services/LlamaService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { RetroButton } from '@/components/RetroButton';
import { cn } from '@/lib/utils';
import { Cpu, CircleAlert, Sparkles, Zap, Code, Brain, Loader2, FileText } from 'lucide-react';

interface RetroAIAssistantProps {
  className?: string;
  initialContext?: string;
}

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export function RetroAIAssistant({ className, initialContext }: RetroAIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      role: 'system',
      content: initialContext || 'Local LLM assistant powered by llama.cpp',
      timestamp: new Date()
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeModel, setActiveModel] = useState<ModelType>('code');
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear any intervals on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleModelChange = async (modelType: ModelType) => {
    if (modelType === activeModel) return;
    
    try {
      setModelLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      // Start progress interval
      progressIntervalRef.current = setInterval(() => {
        const currentProgress = llama.getLoadingProgress();
        setLoadingProgress(currentProgress);
        if (currentProgress >= 100 && progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
      }, 100);
      
      await llama.setActiveModel(modelType);
      setActiveModel(modelType);
      
      // Add system message about model change
      const modelInfo = llama.getActiveModel();
      addMessage({
        id: `system-model-${Date.now()}`,
        role: 'system',
        content: `Switched to ${modelType} model: ${modelInfo?.name}`,
        timestamp: new Date()
      });
      
    } catch (err) {
      console.error('Error changing model:', err);
      setError('Failed to load model. Please try again.');
    } finally {
      setModelLoading(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    // Add user message
    addMessage(userMessage);
    setPrompt('');
    
    // Start generating response
    setLoading(true);
    setError(null);
    
    try {
      // Run inference
      const result = await llama.infer(prompt, {
        temperature: activeModel === 'code' ? 0.2 : 0.7,
        maxTokens: 512
      });
      
      // Add assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: result.text,
        timestamp: new Date()
      };
      
      addMessage(assistantMessage);
      
      // Add system message with stats
      addMessage({
        id: `system-stats-${Date.now()}`,
        role: 'system',
        content: `Generated ${result.tokensUsed} tokens in ${(result.timeTaken / 1000).toFixed(2)}s`,
        timestamp: new Date()
      });
      
    } catch (err) {
      console.error('Inference error:', err);
      setError('Failed to generate response. Please try again.');
      
      // Add error message
      addMessage({
        id: `system-error-${Date.now()}`,
        role: 'system',
        content: `Error: Failed to generate response`,
        timestamp: new Date() 
      });
    } finally {
      setLoading(false);
    }
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <RetroWindow 
      title="AI Assistant Prompt Console" 
      className={cn("flex flex-col h-full", className)}
    >
      <div className="flex items-center justify-between px-2 py-1 border-b border-[hsl(var(--border-dark))] bg-card/50">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleModelChange('text')}
            className={cn(
              "px-2 py-1 text-xs rounded flex items-center space-x-1",
              activeModel === 'text' ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            )}
            disabled={loading || modelLoading}
          >
            <FileText size={12} />
            <span>Text</span>
          </button>
          
          <button 
            onClick={() => handleModelChange('code')}
            className={cn(
              "px-2 py-1 text-xs rounded flex items-center space-x-1",
              activeModel === 'code' ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80" 
            )}
            disabled={loading || modelLoading}
          >
            <Code size={12} />
            <span>Code</span>
          </button>
          
          <button 
            onClick={() => handleModelChange('reasoning')}
            className={cn(
              "px-2 py-1 text-xs rounded flex items-center space-x-1",
              activeModel === 'reasoning' ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            )}
            disabled={loading || modelLoading}
          >
            <Brain size={12} />
            <span>Reasoning</span>
          </button>
        </div>
        
        <div className="flex items-center text-xs">
          <span className={cn(
            "flex items-center",
            modelLoading ? "text-yellow-500" : "text-green-500"
          )}>
            {modelLoading ? (
              <>
                <Loader2 size={12} className="mr-1 animate-spin" />
                <span>Loading {loadingProgress}%</span>
              </>
            ) : (
              <>
                <Cpu size={12} className="mr-1" />
                <span>Local LLM Ready</span>
              </>
            )}
          </span>
        </div>
      </div>
      
      <ScrollArea className="flex-grow p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={cn(
                "p-2 rounded-md min-w-[200px]",
                message.role === 'user' ? "bg-muted ml-10" : 
                message.role === 'assistant' ? "bg-secondary/50 mr-10" : 
                "bg-background/50 text-muted-foreground text-xs italic text-center"
              )}
            >
              {message.role === 'user' && (
                <div className="flex items-center mb-1 text-xs text-muted-foreground">
                  <span className="font-bold">You</span>
                  <span className="ml-auto">{message.timestamp.toLocaleTimeString()}</span>
                </div>
              )}
              
              {message.role === 'assistant' && (
                <div className="flex items-center mb-1 text-xs text-muted-foreground">
                  <span className="font-bold flex items-center">
                    <Sparkles size={12} className="mr-1 text-primary" />
                    Assistant
                  </span>
                  <span className="ml-auto">{message.timestamp.toLocaleTimeString()}</span>
                </div>
              )}
              
              {message.role === 'system' ? (
                <div className="text-center">{message.content}</div>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {error && (
        <div className="p-2 bg-destructive/20 border border-destructive/50 text-destructive text-sm mb-2 mx-2 rounded">
          <div className="flex items-center">
            <CircleAlert size={14} className="mr-1" />
            {error}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-2 border-t border-[hsl(var(--border-light))]">
        <div className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="min-h-[60px] h-[60px] bg-input text-foreground resize-none"
            disabled={loading || modelLoading}
          />
          <div className="flex flex-col justify-between">
            <RetroButton
              type="submit"
              variant="accent"
              disabled={!prompt.trim() || loading || modelLoading}
              className="px-3 py-1 h-[60px] flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
            </RetroButton>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>
            Model: {activeModel.charAt(0).toUpperCase() + activeModel.slice(1)}
          </span>
          <span>Local Inference</span>
        </div>
      </form>
    </RetroWindow>
  );
}
