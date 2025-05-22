#!/bin/bash
# Integration script for llama.cpp and AgentGPT
# This script starts the services and launches the UI

echo "Quixlit - llama.cpp and AgentGPT Integration"

# Default values
PORT=8080
CTX_SIZE=4096
GPU_LAYERS=0

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --model=*)
      MODEL_PATH="${1#*=}"
      shift
      ;;
    --port=*)
      PORT="${1#*=}"
      shift
      ;;
    --ctx=*)
      CTX_SIZE="${1#*=}"
      shift
      ;;
    --gpu-layers=*)
      GPU_LAYERS="${1#*=}"
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --model=/path/to/model.gguf [--port=8080] [--ctx=4096] [--gpu-layers=0]"
      exit 1
      ;;
  esac
done

# Check if model path is provided
if [ -z "$MODEL_PATH" ]; then
  echo "Error: Model path not provided"
  echo "Usage: $0 --model=/path/to/model.gguf [--port=8080] [--ctx=4096] [--gpu-layers=0]"
  exit 1
fi

# Check if model file exists
if [ ! -f "$MODEL_PATH" ]; then
  echo "Error: Model file not found: $MODEL_PATH"
  exit 1
fi

# Set environment variables for AgentGPT platform
export REWORKD_API_FF_LLAMA_MODE_ENABLED=true
export REWORKD_API_LLAMA_MODEL_PATH="$MODEL_PATH"
export REWORKD_API_LLAMA_API_BASE="http://localhost:$PORT/v1"

echo ""
echo "Starting llama.cpp and AgentGPT integration with model: $MODEL_PATH"
echo "Port: $PORT, Context: $CTX_SIZE, GPU Layers: $GPU_LAYERS"
echo ""

# Function to clean up background processes on exit
cleanup() {
  echo "Shutting down all services..."
  [ -n "$LLAMA_PID" ] && kill $LLAMA_PID 2>/dev/null
  [ -n "$AGENTGPT_PID" ] && kill $AGENTGPT_PID 2>/dev/null
  [ -n "$UI_PID" ] && kill $UI_PID 2>/dev/null
  exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# Start llama.cpp server in a new terminal window if available, otherwise background
if [ -n "$DISPLAY" ] && command -v xterm >/dev/null; then
  # Using xterm on Linux
  xterm -title "llama.cpp Server" -e "cd llama.cpp && ./llama-server -m \"$MODEL_PATH\" --port $PORT -c $CTX_SIZE --n-gpu-layers $GPU_LAYERS; read -p 'Press enter to close'" &
  LLAMA_PID=$!
elif [ "$(uname)" == "Darwin" ] && command -v osascript >/dev/null; then
  # Using Terminal.app on macOS
  osascript -e "tell app \"Terminal\" to do script \"cd $(pwd)/llama.cpp && ./llama-server -m \\\"$MODEL_PATH\\\" --port $PORT -c $CTX_SIZE --n-gpu-layers $GPU_LAYERS\""
  # Can't easily track PID with osascript, so we start a background process to find it
  (sleep 2; LLAMA_PID=$(pgrep -f "llama-server.*$PORT")) &
else
  # Fallback to background process
  (cd llama.cpp && ./llama-server -m "$MODEL_PATH" --port $PORT -c $CTX_SIZE --n-gpu-layers $GPU_LAYERS) &
  LLAMA_PID=$!
fi

echo "Waiting for llama.cpp server to start..."
sleep 5

# Start AgentGPT platform
if [ -n "$DISPLAY" ] && command -v xterm >/dev/null; then
  # Using xterm on Linux
  xterm -title "AgentGPT Platform" -e "cd AgentGPT/platform && python -m reworkd_platform; read -p 'Press enter to close'" &
  AGENTGPT_PID=$!
elif [ "$(uname)" == "Darwin" ] && command -v osascript >/dev/null; then
  # Using Terminal.app on macOS
  osascript -e "tell app \"Terminal\" to do script \"cd $(pwd)/AgentGPT/platform && python -m reworkd_platform\""
  # Can't easily track PID with osascript
else
  # Fallback to background process
  (cd AgentGPT/platform && python -m reworkd_platform) &
  AGENTGPT_PID=$!
fi

# Start Next.js dev server
if [ -n "$DISPLAY" ] && command -v xterm >/dev/null; then
  # Using xterm on Linux
  xterm -title "Quixlit UI" -e "npm run dev; read -p 'Press enter to close'" &
  UI_PID=$!
elif [ "$(uname)" == "Darwin" ] && command -v osascript >/dev/null; then
  # Using Terminal.app on macOS
  osascript -e "tell app \"Terminal\" to do script \"cd $(pwd) && npm run dev\""
else
  # Fallback to background process
  npm run dev &
  UI_PID=$!
fi

echo ""
echo "All services started. Access the UI at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Keep the script running until user presses Ctrl+C
while true; do
  sleep 1
done
