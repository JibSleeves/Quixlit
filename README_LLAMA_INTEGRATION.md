# Quixlit with llama.cpp and AgentGPT Integration

This integration combines three powerful technologies:
1. **Quixlit** - The main application with UI for local development
2. **llama.cpp** - Fast C++ inference for local AI models
3. **AgentGPT** - Multi-agent architecture for complex reasoning tasks

## Features

- **Local Model Management**: Upload, select, and manage models for different purposes
- **Built-in Service Controls**: Start and stop llama.cpp and AgentGPT services from the UI
- **Multiple Model Support**: Configure different models for text generation, code completion, and reasoning
- **Multi-Agent Operations**: Leverage AgentGPT's multi-agent capabilities for complex tasks
- **Custom Model Upload**: Add your own GGUF format models for specific tasks

## Prerequisites

- A compiled version of llama.cpp
- GGUF model files for inference (Llama 3, CodeLlama, etc.)
- Python 3.8+ for running AgentGPT platform
- Node.js and npm for the Quixlit UI

## Quick Start

### Windows

```bash
# Start the integration with your model
start_llama_integration.bat path\to\model.gguf
```

### Linux/macOS

```bash
# Make the script executable
chmod +x start_llama_integration.sh

# Start the integration with your model
./start_llama_integration.sh --model=/path/to/model.gguf
```

## Manual Setup

If you prefer to start the components manually:

1. **Start llama.cpp server**:
```bash
cd llama.cpp
./llama-server -m /path/to/model.gguf --port 8080 -c 4096
```

2. **Start AgentGPT platform**:
```bash
# Set environment variables
export REWORKD_API_FF_LLAMA_MODE_ENABLED=true
export REWORKD_API_LLAMA_API_BASE=http://localhost:8080/v1

# Start the platform
cd AgentGPT/platform
python -m reworkd_platform
```

3. **Start Quixlit UI**:
```bash
npm run dev
```

The UI will be available at http://localhost:3000

## Configuration Options

### Shell Script Options (for Linux/macOS)

```
Usage: ./start_llama_integration.sh --model=/path/to/model.gguf [--port=8080] [--ctx=4096] [--gpu-layers=0]
```

- `--model`: Path to the GGUF model file (required)
- `--port`: Port for the llama.cpp server (default: 8080)
- `--ctx`: Context size for inference (default: 4096)
- `--gpu-layers`: Number of layers to offload to GPU (default: 0, set higher for GPU acceleration)

## Using Different Models for Different Tasks

The integration allows you to configure three types of models:

1. **Text Models**: For general text generation and completion
2. **Code Models**: Specialized for code generation and understanding
3. **Reasoning Models**: Used for complex reasoning tasks and utilized by AgentGPT

You can upload and select different models for each purpose through the UI.

## Uploading Custom Models

To use your own models:

1. Visit the Model Management page in the UI
2. Select the model type (text, code, reasoning)
3. Click "Upload Model" and select your GGUF file
4. Fill in the model details:
   - Name: A descriptive name for your model
   - Context Size: Typically 2048, 4096, 8192, etc.
   - Quantization: Bit precision (4bit, 5bit, 8bit)
   - GPU Required: Whether the model requires GPU acceleration
   - Description: Information about the model

## Troubleshooting

### Common Issues

1. **Model loading error**: Ensure the model path is correct and the model file exists
2. **Port conflict**: If port 8080 is already in use, specify a different port
3. **Out of memory**: Try reducing the context size or using a smaller model
4. **Slow inference**: Enable GPU acceleration by setting `--gpu-layers` to a higher value

### Logs

Check the logs from all three components for detailed error messages:
- llama.cpp server terminal
- AgentGPT platform terminal
- Quixlit UI terminal

## Architecture

The integration consists of:

1. **LlamaService**: Frontend service for managing models and the llama.cpp server
2. **AgentGPTService**: Frontend service for managing the AgentGPT platform
3. **ModelInferenceService**: Service for running inference with selected models
4. **ModelManager**: UI component for model management
5. **Start Scripts**: Integration scripts for Windows and Linux/macOS

## Advanced Usage

### Custom Inference Options

When using inference, you can specify additional options:
- Temperature: Controls randomness (0.0-1.0)
- Max Tokens: Maximum tokens to generate
- System Prompt: Context for the model's responses
- Streaming: Enable token-by-token streaming

### Multi-Agent Tasks with AgentGPT

For complex reasoning tasks, you can utilize AgentGPT's multi-agent architecture:
1. Start the AgentGPT service from the UI
2. Create a task with a specific goal
3. AgentGPT will decompose the task into steps
4. Multiple agents will collaborate to accomplish the goal
