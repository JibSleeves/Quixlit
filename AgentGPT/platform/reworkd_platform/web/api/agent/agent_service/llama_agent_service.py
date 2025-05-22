import json
import time
import asyncio
from typing import Any, Dict, List, Optional

import aiohttp
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from lanarky.responses import StreamingResponse
from langchain import LLMChain
from langchain.callbacks.base import AsyncCallbackHandler
from langchain.schema import HumanMessage
from loguru import logger
from pydantic import ValidationError

from reworkd_platform.db.crud.oauth import OAuthCrud
from reworkd_platform.schemas.agent import ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.services.tokenizer.token_service import TokenService
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.agent_service.agent_service import AgentService
from reworkd_platform.web.api.agent.analysis import Analysis, AnalysisArguments
from reworkd_platform.web.api.agent.tools.tools import (
    get_default_tool,
    get_tool_from_name,
    get_tool_name,
    get_user_tools,
)
from reworkd_platform.web.api.agent.tools.utils import summarize
from reworkd_platform.web.api.errors import OpenAIError


class LlamaAgentService(AgentService):
    def __init__(
        self,
        model_settings: ModelSettings,
        token_service: TokenService,
        callbacks: Optional[List[AsyncCallbackHandler]],
        user: UserBase,
        oauth_crud: OAuthCrud,
    ):
        self.model_settings = model_settings
        self.token_service = token_service
        self.callbacks = callbacks
        self.user = user
        self.oauth_crud = oauth_crud
        self.base_url = settings.llama_api_base

    async def _call_llama_api(
        self, prompt: str, max_tokens: int = 500, stream: bool = False
    ) -> Any:
        """Call the llama.cpp API with the given prompt."""
        try:
            url = f"{self.base_url}/chat/completions"
            headers = {"Content-Type": "application/json"}
            temperature = self.model_settings.temperature
            
            # Use the model name from self.model_settings.model or a default
            # This should be configured to match the model loaded in llama.cpp
            model = self.model_settings.model
            
            # Format data according to OpenAI-compatible API
            data = {
                "model": model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": stream
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, json=data) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"LLama API error: {error_text}")
                        raise OpenAIError(f"Error from LLama API: {error_text}")
                    
                    if stream:
                        return response  # Return the raw response for streaming
                    else:
                        response_data = await response.json()
                        return response_data
        except Exception as e:
            logger.error(f"Error calling LLama API: {str(e)}")
            raise OpenAIError(f"Failed to call LLama API: {str(e)}")

    async def start_goal_agent(self, *, goal: str) -> List[str]:
        """Create tasks for the given goal."""
        prompt = (
            f"You are an AI task creator. You need to create tasks to achieve the following goal: {goal}\n"
            f"Please create a list of 3-5 tasks to achieve this goal. The tasks should be concrete and actionable.\n"
            f"Your response should ONLY include the tasks as a numbered list, with no other text or explanation."
        )
        
        max_tokens = min(self.model_settings.max_tokens, 500)
        response = await self._call_llama_api(prompt, max_tokens=max_tokens)
        
        # Extract the tasks from the response
        try:
            content = response["choices"][0]["message"]["content"].strip()
            # Parse the numbered list
            tasks = []
            for line in content.split("\n"):
                line = line.strip()
                # Check if line starts with a number and a dot or parenthesis
                if (line and (line[0].isdigit() and len(line) > 1 and 
                             (line[1] == '.' or line[1] == ')' or line[1] == ':'))):
                    # Remove the number and any leading/trailing whitespace
                    task = line[2:].strip()
                    tasks.append(task)
                elif line and line[0].isdigit():
                    # Handle case where there might just be a number without punctuation
                    parts = line.split(" ", 1)
                    if len(parts) > 1:
                        task = parts[1].strip()
                        tasks.append(task)
            
            # If we couldn't parse tasks properly, split by newlines as fallback
            if not tasks:
                tasks = [line.strip() for line in content.split("\n") if line.strip()]
                
            # Limit to 5 tasks maximum
            return tasks[:5]
        except Exception as e:
            logger.error(f"Error parsing tasks from LLama response: {str(e)}")
            # Fallback to simple task
            return ["Research information about the goal"]

    async def analyze_task_agent(
        self, *, goal: str, task: str, tool_names: List[str]
    ) -> Analysis:
        """Analyze the given task and return the analysis with a recommended tool."""
        user_tools = await get_user_tools(tool_names, self.user, self.oauth_crud)
        
        prompt = (
            f"Goal: {goal}\n"
            f"Task: {task}\n\n"
            f"You need to analyze this task and choose the most appropriate tool to complete it.\n"
            f"Available tools: {', '.join([get_tool_name(tool) for tool in user_tools])}\n\n"
            f"Your analysis should include:\n"
            f"1. What needs to be done to complete this task\n"
            f"2. Which tool is best suited for this task\n"
            f"3. Why this tool is appropriate\n\n"
            f"Respond in JSON format with these fields:\n"
            f"{{\"reasoning\": \"your analysis here\", \"tool\": \"chosen_tool_name\", \"arg\": \"argument for the tool\"}}"
        )
        
        max_tokens = min(self.model_settings.max_tokens, 500)
        response = await self._call_llama_api(prompt, max_tokens=max_tokens)
        
        try:
            content = response["choices"][0]["message"]["content"].strip()
            # Try to extract JSON object from the response
            json_str = content
            # Find JSON object if it's embedded in other text
            start = content.find('{')
            end = content.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = content[start:end]
            
            data = json.loads(json_str)
            return Analysis(
                action=data.get("tool", get_tool_name(get_default_tool())),
                reasoning=data.get("reasoning", "No reasoning provided"),
                arg=data.get("arg", task),
            )
        except (json.JSONDecodeError, ValidationError) as e:
            logger.error(f"Error parsing analysis from LLama response: {str(e)}")
            # Return default analysis if parsing fails
            return Analysis.get_default_analysis(task)

    async def execute_task_agent(
        self,
        *,
        goal: str,
        task: str,
        analysis: Analysis,
    ) -> FastAPIStreamingResponse:
        """Execute the task with the given analysis and return the result."""
        tool_class = get_tool_from_name(analysis.action)
        
        # We pass our own LLama client to the tool instead of using the original model
        # Since we're using a different API, we'll adapt the tool to use our service
        async def llama_execution(goal: str, task: str, arg: str) -> str:
            prompt = (
                f"Goal: {goal}\n"
                f"Task: {task}\n"
                f"Using the {analysis.action} tool with argument: {arg}\n\n"
                f"Execute this task and provide a detailed response with the results."
            )
            
            max_tokens = min(self.model_settings.max_tokens, 1000)
            response = await self._call_llama_api(prompt, max_tokens=max_tokens)
            return response["choices"][0]["message"]["content"].strip()
        
        # Create streaming response
        async def stream_generator():
            try:
                result = await llama_execution(goal, task, analysis.arg)
                # Send the result in chunks to simulate streaming
                chunk_size = 10  # characters per chunk
                for i in range(0, len(result), chunk_size):
                    chunk = result[i:i+chunk_size]
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                    await asyncio.sleep(0.01)  # Small delay to simulate streaming
                
                yield f"data: {json.dumps({'content': '', 'stop': True})}\n\n"
            except Exception as e:
                logger.error(f"Error in stream_generator: {str(e)}")
                yield f"data: {json.dumps({'content': f'Error: {str(e)}', 'stop': True})}\n\n"
        
        return FastAPIStreamingResponse(stream_generator(), media_type="text/event-stream")

    async def create_tasks_agent(
        self,
        *,
        goal: str,
        tasks: List[str],
        last_task: str,
        result: str,
        completed_tasks: Optional[List[str]] = None,
    ) -> List[str]:
        """Create additional tasks based on the results of the previous task."""
        completed = completed_tasks or []
        
        prompt = (
            f"Goal: {goal}\n"
            f"Completed tasks:\n"
            + "\n".join([f"- {task}" for task in completed])
            + f"\n\nCurrent tasks:\n"
            + "\n".join([f"- {task}" for task in tasks])
            + f"\n\nLast completed task: {last_task}\n"
            f"Result: {result}\n\n"
            f"Based on this information, suggest ONE additional task that would help achieve the goal. "
            f"The task should be concrete, actionable, and not duplicate any completed or current tasks. "
            f"Respond with only the task description, no additional explanation."
        )
        
        max_tokens = min(self.model_settings.max_tokens, 200)
        response = await self._call_llama_api(prompt, max_tokens=max_tokens)
        
        try:
            new_task = response["choices"][0]["message"]["content"].strip()
            # Clean up the task if it has numbering or prefixes
            if new_task.startswith(('- ', '• ', '* ')):
                new_task = new_task[2:]
            if new_task and new_task[0].isdigit() and len(new_task) > 1 and new_task[1] in [')', '.', ':']:
                new_task = new_task[2:].strip()
            
            # If the suggested task is already in tasks or completed_tasks, return empty list
            if new_task in tasks or new_task in completed:
                return []
            
            return [new_task]
        except Exception as e:
            logger.error(f"Error creating new task: {str(e)}")
            return []

    async def summarize_task_agent(
        self,
        *,
        goal: str,
        results: List[str],
    ) -> FastAPIStreamingResponse:
        """Summarize the results of all tasks."""
        prompt = (
            f"Goal: {goal}\n\n"
            f"Results from completed tasks:\n"
            + "\n\n".join([f"- {result}" for result in results])
            + f"\n\nPlease provide a comprehensive summary of the results, highlighting the key findings and how they relate to the original goal."
        )
        
        async def stream_generator():
            try:
                response = await self._call_llama_api(prompt, max_tokens=1000, stream=True)
                async for line in response.content:
                    if line:
                        try:
                            line_str = line.decode('utf-8')
                            if line_str.startswith('data: '):
                                data = json.loads(line_str[6:])
                                if 'choices' in data and len(data['choices']) > 0:
                                    delta = data['choices'][0].get('delta', {})
                                    content = delta.get('content', '')
                                    if content:
                                        yield f"data: {json.dumps({'content': content})}\n\n"
                        except Exception as e:
                            logger.error(f"Error parsing streaming response: {str(e)}")
                
                yield f"data: {json.dumps({'content': '', 'stop': True})}\n\n"
            except Exception as e:
                logger.error(f"Error in summarize stream_generator: {str(e)}")
                yield f"data: {json.dumps({'content': f'Error generating summary: {str(e)}', 'stop': True})}\n\n"
        
        return FastAPIStreamingResponse(stream_generator(), media_type="text/event-stream")

    async def chat(
        self,
        *,
        message: str,
        results: List[str],
    ) -> FastAPIStreamingResponse:
        """Chat with the AI about the task results."""
        context = "\n\n".join(results) if results else "No previous results."
        
        prompt = (
            f"Previous context:\n{context}\n\n"
            f"User message: {message}\n\n"
            f"Please respond to the user's message based on the provided context."
        )
        
        async def stream_generator():
            try:
                response = await self._call_llama_api(prompt, max_tokens=1000, stream=True)
                async for line in response.content:
                    if line:
                        try:
                            line_str = line.decode('utf-8')
                            if line_str.startswith('data: '):
                                data = json.loads(line_str[6:])
                                if 'choices' in data and len(data['choices']) > 0:
                                    delta = data['choices'][0].get('delta', {})
                                    content = delta.get('content', '')
                                    if content:
                                        yield f"data: {json.dumps({'content': content})}\n\n"
                        except Exception as e:
                            logger.error(f"Error parsing chat streaming response: {str(e)}")
                
                yield f"data: {json.dumps({'content': '', 'stop': True})}\n\n"
            except Exception as e:
                logger.error(f"Error in chat stream_generator: {str(e)}")
                yield f"data: {json.dumps({'content': f'Error generating response: {str(e)}', 'stop': True})}\n\n"
        
        return FastAPIStreamingResponse(stream_generator(), media_type="text/event-stream")
