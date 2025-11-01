'use client';

import React, { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Agent, NodeType, ModelConfig, ToolType } from '@/types/agents';
import { Settings, Code, Database, Zap, Trash2, Save } from 'lucide-react';

interface PropertyPanelProps {
  selectedNode?: Node | null;
  selectedEdge?: Edge | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  agent?: Agent;
  readOnly?: boolean;
}

export function PropertyPanel({ selectedNode, selectedEdge, onUpdateNode, agent, readOnly }: PropertyPanelProps) {
  const [nodeData, setNodeData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setNodeData({ ...selectedNode.data });
      setHasChanges(false);
    }
  }, [selectedNode]);

  const handleFieldChange = (field: string, value: any) => {
    const newData = { ...nodeData, [field]: value };
    setNodeData(newData);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, nodeData);
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    if (selectedNode) {
      setNodeData({ ...selectedNode.data });
      setHasChanges(false);
    }
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-sm">Select a node or edge to view properties</p>
      </div>
    );
  }

  if (selectedEdge) {
    return <EdgePropertyPanel edge={selectedEdge} readOnly={readOnly} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {nodeData.label || 'Node Properties'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Type: <Badge variant="secondary">{selectedNode?.type}</Badge>
            </p>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleReset}
                variant="ghost"
                size="sm"
                disabled={readOnly}
              >
                Reset
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                disabled={readOnly}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="general" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-4">
            <TabsContent value="general" className="space-y-4 mt-0">
              <NodeGeneralProperties
                nodeData={nodeData}
                onChange={handleFieldChange}
                readOnly={readOnly}
              />
            </TabsContent>

            <TabsContent value="config" className="space-y-4 mt-0">
              <NodeConfigurationProperties
                nodeType={selectedNode?.type as NodeType}
                nodeData={nodeData}
                onChange={handleFieldChange}
                agent={agent}
                readOnly={readOnly}
              />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-0">
              <NodeAdvancedProperties
                nodeData={nodeData}
                onChange={handleFieldChange}
                readOnly={readOnly}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function NodeGeneralProperties({ nodeData, onChange, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={nodeData.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="Enter node label"
          disabled={readOnly}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={nodeData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Describe what this node does"
          rows={3}
          disabled={readOnly}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={nodeData.tags?.join(', ') || ''}
          onChange={(e) => onChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
          placeholder="Enter tags separated by commas"
          disabled={readOnly}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="enabled"
          checked={nodeData.enabled !== false}
          onCheckedChange={(checked) => onChange('enabled', checked)}
          disabled={readOnly}
        />
        <Label htmlFor="enabled">Enable this node</Label>
      </div>
    </div>
  );
}

function NodeConfigurationProperties({ nodeType, nodeData, onChange, agent, readOnly }: {
  nodeType: NodeType;
  nodeData: any;
  onChange: (field: string, value: any) => void;
  agent?: Agent;
  readOnly?: boolean;
}) {
  switch (nodeType) {
    case NodeType.AGENT:
      return <AgentConfiguration nodeData={nodeData} onChange={onChange} agent={agent} readOnly={readOnly} />;
    case NodeType.TRIGGER:
      return <TriggerConfiguration nodeData={nodeData} onChange={onChange} readOnly={readOnly} />;
    case NodeType.CONDITION:
      return <ConditionConfiguration nodeData={nodeData} onChange={onChange} readOnly={readOnly} />;
    case NodeType.ACTION:
      return <ActionConfiguration nodeData={nodeData} onChange={onChange} readOnly={readOnly} />;
    case NodeType.TOOL:
      return <ToolConfiguration nodeData={nodeData} onChange={onChange} readOnly={readOnly} />;
    case NodeType.DELAY:
      return <DelayConfiguration nodeData={nodeData} onChange={onChange} readOnly={readOnly} />;
    case NodeType.LOOP:
      return <LoopConfiguration nodeData={nodeData} onChange={onChange} readOnly={readOnly} />;
    default:
      return <div className="text-sm text-gray-500">No configuration options available for this node type.</div>;
  }
}

function AgentConfiguration({ nodeData, onChange, agent, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  agent?: Agent;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="agentId">Agent</Label>
        <Select
          value={nodeData.agentId || ''}
          onValueChange={(value) => onChange('agentId', value)}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={agent?.id || ''}>{agent?.name || 'Current Agent'}</SelectItem>
            {/* Add more agents here */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="systemPrompt">System Prompt</Label>
        <Textarea
          id="systemPrompt"
          value={nodeData.systemPrompt || ''}
          onChange={(e) => onChange('systemPrompt', e.target.value)}
          placeholder="Enter the system prompt for this agent"
          rows={4}
          disabled={readOnly}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="temperature">Temperature</Label>
          <Input
            id="temperature"
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={nodeData.temperature || 0.7}
            onChange={(e) => onChange('temperature', parseFloat(e.target.value))}
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="maxTokens">Max Tokens</Label>
          <Input
            id="maxTokens"
            type="number"
            min="1"
            value={nodeData.maxTokens || 1000}
            onChange={(e) => onChange('maxTokens', parseInt(e.target.value))}
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  );
}

function TriggerConfiguration({ nodeData, onChange, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="triggerType">Trigger Type</Label>
        <Select
          value={nodeData.triggerType || 'manual'}
          onValueChange={(value) => onChange('triggerType', value)}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="schedule">Schedule</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="event">Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {nodeData.triggerType === 'schedule' && (
        <div>
          <Label htmlFor="schedule">Cron Expression</Label>
          <Input
            id="schedule"
            value={nodeData.schedule || ''}
            onChange={(e) => onChange('schedule', e.target.value)}
            placeholder="0 0 * * *"
            disabled={readOnly}
          />
        </div>
      )}

      {nodeData.triggerType === 'webhook' && (
        <div>
          <Label htmlFor="webhookUrl">Webhook URL</Label>
          <Input
            id="webhookUrl"
            value={nodeData.webhookUrl || ''}
            onChange={(e) => onChange('webhookUrl', e.target.value)}
            placeholder="https://example.com/webhook"
            disabled={readOnly}
          />
        </div>
      )}
    </div>
  );
}

function ConditionConfiguration({ nodeData, onChange, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="conditionType">Condition Type</Label>
        <Select
          value={nodeData.conditionType || 'expression'}
          onValueChange={(value) => onChange('conditionType', value)}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expression">Expression</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="comparison">Comparison</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Textarea
          id="condition"
          value={nodeData.condition || ''}
          onChange={(e) => onChange('condition', e.target.value)}
          placeholder="Enter condition expression"
          rows={3}
          disabled={readOnly}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="invertCondition"
          checked={nodeData.invertCondition || false}
          onCheckedChange={(checked) => onChange('invertCondition', checked)}
          disabled={readOnly}
        />
        <Label htmlFor="invertCondition">Invert condition</Label>
      </div>
    </div>
  );
}

function ActionConfiguration({ nodeData, onChange, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="actionType">Action Type</Label>
        <Select
          value={nodeData.actionType || 'custom'}
          onValueChange={(value) => onChange('actionType', value)}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom</SelectItem>
            <SelectItem value="send_email">Send Email</SelectItem>
            <SelectItem value="call_api">Call API</SelectItem>
            <SelectItem value="create_file">Create File</SelectItem>
            <SelectItem value="send_notification">Send Notification</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="actionConfig">Action Configuration</Label>
        <Textarea
          id="actionConfig"
          value={nodeData.actionConfig || ''}
          onChange={(e) => onChange('actionConfig', e.target.value)}
          placeholder="Enter action configuration (JSON)"
          rows={4}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function ToolConfiguration({ nodeData, onChange, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="toolType">Tool Type</Label>
        <Select
          value={nodeData.toolType || ''}
          onValueChange={(value) => onChange('toolType', value)}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select tool type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ToolType.API_CALL}>API Call</SelectItem>
            <SelectItem value={ToolType.WEB_SEARCH}>Web Search</SelectItem>
            <SelectItem value={ToolType.DATABASE}>Database</SelectItem>
            <SelectItem value={ToolType.FILE_OPERATION}>File Operation</SelectItem>
            <SelectItem value={ToolType.CODE_EXECUTION}>Code Execution</SelectItem>
            <SelectItem value={ToolType.EMAIL}>Email</SelectItem>
            <SelectItem value={ToolType.CALENDAR}>Calendar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="toolConfig">Tool Configuration</Label>
        <Textarea
          id="toolConfig"
          value={nodeData.toolConfig || ''}
          onChange={(e) => onChange('toolConfig', e.target.value)}
          placeholder="Enter tool configuration (JSON)"
          rows={4}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function DelayConfiguration({ nodeData, onChange, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="delayAmount">Delay Amount</Label>
        <Input
          id="delayAmount"
          type="number"
          min="0"
          value={nodeData.delayAmount || 1}
          onChange={(e) => onChange('delayAmount', parseInt(e.target.value))}
          disabled={readOnly}
        />
      </div>

      <div>
        <Label htmlFor="delayUnit">Delay Unit</Label>
        <Select
          value={nodeData.delayUnit || 'seconds'}
          onValueChange={(value) => onChange('delayUnit', value)}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">Seconds</SelectItem>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="hours">Hours</SelectItem>
            <SelectItem value="days">Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function LoopConfiguration({ nodeData, onChange, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="loopType">Loop Type</Label>
        <Select
          value={nodeData.loopType || 'for'}
          onValueChange={(value) => onChange('loopType', value)}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="for">For Loop</SelectItem>
            <SelectItem value="while">While Loop</SelectItem>
            <SelectItem value="foreach">For Each</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="loopCondition">Loop Condition</Label>
        <Textarea
          id="loopCondition"
          value={nodeData.loopCondition || ''}
          onChange={(e) => onChange('loopCondition', e.target.value)}
          placeholder="Enter loop condition"
          rows={3}
          disabled={readOnly}
        />
      </div>

      <div>
        <Label htmlFor="maxIterations">Max Iterations</Label>
        <Input
          id="maxIterations"
          type="number"
          min="1"
          value={nodeData.maxIterations || 100}
          onChange={(e) => onChange('maxIterations', parseInt(e.target.value))}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function NodeAdvancedProperties({ nodeData, onChange, readOnly }: {
  nodeData: any;
  onChange: (field: string, value: any) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="retryPolicy">Retry Policy</Label>
        <Textarea
          id="retryPolicy"
          value={JSON.stringify(nodeData.retryPolicy || {}, null, 2)}
          onChange={(e) => {
            try {
              const policy = JSON.parse(e.target.value);
              onChange('retryPolicy', policy);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          placeholder="Enter retry policy (JSON)"
          rows={4}
          disabled={readOnly}
        />
      </div>

      <div>
        <Label htmlFor="timeout">Timeout (seconds)</Label>
        <Input
          id="timeout"
          type="number"
          min="1"
          value={nodeData.timeout || 30}
          onChange={(e) => onChange('timeout', parseInt(e.target.value))}
          disabled={readOnly}
        />
      </div>

      <div className="space-y-2">
        <Label>Custom Properties</Label>
        <Textarea
          value={JSON.stringify(nodeData.customProperties || {}, null, 2)}
          onChange={(e) => {
            try {
              const props = JSON.parse(e.target.value);
              onChange('customProperties', props);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          placeholder="Enter custom properties (JSON)"
          rows={4}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function EdgePropertyPanel({ edge, readOnly }: {
  edge: Edge;
  readOnly?: boolean;
}) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Connection Properties</h3>
      </div>

      <div>
        <Label>Source</Label>
        <p className="text-sm text-gray-600">{edge.source}</p>
      </div>

      <div>
        <Label>Target</Label>
        <p className="text-sm text-gray-600">{edge.target}</p>
      </div>

      {edge.sourceHandle && (
        <div>
          <Label>Source Handle</Label>
          <p className="text-sm text-gray-600">{edge.sourceHandle}</p>
        </div>
      )}

      {edge.targetHandle && (
        <div>
          <Label>Target Handle</Label>
          <p className="text-sm text-gray-600">{edge.targetHandle}</p>
        </div>
      )}

      <div>
        <Label htmlFor="edgeLabel">Label</Label>
        <Input
          id="edgeLabel"
          value={edge.data?.label || ''}
          onChange={(e) => {
            // Update edge label logic here
          }}
          placeholder="Enter edge label"
          disabled={readOnly}
        />
      </div>

      <div>
        <Label htmlFor="edgeCondition">Condition</Label>
        <Textarea
          id="edgeCondition"
          value={edge.data?.condition || ''}
          onChange={(e) => {
            // Update edge condition logic here
          }}
          placeholder="Enter condition for this connection"
          rows={3}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}