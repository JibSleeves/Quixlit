@echo off
REM Integration script for llama.cpp and AgentGPT
REM This script starts the services and launches the UI

echo Quixlit - llama.cpp and AgentGPT Integration

REM Set environment variables
set REWORKD_API_FF_LLAMA_MODE_ENABLED=true
set REWORKD_API_LLAMA_API_BASE=http://localhost:8080/v1

REM Check if a model path is provided
set MODEL_PATH=%1
if "%MODEL_PATH%"=="" (
    echo ERROR: No model path provided.
    echo Usage: start_llama_integration.bat path\to\model.gguf
    exit /b 1
)

REM Check if the model file exists
if not exist "%MODEL_PATH%" (
    echo ERROR: Model file not found: %MODEL_PATH%
    exit /b 1
)

echo.
echo Starting llama.cpp and AgentGPT integration with model: %MODEL_PATH%
echo.

REM Start the llama.cpp server in a new terminal
start cmd /k "title llama.cpp Server && cd llama.cpp && echo Starting llama.cpp server on port 8080... && .\llama-server.exe -m "%MODEL_PATH%" --port 8080 -c 4096"

REM Give the server time to start
echo Waiting for llama.cpp server to start...
timeout /t 5 /nobreak > nul

REM Start the AgentGPT platform in a new terminal
start cmd /k "title AgentGPT Platform && cd AgentGPT\platform && echo Starting AgentGPT platform... && python -m reworkd_platform"

REM Start the Next.js developer server in a new terminal
start cmd /k "title Quixlit UI && echo Starting Quixlit UI... && npm run dev"

echo.
echo All services started. Access the UI at http://localhost:3000
echo.
echo Press any key to stop all services...
pause > nul

REM Kill all services when the user presses a key
taskkill /FI "WindowTitle eq llama.cpp Server*" /T /F
taskkill /FI "WindowTitle eq AgentGPT Platform*" /T /F
taskkill /FI "WindowTitle eq Quixlit UI*" /T /F

echo All services stopped.
