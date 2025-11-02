'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow from 'reactflow';

// Mock implementations for ReactFlow functions that are causing import issues
const addEdge = (params: any, edges: any[]) => [...edges, { ...params, id: `edge-${Date.now()}` }];

const useNodesState = (initialNodes: any[]) => {
  const [nodes, setNodes] = React.useState(initialNodes);
  const onNodesChange = (changes: any[]) => {
    // Simple mock implementation
    console.log('Nodes changed:', changes);
  };
  return [nodes, setNodes, onNodesChange] as const;
};

const useEdgesState = (initialEdges: any[]) => {
  const [edges, setEdges] = React.useState(initialEdges);
  const onEdgesChange = (changes: any[]) => {
    // Simple mock implementation
    console.log('Edges changed:', changes);
  };
  return [edges, setEdges, onEdgesChange] as const;
};

// Mock components
const Controls = () => <div className="react-flow-controls">Controls</div>;
const MiniMap = (_nodeColor: any) => <div className="react-flow-minimap">Minimap</div>;
const Background = (_props: any) => <div className="react-flow-background">Background</div>;
const BackgroundVariant = {
  Dots: 'dots'
};

// Define types locally to avoid import issues
interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: any;
}

interface Connection {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
import 'reactflow/dist/style.css';
import { NodePalette } from './node-palette';
import { PropertyPanel } from './property-panel';
import { ExecutionDebugPanel } from './execution-debug-panel';
import { Agent, Workflow, NodeType } from '@/types/agents';
import { saveWorkflow, executeWorkflow } from '@/lib/agent-framework/builder-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Save, Undo, Redo, Settings, Bug } from 'lucide-react';

interface AgentBuilderProps {
  initialWorkflow?: Workflow;
  agent?: Agent;
  onSave?: (workflow: Workflow) => void;
  onExecute?: (executionId: string) => void;
  readOnly?: boolean;
}

const nodeTypes = {
  agent: AgentNode,
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  tool: ToolNode,
  input: InputNode,
  output: OutputNode,
  delay: DelayNode,
  loop: LoopNode,
  merge: MergeNode,
  split: SplitNode,
};

export function AgentBuilder({
  initialWorkflow,
  agent,
  onSave,
  onExecute,
  readOnly = false
}: AgentBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialWorkflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialWorkflow?.edges || []);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<any[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);
  const [history, setHistory] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      ...params,
      id: `edge-${Date.now()}`,
      type: 'smoothstep',
    };
    setEdges((eds: Edge[]) => addEdge(newEdge, eds));
    setIsDirty(true);
  }, [setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [nodes, edges, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      if (prevState) {
        setNodes(prevState.nodes);
        setEdges(prevState.edges);
        setHistoryIndex(historyIndex - 1);
        setIsDirty(true);
      }
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      if (nextState) {
        setNodes(nextState.nodes);
        setEdges(nextState.edges);
        setHistoryIndex(historyIndex + 1);
        setIsDirty(true);
      }
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const handleSave = async () => {
    if (!initialWorkflow) return;

    const updatedWorkflow: Workflow = {
      ...initialWorkflow,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type as NodeType,
        position: node.position,
        data: node.data,
        config: node.data.config || {},
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        condition: edge.data?.condition,
      })),
      updatedAt: new Date(),
    };

    try {
      await saveWorkflow(updatedWorkflow);
      setIsDirty(false);
      onSave?.(updatedWorkflow);
    } catch (error) {
      console.error('Failed to save workflow:', error);
    }
  };

  const handleExecute = async () => {
    if (!initialWorkflow) return;

    setIsExecuting(true);
    setShowDebugPanel(true);

    try {
      const execution = await executeWorkflow(initialWorkflow.id, {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type as NodeType,
          position: node.position,
          data: node.data,
          config: node.data.config || {},
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          condition: edge.data?.condition,
        })),
      });

      setExecutionSteps(execution.steps);
      onExecute?.(execution.id);
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const addNode = useCallback((nodeType: NodeType, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: nodeType,
      position,
      data: {
        label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
        type: nodeType,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setIsDirty(true);
    saveToHistory();
  }, [setNodes, saveToHistory]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
    setIsDirty(true);
  }, [setNodes]);

  const deleteSelectedElement = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null);
    }
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
    setIsDirty(true);
    saveToHistory();
  }, [selectedNode, selectedEdge, setNodes, setEdges, saveToHistory]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            undo();
            break;
          case 'y':
            event.preventDefault();
            redo();
            break;
          case 's':
            event.preventDefault();
            handleSave();
            break;
        }
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelectedElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleSave, deleteSelectedElement]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Node Palette */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Components</h3>
        </div>
        <NodePalette onAddNode={addNode} />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExecute}
              disabled={isExecuting || readOnly}
              variant="default"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              {isExecuting ? 'Running...' : 'Run'}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isDirty || readOnly}
              variant="outline"
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <div className="flex items-center gap-1 ml-4">
              <Button
                onClick={undo}
                disabled={historyIndex <= 0}
                variant="ghost"
                size="sm"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                variant="ghost"
                size="sm"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPropertyPanel(!showPropertyPanel)}
              variant={showPropertyPanel ? 'default' : 'ghost'}
              size="sm"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              variant={showDebugPanel ? 'default' : 'ghost'}
              size="sm"
            >
              <Bug className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            readOnly={readOnly}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
            <MiniMap
              nodeColor={(node: any) => {
                switch (node.type) {
                  case 'agent': return '#3b82f6';
                  case 'trigger': return '#10b981';
                  case 'condition': return '#f59e0b';
                  case 'action': return '#8b5cf6';
                  case 'tool': return '#ef4444';
                  default: return '#6b7280';
                }
              }}
            />
          </ReactFlow>
        </div>

        {/* Debug Panel */}
        {showDebugPanel && (
          <div className="h-64 bg-white border-t border-gray-200">
            <ExecutionDebugPanel
              steps={executionSteps}
              isRunning={isExecuting}
            />
          </div>
        )}
      </div>

      {/* Right Sidebar - Property Panel */}
      {showPropertyPanel && (
        <div className="w-80 bg-white border-l border-gray-200">
          <PropertyPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onUpdateNode={updateNodeData}
            agent={agent || null}
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );
}

// Custom Node Components
function AgentNode({ data }: { data: any }) {
  return (
    <Card className="bg-blue-50 border-blue-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div>
            <div className="font-medium text-blue-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-blue-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function TriggerNode({ data }: { data: any }) {
  return (
    <Card className="bg-green-50 border-green-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <div>
            <div className="font-medium text-green-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-green-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ConditionNode({ data }: { data: any }) {
  return (
    <Card className="bg-yellow-50 border-yellow-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">?</span>
          </div>
          <div>
            <div className="font-medium text-yellow-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-yellow-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ActionNode({ data }: { data: any }) {
  return (
    <Card className="bg-purple-50 border-purple-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">!</span>
          </div>
          <div>
            <div className="font-medium text-purple-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-purple-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ToolNode({ data }: { data: any }) {
  return (
    <Card className="bg-red-50 border-red-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">⚙</span>
          </div>
          <div>
            <div className="font-medium text-red-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-red-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function InputNode({ data }: { data: any }) {
  return (
    <Card className="bg-gray-50 border-gray-200 min-w-[150px]">
      <div className="p-3">
        <div className="font-medium text-gray-900">{data.label}</div>
        {data.description && (
          <div className="text-xs text-gray-700">{data.description}</div>
        )}
      </div>
    </Card>
  );
}

function OutputNode({ data }: { data: any }) {
  return (
    <Card className="bg-gray-50 border-gray-200 min-w-[150px]">
      <div className="p-3">
        <div className="font-medium text-gray-900">{data.label}</div>
        {data.description && (
          <div className="text-xs text-gray-700">{data.description}</div>
        )}
      </div>
    </Card>
  );
}

function DelayNode({ data }: { data: any }) {
  return (
    <Card className="bg-orange-50 border-orange-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">⏱</span>
          </div>
          <div>
            <div className="font-medium text-orange-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-orange-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function LoopNode({ data }: { data: any }) {
  return (
    <Card className="bg-cyan-50 border-cyan-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">↻</span>
          </div>
          <div>
            <div className="font-medium text-cyan-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-cyan-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function MergeNode({ data }: { data: any }) {
  return (
    <Card className="bg-indigo-50 border-indigo-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">⇉</span>
          </div>
          <div>
            <div className="font-medium text-indigo-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-indigo-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function SplitNode({ data }: { data: any }) {
  return (
    <Card className="bg-pink-50 border-pink-200 min-w-[150px]">
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">⇉</span>
          </div>
          <div>
            <div className="font-medium text-pink-900">{data.label}</div>
            {data.description && (
              <div className="text-xs text-pink-700">{data.description}</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}