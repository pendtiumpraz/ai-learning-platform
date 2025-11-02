'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agent, Workflow, AgentExecution } from '@/types/agents';
import { orchestrateAgents } from '@/lib/agent-framework/orchestration-service';
import {
  Play,
  Square,
  Settings,
  Network,
  Users,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  BarChart3,
  MessageSquare,
  GitBranch
} from 'lucide-react';

interface AgentOrchestratorProps {
  agents: Agent[];
  workflows: Workflow[];
  onExecutionComplete?: (execution: AgentExecution) => void;
}

interface OrchestratedAgent {
  agent: Agent;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  execution?: AgentExecution;
  dependencies: string[];
  outputs: any[];
}

interface OrchestrationPlan {
  id: string;
  name: string;
  agents: OrchestratedAgent[];
  workflow: Workflow;
  status: 'planning' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
}

export function AgentOrchestrator({ agents, workflows, onExecutionComplete }: AgentOrchestratorProps) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [orchestrationPlan, setOrchestrationPlan] = useState<OrchestrationPlan | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<Array<{
    timestamp: Date;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
    agentId?: string;
  }>>([]);
  const [activeTab, setActiveTab] = useState('planner');

  const handleAgentSelection = useCallback((agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  }, []);

  const handleCreatePlan = useCallback(async () => {
    if (!selectedWorkflow || selectedAgents.length === 0) return;

    const plan: OrchestrationPlan = {
      id: `plan-${Date.now()}`,
      name: `${selectedWorkflow.name} - ${new Date().toLocaleString()}`,
      agents: selectedAgents.map(agentId => {
        const agent = agents.find(a => a.id === agentId)!;
        return {
          agent,
          status: 'idle',
          progress: 0,
          dependencies: [], // Would be calculated based on workflow
          outputs: [],
        };
      }),
      workflow: selectedWorkflow,
      status: 'planning',
    };

    setOrchestrationPlan(plan);
    addLog('Orchestration plan created', 'info');
  }, [selectedWorkflow, selectedAgents, agents]);

  const handleExecutePlan = useCallback(async () => {
    if (!orchestrationPlan) return;

    setIsRunning(true);
    setOrchestrationPlan(prev => prev ? { ...prev, status: 'running', startTime: new Date() } : null);
    addLog('Starting orchestration execution', 'info');

    try {
      // Execute the orchestration plan
      await orchestrateAgents();

      // Update plan status
      setOrchestrationPlan(prev => prev ? {
        ...prev,
        status: 'completed',
        endTime: new Date(),
        agents: prev.agents.map(agent => ({
          ...agent,
          status: 'completed',
          progress: 100,
        }))
      } : null);

      addLog('Orchestration completed successfully', 'success');
      onExecutionComplete?.({} as AgentExecution);
    } catch (error) {
      setOrchestrationPlan(prev => prev ? { ...prev, status: 'failed', endTime: new Date() } : null);
      addLog(`Orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsRunning(false);
    }
  }, [orchestrationPlan, onExecutionComplete]);

  const handleStopExecution = useCallback(() => {
    setIsRunning(false);
    setOrchestrationPlan(prev => prev ? { ...prev, status: 'failed', endTime: new Date() } : null);
    addLog('Orchestration stopped by user', 'warning');
  }, []);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning', agentId?: string) => {
    const logEntry = {
      timestamp: new Date(),
      message,
      type,
      ...(agentId && { agentId }),
    } as const;
    setExecutionLogs(prev => [...prev, logEntry]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'idle':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'idle':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Agent Orchestrator</h1>
            <Badge variant="secondary">Multi-Agent Coordination</Badge>
          </div>
          <div className="flex items-center gap-2">
            {orchestrationPlan && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExecutePlan}
                  disabled={isRunning || orchestrationPlan.status === 'completed'}
                  variant="default"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </Button>
                <Button
                  onClick={handleStopExecution}
                  disabled={!isRunning}
                  variant="outline"
                  size="sm"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-4">
            <TabsTrigger value="planner">Planner</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="flex-1 p-4 m-0 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workflow Selection */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                  Select Workflow
                </h3>
                <Select value={selectedWorkflow?.id || ''} onValueChange={(value) => {
                  const workflow = workflows.find(w => w.id === value);
                  setSelectedWorkflow(workflow || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    {workflows.map(workflow => (
                      <SelectItem key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedWorkflow && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Workflow Details</h4>
                    <p className="text-sm text-gray-600 mb-2">{selectedWorkflow.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Nodes: {selectedWorkflow.nodes.length}</span>
                      <span>Edges: {selectedWorkflow.edges.length}</span>
                      <Badge variant="outline">{selectedWorkflow.status}</Badge>
                    </div>
                  </div>
                )}
              </Card>

              {/* Agent Selection */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Select Agents
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {agents.map(agent => (
                    <div
                      key={agent.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAgents.includes(agent.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAgentSelection(agent.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-gray-600">{agent.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{agent.type}</Badge>
                          <Badge variant="secondary">Level {agent.level}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedAgents.length} agents selected
                  </span>
                  <Button
                    onClick={handleCreatePlan}
                    disabled={!selectedWorkflow || selectedAgents.length === 0}
                    size="sm"
                  >
                    Create Plan
                  </Button>
                </div>
              </Card>
            </div>

            {/* Orchestration Plan */}
            {orchestrationPlan && (
              <Card className="mt-6 p-6">
                <h3 className="text-lg font-semibold mb-4">Orchestration Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orchestrationPlan.agents.map((orchestratedAgent) => (
                    <Card key={orchestratedAgent.agent.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(orchestratedAgent.status)}
                          <span className="font-medium">{orchestratedAgent.agent.name}</span>
                        </div>
                        <Badge className={getStatusColor(orchestratedAgent.status)} variant="outline">
                          {orchestratedAgent.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{orchestratedAgent.progress}%</span>
                        </div>
                        <Progress value={orchestratedAgent.progress} className="h-2" />
                        <div className="text-xs text-gray-500">
                          Type: {orchestratedAgent.agent.type}
                        </div>
                        {orchestratedAgent.dependencies.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Dependencies: {orchestratedAgent.dependencies.join(', ')}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="execution" className="flex-1 p-4 m-0">
            <Card className="h-full p-6">
              <h3 className="text-lg font-semibold mb-4">Execution Overview</h3>
              {orchestrationPlan ? (
                <div className="space-y-6">
                  {/* Execution Timeline */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Execution Timeline</h4>
                    <div className="space-y-2">
                      {orchestrationPlan.startTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>Started: {orchestrationPlan.startTime.toLocaleString()}</span>
                        </div>
                      )}
                      {orchestrationPlan.endTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Ended: {orchestrationPlan.endTime.toLocaleString()}</span>
                        </div>
                      )}
                      {orchestrationPlan.startTime && orchestrationPlan.endTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span>
                            Duration: {Math.round((orchestrationPlan.endTime.getTime() - orchestrationPlan.startTime.getTime()) / 1000)}s
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Agent Execution Status */}
                  <div>
                    <h4 className="font-medium mb-3">Agent Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orchestrationPlan.agents.map(orchestratedAgent => (
                        <Card key={orchestratedAgent.agent.id} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium">{orchestratedAgent.agent.name}</span>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(orchestratedAgent.status)}
                              <Badge className={getStatusColor(orchestratedAgent.status)}>
                                {orchestratedAgent.status}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={orchestratedAgent.progress} className="mb-3" />
                          {orchestratedAgent.execution && (
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Steps: {orchestratedAgent.execution.steps.length}</div>
                              <div>Duration: {orchestratedAgent.execution.metrics.duration}ms</div>
                              <div>Tokens: {orchestratedAgent.execution.metrics.tokenCount}</div>
                              <div>Cost: ${orchestratedAgent.execution.metrics.cost.toFixed(4)}</div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Network className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No orchestration plan created yet.</p>
                  <p className="text-sm">Select a workflow and agents to create a plan.</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="flex-1 p-4 m-0">
            <Card className="h-full p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Performance Monitoring
              </h3>

              {orchestrationPlan ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Metrics */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Overall Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Agents</span>
                        <span className="font-medium">{orchestrationPlan.agents.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed</span>
                        <span className="font-medium text-green-600">
                          {orchestrationPlan.agents.filter(a => a.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed</span>
                        <span className="font-medium text-red-600">
                          {orchestrationPlan.agents.filter(a => a.status === 'failed').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Running</span>
                        <span className="font-medium text-blue-600">
                          {orchestrationPlan.agents.filter(a => a.status === 'running').length}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Resource Usage */}
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Resource Usage</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Total Tokens</span>
                          <span className="text-sm font-medium">
                            {orchestrationPlan.agents.reduce((sum, a) =>
                              sum + (a.execution?.metrics.tokenCount || 0), 0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: '75%' }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Total Cost</span>
                          <span className="text-sm font-medium">
                            ${orchestrationPlan.agents.reduce((sum, a) =>
                              sum + (a.execution?.metrics.cost || 0), 0
                            ).toFixed(4)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: '30%' }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">API Calls</span>
                          <span className="text-sm font-medium">
                            {orchestrationPlan.agents.reduce((sum, a) =>
                              sum + (a.execution?.metrics.apiCalls || 0), 0
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: '60%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Agent Communication */}
                  <Card className="p-4 lg:col-span-2">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Agent Communication
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {orchestrationPlan.agents.map(agent => (
                        <div key={agent.agent.id} className="text-sm p-2 bg-gray-50 rounded">
                          <span className="font-medium">{agent.agent.name}</span>
                          <span className="text-gray-600 ml-2">
                            {agent.outputs.length} outputs generated
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No monitoring data available.</p>
                  <p className="text-sm">Execute an orchestration plan to see performance metrics.</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 p-4 m-0">
            <Card className="h-full p-6">
              <h3 className="text-lg font-semibold mb-4">Execution Logs</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 h-full overflow-y-auto font-mono text-sm">
                {executionLogs.length === 0 ? (
                  <div className="text-gray-500">No logs available yet.</div>
                ) : (
                  <div className="space-y-1">
                    {executionLogs.map((log, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-gray-500 text-xs">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            log.type === 'error' ? 'bg-red-900 text-red-200' :
                            log.type === 'warning' ? 'bg-yellow-900 text-yellow-200' :
                            log.type === 'success' ? 'bg-green-900 text-green-200' :
                            'bg-gray-800 text-gray-300'
                          }`}
                        >
                          {log.type.toUpperCase()}
                        </span>
                        <span className="flex-1">{log.message}</span>
                        {log.agentId && (
                          <span className="text-blue-400 text-xs">
                            [{agents.find(a => a.id === log.agentId)?.name || log.agentId}]
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}