"use client";

import React, { useState, useEffect } from 'react';
import { llama, ModelType, ModelConfig } from '../services/LlamaService';
import { agentGPT } from '../services/AgentGPTService';

interface TabProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ title, active, onClick }) => (
  <div 
    className={`px-4 py-2 cursor-pointer border-b-2 ${active ? 'border-primary text-primary font-bold' : 'border-transparent hover:border-gray-400'}`}
    onClick={onClick}
  >
    {title}
  </div>
);

export function ModelManager() {
  const [activeTab, setActiveTab] = useState<ModelType>('text');
  const [models, setModels] = useState<Record<ModelType, ModelConfig[]>>({
    text: [],
    code: [],
    reasoning: []
  });
  const [selectedModels, setSelectedModels] = useState<Record<ModelType, string>>({
    text: '',
    code: '',
    reasoning: ''
  });
  const [serverStatus, setServerStatus] = useState({
    running: false,
    modelLoaded: null as string | null
  });
  const [agentGPTStatus, setAgentGPTStatus] = useState({
    running: false
  });

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      const allModels = llama.getAllModels();
      setModels(allModels);
      
      // Pre-select the first model of each type
      const initialSelections: Record<ModelType, string> = {
        text: allModels.text[0]?.name || '',
        code: allModels.code[0]?.name || '',
        reasoning: allModels.reasoning[0]?.name || ''
      };
      setSelectedModels(initialSelections);
      
      // Current statuses
      const status = llama.getServerStatus();
      setServerStatus({
        running: status.running,
        modelLoaded: status.modelLoaded
      });
      
      setAgentGPTStatus({
        running: agentGPT.isAgentGPTRunning()
      });
    };
    
    loadModels();
    
    // Status polling
    const interval = setInterval(() => {
      const status = llama.getServerStatus();
      setServerStatus({
        running: status.running,
        modelLoaded: status.modelLoaded
      });
      
      setAgentGPTStatus({
        running: agentGPT.isAgentGPTRunning()
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle model selection
  const handleSelectModel = (type: ModelType, modelName: string) => {
    setSelectedModels(prev => ({
      ...prev,
      [type]: modelName
    }));
  };

  // Start/Stop server functions
  const handleStartServer = async () => {
    const modelName = selectedModels[activeTab];
    if (!modelName) return;
    
    const modelConfig = models[activeTab].find(m => m.name === modelName);
    if (!modelConfig) return;
    
    const started = await llama.startServer(modelConfig);
    if (started) {
      const status = llama.getServerStatus();
      setServerStatus({
        running: status.running,
        modelLoaded: status.modelLoaded
      });
    }
  };

  const handleStopServer = async () => {
    await llama.stopServer();
    const status = llama.getServerStatus();
    setServerStatus({
      running: status.running,
      modelLoaded: status.modelLoaded
    });
  };

  // AgentGPT controls
  const handleStartAgentGPT = async () => {
    await agentGPT.startAgentGPTPlatform();
    setAgentGPTStatus({
      running: agentGPT.isAgentGPTRunning()
    });
  };

  const handleStopAgentGPT = async () => {
    await agentGPT.stopAgentGPTPlatform();
    setAgentGPTStatus({
      running: agentGPT.isAgentGPTRunning()
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Model Management</h2>
      
      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 border rounded-md">
          <h3 className="font-medium">llama.cpp Status</h3>
          <div className="flex items-center mt-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${serverStatus.running ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span>{serverStatus.running ? 'Running' : 'Stopped'}</span>
          </div>
          <div className="mt-4">
            {serverStatus.running ? (
              <button 
                onClick={handleStopServer}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Stop Server
              </button>
            ) : (
              <button 
                onClick={handleStartServer}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                Start Server
              </button>
            )}
          </div>
        </div>

        <div className="p-3 border rounded-md">
          <h3 className="font-medium">AgentGPT Status</h3>
          <div className="flex items-center mt-2">
            <div className={`w-3 h-3 rounded-full mr-2 ${agentGPTStatus.running ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span>{agentGPTStatus.running ? 'Running' : 'Stopped'}</span>
          </div>
          <div className="mt-4">
            {agentGPTStatus.running ? (
              <button 
                onClick={handleStopAgentGPT}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Stop AgentGPT
              </button>
            ) : (
              <button 
                onClick={handleStartAgentGPT}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                Start AgentGPT
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Model Type Tabs */}
      <div className="flex border-b mb-4">
        <Tab title="Text Models" active={activeTab === 'text'} onClick={() => setActiveTab('text')} />
        <Tab title="Code Models" active={activeTab === 'code'} onClick={() => setActiveTab('code')} />
        <Tab title="Reasoning Models" active={activeTab === 'reasoning'} onClick={() => setActiveTab('reasoning')} />
      </div>

      {/* Model List */}
      <div>
        <h3 className="text-xl font-medium mb-3">Available Models</h3>
        {models[activeTab].length === 0 ? (
          <div className="p-3 border border-dashed text-center text-gray-500">
            No models available
          </div>
        ) : (
          <div className="space-y-2">
            {models[activeTab].map(model => (
              <div 
                key={model.name} 
                className={`p-3 border rounded-md ${selectedModels[activeTab] === model.name ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <input 
                    type="radio"
                    name={`model-${activeTab}`}
                    checked={selectedModels[activeTab] === model.name}
                    onChange={() => handleSelectModel(activeTab, model.name)}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm text-gray-600">{model.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
