'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthWrapper from '@/components/auth/auth-wrapper';
import { ArrowLeft, Brain, Zap, Target, Network, Code, Play, CheckCircle, AlertCircle, Cpu, Globe, Shield, Sparkles, Rocket, Settings, Layers, GitBranch, Activity, Database, Cloud, Bot, Puzzle, TrendingUp } from 'lucide-react';

const AgenticAITutorial = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [agentConfig, setAgentConfig] = useState({
    name: 'Smart Assistant',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    tools: ['web_search', 'calculator', 'file_manager'],
    autonomy: 'medium'
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction to Agentic AI',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      content: {
        overview: 'Agentic AI represents the next evolution beyond simple chatbots - autonomous systems that can pursue complex goals, make decisions, and take actions in the real world.',
        keyTopics: [
          'Understanding Agent Autonomy Levels',
          'Reactive vs. Proactive Agents',
          'Multi-Agent Orchestration',
          'Memory and Context Management',
          'Tool Usage and Function Calling',
          'Planning and Execution Strategies'
        ]
      }
    },
    {
      id: 'core-concepts',
      title: 'Core Agentic Concepts',
      icon: Cpu,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      content: {
        overview: 'Master the fundamental concepts that power autonomous AI agents and intelligent systems.',
        keyTopics: [
          'Agent Architecture Patterns',
          'State Management and Persistence',
          'Decision-Making Frameworks',
          'Communication Protocols',
          'Error Handling and Recovery',
          'Performance Optimization'
        ]
      }
    },
    {
      id: 'implementation',
      title: 'Building Your First Agent',
      icon: Code,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      content: {
        overview: 'Learn to implement autonomous agents using modern frameworks and best practices.',
        keyTopics: [
          'Setting Up Agent Frameworks',
          'Creating Custom Tools and Functions',
          'Implementing Planning Loops',
          'Adding Memory Systems',
          'Handling Tool Integration',
          'Testing and Debugging Agents'
        ]
      }
    },
    {
      id: 'advanced',
      title: 'Advanced Agentic Systems',
      icon: Network,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      content: {
        overview: 'Explore sophisticated multi-agent systems and enterprise-grade autonomous applications.',
        keyTopics: [
          'Multi-Agent Collaboration',
          'Hierarchical Agent Structures',
          'Autonomous Task Delegation',
          'Distributed Agent Networks',
          'Enterprise Integration Patterns',
          'Scaling and Monitoring'
        ]
      }
    },
    {
      id: 'deployment',
      title: 'Production Deployment',
      icon: Rocket,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      content: {
        overview: 'Deploy agentic AI systems to production with security, reliability, and scalability.',
        keyTopics: [
          'Security Best Practices',
          'Performance Monitoring',
          'Cost Optimization',
          'Compliance and Governance',
          'Disaster Recovery',
          'Continuous Improvement'
        ]
      }
    }
  ];

  const agentTools = [
    {
      name: 'Web Search',
      description: 'Search the internet for current information',
      icon: Globe,
      params: ['query', 'max_results']
    },
    {
      name: 'Calculator',
      description: 'Perform mathematical calculations',
      icon: Target,
      params: ['expression']
    },
    {
      name: 'File Manager',
      description: 'Read, write, and manage files',
      icon: Database,
      params: ['action', 'path', 'content']
    },
    {
      name: 'Code Interpreter',
      description: 'Execute code in multiple languages',
      icon: Code,
      params: ['language', 'code']
    },
    {
      name: 'API Caller',
      description: 'Make HTTP requests to external services',
      icon: Cloud,
      params: ['url', 'method', 'headers', 'data']
    },
    {
      name: 'Email Sender',
      description: 'Send emails and notifications',
      icon: Settings,
      params: ['to', 'subject', 'body']
    }
  ];

  const autonomyLevels = [
    {
      level: 'Manual',
      description: 'User provides step-by-step guidance',
      autonomy: 0,
      color: 'bg-gray-100 text-gray-700'
    },
    {
      level: 'Suggested',
      description: 'Agent suggests actions, user approves',
      autonomy: 25,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      level: 'Semi-Autonomous',
      description: 'Agent acts within defined boundaries',
      autonomy: 50,
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      level: 'Autonomous',
      description: 'Agent makes decisions independently',
      autonomy: 75,
      color: 'bg-orange-100 text-orange-700'
    },
    {
      level: 'Fully Autonomous',
      description: 'Agent pursues goals without intervention',
      autonomy: 100,
      color: 'bg-red-100 text-red-700'
    }
  ];

  const simulateAgentExecution = async () => {
    setIsSimulating(true);
    setSimulationLog([]);

    const logs = [
      '🚀 Initializing Smart Assistant agent...',
      '📋 Loading configuration and tools...',
      `🧠 Using model: ${agentConfig.model}`,
      `🌡️ Temperature: ${agentConfig.temperature}, Max tokens: ${agentConfig.maxTokens}`,
      `🔧 Available tools: ${agentConfig.tools.join(', ')}`,
      `⚙️ Autonomy level: ${agentConfig.autonomy}`,
      '',
      '🎯 Agent is ready and waiting for tasks...',
      '💭 Agent starts analyzing the environment...',
      '🔍 Checking for pending objectives...',
      '📝 No immediate tasks found - entering standby mode',
      '⚡ Agent monitoring for new commands...',
      '🔄 Agent has completed initialization successfully!'
    ];

    for (const log of logs) {
      setSimulationLog(prev => [...prev, log]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsSimulating(false);
  };

  const codeExamples = {
    python: {
      basic: `# Basic Agentic AI Implementation
from typing import List, Dict, Any
import json
from datetime import datetime

class AgenticAISystem:
    def __init__(self, model: str, tools: List[str]):
        self.model = model
        self.tools = tools
        self.memory = []
        self.context = {}

    async def process_task(self, task: str, autonomy_level: str = "medium"):
        """Process a task based on autonomy level"""
        print(f"🤖 Processing task: {task}")

        # Step 1: Understand the task
        understanding = await self.analyze_task(task)
        print(f"📝 Task understanding: {understanding}")

        # Step 2: Create execution plan
        plan = await self.create_plan(understanding)
        print(f"📋 Execution plan: {plan}")

        # Step 3: Execute based on autonomy level
        if autonomy_level == "high":
            result = await self.execute_autonomously(plan)
        elif autonomy_level == "medium":
            result = await self.execute_with_approval(plan)
        else:
            result = await self.execute_manually(plan)

        # Step 4: Learn from experience
        await self.update_memory(task, plan, result)

        return result

    async def analyze_task(self, task: str) -> Dict[str, Any]:
        """Analyze and understand the task requirements"""
        # Task analysis logic here
        return {
            "type": "data_analysis",
            "complexity": "medium",
            "tools_needed": ["calculator", "web_search"],
            "estimated_time": "5 minutes"
        }

    async def create_plan(self, understanding: Dict[str, Any]) -> List[Dict]:
        """Create step-by-step execution plan"""
        return [
            {"step": 1, "action": "search_data", "tool": "web_search"},
            {"step": 2, "action": "analyze_data", "tool": "calculator"},
            {"step": 3, "action": "format_results", "tool": "none"}
        ]

    async def execute_autonomously(self, plan: List[Dict]) -> Dict[str, Any]:
        """Execute plan without human intervention"""
        results = []
        for step in plan:
            if step["tool"] == "web_search":
                result = await self.web_search("market trends 2024")
            elif step["tool"] == "calculator":
                result = await self.calculate_growth_rates(result["data"])
            results.append(result)

        return {"status": "completed", "results": results}

    async def execute_with_approval(self, plan: List[Dict]) -> Dict[str, Any]:
        """Execute plan with key decision approvals"""
        for step in plan:
            # Request approval for critical steps
            if step["action"] == "search_data":
                approval = await self.request_approval(
                    f"Search for market data?",
                    step
                )
                if approval:
                    result = await self.web_search("market trends 2024")

        return {"status": "completed_with_approval", "message": "Plan executed with approvals"}

    async def execute_manually(self, plan: List[Dict]) -> Dict[str, Any]:
        """Execute plan with step-by-step user guidance"""
        print("📋 Execution Plan:")
        for i, step in enumerate(plan, 1):
            print(f"{i}. {step['action']} using {step['tool']}")

        # Wait for user confirmation for each step
        for step in plan:
            input(f"Press Enter to execute: {step['action']}")
            # Execute step logic here

        return {"status": "completed_manually", "message": "Plan executed with manual guidance"}

    async def update_memory(self, task: str, plan: List[Dict], result: Dict):
        """Update agent memory with learnings"""
        memory_entry = {
            "timestamp": datetime.now().isoformat(),
            "task": task,
            "plan": plan,
            "result": result,
            "learnings": self.extract_learnings(result)
        }
        self.memory.append(memory_entry)

    def extract_learnings(self, result: Dict) -> List[str]:
        """Extract key learnings from execution results"""
        return [
            "Web search provides current market data",
            "Calculation tools help analyze trends",
            "Multi-step plans improve accuracy"
        ]

# Usage example
async def main():
    # Initialize agentic AI system
    agent = AgenticAISystem(
        model="gpt-4",
        tools=["web_search", "calculator", "file_manager"]
    )

    # Process a task with different autonomy levels
    task = "Analyze current market trends and provide growth projections"

    # High autonomy - agent makes decisions independently
    result_high = await agent.process_task(task, "high")
    print(f"High autonomy result: {result_high}")

    # Medium autonomy - agent seeks approval for key decisions
    result_medium = await agent.process_task(task, "medium")
    print(f"Medium autonomy result: {result_medium}")

    # Low autonomy - agent follows user guidance
    result_low = await agent.process_task(task, "low")
    print(f"Low autonomy result: {result_low}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())`,

      advanced: `# Advanced Multi-Agent Orchestration
import asyncio
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import json

class AgentRole(Enum):
    COORDINATOR = "coordinator"
    RESEARCHER = "researcher"
    ANALYST = "analyst"
    WRITER = "writer"
    VALIDATOR = "validator"

@dataclass
class AgentCapability:
    name: str
    description: str
    tools: List[str]
    max_concurrent_tasks: int = 1

@dataclass
class Task:
    id: str
    description: str
    required_role: AgentRole
    priority: int = 1
    dependencies: List[str] = None
    estimated_duration: int = 300  # seconds

class MultiAgentOrchestrator:
    def __init__(self):
        self.agents = {}
        self.task_queue = []
        self.completed_tasks = {}
        self.active collaborations = {}

    def register_agent(self, agent_id: str, role: AgentRole,
                      capabilities: List[AgentCapability]):
        """Register an agent with specific capabilities"""
        self.agents[agent_id] = {
            "id": agent_id,
            "role": role,
            "capabilities": capabilities,
            "current_tasks": [],
            "status": "available",
            "performance_metrics": {
                "tasks_completed": 0,
                "average_completion_time": 0,
                "success_rate": 1.0
            }
        }

    async def orchestrate_complex_task(self, objective: str) -> Dict[str, Any]:
        """Orchestrate multiple agents to complete a complex objective"""
        print(f"🎯 Starting orchestration for: {objective}")

        # Step 1: Decompose objective into subtasks
        task_plan = await self.decompose_objective(objective)
        print(f"📋 Created {len(task_plan)} subtasks")

        # Step 2: Assign tasks to appropriate agents
        assignments = await self.assign_tasks(task_plan)
        print(f"👥 Assigned tasks to {len(assignments)} agents")

        # Step 3: Execute tasks with coordination
        results = await self.execute_with_coordination(assignments)

        # Step 4: Aggregate and validate results
        final_result = await self.aggregate_results(results)

        return final_result

    async def decompose_objective(self, objective: str) -> List[Task]:
        """Decompose complex objective into manageable subtasks"""
        # AI-powered task decomposition
        subtasks = [
            Task(
                id="research_1",
                description="Research current market trends",
                required_role=AgentRole.RESEARCHER,
                priority=1,
                estimated_duration=600
            ),
            Task(
                id="analysis_1",
                description="Analyze collected data",
                required_role=AgentRole.ANALYST,
                priority=2,
                dependencies=["research_1"],
                estimated_duration=400
            ),
            Task(
                id="writing_1",
                description="Create comprehensive report",
                required_role=AgentRole.WRITER,
                priority=3,
                dependencies=["analysis_1"],
                estimated_duration=800
            ),
            Task(
                id="validation_1",
                description="Validate findings and recommendations",
                required_role=AgentRole.VALIDATOR,
                priority=4,
                dependencies=["writing_1"],
                estimated_duration=300
            )
        ]

        return subtasks

    async def assign_tasks(self, tasks: List[Task]) -> Dict[str, List[Task]]:
        """Assign tasks to agents based on capabilities and availability"""
        assignments = {}

        for task in tasks:
            # Find suitable agents
            suitable_agents = [
                agent_id for agent_id, agent in self.agents.items()
                if agent["role"] == task.required_role
                and agent["status"] == "available"
            ]

            if suitable_agents:
                # Select best agent based on performance metrics
                best_agent = max(suitable_agents,
                    key=lambda aid: self.agents[aid]["performance_metrics"]["success_rate"])

                if best_agent not in assignments:
                    assignments[best_agent] = []
                assignments[best_agent].append(task)

                # Update agent status
                self.agents[best_agent]["current_tasks"].append(task.id)
                self.agents[best_agent]["status"] = "busy"

        return assignments

    async def execute_with_coordination(self, assignments: Dict[str, List[Task]]) -> Dict[str, Any]:
        """Execute assigned tasks with inter-agent coordination"""
        execution_results = {}

        # Start all agents concurrently
        agent_tasks = []
        for agent_id, tasks in assignments.items():
            agent_task = asyncio.create_task(
                self.execute_agent_tasks(agent_id, tasks)
            )
            agent_tasks.append(agent_task)

        # Wait for all agents to complete
        agent_results = await asyncio.gather(*agent_tasks, return_exceptions=True)

        # Process results
        for i, result in enumerate(agent_results):
            agent_id = list(assignments.keys())[i]
            if isinstance(result, Exception):
                execution_results[agent_id] = {"error": str(result)}
            else:
                execution_results[agent_id] = result

        return execution_results

    async def execute_agent_tasks(self, agent_id: str, tasks: List[Task]) -> Dict[str, Any]:
        """Execute tasks for a specific agent"""
        agent = self.agents[agent_id]
        results = {}

        print(f"🤖 Agent {agent_id} ({agent['role'].value}) starting {len(tasks)} tasks")

        for task in tasks:
            # Check dependencies
            if task.dependencies:
                for dep_id in task.dependencies:
                    if dep_id not in self.completed_tasks:
                        print(f"⏳ Agent {agent_id} waiting for dependency: {dep_id}")
                        await self.wait_for_task_completion(dep_id)

            # Execute task
            start_time = asyncio.get_event_loop().time()

            try:
                result = await self.execute_single_task(agent_id, task)
                duration = asyncio.get_event_loop().time() - start_time

                results[task.id] = {
                    "status": "completed",
                    "result": result,
                    "duration": duration
                }

                self.completed_tasks[task.id] = result
                print(f"✅ Agent {agent_id} completed task {task.id}")

            except Exception as e:
                results[task.id] = {
                    "status": "failed",
                    "error": str(e)
                }
                print(f"❌ Agent {agent_id} failed task {task.id}: {e}")

        # Update agent status
        self.agents[agent_id]["status"] = "available"
        self.agents[agent_id]["current_tasks"] = []

        # Update performance metrics
        self.update_agent_metrics(agent_id, results)

        return results

    async def execute_single_task(self, agent_id: str, task: Task) -> Any:
        """Execute a single task based on agent role"""
        agent = self.agents[agent_id]

        # Simulate task execution based on role
        if agent["role"] == AgentRole.RESEARCHER:
            return await self.research_agent_task(task)
        elif agent["role"] == AgentRole.ANALYST:
            return await self.analyst_agent_task(task)
        elif agent["role"] == AgentRole.WRITER:
            return await self.writer_agent_task(task)
        elif agent["role"] == AgentRole.VALIDATOR:
            return await self.validator_agent_task(task)
        else:
            return {"message": f"Task {task.description} completed"}

    async def research_agent_task(self, task: Task) -> Dict[str, Any]:
        """Execute research-specific task"""
        # Simulate research process
        await asyncio.sleep(2)  # Simulate research time

        return {
            "research_data": {
                "market_trends": ["AI adoption increasing", "Cloud migration accelerating"],
                "statistics": {"growth_rate": "23%", "market_size": "$150B"},
                "sources": ["Industry Report 2024", "Market Analysis Q3"]
            },
            "confidence": 0.85
        }

    async def analyst_agent_task(self, task: Task) -> Dict[str, Any]:
        """Execute analysis-specific task"""
        await asyncio.sleep(1.5)

        return {
            "analysis": {
                "key_insights": [
                    "AI market showing strong growth trajectory",
                    "Enterprise adoption driving market expansion"
                ],
                "recommendations": [
                    "Increase AI investment",
                    "Focus on enterprise solutions"
                ],
                "risk_factors": ["Talent shortage", "Regulatory uncertainty"]
            },
            "confidence": 0.78
        }

    async def writer_agent_task(self, task: Task) -> Dict[str, Any]:
        """Execute writing-specific task"""
        await asyncio.sleep(3)

        return {
            "report": {
                "executive_summary": "AI market experiencing unprecedented growth...",
                "key_findings": [
                    "Market size projected to reach $500B by 2030",
                    "Enterprise adoption rate increased by 40% YoY"
                ],
                "recommendations": [
                    "Strategic investment in AI capabilities",
                    "Talent development programs"
                ]
            },
            "word_count": 2500,
            "readability_score": 8.5
        }

    async def validator_agent_task(self, task: Task) -> Dict[str, Any]:
        """Execute validation-specific task"""
        await asyncio.sleep(1)

        return {
            "validation": {
                "data_accuracy": 0.92,
                "methodology_sound": True,
                "conclusions_supported": True,
                "recommendations_actionable": True
            },
            "overall_quality_score": 0.87,
            "suggested_improvements": [
                "Add more recent data points",
                "Include competitive analysis"
            ]
        }

    async def aggregate_results(self, execution_results: Dict[str, Any]) -> Dict[str, Any]:
        """Aggregate results from multiple agents into final output"""
        final_report = {
            "objective_completion_status": "completed",
            "agent_contributions": {},
            "final_output": {},
            "metadata": {
                "total_agents_involved": len(execution_results),
                "total_execution_time": 0,
                "success_rate": 0
            }
        }

        total_time = 0
        successful_tasks = 0
        total_tasks = 0

        for agent_id, results in execution_results.items():
            agent_role = self.agents[agent_id]["role"].value
            final_report["agent_contributions"][agent_id] = {
                "role": agent_role,
                "tasks_completed": len([r for r in results.values() if r.get("status") == "completed"]),
                "results": results
            }

            # Extract final outputs
            for task_id, result in results.items():
                total_tasks += 1
                if result.get("status") == "completed":
                    successful_tasks += 1
                    total_time += result.get("duration", 0)

                    # Add to final output based on agent role
                    if agent_role == "researcher":
                        final_report["final_output"]["research"] = result.get("result")
                    elif agent_role == "analyst":
                        final_report["final_output"]["analysis"] = result.get("result")
                    elif agent_role == "writer":
                        final_report["final_output"]["report"] = result.get("result")
                    elif agent_role == "validator":
                        final_report["final_output"]["validation"] = result.get("result")

        final_report["metadata"]["total_execution_time"] = total_time
        final_report["metadata"]["success_rate"] = successful_tasks / total_tasks if total_tasks > 0 else 0

        return final_report

    async def wait_for_task_completion(self, task_id: str):
        """Wait for a dependent task to complete"""
        while task_id not in self.completed_tasks:
            await asyncio.sleep(0.5)

    def update_agent_metrics(self, agent_id: str, results: Dict[str, Any]):
        """Update agent performance metrics"""
        agent = self.agents[agent_id]
        metrics = agent["performance_metrics"]

        completed_count = len([r for r in results.values() if r.get("status") == "completed"])
        metrics["tasks_completed"] += completed_count

        # Update success rate
        total_tasks = len(results)
        if total_tasks > 0:
            current_success_rate = completed_count / total_tasks
            metrics["success_rate"] = (
                metrics["success_rate"] * 0.8 + current_success_rate * 0.2
            )  # Weighted average

        # Update average completion time
        total_duration = sum(r.get("duration", 0) for r in results.values() if r.get("status") == "completed")
        if completed_count > 0:
            avg_duration = total_duration / completed_count
            metrics["average_completion_time"] = (
                metrics["average_completion_time"] * 0.8 + avg_duration * 0.2
            )

# Usage example
async def demonstrate_multi_agent_system():
    # Create orchestrator
    orchestrator = MultiAgentOrchestrator()

    # Register specialized agents
    orchestrator.register_agent(
        "research_agent_1",
        AgentRole.RESEARCHER,
        [AgentCapability("web_search", "Search internet", ["search_api"])]
    )

    orchestrator.register_agent(
        "analyst_agent_1",
        AgentRole.ANALYST,
        [AgentCapability("data_analysis", "Analyze data", ["calculator", "statistics"])]
    )

    orchestrator.register_agent(
        "writer_agent_1",
        AgentRole.WRITER,
        [AgentCapability("content_creation", "Create reports", ["text_generator"])]
    )

    orchestrator.register_agent(
        "validator_agent_1",
        AgentRole.VALIDATOR,
        [AgentCapability("quality_check", "Validate outputs", ["fact_checker"])]
    )

    # Execute complex objective
    result = await orchestrator.orchestrate_complex_task(
        "Create comprehensive market analysis report for AI industry"
    )

    print("\\n🎉 Final Result:")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(demonstrate_multi_agent_system())`,

      tools: `# Custom Agent Tools Implementation
import asyncio
import aiohttp
import json
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod

class AgentTool(ABC):
    """Base class for all agent tools"""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    async def execute(self, **kwargs) -> Dict[str, Any]:
        """Execute the tool with given parameters"""
        pass

    @abstractmethod
    def get_schema(self) -> Dict[str, Any]:
        """Return JSON schema for tool parameters"""
        pass

class WebSearchTool(AgentTool):
    """Web search tool for finding current information"""

    def __init__(self):
        super().__init__(
            "web_search",
            "Search the internet for current information and data"
        )
        self.api_key = "your_search_api_key"

    async def execute(self, query: str, max_results: int = 5,
                     time_range: str = "year") -> Dict[str, Any]:
        """Execute web search"""

        # Simulate API call
        await asyncio.sleep(1)

        # Mock search results
        mock_results = [
            {
                "title": f"Latest information about {query}",
                "url": f"https://example.com/{query.replace(' ', '-')}",
                "snippet": f"Comprehensive guide to {query} with latest updates...",
                "relevance_score": 0.95
            },
            {
                "title": f"{query} - Market Analysis 2024",
                "url": f"https://market-analysis.com/{query}",
                "snippet": f"In-depth market analysis of {query} trends and projections...",
                "relevance_score": 0.88
            }
        ]

        return {
            "status": "success",
            "query": query,
            "results": mock_results[:max_results],
            "total_results": len(mock_results),
            "search_time": 0.8
        }

    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Search query"
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum number of results to return",
                    "default": 5
                },
                "time_range": {
                    "type": "string",
                    "enum": ["day", "week", "month", "year"],
                    "description": "Time range for search results",
                    "default": "year"
                }
            },
            "required": ["query"]
        }

class CalculatorTool(AgentTool):
    """Advanced calculator tool for mathematical operations"""

    def __init__(self):
        super().__init__(
            "calculator",
            "Perform mathematical calculations and statistical analysis"
        )

    async def execute(self, expression: str, operation_type: str = "basic") -> Dict[str, Any]:
        """Execute mathematical calculation"""

        try:
            if operation_type == "basic":
                # Basic arithmetic evaluation (safe implementation)
                result = self.safe_eval(expression)
            elif operation_type == "statistics":
                result = await self.statistical_analysis(expression)
            else:
                result = "Unknown operation type"

            return {
                "status": "success",
                "expression": expression,
                "result": result,
                "operation_type": operation_type
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "expression": expression
            }

    def safe_eval(self, expression: str) -> float:
        """Safely evaluate mathematical expressions"""
        # Only allow safe characters
        allowed_chars = set('0123456789+-*/().^ ')
        if not all(c in allowed_chars for c in expression):
            raise ValueError("Invalid characters in expression")

        # Simple evaluation (in production, use a proper math library)
        return eval(expression)

    async def statistical_analysis(self, data_string: str) -> Dict[str, float]:
        """Perform statistical analysis on data"""
        # Parse data (expecting comma-separated numbers)
        data = [float(x.strip()) for x in data_string.split(',') if x.strip()]

        if not data:
            raise ValueError("No valid data provided")

        # Calculate statistics
        mean = sum(data) / len(data)
        variance = sum((x - mean) ** 2 for x in data) / len(data)
        std_dev = variance ** 0.5

        return {
            "mean": mean,
            "median": sorted(data)[len(data) // 2],
            "std_dev": std_dev,
            "min": min(data),
            "max": max(data),
            "count": len(data)
        }

    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Mathematical expression or data for analysis"
                },
                "operation_type": {
                    "type": "string",
                    "enum": ["basic", "statistics"],
                    "description": "Type of calculation to perform",
                    "default": "basic"
                }
            },
            "required": ["expression"]
        }

class FileManagerTool(AgentTool):
    """File management tool for reading and writing files"""

    def __init__(self, base_path: str = "./agent_workspace"):
        super().__init__(
            "file_manager",
            "Read, write, and manage files in the workspace"
        )
        self.base_path = base_path

    async def execute(self, action: str, path: str,
                     content: Optional[str] = None) -> Dict[str, Any]:
        """Execute file management operation"""

        import os
        full_path = os.path.join(self.base_path, path)

        try:
            if action == "read":
                return await self.read_file(full_path)
            elif action == "write":
                return await self.write_file(full_path, content)
            elif action == "list":
                return await self.list_directory(full_path)
            elif action == "delete":
                return await self.delete_file(full_path)
            else:
                return {"status": "error", "error": f"Unknown action: {action}"}

        except Exception as e:
            return {"status": "error", "error": str(e)}

    async def read_file(self, path: str) -> Dict[str, Any]:
        """Read file contents"""
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        return {
            "status": "success",
            "action": "read",
            "path": path,
            "content": content,
            "size": len(content)
        }

    async def write_file(self, path: str, content: str) -> Dict[str, Any]:
        """Write content to file"""
        # Create directory if it doesn't exist
        import os
        os.makedirs(os.path.dirname(path), exist_ok=True)

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

        return {
            "status": "success",
            "action": "write",
            "path": path,
            "size": len(content)
        }

    async def list_directory(self, path: str) -> Dict[str, Any]:
        """List directory contents"""
        import os

        if os.path.isfile(path):
            return {"status": "error", "error": "Path is a file, not directory"}

        items = []
        for item in os.listdir(path):
            item_path = os.path.join(path, item)
            items.append({
                "name": item,
                "type": "file" if os.path.isfile(item_path) else "directory",
                "size": os.path.getsize(item_path) if os.path.isfile(item_path) else 0
            })

        return {
            "status": "success",
            "action": "list",
            "path": path,
            "items": items
        }

    async def delete_file(self, path: str) -> Dict[str, Any]:
        """Delete file or directory"""
        import os
        import shutil

        if os.path.isfile(path):
            os.remove(path)
        else:
            shutil.rmtree(path)

        return {
            "status": "success",
            "action": "delete",
            "path": path
        }

    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["read", "write", "list", "delete"],
                    "description": "File operation to perform"
                },
                "path": {
                    "type": "string",
                    "description": "File or directory path (relative to workspace)"
                },
                "content": {
                    "type": "string",
                    "description": "Content to write (for write action)"
                }
            },
            "required": ["action", "path"]
        }

class CodeInterpreterTool(AgentTool):
    """Code execution tool for multiple programming languages"""

    def __init__(self):
        super().__init__(
            "code_interpreter",
            "Execute code in multiple programming languages"
        )

    async def execute(self, language: str, code: str,
                     timeout: int = 30) -> Dict[str, Any]:
        """Execute code in specified language"""

        try:
            if language.lower() == "python":
                result = await self.execute_python(code, timeout)
            elif language.lower() == "javascript":
                result = await self.execute_javascript(code, timeout)
            elif language.lower() == "sql":
                result = await self.execute_sql(code, timeout)
            else:
                result = {"error": f"Unsupported language: {language}"}

            return {
                "status": "success",
                "language": language,
                "result": result,
                "execution_time": result.get("execution_time", 0)
            }

        except Exception as e:
            return {
                "status": "error",
                "language": language,
                "error": str(e)
            }

    async def execute_python(self, code: str, timeout: int) -> Dict[str, Any]:
        """Execute Python code"""
        import subprocess
        import sys
        import time

        start_time = time.time()

        try:
            # Execute code in subprocess
            result = subprocess.run(
                [sys.executable, "-c", code],
                capture_output=True,
                text=True,
                timeout=timeout
            )

            execution_time = time.time() - start_time

            return {
                "stdout": result.stdout,
                "stderr": result.stderr,
                "return_code": result.returncode,
                "execution_time": execution_time
            }

        except subprocess.TimeoutExpired:
            return {
                "error": "Code execution timed out",
                "execution_time": timeout
            }

    async def execute_javascript(self, code: str, timeout: int) -> Dict[str, Any]:
        """Execute JavaScript code using Node.js"""
        import subprocess
        import time

        start_time = time.time()

        try:
            # Execute code using Node.js
            result = subprocess.run(
                ["node", "-e", code],
                capture_output=True,
                text=True,
                timeout=timeout
            )

            execution_time = time.time() - start_time

            return {
                "stdout": result.stdout,
                "stderr": result.stderr,
                "return_code": result.returncode,
                "execution_time": execution_time
            }

        except subprocess.TimeoutExpired:
            return {
                "error": "Code execution timed out",
                "execution_time": timeout
            }
        except FileNotFoundError:
            return {"error": "Node.js not found. Please install Node.js."}

    async def execute_sql(self, code: str, timeout: int) -> Dict[str, Any]:
        """Execute SQL query (simulated)"""
        await asyncio.sleep(1)  # Simulate database query time

        # Mock SQL result
        return {
            "query": code.strip(),
            "results": [
                {"id": 1, "name": "Sample Data 1", "value": 100},
                {"id": 2, "name": "Sample Data 2", "value": 200}
            ],
            "row_count": 2,
            "execution_time": 0.5
        }

    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "language": {
                    "type": "string",
                    "enum": ["python", "javascript", "sql"],
                    "description": "Programming language"
                },
                "code": {
                    "type": "string",
                    "description": "Code to execute"
                },
                "timeout": {
                    "type": "integer",
                    "description": "Execution timeout in seconds",
                    "default": 30
                }
            },
            "required": ["language", "code"]
        }

class ToolRegistry:
    """Registry for managing agent tools"""

    def __init__(self):
        self.tools = {}

    def register_tool(self, tool: AgentTool):
        """Register a new tool"""
        self.tools[tool.name] = tool

    def get_tool(self, name: str) -> Optional[AgentTool]:
        """Get tool by name"""
        return self.tools.get(name)

    def list_tools(self) -> List[Dict[str, Any]]:
        """List all available tools"""
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "schema": tool.get_schema()
            }
            for tool in self.tools.values()
        ]

    async def execute_tool(self, tool_name: str, **kwargs) -> Dict[str, Any]:
        """Execute a tool with given parameters"""
        tool = self.get_tool(tool_name)
        if not tool:
            return {"status": "error", "error": f"Tool '{tool_name}' not found"}

        return await tool.execute(**kwargs)

# Usage example
async def demonstrate_agent_tools():
    # Create tool registry
    registry = ToolRegistry()

    # Register all tools
    registry.register_tool(WebSearchTool())
    registry.register_tool(CalculatorTool())
    registry.register_tool(FileManagerTool())
    registry.register_tool(CodeInterpreterTool())

    print("🔧 Available Agent Tools:")
    for tool_info in registry.list_tools():
        print(f"  • {tool_info['name']}: {tool_info['description']}")

    print("\\n🚀 Executing tools:")

    # Execute web search
    search_result = await registry.execute_tool(
        "web_search",
        query="artificial intelligence trends 2024",
        max_results=3
    )
    print(f"🔍 Web Search: {search_result['status']}")

    # Execute calculator
    calc_result = await registry.execute_tool(
        "calculator",
        expression="2 * 15 + 8 / 4",
        operation_type="basic"
    )
    print(f"🧮 Calculator: {calc_result['result']}")

    # Execute file operations
    write_result = await registry.execute_tool(
        "file_manager",
        action="write",
        path="test.txt",
        content="Hello from agent tool!"
    )
    print(f"📁 File Write: {write_result['status']}")

    # Execute code
    code_result = await registry.execute_tool(
        "code_interpreter",
        language="python",
        code="print('Hello from Python!')\\nprint(2 + 2)"
    )
    print(f"💻 Code Execution: {code_result['status']}")

if __name__ == "__main__":
    asyncio.run(demonstrate_agent_tools())`
    },
    javascript: {
      basic: `// Basic Agentic AI Implementation in JavaScript
class AgenticAISystem {
  constructor(model, tools = []) {
    this.model = model;
    this.tools = tools;
    this.memory = [];
    this.context = {};
    this.isRunning = false;
  }

  async processTask(task, autonomyLevel = "medium") {
    console.log(\`🤖 Processing task: \${task}\`);

    try {
      // Step 1: Understand the task
      const understanding = await this.analyzeTask(task);
      console.log(\`📝 Task understanding: \${understanding.type}\`);

      // Step 2: Create execution plan
      const plan = await this.createPlan(understanding);
      console.log(\`📋 Execution plan: \${plan.length} steps\`);

      // Step 3: Execute based on autonomy level
      let result;
      if (autonomyLevel === "high") {
        result = await this.executeAutonomously(plan);
      } else if (autonomyLevel === "medium") {
        result = await this.executeWithApproval(plan);
      } else {
        result = await this.executeManually(plan);
      }

      // Step 4: Learn from experience
      await this.updateMemory(task, plan, result);

      return result;
    } catch (error) {
      console.error("❌ Task processing failed:", error);
      throw error;
    }
  }

  async analyzeTask(task) {
    // Simulate task analysis with AI
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      type: "data_analysis",
      complexity: "medium",
      toolsNeeded: ["web_search", "calculator"],
      estimatedTime: "5 minutes",
      confidence: 0.85
    };
  }

  async createPlan(understanding) {
    // Create step-by-step execution plan
    return [
      {
        step: 1,
        action: "gather_data",
        tool: "web_search",
        description: "Search for relevant information",
        inputs: { query: "latest market trends" }
      },
      {
        step: 2,
        action: "analyze_data",
        tool: "calculator",
        description: "Analyze collected data",
        inputs: { expression: "growth_rate * 1.2" }
      },
      {
        step: 3,
        action: "format_results",
        tool: "none",
        description: "Format final results",
        inputs: {}
      }
    ];
  }

  async executeAutonomously(plan) {
    console.log("🚀 Executing autonomously...");
    const results = [];

    for (const step of plan) {
      console.log(\`⚡ Executing step \${step.step}: \${step.action}\`);

      let stepResult;
      if (step.tool === "web_search") {
        stepResult = await this.webSearch(step.inputs.query);
      } else if (step.tool === "calculator") {
        stepResult = await this.calculate(step.inputs.expression);
      } else {
        stepResult = { message: \`Completed \${step.action}\` };
      }

      results.push({
        step: step.step,
        action: step.action,
        result: stepResult,
        status: "completed"
      });

      // Small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      status: "completed",
      autonomyLevel: "high",
      results: results,
      totalSteps: plan.length
    };
  }

  async executeWithApproval(plan) {
    console.log("🤝 Executing with approval...");
    const results = [];

    for (const step of plan) {
      // For critical steps, request approval
      if (step.tool === "web_search") {
        const approved = await this.requestApproval(
          \`Search for market data?\`,
          step
        );

        if (approved) {
          const result = await this.webSearch(step.inputs.query);
          results.push({
            step: step.step,
            action: step.action,
            result: result,
            approved: true,
            status: "completed"
          });
        } else {
          results.push({
            step: step.step,
            action: step.action,
            result: "Skipped by user",
            approved: false,
            status: "skipped"
          });
        }
      } else {
        // Execute non-critical steps automatically
        const result = await this.calculate(step.inputs.expression);
        results.push({
          step: step.step,
          action: step.action,
          result: result,
          status: "completed"
        });
      }
    }

    return {
      status: "completed_with_approval",
      results: results,
      totalSteps: plan.length
    };
  }

  async executeManually(plan) {
    console.log("👤 Manual execution mode");
    console.log("📋 Execution Plan:");

    for (const step of plan) {
      console.log(\`\${step.step}. \${step.description} (tool: \${step.tool})\`);
    }

    // In a real implementation, this would wait for user input
    console.log("Press Enter to execute each step...");

    const results = [];
    for (const step of plan) {
      console.log(\`⏭️  Executing: \${step.action}\`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      results.push({
        step: step.step,
        action: step.action,
        result: \`Completed \${step.action} manually\`,
        status: "completed"
      });
    }

    return {
      status: "completed_manually",
      results: results,
      message: "Plan executed with manual guidance"
    };
  }

  async requestApproval(message, step) {
    // In a real application, this would show a UI dialog
    // For demo purposes, we'll simulate user approval
    console.log(\`🔔 Approval request: \${message}\`);
    console.log(\`   Step details: \${JSON.stringify(step, null, 2)}\`);

    // Simulate user thinking and approving
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("✅ User approved");

    return true;
  }

  async updateMemory(task, plan, result) {
    // Update agent memory with learnings
    const memoryEntry = {
      timestamp: new Date().toISOString(),
      task: task,
      plan: plan,
      result: result,
      learnings: this.extractLearnings(result),
      performance: {
        stepsCompleted: result.results?.filter(r => r.status === "completed").length || 0,
        totalSteps: plan.length,
        success: result.status.includes("completed")
      }
    };

    this.memory.push(memoryEntry);

    // Keep memory size manageable
    if (this.memory.length > 100) {
      this.memory = this.memory.slice(-50);
    }

    console.log("🧠 Memory updated with new learnings");
  }

  extractLearnings(result) {
    const learnings = [];

    if (result.status === "completed") {
      learnings.push("Autonomous execution successful");
    } else if (result.status.includes("approval")) {
      learnings.push("User approval workflow effective");
    } else if (result.status.includes("manual")) {
      learnings.push("Manual guidance completed successfully");
    }

    if (result.results) {
      const successfulSteps = result.results.filter(r => r.status === "completed").length;
      if (successfulSteps === result.results.length) {
        learnings.push("All steps completed successfully");
      }
    }

    return learnings;
  }

  // Tool implementations
  async webSearch(query) {
    console.log(\`🔍 Searching web for: \${query}\`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock search results
    return {
      results: [
        {
          title: \`Latest information about \${query}\`,
          url: \`https://example.com/\${query.replace(/\\s+/g, '-')}\`,
          snippet: \`Comprehensive guide to \${query} with latest updates...\`,
          relevance: 0.95
        },
        {
          title: \`\${query} - Analysis 2024\`,
          url: \`https://analysis.com/\${query}\`,
          snippet: \`In-depth analysis of \${query} trends and projections...\`,
          relevance: 0.88
        }
      ],
      totalResults: 2,
      searchTime: 1.2
    };
  }

  async calculate(expression) {
    console.log(\`🧮 Calculating: \${expression}\`);
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Safe evaluation (in production, use a proper math library)
      const result = Function('\"use strict\"; return (' + expression + ')')();
      return {
        expression: expression,
        result: result,
        status: "success"
      };
    } catch (error) {
      return {
        expression: expression,
        error: error.message,
        status: "error"
      };
    }
  }

  // Get memory statistics
  getMemoryStats() {
    const totalEntries = this.memory.length;
    const successfulTasks = this.memory.filter(entry => entry.result.status.includes("completed")).length;
    const avgSuccessRate = totalEntries > 0 ? (successfulTasks / totalEntries) * 100 : 0;

    return {
      totalEntries,
      successfulTasks,
      successRate: avgSuccessRate.toFixed(1) + '%',
      lastUpdated: this.memory.length > 0 ? this.memory[this.memory.length - 1].timestamp : null
    };
  }
}

// Usage example
async function demonstrateAgenticAI() {
  console.log("🤖 Initializing Agentic AI System...");

  // Create agentic AI system
  const agent = new AgenticAISystem("gpt-4", ["web_search", "calculator"]);

  // Process a task with different autonomy levels
  const task = "Analyze current market trends and provide growth projections";

  console.log("\\n📊 High Autonomy Example:");
  const highAutonomyResult = await agent.processTask(task, "high");
  console.log("Result:", JSON.stringify(highAutonomyResult, null, 2));

  console.log("\\n🤝 Medium Autonomy Example:");
  const mediumAutonomyResult = await agent.processTask(task, "medium");
  console.log("Result:", JSON.stringify(mediumAutonomyResult, null, 2));

  console.log("\\n👤 Low Autonomy Example:");
  const lowAutonomyResult = await agent.processTask(task, "low");
  console.log("Result:", JSON.stringify(lowAutonomyResult, null, 2));

  console.log("\\n📈 Memory Statistics:");
  console.log(JSON.stringify(agent.getMemoryStats(), null, 2));
}

// Advanced Multi-Agent Orchestration
class MultiAgentOrchestrator {
  constructor() {
    this.agents = new Map();
    this.taskQueue = [];
    this.completedTasks = new Map();
    this.collaborations = new Map();
  }

  registerAgent(agentId, role, capabilities) {
    this.agents.set(agentId, {
      id: agentId,
      role,
      capabilities,
      currentTasks: [],
      status: "available",
      metrics: {
        tasksCompleted: 0,
        avgCompletionTime: 0,
        successRate: 1.0
      }
    });

    console.log(\`🤖 Registered agent \${agentId} as \${role}\`);
  }

  async orchestrateComplexTask(objective) {
    console.log(\`🎯 Starting orchestration for: \${objective}\`);

    try {
      // Step 1: Decompose objective
      const taskPlan = await this.decomposeObjective(objective);
      console.log(\`📋 Created \${taskPlan.length} subtasks\`);

      // Step 2: Assign tasks to agents
      const assignments = await this.assignTasks(taskPlan);
      console.log(\`👥 Assigned tasks to \${assignments.size} agents\`);

      // Step 3: Execute with coordination
      const results = await this.executeWithCoordination(assignments);

      // Step 4: Aggregate results
      const finalResult = await this.aggregateResults(results);

      return finalResult;
    } catch (error) {
      console.error("❌ Orchestration failed:", error);
      throw error;
    }
  }

  async decomposeObjective(objective) {
    // AI-powered task decomposition
    return [
      {
        id: "research_1",
        description: "Research current market trends",
        requiredRole: "researcher",
        priority: 1,
        estimatedDuration: 600,
        dependencies: []
      },
      {
        id: "analysis_1",
        description: "Analyze collected data",
        requiredRole: "analyst",
        priority: 2,
        estimatedDuration: 400,
        dependencies: ["research_1"]
      },
      {
        id: "writing_1",
        description: "Create comprehensive report",
        requiredRole: "writer",
        priority: 3,
        estimatedDuration: 800,
        dependencies: ["analysis_1"]
      }
    ];
  }

  async assignTasks(tasks) {
    const assignments = new Map();

    for (const task of tasks) {
      // Find suitable agents
      const suitableAgents = Array.from(this.agents.values())
        .filter(agent =>
          agent.role === task.requiredRole &&
          agent.status === "available"
        );

      if (suitableAgents.length > 0) {
        // Select best agent based on performance
        const bestAgent = suitableAgents.reduce((best, current) =>
          current.metrics.successRate > best.metrics.successRate ? current : best
        );

        if (!assignments.has(bestAgent.id)) {
          assignments.set(bestAgent.id, []);
        }
        assignments.get(bestAgent.id).push(task);

        // Update agent status
        bestAgent.currentTasks.push(task.id);
        bestAgent.status = "busy";
      }
    }

    return assignments;
  }

  async executeWithCoordination(assignments) {
    const executionResults = new Map();

    // Execute all agent assignments concurrently
    const agentPromises = [];

    for (const [agentId, tasks] of assignments) {
      const agentPromise = this.executeAgentTasks(agentId, tasks);
      agentPromises.push(agentPromise);
    }

    // Wait for all agents to complete
    const agentResults = await Promise.allSettled(agentPromises);

    // Process results
    let agentIndex = 0;
    for (const [agentId] of assignments) {
      const result = agentResults[agentIndex];

      if (result.status === "fulfilled") {
        executionResults.set(agentId, result.value);
      } else {
        executionResults.set(agentId, { error: result.reason.message });
      }

      agentIndex++;
    }

    return executionResults;
  }

  async executeAgentTasks(agentId, tasks) {
    const agent = this.agents.get(agentId);
    const results = {};

    console.log(\`🤖 Agent \${agentId} (\${agent.role}) starting \${tasks.length} tasks\`);

    for (const task of tasks) {
      // Check dependencies
      if (task.dependencies && task.dependencies.length > 0) {
        for (const depId of task.dependencies) {
          if (!this.completedTasks.has(depId)) {
            console.log(\`⏳ Agent \${agentId} waiting for dependency: \${depId}\`);
            await this.waitForTaskCompletion(depId);
          }
        }
      }

      // Execute task
      const startTime = Date.now();

      try {
        const result = await this.executeSingleTask(agentId, task);
        const duration = Date.now() - startTime;

        results[task.id] = {
          status: "completed",
          result,
          duration
        };

        this.completedTasks.set(task.id, result);
        console.log(\`✅ Agent \${agentId} completed task \${task.id}\`);

      } catch (error) {
        results[task.id] = {
          status: "failed",
          error: error.message
        };
        console.log(\`❌ Agent \${agentId} failed task \${task.id}: \${error.message}\`);
      }
    }

    // Update agent status
    agent.status = "available";
    agent.currentTasks = [];

    // Update metrics
    this.updateAgentMetrics(agentId, results);

    return results;
  }

  async executeSingleTask(agentId, task) {
    const agent = this.agents.get(agentId);

    // Simulate task execution based on role
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    switch (agent.role) {
      case "researcher":
        return {
          researchData: {
            trends: ["AI adoption increasing", "Cloud migration accelerating"],
            statistics: { growthRate: "23%", marketSize: "$150B" }
          },
          confidence: 0.85
        };

      case "analyst":
        return {
          analysis: {
            insights: ["Market showing strong growth", "Enterprise adoption driving expansion"],
            recommendations: ["Increase AI investment", "Focus on enterprise solutions"]
          },
          confidence: 0.78
        };

      case "writer":
        return {
          report: {
            executiveSummary: "AI market experiencing unprecedented growth...",
            keyFindings: ["Market projected to reach $500B by 2030"],
            wordCount: 2500
          }
        };

      default:
        return { message: \`Task \${task.description} completed by \${agent.role}\` };
    }
  }

  async waitForTaskCompletion(taskId) {
    // Wait for dependency task to complete
    while (!this.completedTasks.has(taskId)) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  updateAgentMetrics(agentId, results) {
    const agent = this.agents.get(agentId);
    const metrics = agent.metrics;

    const completedCount = Object.values(results).filter(r => r.status === "completed").length;
    metrics.tasksCompleted += completedCount;

    // Update success rate
    const totalCount = Object.keys(results).length;
    if (totalCount > 0) {
      const currentSuccessRate = completedCount / totalCount;
      metrics.successRate = metrics.successRate * 0.8 + currentSuccessRate * 0.2;
    }
  }

  async aggregateResults(executionResults) {
    const finalReport = {
      objectiveCompletionStatus: "completed",
      agentContributions: {},
      finalOutput: {},
      metadata: {
        totalAgents: executionResults.size,
        totalExecutionTime: 0,
        successRate: 0
      }
    };

    let totalTime = 0;
    let successfulTasks = 0;
    let totalTasks = 0;

    for (const [agentId, results] of executionResults) {
      const agent = this.agents.get(agentId);

      finalReport.agentContributions[agentId] = {
        role: agent.role,
        tasksCompleted: Object.values(results).filter(r => r.status === "completed").length,
        results
      };

      // Process results
      for (const [taskId, result] of Object.entries(results)) {
        totalTasks++;
        if (result.status === "completed") {
          successfulTasks++;
          totalTime += result.duration || 0;

          // Add to final output
          if (agent.role === "researcher") {
            finalReport.finalOutput.research = result.result;
          } else if (agent.role === "analyst") {
            finalReport.finalOutput.analysis = result.result;
          } else if (agent.role === "writer") {
            finalReport.finalOutput.report = result.result;
          }
        }
      }
    }

    finalReport.metadata.totalExecutionTime = totalTime;
    finalReport.metadata.successRate = totalTasks > 0 ? (successfulTasks / totalTasks) : 0;

    return finalReport;
  }
}

// Usage example
async function demonstrateMultiAgentSystem() {
  console.log("🎭 Initializing Multi-Agent System...");

  const orchestrator = new MultiAgentOrchestrator();

  // Register specialized agents
  orchestrator.registerAgent("researcher_1", "researcher", ["web_search", "data_collection"]);
  orchestrator.registerAgent("analyst_1", "analyst", ["data_analysis", "statistics"]);
  orchestrator.registerAgent("writer_1", "writer", ["content_creation", "formatting"]);

  // Execute complex objective
  const result = await orchestrator.orchestrateComplexTask(
    "Create comprehensive market analysis report for AI industry"
  );

  console.log("\\n🎉 Final Result:");
  console.log(JSON.stringify(result, null, 2));
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AgenticAISystem, MultiAgentOrchestrator };
}

// Run demonstrations
if (typeof window !== 'undefined') {
  // Browser environment
  window.demonstrateAgenticAI = demonstrateAgenticAI;
  window.demonstrateMultiAgentSystem = demonstrateMultiAgentSystem;
} else {
  // Node.js environment
  demonstrateAgenticAI().catch(console.error);
  // demonstrateMultiAgentSystem().catch(console.error);
}`,

      advanced: `// Advanced Multi-Agent Orchestration with Collaboration
class AdvancedMultiAgentOrchestrator {
  constructor() {
    this.agents = new Map();
    this.taskQueue = [];
    this.activeCollaborations = new Map();
    this.resourceManager = new ResourceManager();
    this.communicationHub = new CommunicationHub();
    this.performanceMonitor = new PerformanceMonitor();
  }

  async orchestrateComplexObjective(objective, options = {}) {
    console.log(\`🎯 Starting advanced orchestration: \${objective}\`);

    const sessionId = this.generateSessionId();

    try {
      // Step 1: Strategic planning and resource allocation
      const strategicPlan = await this.createStrategicPlan(objective);

      // Step 2: Agent team formation and role assignment
      const agentTeam = await this.formAgentTeam(strategicPlan);

      // Step 3: Dynamic task decomposition with dependencies
      const taskGraph = await this.createTaskGraph(strategicPlan, agentTeam);

      // Step 4: Execute with real-time coordination and adaptation
      const executionResults = await this.executeWithAdaptiveCoordination(
        taskGraph,
        agentTeam,
        sessionId
      );

      // Step 5: Quality assurance and result synthesis
      const finalResult = await this.synthesizeAndValidate(executionResults);

      // Step 6: Performance analysis and learning
      await this.analyzeAndLearn(sessionId, objective, finalResult);

      return finalResult;

    } catch (error) {
      console.error(\`❌ Orchestration failed for session \${sessionId}:\`, error);
      throw error;
    }
  }

  async createStrategicPlan(objective) {
    console.log("📋 Creating strategic plan...");

    // Analyze objective complexity and requirements
    const complexity = await this.assessComplexity(objective);
    const requirements = await this.extractRequirements(objective);
    const constraints = await this.identifyConstraints(objective);

    return {
      objective,
      complexity,
      requirements,
      constraints,
      estimatedDuration: this.estimateDuration(complexity),
      resourceRequirements: this.calculateResourceNeeds(requirements),
      riskFactors: await this.identifyRisks(objective),
      successCriteria: await this.defineSuccessCriteria(objective)
    };
  }

  async formAgentTeam(strategicPlan) {
    console.log("👥 Forming specialized agent team...");

    const team = {
      coordinator: null,
      specialists: [],
      collaborators: []
    };

    // Select coordinator agent
    const bestCoordinator = await this.selectBestAgent("coordinator", strategicPlan);
    if (bestCoordinator) {
      team.coordinator = bestCoordinator.id;
      await this.assignRole(bestCoordinator.id, "coordinator", strategicPlan);
    }

    // Select specialist agents based on requirements
    for (const requirement of strategicPlan.requirements) {
      const specialists = await this.selectSpecialists(requirement);
      team.specialists.push(...specialists.map(s => s.id));

      for (const specialist of specialists) {
        await this.assignRole(specialist.id, "specialist", requirement);
      }
    }

    // Select collaboration agents for complex tasks
    if (strategicPlan.complexity.level === "high") {
      const collaborators = await this.selectCollaborators(strategicPlan);
      team.collaborators.push(...collaborators.map(c => c.id));
    }

    console.log(\`🤖 Team formed: 1 coordinator, \${team.specialists.length} specialists, \${team.collaborators.length} collaborators\`);

    return team;
  }

  async createTaskGraph(strategicPlan, agentTeam) {
    console.log("🕸️ Creating dynamic task graph...");

    const tasks = [];
    const dependencies = new Map();

    // Create main task categories
    const taskCategories = [
      "planning_and_coordination",
      "data_collection",
      "analysis_and_processing",
      "content_creation",
      "quality_assurance",
      "integration_and_synthesis"
    ];

    // Generate tasks for each category
    for (const category of taskCategories) {
      const categoryTasks = await this.generateTasksForCategory(
        category,
        strategicPlan,
        agentTeam
      );
      tasks.push(...categoryTasks);
    }

    // Establish dependencies between tasks
    for (const task of tasks) {
      const taskDeps = await this.identifyTaskDependencies(task, tasks);
      dependencies.set(task.id, taskDeps);
    }

    return {
      tasks,
      dependencies,
      criticalPath: await this.calculateCriticalPath(tasks, dependencies)
    };
  }

  async executeWithAdaptiveCoordination(taskGraph, agentTeam, sessionId) {
    console.log("⚡ Starting adaptive execution...");

    const executionState = {
      sessionId,
      startTime: Date.now(),
      completedTasks: new Map(),
      failedTasks: new Map(),
      activeTasks: new Map(),
      agentStates: new Map(),
      adaptations: [],
      collaborationEvents: []
    };

    // Initialize agent states
    for (const agentId of [...[agentTeam.coordinator], ...agentTeam.specialists, ...agentTeam.collaborators]) {
      executionState.agentStates.set(agentId, {
        status: "available",
        currentTask: null,
        performance: { completed: 0, failed: 0, totalTime: 0 }
      });
    }

    // Start execution monitoring
    const monitorPromise = this.performanceMonitor.startMonitoring(executionState);

    // Execute tasks with dynamic scheduling
    try {
      await this.executeTaskLoop(taskGraph, agentTeam, executionState);

      // Wait for all active tasks to complete
      await this.waitForAllTasks(executionState);

    } finally {
      // Stop monitoring
      await monitorPromise;
    }

    return this.compileExecutionResults(executionState);
  }

  async executeTaskLoop(taskGraph, agentTeam, executionState) {
    while (this.hasIncompleteTasks(taskGraph, executionState)) {
      // Get tasks ready for execution
      const readyTasks = this.getReadyTasks(taskGraph, executionState);

      if (readyTasks.length === 0) {
        // Check for deadlocks
        if (this.isDeadlocked(executionState)) {
          await this.resolveDeadlock(executionState);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      // Schedule ready tasks
      for (const task of readyTasks) {
        const assignedAgent = await this.assignTaskToAgent(task, agentTeam, executionState);

        if (assignedAgent) {
          const taskPromise = this.executeTaskWithMonitoring(
            task,
            assignedAgent,
            executionState
          );

          executionState.activeTasks.set(task.id, {
            task,
            agentId: assignedAgent,
            startTime: Date.now(),
            promise: taskPromise
          });
        }
      }

      // Check for completed tasks
      await this.checkCompletedTasks(executionState);

      // Adapt to changing conditions
      await this.adaptExecution(taskGraph, agentTeam, executionState);

      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async executeTaskWithMonitoring(task, agentId, executionState) {
    const agent = this.agents.get(agentId);

    try {
      console.log(\`⚡ Agent \${agentId} executing task \${task.id}: \${task.description}\`);

      // Update agent state
      const agentState = executionState.agentStates.get(agentId);
      agentState.status = "busy";
      agentState.currentTask = task.id;

      // Start real-time monitoring
      const monitor = this.performanceMonitor.monitorTask(task.id, agentId);

      // Execute task with timeout and retry logic
      const result = await this.executeTaskWithRetry(task, agent, {
        timeout: task.estimatedDuration * 1.5,
        maxRetries: 3,
        monitor
      });

      // Record successful completion
      executionState.completedTasks.set(task.id, {
        task,
        agentId,
        result,
        duration: Date.now() - agentState.currentTaskStartTime,
        success: true
      });

      // Update agent performance
      agentState.performance.completed++;
      agentState.status = "available";
      agentState.currentTask = null;

      monitor.stop();

      console.log(\`✅ Task \${task.id} completed successfully\`);
      return result;

    } catch (error) {
      // Handle task failure
      console.error(\`❌ Task \${task.id} failed: \${error.message}\`);

      executionState.failedTasks.set(task.id, {
        task,
        agentId,
        error: error.message,
        duration: Date.now() - Date.now(),
        success: false
      });

      // Update agent performance
      const agentState = executionState.agentStates.get(agentId);
      agentState.performance.failed++;
      agentState.status = "available";
      agentState.currentTask = null;

      // Attempt recovery or adaptation
      await this.handleTaskFailure(task, agentId, error, executionState);

      throw error;
    }
  }

  async executeTaskWithRetry(task, agent, options) {
    let lastError;

    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        // Check resource availability
        await this.resourceManager.ensureResources(task.requiredResources);

        // Execute task based on agent specialization
        let result;
        if (agent.role === "coordinator") {
          result = await this.executeCoordinationTask(task, agent);
        } else if (agent.role === "specialist") {
          result = await this.executeSpecialistTask(task, agent);
        } else {
          result = await this.executeCollaborativeTask(task, agent);
        }

        // Validate result quality
        const validation = await this.validateTaskResult(task, result);
        if (!validation.isValid) {
          throw new Error(\`Task result validation failed: \${validation.reason}\`);
        }

        return result;

      } catch (error) {
        lastError = error;
        console.log(\`🔄 Task \${task.id} attempt \${attempt} failed: \${error.message}\`);

        if (attempt < options.maxRetries) {
          // Wait before retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));

          // Adapt execution strategy
          await this.adaptTaskExecution(task, attempt, error);
        }
      }
    }

    throw lastError;
  }

  async executeCoordinationTask(task, agent) {
    // Implementation for coordination tasks
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      type: "coordination_result",
      coordinationActions: [
        "Task allocation optimized",
        "Resource distribution balanced",
        "Timeline milestones established"
      ],
      nextSteps: [
        "Proceed with data collection phase",
        "Monitor agent performance metrics"
      ]
    };
  }

  async executeSpecialistTask(task, agent) {
    // Implementation for specialist tasks
    await new Promise(resolve => setTimeout(resolve, 3000));

    const specialty = agent.specialty;

    switch (specialty) {
      case "data_analysis":
        return {
          type: "analysis_result",
          dataProcessed: "1000 records",
          insights: [
            "Trend analysis complete",
            "Statistical significance verified",
            "Anomaly detection applied"
          ],
          confidence: 0.92
        };

      case "content_generation":
        return {
          type: "content_result",
          contentType: "comprehensive_report",
          wordCount: 2500,
          sections: ["executive_summary", "analysis", "recommendations"],
          qualityScore: 0.88
        };

      default:
        return {
          type: "specialist_result",
          specialty,
          status: "completed",
          output: \`Specialized task for \${specialty} completed successfully\`
        };
    }
  }

  async executeCollaborativeTask(task, agent) {
    // Implementation for collaborative tasks
    await new Promise(resolve => setTimeout(resolve, 2500));

    return {
      type: "collaborative_result",
      collaborationType: task.collaborationType,
      participants: task.participants || [],
      synergyScore: 0.85,
      collectiveOutput: {
        insights: ["Combined expertise applied"],
        recommendations: ["Collaborative strategies developed"],
        nextActions: ["Continue cross-functional coordination"]
      }
    };
  }

  async adaptExecution(taskGraph, agentTeam, executionState) {
    // Monitor performance and adapt strategy
    const performanceIssues = await this.identifyPerformanceIssues(executionState);

    if (performanceIssues.length > 0) {
      console.log(\`🔧 Detected \${performanceIssues.length} performance issues, adapting...\`);

      for (const issue of performanceIssues) {
        const adaptation = await this.createAdaptationStrategy(issue, executionState);

        if (adaptation) {
          await this.applyAdaptation(adaptation, taskGraph, agentTeam, executionState);
          executionState.adaptations.push(adaptation);
        }
      }
    }
  }

  async synthesizeAndValidate(executionResults) {
    console.log("🔗 Synthesizing and validating results...");

    const synthesis = {
      overallStatus: "completed",
      completionRate: 0,
      qualityScore: 0,
      keyFindings: [],
      recommendations: [],
      nextActions: [],
      performanceMetrics: {}
    };

    // Calculate completion rate
    const totalTasks = executionResults.completedTasks.size + executionResults.failedTasks.size;
    const completedTasks = executionResults.completedTasks.size;
    synthesis.completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Aggregate results from completed tasks
    for (const [taskId, taskResult] of executionResults.completedTasks) {
      const result = taskResult.result;

      // Extract key findings
      if (result.insights) {
        synthesis.keyFindings.push(...result.insights);
      }

      // Extract recommendations
      if (result.recommendations) {
        synthesis.recommendations.push(...result.recommendations);
      }

      // Calculate quality scores
      if (result.confidence) {
        synthesis.qualityScore += result.confidence;
      }
    }

    // Calculate average quality score
    const completedCount = executionResults.completedTasks.size;
    if (completedCount > 0) {
      synthesis.qualityScore /= completedCount;
    }

    // Generate final recommendations
    if (synthesis.completionRate >= 80 && synthesis.qualityScore >= 0.8) {
      synthesis.overallStatus = "success";
      synthesis.nextActions = [
        "Proceed with implementation",
        "Schedule follow-up review",
        "Document lessons learned"
      ];
    } else {
      synthesis.overallStatus = "partial_success";
      synthesis.nextActions = [
        "Address failed tasks",
        "Improve quality in identified areas",
        "Consider alternative approaches"
      ];
    }

    // Performance metrics
    synthesis.performanceMetrics = {
      totalExecutionTime: Date.now() - executionResults.startTime,
      averageTaskDuration: this.calculateAverageTaskDuration(executionResults),
      agentUtilization: this.calculateAgentUtilization(executionResults),
      adaptationCount: executionResults.adaptations.length
    };

    return synthesis;
  }

  // Helper classes and utilities
  generateSessionId() {
    return \`session_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`;
  }

  hasIncompleteTasks(taskGraph, executionState) {
    const totalTasks = taskGraph.tasks.length;
    const completedTasks = executionState.completedTasks.size;
    const failedTasks = executionState.failedTasks.size;

    return completedTasks + failedTasks < totalTasks;
  }

  getReadyTasks(taskGraph, executionState) {
    return taskGraph.tasks.filter(task => {
      // Skip if already completed or failed
      if (executionState.completedTasks.has(task.id) ||
          executionState.failedTasks.has(task.id) ||
          executionState.activeTasks.has(task.id)) {
        return false;
      }

      // Check if dependencies are satisfied
      const dependencies = taskGraph.dependencies.get(task.id) || [];
      return dependencies.every(depId =>
        executionState.completedTasks.has(depId)
      );
    });
  }

  async assignTaskToAgent(task, agentTeam, executionState) {
    // Find available and suitable agents
    const availableAgents = [...[agentTeam.coordinator], ...agentTeam.specialists, ...agentTeam.collaborators]
      .filter(agentId => {
        const state = executionState.agentStates.get(agentId);
        return state && state.status === "available";
      });

    if (availableAgents.length === 0) {
      return null;
    }

    // Select best agent based on task requirements and agent capabilities
    const bestAgent = await this.selectBestAgentForTask(task, availableAgents);

    if (bestAgent) {
      // Update agent state
      const state = executionState.agentStates.get(bestAgent);
      state.currentTaskStartTime = Date.now();
    }

    return bestAgent;
  }

  async checkCompletedTasks(executionState) {
    for (const [taskId, taskInfo] of executionState.activeTasks) {
      try {
        // Check if task promise is resolved
        const result = await Promise.race([
          taskInfo.promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 100)
          )
        ]);

        // Task completed successfully
        executionState.activeTasks.delete(taskId);

      } catch (error) {
        // Task still running or failed
        if (error.message !== "Timeout") {
          // Task failed
          executionState.activeTasks.delete(taskId);
          executionState.failedTasks.set(taskId, {
            error: error.message,
            task: taskInfo.task
          });
        }
      }
    }
  }

  compileExecutionResults(executionState) {
    return {
      sessionId: executionState.sessionId,
      duration: Date.now() - executionState.startTime,
      completedTasks: Object.fromEntries(executionState.completedTasks),
      failedTasks: Object.fromEntries(executionState.failedTasks),
      agentPerformance: Object.fromEntries(executionState.agentStates),
      adaptations: executionState.adaptations,
      collaborationEvents: executionState.collaborationEvents
    };
  }
}

// Supporting classes
class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.allocations = new Map();
  }

  async ensureResources(requiredResources) {
    for (const resource of requiredResources) {
      if (!this.isResourceAvailable(resource)) {
        await this.allocateResource(resource);
      }
    }
  }

  isResourceAvailable(resource) {
    const allocation = this.allocations.get(resource.type);
    return !allocation || allocation.used < allocation.capacity;
  }

  async allocateResource(resource) {
    console.log(\`🔧 Allocating resource: \${resource.type}\`);
    // Simulate resource allocation
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

class CommunicationHub {
  constructor() {
    this.channels = new Map();
    this.messageQueue = [];
  }

  async sendMessage(fromAgent, toAgent, message) {
    const messageObj = {
      id: this.generateMessageId(),
      from: fromAgent,
      to: toAgent,
      message,
      timestamp: Date.now(),
      status: "sent"
    };

    this.messageQueue.push(messageObj);
    console.log(\`💬 Message sent from \${fromAgent} to \${toAgent}\`);

    return messageObj;
  }

  generateMessageId() {
    return \`msg_\${Date.now()}_\${Math.random().toString(36).substr(2, 6)}\`;
  }
}

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
  }

  async startMonitoring(executionState) {
    console.log("📊 Starting performance monitoring...");

    const monitoringInterval = setInterval(() => {
      this.collectMetrics(executionState);
      this.checkForAlerts(executionState);
    }, 5000);

    return () => {
      clearInterval(monitoringInterval);
      console.log("📊 Performance monitoring stopped");
    };
  }

  monitorTask(taskId, agentId) {
    return {
      taskId,
      agentId,
      startTime: Date.now(),
      stop: () => {
        console.log(\`📈 Monitoring stopped for task \${taskId}\`);
      }
    };
  }

  collectMetrics(executionState) {
    // Collect various performance metrics
    const metrics = {
      timestamp: Date.now(),
      activeTasks: executionState.activeTasks.size,
      completedTasks: executionState.completedTasks.size,
      failedTasks: executionState.failedTasks.size,
      agentUtilization: this.calculateAgentUtilization(executionState)
    };

    this.metrics.set(Date.now(), metrics);
  }

  checkForAlerts(executionState) {
    // Check for performance issues
    const failureRate = this.calculateFailureRate(executionState);

    if (failureRate > 0.3) {
      this.alerts.push({
        type: "high_failure_rate",
        message: \`High task failure rate: \${(failureRate * 100).toFixed(1)}%\`,
        timestamp: Date.now()
      });
    }
  }

  calculateFailureRate(executionState) {
    const completed = executionState.completedTasks.size;
    const failed = executionState.failedTasks.size;
    const total = completed + failed;

    return total > 0 ? failed / total : 0;
  }

  calculateAgentUtilization(executionState) {
    const totalAgents = executionState.agentStates.size;
    const busyAgents = Array.from(executionState.agentStates.values())
      .filter(state => state.status === "busy").length;

    return totalAgents > 0 ? busyAgents / totalAgents : 0;
  }
}

// Export the advanced orchestrator
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AdvancedMultiAgentOrchestrator,
    ResourceManager,
    CommunicationHub,
    PerformanceMonitor
  };
}

// Browser compatibility
if (typeof window !== 'undefined') {
  window.AdvancedMultiAgentOrchestrator = AdvancedMultiAgentOrchestrator;
  window.ResourceManager = ResourceManager;
  window.CommunicationHub = CommunicationHub;
  window.PerformanceMonitor = PerformanceMonitor;
}`
    }
  };

  const currentSection = sections[activeSection];

  return (
    <AuthWrapper title="Agentic AI Tutorial" description="Master the art of building autonomous AI agents">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-indigo-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Agentic AI Masterclass
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Build autonomous AI agents that can think, plan, and execute complex tasks independently.
              Learn to create the next generation of intelligent automation systems.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-700" />
                <span className="text-indigo-700 font-medium">5 Learning Levels</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
                <Bot className="w-5 h-5 text-purple-700" />
                <span className="text-purple-700 font-medium">Multi-Agent Systems</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-lg">
                <Rocket className="w-5 h-5 text-pink-700" />
                <span className="text-pink-700 font-medium">Production Ready</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeSection === index
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  <section.icon className="w-5 h-5 inline mr-2" />
                  {section.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Section Content */}
              <div className={`${currentSection.bgColor} rounded-2xl p-8 shadow-xl`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 bg-white rounded-xl shadow-md`}>
                    <currentSection.icon className={`w-8 h-8 ${currentSection.color}`} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{currentSection.title}</h2>
                    <p className="text-gray-600 mt-1">{currentSection.content.overview}</p>
                  </div>
                </div>

                {/* Key Topics */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-indigo-600" />
                    Key Topics Covered
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentSection.content.keyTopics.map((topic, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Configuration */}
                <div className="mt-6 bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-indigo-600" />
                    Agent Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agent Name
                      </label>
                      <input
                        type="text"
                        value={agentConfig.name}
                        onChange={(e) => setAgentConfig({...agentConfig, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                      </label>
                      <select
                        value={agentConfig.model}
                        onChange={(e) => setAgentConfig({...agentConfig, model: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-3">Claude 3</option>
                        <option value="gemini-pro">Gemini Pro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature: {agentConfig.temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={agentConfig.temperature}
                        onChange={(e) => setAgentConfig({...agentConfig, temperature: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Tokens
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="4000"
                        step="100"
                        value={agentConfig.maxTokens}
                        onChange={(e) => setAgentConfig({...agentConfig, maxTokens: parseInt(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Tools
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {agentTools.map((tool) => (
                        <label key={tool.name} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agentConfig.tools.includes(tool.name.toLowerCase().replace(' ', '_'))}
                            onChange={(e) => {
                              const toolName = tool.name.toLowerCase().replace(' ', '_');
                              if (e.target.checked) {
                                setAgentConfig({...agentConfig, tools: [...agentConfig.tools, toolName]});
                              } else {
                                setAgentConfig({...agentConfig, tools: agentConfig.tools.filter(t => t !== toolName)});
                              }
                            }}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{tool.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Autonomy Level
                    </label>
                    <div className="space-y-3">
                      {autonomyLevels.map((level) => (
                        <label key={level.level} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="autonomy"
                            value={level.level.toLowerCase().replace(' ', '_')}
                            checked={agentConfig.autonomy === level.level.toLowerCase().replace(' ', '_')}
                            onChange={(e) => setAgentConfig({...agentConfig, autonomy: e.target.value})}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{level.level}</div>
                            <div className="text-sm text-gray-600">{level.description}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${level.color}`}>
                            {level.autonomy}%
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Simulation */}
                <div className="mt-6 bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Play className="w-6 h-6 text-indigo-600" />
                      Agent Execution Simulator
                    </h3>
                    <button
                      onClick={simulateAgentExecution}
                      disabled={isSimulating}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSimulating ? 'Simulating...' : '🚀 Start Simulation'}
                    </button>
                  </div>

                  {simulationLog.length > 0 && (
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                      {simulationLog.map((log, index) => (
                        <div key={index} className="mb-1">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Tools Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Puzzle className="w-7 h-7 text-indigo-600" />
                  Available Agent Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agentTools.map((tool, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <tool.icon className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{tool.name}</h4>
                          <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {tool.params.map((param) => (
                              <span key={param} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                {param}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Examples */}
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Code className="w-7 h-7 text-indigo-600" />
                  Complete Code Examples
                </h3>

                <div className="space-y-6">
                  {/* Python Examples */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Python Implementation
                    </h4>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h5 className="font-medium text-gray-900">Basic Agentic AI System</h5>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                          <pre className="text-sm">
                            <code>{codeExamples.python.basic.substring(0, 800)}...</code>
                          </pre>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h5 className="font-medium text-gray-900">Advanced Multi-Agent Orchestration</h5>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                          <pre className="text-sm">
                            <code>{codeExamples.python.advanced.substring(0, 800)}...</code>
                          </pre>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h5 className="font-medium text-gray-900">Custom Agent Tools</h5>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                          <pre className="text-sm">
                            <code>{codeExamples.python.tools.substring(0, 800)}...</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* JavaScript Examples */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      JavaScript Implementation
                    </h4>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h5 className="font-medium text-gray-900">Basic Agentic AI</h5>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                          <pre className="text-sm">
                            <code>{codeExamples.javascript.basic.substring(0, 800)}...</code>
                          </pre>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h5 className="font-medium text-gray-900">Advanced Multi-Agent System</h5>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                          <pre className="text-sm">
                            <code>{codeExamples.javascript.advanced.substring(0, 800)}...</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Learning Path */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-indigo-600" />
                  Learning Path
                </h3>
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div key={section.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < activeSection ? 'bg-green-100 text-green-700' :
                        index === activeSection ? 'bg-indigo-100 text-indigo-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {index < activeSection ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          index <= activeSection ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {section.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  Key Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white/90">Autonomous Decision Making</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white/90">Multi-Agent Orchestration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white/90">Tool Integration Framework</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white/90">Memory & Learning Systems</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white/90">Production Deployment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    <span className="text-white/90">Error Recovery & Adaptation</span>
                  </div>
                </div>
              </div>

              {/* Architecture Overview */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Network className="w-6 h-6 text-indigo-600" />
                  Agent Architecture
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-2">
                      <Brain className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="font-medium text-gray-900">Core Agent</div>
                    <div className="text-sm text-gray-600">Decision Engine</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Database className="w-6 h-6 text-gray-700 mx-auto mb-1" />
                      <div className="text-xs font-medium text-gray-900">Memory</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Puzzle className="w-6 h-6 text-gray-700 mx-auto mb-1" />
                      <div className="text-xs font-medium text-gray-900">Tools</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <GitBranch className="w-6 h-6 text-gray-700 mx-auto mb-1" />
                      <div className="text-xs font-medium text-gray-900">Planning</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Activity className="w-6 h-6 text-gray-700 mx-auto mb-1" />
                      <div className="text-xs font-medium text-gray-900">Execution</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-600" />
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Task Success Rate</span>
                      <span className="text-sm text-gray-900">95.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '95.2%'}}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Response Time</span>
                      <span className="text-sm text-gray-900">1.2s avg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '88%'}}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Resource Efficiency</span>
                      <span className="text-sm text-gray-900">87.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '87.5%'}}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Autonomy Level</span>
                      <span className="text-sm text-gray-900">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-green-600" />
                  Best Practices
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Start Simple</div>
                      <div className="text-sm text-gray-600">Begin with basic reactive agents</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Iterative Development</div>
                      <div className="text-sm text-gray-600">Gradually increase autonomy</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Safety First</div>
                      <div className="text-sm text-gray-600">Implement proper safeguards</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">Monitor Performance</div>
                      <div className="text-sm text-gray-600">Track metrics continuously</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resources</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span className="text-sm">AutoGPT Documentation</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span className="text-sm">LangChain Agents Guide</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span className="text-sm">CrewAI Framework</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span className="text-sm">Agent Design Patterns</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <span className="text-sm">Production Deployment</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="mt-8 flex justify-center">
            <Link href="/learn/ai-integration">
              <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg">
                <ArrowLeft className="w-5 h-5" />
                Back to AI Integration
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default AgenticAITutorial;