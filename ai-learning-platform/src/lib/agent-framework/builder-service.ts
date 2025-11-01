import { Workflow, AgentExecution, SaveWorkflowFunction, ExecuteWorkflowFunction } from '../types/agents';
import { workflowService } from './workflow-service';
import { agentExecutionEngine } from './agent-execution-engine';

// Global service functions for agent builder
export const saveWorkflow: SaveWorkflowFunction = async (workflow: Workflow) => {
  try {
    // Convert workflow nodes and edges to the format expected by the workflow service
    const workflowNodes = workflow.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));

    const workflowEdges = workflow.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      data: edge.data || {},
    }));

    await workflowService.saveWorkflow(workflowNodes, workflowEdges);
    console.log('Workflow saved successfully:', workflow.id);
  } catch (error) {
    console.error('Failed to save workflow:', error);
    throw error;
  }
};

export const executeWorkflow: ExecuteWorkflowFunction = async (workflowId: string, data: { nodes: any[], edges: any[] }): Promise<AgentExecution> => {
  try {
    // Create a mock agent for execution
    const mockAgent: Agent = {
      id: 'workflow-agent',
      name: 'Workflow Agent',
      description: 'Agent executing a workflow',
      type: AgentType.WORKFLOW,
      level: AgentLevel.INTERMEDIATE,
      status: AgentStatus.ACTIVE,
      config: {
        model: {
          provider: 'openai',
          modelName: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000,
        },
        prompts: [],
        tools: [],
        memory: {
          type: 'short_term',
          maxSize: 100,
          retention: 24,
          strategy: 'fifo',
        },
        execution: {
          maxSteps: 10,
          timeout: 300,
          retryPolicy: {
            maxRetries: 3,
            backoffStrategy: 'exponential',
            retryDelay: 1000,
          },
          parallelExecution: false,
          debugMode: true,
        },
        constraints: {},
      },
      tools: [],
      memory: {
        id: 'workflow-memory',
        type: 'conversation',
        content: [],
        metadata: {},
        lastAccessed: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      version: '1.0.0',
      tags: ['workflow'],
    };

    // Execute the agent with the workflow data
    const execution = await agentExecutionEngine.executeAgent(mockAgent, JSON.stringify(data));

    console.log('Workflow executed successfully:', workflowId);
    return execution;
  } catch (error) {
    console.error('Failed to execute workflow:', error);
    throw error;
  }
};

// Import required enums and types
import { AgentType, AgentLevel, AgentStatus, Agent } from '../types/agents';