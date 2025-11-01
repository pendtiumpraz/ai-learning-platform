'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agent, AgentExecution, ExecutionStep, ExecutionStatus } from '@/types/agents';
import { executeAgent, getExecutionStatus } from '@/lib/agent-framework/execution-service';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
  Share2,
  Settings,
  Bug,
  Clock,
  Zap,
  Brain,
  MessageSquare,
  Code,
  BarChart3,
  History
} from 'lucide-react';

interface AgentPlaygroundProps {
  agent: Agent;
  onSave?: (agent: Agent) => void;
  onShare?: (agentId: string) => void;
}

export function AgentPlayground({ agent, onSave, onShare }: AgentPlaygroundProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentExecution, setCurrentExecution] = useState<AgentExecution | null>(null);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);
  const [executionMode, setExecutionMode] = useState<'fast' | 'step-by-step' | 'debug'>('fast');
  const [autoRun, setAutoRun] = useState(false);
  const [history, setHistory] = useState<Array<{ input: string; output: string; timestamp: Date }>>([]);
  const [settings, setSettings] = useState({
    temperature: agent.config.model.temperature,
    maxTokens: agent.config.model.maxTokens,
    showThinking: false,
    saveToHistory: true,
  });

  const outputRef = useRef<HTMLDivElement>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    return () => {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
    };
  }, []);

  const executeAgentStep = useCallback(async (input: string) => {
    setIsRunning(true);
    setOutput('');
    setSteps([]);
    setCurrentStepIndex(0);

    try {
      const execution = await executeAgent(agent.id, {
        input,
        mode: executionMode,
        settings: {
          ...settings,
          debugMode: executionMode === 'debug',
          stepByStepMode: executionMode === 'step-by-step',
        }
      });

      setCurrentExecution(execution);

      if (executionMode === 'fast') {
        // Fast mode - show all results at once
        setOutput(execution.output?.content || '');
        setSteps(execution.steps);

        if (settings.saveToHistory) {
          setHistory(prev => [...prev, {
            input,
            output: execution.output?.content || '',
            timestamp: new Date()
          }]);
        }
      } else {
        // Step-by-step or debug mode - show execution progress
        simulateStepExecution(execution.steps, input);
      }
    } catch (error) {
      console.error('Agent execution failed:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsRunning(false);
      setIsPaused(false);
    }
  }, [agent.id, executionMode, settings]);

  const simulateStepExecution = (executionSteps: ExecutionStep[], originalInput: string) => {
    let stepIndex = 0;
    let accumulatedOutput = '';

    stepIntervalRef.current = setInterval(() => {
      if (isPaused) return;

      if (stepIndex >= executionSteps.length) {
        if (stepIntervalRef.current) {
          clearInterval(stepIntervalRef.current);
        }
        setIsRunning(false);

        if (settings.saveToHistory) {
          setHistory(prev => [...prev, {
            input: originalInput,
            output: accumulatedOutput,
            timestamp: new Date()
          }]);
        }
        return;
      }

      const currentStep = executionSteps[stepIndex];
      setCurrentStepIndex(stepIndex);
      setSteps(prev => [...prev, currentStep]);

      // Accumulate output based on step type
      if (currentStep.type === 'llm_response' && currentStep.output) {
        accumulatedOutput += currentStep.output.content + '\n';
        setOutput(accumulatedOutput);
      }

      stepIndex++;
    }, executionMode === 'debug' ? 2000 : 1000);
  };

  const handleRun = () => {
    if (!input.trim()) return;
    executeAgentStep(input);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setSteps([]);
    setCurrentStepIndex(0);
    setCurrentExecution(null);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleExport = () => {
    const exportData = {
      agent: agent.name,
      input,
      output,
      steps,
      timestamp: new Date().toISOString(),
      settings,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-execution-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    onShare?.(agent.id);
  };

  const loadFromHistory = (item: { input: string; output: string }) => {
    setInput(item.input);
    setOutput(item.output);
  };

  const currentStep = steps[currentStepIndex];
  const progress = steps.length > 0 ? (currentStepIndex / steps.length) * 100 : 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">{agent.name}</h1>
              <Badge variant="secondary">{agent.type}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Select value={executionMode} onValueChange={(value: any) => setExecutionMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="step-by-step">Step-by-Step</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebugPanel(!showDebugPanel)}
            >
              <Bug className="w-4 h-4 mr-2" />
              Debug
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Metrics
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Input & Controls */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          {/* Controls */}
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Button
                onClick={handleRun}
                disabled={!input.trim() || isRunning}
                variant="default"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
              <Button
                onClick={handlePause}
                disabled={!isRunning}
                variant="outline"
                size="sm"
              >
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                onClick={handleStop}
                disabled={!isRunning}
                variant="outline"
                size="sm"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Temperature: {settings.temperature}</Label>
                <Input
                  id="temperature"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.temperature}
                  onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  disabled={isRunning}
                />
              </div>
              <div>
                <Label htmlFor="maxTokens">Max Tokens: {settings.maxTokens}</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1"
                  max="4000"
                  value={settings.maxTokens}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  disabled={isRunning}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showThinking"
                  checked={settings.showThinking}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showThinking: checked }))}
                  disabled={isRunning}
                />
                <Label htmlFor="showThinking">Show thinking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="saveToHistory"
                  checked={settings.saveToHistory}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, saveToHistory: checked }))}
                  disabled={isRunning}
                />
                <Label htmlFor="saveToHistory">Save to history</Label>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="flex-1 p-4">
            <Label htmlFor="input" className="block mb-2">Input</Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input here..."
              className="h-full resize-none"
              disabled={isRunning}
            />
          </div>

          {/* Progress */}
          {isRunning && executionMode !== 'fast' && (
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Execution Progress</span>
                <span className="text-sm text-gray-600">{currentStepIndex + 1} / {steps.length}</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentStep && (
                <div className="mt-2 text-sm text-gray-600">
                  Current: {currentStep.type}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Output */}
        <div className="w-1/2 flex flex-col">
          <Tabs defaultValue="output" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="output" className="flex-1 flex flex-col m-0">
              <div className="flex-1 p-4">
                <div
                  ref={outputRef}
                  className="bg-white border border-gray-200 rounded-lg p-4 h-full overflow-y-auto font-mono text-sm whitespace-pre-wrap"
                >
                  {output || 'Agent output will appear here...'}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="steps" className="flex-1 p-4 m-0 overflow-y-auto">
              <div className="space-y-2">
                {steps.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No execution steps yet. Run the agent to see steps.
                  </div>
                ) : (
                  steps.map((step, index) => (
                    <Card
                      key={step.id}
                      className={`p-3 ${
                        index === currentStepIndex
                          ? 'border-blue-500 bg-blue-50'
                          : step.status === 'completed'
                          ? 'border-green-200 bg-green-50'
                          : step.status === 'failed'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{step.type}</Badge>
                          <span className="text-sm text-gray-600">
                            Step {index + 1}
                          </span>
                        </div>
                        <Badge
                          variant={
                            step.status === 'completed'
                              ? 'default'
                              : step.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {step.status}
                        </Badge>
                      </div>
                      {step.input && (
                        <div className="text-sm text-gray-700 mb-1">
                          <strong>Input:</strong> {JSON.stringify(step.input)}
                        </div>
                      )}
                      {step.output && (
                        <div className="text-sm text-gray-700">
                          <strong>Output:</strong> {JSON.stringify(step.output)}
                        </div>
                      )}
                      {step.error && (
                        <div className="text-sm text-red-600 mt-1">
                          <strong>Error:</strong> {step.error}
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 p-4 m-0 overflow-y-auto">
              <div className="space-y-2">
                {history.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No history yet. Enable "Save to history" and run the agent.
                  </div>
                ) : (
                  history.map((item, index) => (
                    <Card
                      key={index}
                      className="p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {item.timestamp.toLocaleString()}
                        </span>
                        <Button variant="ghost" size="sm">
                          Load
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        <strong>Input:</strong> {item.input}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        <strong>Output:</strong> {item.output}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebugPanel && (
        <div className="h-64 bg-gray-900 text-green-400 p-4 border-t border-gray-700 font-mono text-sm overflow-y-auto">
          <div className="mb-2 text-gray-400">=== Agent Debug Console ===</div>
          {currentExecution ? (
            <div className="space-y-2">
              <div>Execution ID: {currentExecution.id}</div>
              <div>Status: {currentExecution.status}</div>
              <div>Duration: {currentExecution.metrics.duration}ms</div>
              <div>Token Count: {currentExecution.metrics.tokenCount}</div>
              <div>Cost: ${currentExecution.metrics.cost.toFixed(4)}</div>
              <div>API Calls: {currentExecution.metrics.apiCalls}</div>
              {currentExecution.error && (
                <div className="text-red-400">Error: {currentExecution.error}</div>
              )}
            </div>
          ) : (
            <div>No execution data available. Run the agent to see debug information.</div>
          )}
        </div>
      )}
    </div>
  );
}