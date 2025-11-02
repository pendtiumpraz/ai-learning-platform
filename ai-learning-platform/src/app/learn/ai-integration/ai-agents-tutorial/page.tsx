"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import AuthWrapper from '@/components/auth/auth-wrapper'
import {
  ArrowLeft,
  Copy,
  Download,
  Bot,
  Play,
  CheckCircle,
  Code,
  Lightbulb,
  Zap,
  Target,
  Workflow,
  Terminal
} from 'lucide-react'

export default function AIAgentsTutorial() {
  const [activeSection, setActiveSection] = useState('foundations')
  const [agentGoal, setAgentGoal] = useState('')
  const [agentType, setAgentType] = useState('reactive')
  const [apiKey, setApiKey] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [agentLogs, setAgentLogs] = useState<Array<{timestamp: string, message: string, type: 'info' | 'success' | 'error'}>>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const simulateAgent = async () => {
    if (!agentGoal.trim() || !apiKey) {
      alert('Please provide an agent goal and API key')
      return
    }

    setIsRunning(true)
    setAgentLogs([])

    const simulationSteps = [
      { message: "Initializing AI Agent...", type: "info" },
      { message: "Loading configuration and capabilities...", type: "info" },
      { message: `Agent type: ${agentType}`, type: "info" },
      { message: "Connecting to LLM service...", type: "info" },
      { message: "Connection established successfully", type: "success" },
      { message: `Processing goal: ${agentGoal}`, type: "info" },
      { message: "Analyzing requirements...", type: "info" },
      { message: "Generating execution plan...", type: "info" },
      { message: "Starting task execution...", type: "info" },
      { message: "✅ Task completed successfully", type: "success" }
    ]

    for (let i = 0; i < simulationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const step = simulationSteps[i]!;
      setAgentLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        message: step.message,
        type: step.type as 'info' | 'success' | 'error'
      }])
    }

    setIsRunning(false)
  }

  const copyToClipboard = async (text: string, codeId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCode(codeId)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Code examples
  const foundationsCode = `// Basic AI Agent Foundation
class AIAgent {
  constructor(config) {
    this.name = config.name;
    this.type = config.type; // 'reactive', 'proactive', 'hybrid'
    this.llm = new LLMService(config.apiKey);
    this.memory = new Memory();
    this.tools = config.tools || [];
    this.goals = config.goals || [];
  }

  // Core agent execution
  async execute(input) {
    // 1. Analyze input
    const analysis = await this.analyze(input);

    // 2. Plan actions
    const plan = await this.plan(analysis);

    // 3. Execute actions
    const results = await this.act(plan);

    // 4. Learn and remember
    await this.learn(input, analysis, plan, results);

    return results;
  }

  async analyze(input) {
    const prompt = \`
You are an AI agent assistant. Analyze this input:
Input: "\${input}"

Provide analysis including:
1. User intent
2. Required information
3. Available tools needed
4. Potential challenges
\`;

    return await this.llm.generate(prompt);
  }
}`

  const reactiveAgentCode = `// Reactive Agent - Responds to inputs
class ReactiveAgent extends AIAgent {
  constructor(config) {
    super({ ...config, type: 'reactive' });
  }

  async execute(input) {
    console.log(\`[Agent] Processing: \${input}\`);

    // Analyze the immediate input
    const analysis = await this.analyze(input);

    // Determine best response
    const response = await this.generateResponse(analysis);

    // Execute any required actions
    if (analysis.requiresAction) {
      await this.executeActions(analysis);
    }

    return response;
  }

  async generateResponse(analysis) {
    const prompt = \`
As a helpful AI assistant, respond to this analysis:
\${analysis}

Generate a helpful and accurate response.
\`;

    return await this.llm.generate(prompt);
  }

  async executeActions(analysis) {
    for (const tool of analysis.requiredTools) {
      if (this.tools.includes(tool)) {
        await this.useTool(tool, analysis);
      }
    }
  }
}`

  const proactiveAgentCode = `// Proactive Agent - Takes initiative
class ProactiveAgent extends AIAgent {
  constructor(config) {
    super({ ...config, type: 'proactive' });
    this.isRunning = false;
    this.checkInterval = config.checkInterval || 60000; // 1 minute
  }

  async start() {
    this.isRunning = true;
    console.log('[Agent] Starting proactive monitoring...');

    // Start background monitoring
    this.monitoringLoop();

    // Check for immediate goals
    await this.checkGoals();
  }

  async stop() {
    this.isRunning = false;
    console.log('[Agent] Stopping proactive monitoring...');
  }

  async monitoringLoop() {
    while (this.isRunning) {
      try {
        // Check environment
        const state = await this.assessEnvironment();

        // Look for opportunities
        const opportunities = await this.identifyOpportunities(state);

        // Act on opportunities
        for (const opportunity of opportunities) {
          await this.pursueOpportunity(opportunity);
        }

        // Wait for next check
        await this.sleep(this.checkInterval);
      } catch (error) {
        console.error('[Agent] Monitoring error:', error);
      }
    }
  }

  async assessEnvironment() {
    // Check system state, data, notifications, etc.
    return {
      timestamp: Date.now(),
      systemHealth: 'good',
      pendingTasks: await this.getPendingTasks(),
      notifications: await this.getNotifications()
    };
  }

  async identifyOpportunities(state) {
    const prompt = \`
Based on this environment state, identify proactive opportunities:
\${JSON.stringify(state, null, 2)}

Look for:
1. Tasks that need attention
2. Improvements that can be made
3. Potential issues to prevent
4. Optimization opportunities

Return a list of actionable opportunities.
\`;

    const response = await this.llm.generate(prompt);
    return this.parseOpportunities(response);
  }

  async pursueOpportunity(opportunity) {
    console.log(\`[Agent] Pursuing: \${opportunity.description}\`);

    // Create action plan
    const plan = await this.createActionPlan(opportunity);

    // Execute plan
    const results = await this.executePlan(plan);

    // Log outcome
    await this.logOutcome(opportunity, results);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}`

  const advancedAgentCode = `// Advanced Multi-Agent System
class MultiAgentSystem {
  constructor(config) {
    this.agents = new Map();
    this.coordinator = new AgentCoordinator(config.coordinator);
    this.sharedMemory = new SharedMemory();
    this.messageBus = new MessageBus();
  }

  // Register an agent
  registerAgent(agent) {
    this.agents.set(agent.id, agent);
    agent.connectToMessageBus(this.messageBus);
    agent.connectToSharedMemory(this.sharedMemory);
  }

  // Execute complex task
  async executeTask(task) {
    console.log(\`[MAS] Executing task: \${task.description}\`);

    // 1. Decompose task
    const subtasks = await this.coordinator.decomposeTask(task);

    // 2. Assign agents
    const assignments = await this.coordinator.assignAgents(subtasks, this.agents);

    // 3. Execute in parallel
    const results = await this.executeParallel(assignments);

    // 4. Integrate results
    const integratedResult = await this.coordinator.integrateResults(results);

    return integratedResult;
  }

  async executeParallel(assignments) {
    const promises = assignments.map(async assignment => {
      const agent = this.agents.get(assignment.agentId);
      if (!agent) {
        throw new Error(\`Agent \${assignment.agentId} not found\`);
      }

      return await agent.execute(assignment.task);
    });

    return await Promise.all(promises);
  }
}

// Agent Coordinator
class AgentCoordinator {
  constructor(config) {
    this.llm = new LLMService(config.apiKey);
  }

  async decomposeTask(task) {
    const prompt = \`
Break down this complex task into subtasks that can be handled by specialized agents:

Task: \${task.description}
Requirements: \${task.requirements}

For each subtask, specify:
1. Subtask description
2. Required skills/capabilities
3. Dependencies on other subtasks
4. Expected output

Return as JSON array.
\`;

    const response = await this.llm.generate(prompt);
    return JSON.parse(response);
  }

  async assignAgents(subtasks, availableAgents) {
    const assignments = [];

    for (const subtask of subtasks) {
      const bestAgent = await this.findBestAgent(subtask, availableAgents);
      assignments.push({
        subtaskId: subtask.id,
        agentId: bestAgent.id,
        task: subtask
      });
    }

    return assignments;
  }

  async findBestAgent(subtask, agents) {
    const agentList = Array.from(agents.values()).map(agent => ({
      id: agent.id,
      capabilities: agent.capabilities
    }));

    const prompt = \`
Given this subtask and available agents, select the best agent:

Subtask: \${JSON.stringify(subtask)}
Available Agents: \${JSON.stringify(agentList)}

Return the ID of the most suitable agent.
\`;

    const response = await this.llm.generate(prompt);
    const selectedId = response.trim();

    return agents.get(selectedId) || agents.values().next().value;
  }
}`

  const pythonAgentCode = `import asyncio
import json
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime
import openai

@dataclass
class AgentMessage:
    sender: str
    receiver: str
    content: str
    timestamp: datetime
    message_type: str = "info"

class BaseAgent:
    def __init__(self, agent_id: str, name: str, openai_api_key: str):
        self.id = agent_id
        self.name = name
        self.client = openai.OpenAI(api_key=openai_api_key)
        self.memory = []
        self.tools = []
        self.is_active = False

    async def start(self):
        """Start the agent"""
        self.is_active = True
        await self.on_start()

    async def stop(self):
        """Stop the agent"""
        self.is_active = False
        await self.on_stop()

    async def process_message(self, message: AgentMessage) -> Optional[AgentMessage]:
        """Process incoming message"""
        if not self.is_active:
            return None

        try:
            # Add to memory
            self.memory.append(message)

            # Generate response
            response_content = await self.generate_response(message.content)

            return AgentMessage(
                sender=self.id,
                receiver=message.sender,
                content=response_content,
                timestamp=datetime.now(),
                message_type="response"
            )
        except Exception as e:
            print(f"Error processing message: {e}")
            return None

    async def generate_response(self, input_text: str) -> str:
        """Generate AI response"""
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": f"You are {self.name}, an AI assistant. Be helpful and accurate."
                },
                {
                    "role": "user",
                    "content": input_text
                }
            ],
            temperature=0.7,
            max_tokens=300
        )
        return response.choices[0].message.content

    async def on_start(self):
        """Called when agent starts"""
        print(f"[{self.name}] Agent started")

    async def on_stop(self):
        """Called when agent stops"""
        print(f"[{self.name}] Agent stopped")

class ReactiveAgent(BaseAgent):
    def __init__(self, agent_id: str, name: str, openai_api_key: str):
        super().__init__(agent_id, name, openai_api_key)
        self.agent_type = "reactive"

    async def generate_response(self, input_text: str) -> str:
        """Generate immediate response to input"""
        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": f"You are {self.name}, a reactive AI agent. Respond immediately and helpfully."
                },
                {
                    "role": "user",
                    "content": f"Please respond to this: {input_text}"
                }
            ],
            temperature=0.3,
            max_tokens=200
        )
        return response.choices[0].message.content

class ProactiveAgent(BaseAgent):
    def __init__(self, agent_id: str, name: str, openai_api_key: str, check_interval: int = 60):
        super().__init__(agent_id, name, openai_api_key)
        self.agent_type = "proactive"
        self.check_interval = check_interval
        self.monitoring_task = None

    async def start(self):
        await super().start()
        # Start monitoring loop
        self.monitoring_task = asyncio.create_task(self.monitoring_loop())

    async def stop(self):
        if self.monitoring_task:
            self.monitoring_task.cancel()
        await super().stop()

    async def monitoring_loop(self):
        """Background monitoring loop"""
        while self.is_active:
            try:
                await self.check_environment()
                await asyncio.sleep(self.check_interval)
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Monitoring error: {e}")

    async def check_environment(self):
        """Check environment and take proactive actions"""
        # Check for tasks, notifications, opportunities
        state = await self.get_environment_state()
        opportunities = await self.identify_opportunities(state)

        for opportunity in opportunities:
            await self.take_action(opportunity)

    async def get_environment_state(self) -> Dict[str, Any]:
        """Get current environment state"""
        return {
            "timestamp": datetime.now().isoformat(),
            "pending_tasks": await self.get_pending_tasks(),
            "notifications": await self.get_notifications(),
            "system_status": "healthy"
        }

    async def identify_opportunities(self, state: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify proactive opportunities using AI"""
        prompt = f"""
        Based on this environment state, identify proactive opportunities:
        {json.dumps(state, indent=2)}

        Look for:
        1. Tasks needing attention
        2. Preventive actions needed
        3. Optimization opportunities
        4. Process improvements

        Return as JSON list of opportunities with description and priority.
        """

        response = await self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=500
        )

        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            return []

    async def take_action(self, opportunity: Dict[str, Any]):
        """Take proactive action on opportunity"""
        print(f"[{self.name}] Taking action: {opportunity['description']}")

        # Create action plan
        plan = await self.create_action_plan(opportunity)

        # Execute action
        await self.execute_action_plan(plan)

# Multi-Agent System
class MultiAgentSystem:
    def __init__(self, openai_api_key: str):
        self.openai_api_key = openai_api_key
        self.agents = {}
        self.message_queue = asyncio.Queue()
        self.coordinator = AgentCoordinator(openai_api_key)

    def register_agent(self, agent: BaseAgent):
        """Register an agent with the system"""
        self.agents[agent.id] = agent

    async def start_all(self):
        """Start all registered agents"""
        for agent in self.agents.values():
            await agent.start()

    async def stop_all(self):
        """Stop all registered agents"""
        for agent in self.agents.values():
            await agent.stop()

    async def send_message(self, sender_id: str, receiver_id: str, content: str):
        """Send message between agents"""
        if receiver_id not in self.agents:
            raise ValueError(f"Agent {receiver_id} not found")

        message = AgentMessage(
            sender=sender_id,
            receiver=receiver_id,
            content=content,
            timestamp=datetime.now()
        )

        receiver = self.agents[receiver_id]
        return await receiver.process_message(message)

    async def execute_complex_task(self, task_description: str, requirements: str):
        """Execute complex task using multiple agents"""
        task = {
            "description": task_description,
            "requirements": requirements
        }

        # Decompose task
        subtasks = await self.coordinator.decompose_task(task)

        # Execute in parallel using available agents
        results = await self.execute_subtasks_parallel(subtasks)

        # Integrate results
        integrated = await self.coordinator.integrate_results(results)

        return integrated

# Usage example
async def main():
    # Initialize multi-agent system
    mas = MultiAgentSystem("your-openai-api-key")

    # Create and register agents
    reactive_agent = ReactiveAgent("reactive_1", "Helper", mas.openai_api_key)
    proactive_agent = ProactiveAgent("proactive_1", "Monitor", mas.openai_api_key, check_interval=30)

    mas.register_agent(reactive_agent)
    mas.register_agent(proactive_agent)

    # Start all agents
    await mas.start_all()

    # Test agent communication
    response = await mas.send_message(
        "user",
        "reactive_1",
        "Can you help me understand AI agents?"
    )

    if response:
        print(f"Response: {response.content}")

    # Execute complex task
    result = await mas.execute_complex_task(
        "Analyze customer feedback and generate action plan",
        "Include sentiment analysis, key themes, and prioritized recommendations"
    )

    print(f"Complex task result: {result}")

    # Run for a while
    await asyncio.sleep(60)

    # Stop all agents
    await mas.stop_all()

if __name__ == "__main__":
    asyncio.run(main())`

  const sections = [
    {
      id: 'foundations',
      title: 'AI Agent Foundations',
      description: 'Understanding the core concepts of AI agents and their architecture',
      content: [
        {
          title: 'Agent Architecture Fundamentals',
          content: 'Core structure and components of AI agents:',
          code: foundationsCode,
          filename: 'agent-foundations.js'
        },
        {
          title: 'Key Concepts',
          items: [
            'Agent types: Reactive, Proactive, Hybrid',
            'Memory and state management',
            'Tool integration and execution',
            'Goal-oriented behavior',
            'Learning and adaptation mechanisms'
          ]
        }
      ]
    },
    {
      id: 'reactive',
      title: 'Reactive Agents',
      description: 'Build agents that respond to inputs and events',
      content: [
        {
          title: 'Reactive Agent Implementation',
          content: 'Complete reactive agent with response generation:',
          code: reactiveAgentCode,
          filename: 'reactive-agent.js'
        },
        {
          title: 'Reactive Patterns',
          items: [
            'Event-driven responses',
            'Input analysis and classification',
            'Tool selection and execution',
            'Context-aware responses',
            'Real-time processing capabilities'
          ]
        }
      ]
    },
    {
      id: 'proactive',
      title: 'Proactive Agents',
      description: 'Create agents that take initiative and monitor environments',
      content: [
        {
          title: 'Proactive Agent System',
          content: 'Autonomous agent with monitoring and initiative:',
          code: proactiveAgentCode,
          filename: 'proactive-agent.js'
        },
        {
          title: 'Proactive Capabilities',
          items: [
            'Environment monitoring and assessment',
            'Opportunity identification',
            'Autonomous task execution',
            'Goal-seeking behavior',
            'Predictive analytics and planning'
          ]
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Multi-Agent Systems',
      description: 'Complex agent orchestration and collaboration',
      content: [
        {
          title: 'Multi-Agent Architecture',
          content: 'Complete multi-agent system with coordination:',
          code: advancedAgentCode,
          filename: 'multi-agent-system.js'
        },
        {
          title: 'Python Multi-Agent Implementation',
          content: 'Production-ready Python multi-agent framework:',
          code: pythonAgentCode,
          filename: 'multi-agent-python.py'
        },
        {
          title: 'Advanced Patterns',
          items: [
            'Agent coordination and communication',
            'Task decomposition and distribution',
            'Conflict resolution strategies',
            'Scalability and performance optimization',
            'Security and trust mechanisms'
          ]
        }
      ]
    }
  ]

  const currentSection = sections.find(s => s.id === activeSection)

  return (
    <AuthWrapper title="AI Agent Development Masterclass" description="Sign in to access comprehensive AI agent tutorials with hands-on practice">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <Link href="/learn/ai-integration" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Integration
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Agent Development Masterclass</h1>
              <p className="text-gray-600 mt-2">Master the creation of intelligent autonomous AI agents</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              <Bot className="w-3 h-3 mr-1" />
              Autonomous AI
            </Badge>
          </div>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="foundations">Foundations</TabsTrigger>
            <TabsTrigger value="reactive">Reactive</TabsTrigger>
            <TabsTrigger value="proactive">Proactive</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value={activeSection} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tutorial Content */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      {currentSection?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentSection?.content.map((content, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>
                        <p className="text-gray-700 mb-3">{content.content}</p>

                        {content.code && (
                          <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{content.filename}</span>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(content.code, `code-${idx}`)}
                                  className="flex items-center gap-1"
                                >
                                  {copiedCode === `code-${idx}` ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                  {copiedCode === `code-${idx}` ? 'Copied!' : 'Copy'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadCode(content.code, content.filename)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            <SyntaxHighlighter
                              language="javascript"
                              style={tomorrow}
                              className="rounded-lg text-sm"
                              customStyle={{ margin: 0 }}
                            >
                              {content.code}
                            </SyntaxHighlighter>
                          </div>
                        )}

                        {content.items && (
                          <ul className="space-y-2">
                            {content.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start">
                                <Target className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Agent Architecture Best Practices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Agent Design Principles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Single Responsibility:</strong> Each agent should have a clear, focused purpose
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>State Management:</strong> Maintain consistent state and memory
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Error Handling:</strong> Robust error recovery and fallback mechanisms
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>Security:</strong> Validate inputs and control agent capabilities
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Agent Simulator */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Terminal className="w-5 h-5 mr-2" />
                      Agent Simulator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OpenAI API Key
                        </label>
                        <Input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="sk-..."
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Agent Type
                          </label>
                          <Select value={agentType} onValueChange={setAgentType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="reactive">Reactive Agent</SelectItem>
                              <SelectItem value="proactive">Proactive Agent</SelectItem>
                              <SelectItem value="hybrid">Hybrid Agent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Agent Goal
                          </label>
                          <Input
                            value={agentGoal}
                            onChange={(e) => setAgentGoal(e.target.value)}
                            placeholder="e.g., Monitor system performance"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={simulateAgent}
                        disabled={!agentGoal.trim() || !apiKey || isRunning}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {isRunning ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Running Agent...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Agent Simulation
                          </>
                        )}
                      </Button>
                    </div>

                    {agentLogs.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Agent Execution Log</h4>
                        <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-2 max-h-64 overflow-y-auto">
                          {agentLogs.map((log, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <span className="text-gray-500">[{log.timestamp}]</span>
                              <span className={
                                log.type === 'success' ? 'text-green-400' :
                                log.type === 'error' ? 'text-red-400' : 'text-blue-400'
                              }>
                                {log.type.toUpperCase()}
                              </span>
                              <span className="text-gray-300">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Agent Use Cases */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Workflow className="w-5 h-5 mr-2" />
                      Real-World Use Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { title: 'Customer Support', desc: '24/7 automated customer service agents', icon: '🎧' },
                        { title: 'System Monitoring', desc: 'Proactive infrastructure health monitoring', icon: '📊' },
                        { title: 'Data Analysis', desc: 'Automated data processing and insights', icon: '📈' },
                        { title: 'Content Creation', desc: 'AI-powered content generation and curation', icon: '✍️' },
                        { title: 'Task Automation', desc: 'Intelligent workflow automation', icon: '⚙️' },
                        { title: 'Research Assistant', desc: 'Automated research and summarization', icon: '🔬' }
                      ].map((useCase, idx) => (
                        <div key={idx} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{useCase.icon}</span>
                            <div>
                              <h5 className="font-medium text-gray-900">{useCase.title}</h5>
                              <p className="text-sm text-gray-600">{useCase.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AuthWrapper>
  )
}