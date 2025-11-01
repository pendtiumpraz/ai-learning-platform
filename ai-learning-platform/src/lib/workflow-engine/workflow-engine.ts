import { Workflow, WorkflowNode, WorkflowEdge, NodeType, ExecutionStatus, AgentExecution } from '@/types/agents';
import { agentExecutionEngine } from '../agent-framework/agent-execution-engine';
import { v4 as uuidv4 } from 'uuid';

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startTime: Date;
  endTime?: Date;
  nodeExecutions: NodeExecution[];
  variables: Record<string, any>;
  error?: string;
  metrics: WorkflowExecutionMetrics;
}

export interface NodeExecution {
  id: string;
  nodeId: string;
  status: ExecutionStatus;
  input: any;
  output?: any;
  startTime: Date;
  endTime?: Date;
  error?: string;
  metrics: NodeExecutionMetrics;
}

export interface WorkflowExecutionMetrics {
  totalDuration: number;
  nodeExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  totalCost: number;
  totalTokens: number;
}

export interface NodeExecutionMetrics {
  duration: number;
  cost: number;
  tokens: number;
  memoryUsage?: number;
}

export class WorkflowEngine {
  private executions: Map<string, WorkflowExecution> = new Map();
  private nodeHandlers: Map<NodeType, NodeHandler> = new Map();

  constructor() {
    this.initializeNodeHandlers();
  }

  private initializeNodeHandlers() {
    this.nodeHandlers.set(NodeType.AGENT, new AgentNodeHandler());
    this.nodeHandlers.set(NodeType.TRIGGER, new TriggerNodeHandler());
    this.nodeHandlers.set(NodeType.CONDITION, new ConditionNodeHandler());
    this.nodeHandlers.set(NodeType.ACTION, new ActionNodeHandler());
    this.nodeHandlers.set(NodeType.TOOL, new ToolNodeHandler());
    this.nodeHandlers.set(NodeType.INPUT, new InputNodeHandler());
    this.nodeHandlers.set(NodeType.OUTPUT, new OutputNodeHandler());
    this.nodeHandlers.set(NodeType.DELAY, new DelayNodeHandler());
    this.nodeHandlers.set(NodeType.LOOP, new LoopNodeHandler());
    this.nodeHandlers.set(NodeType.MERGE, new MergeNodeHandler());
    this.nodeHandlers.set(NodeType.SPLIT, new SplitNodeHandler());
  }

  async executeWorkflow(
    workflow: Workflow,
    initialInput?: any,
    options: {
      nodeId?: string; // Start from specific node
      variables?: Record<string, any>;
      debugMode?: boolean;
    } = {}
  ): Promise<WorkflowExecution> {
    const executionId = uuidv4();
    const startTime = new Date();

    const execution: WorkflowExecution = {
      id: executionId,
      workflowId: workflow.id,
      status: ExecutionStatus.RUNNING,
      startTime,
      nodeExecutions: [],
      variables: { ...workflow.variables, ...options.variables },
      metrics: {
        totalDuration: 0,
        nodeExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        totalCost: 0,
        totalTokens: 0,
      },
    };

    this.executions.set(executionId, execution);

    try {
      // Find starting node(s)
      const startNodes = this.findStartNodes(workflow, options.nodeId);

      if (startNodes.length === 0) {
        throw new Error('No starting nodes found in workflow');
      }

      // Execute workflow graph
      await this.executeWorkflowGraph(
        workflow,
        execution,
        startNodes,
        initialInput
      );

      execution.status = ExecutionStatus.COMPLETED;
    } catch (error) {
      execution.status = ExecutionStatus.FAILED;
      execution.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      execution.endTime = new Date();
      execution.metrics.totalDuration = execution.endTime.getTime() - execution.startTime.getTime();
    }

    return execution;
  }

  private findStartNodes(workflow: Workflow, startNodeId?: string): WorkflowNode[] {
    if (startNodeId) {
      const node = workflow.nodes.find(n => n.id === startNodeId);
      return node ? [node] : [];
    }

    // Find nodes with no incoming edges (trigger nodes)
    const nodeIds = new Set(workflow.nodes.map(n => n.id));
    const targetIds = new Set(workflow.edges.map(e => e.target));

    const startNodeIds = [...nodeIds].filter(id => !targetIds.has(id));
    return workflow.nodes.filter(n => startNodeIds.includes(n.id));
  }

  private async executeWorkflowGraph(
    workflow: Workflow,
    execution: WorkflowExecution,
    startNodes: WorkflowNode[],
    initialInput?: any
  ): Promise<void> {
    const visited = new Set<string>();
    const executing = new Set<string>();
    const nodeQueue = new Map<string, any>();

    // Initialize queue with start nodes
    startNodes.forEach(node => {
      nodeQueue.set(node.id, initialInput);
    });

    while (nodeQueue.size > 0) {
      const [nodeId, inputData] = nodeQueue.entries().next().value;
      nodeQueue.delete(nodeId);

      if (visited.has(nodeId)) {
        continue; // Already processed this node
      }

      const node = workflow.nodes.find(n => n.id === nodeId);
      if (!node) {
        continue;
      }

      // Check if all dependencies are satisfied
      const dependencies = this.getNodeDependencies(workflow, nodeId);
      const unsatisfiedDependencies = dependencies.filter(depId => !visited.has(depId));

      if (unsatisfiedDependencies.length > 0) {
        // Dependencies not satisfied, re-queue for later
        nodeQueue.set(nodeId, inputData);
        continue;
      }

      // Execute node
      const nodeExecution = await this.executeNode(node, inputData, execution);
      execution.nodeExecutions.push(nodeExecution);

      if (nodeExecution.status === ExecutionStatus.FAILED) {
        throw new Error(`Node ${nodeId} failed: ${nodeExecution.error}`);
      }

      visited.add(nodeId);
      execution.metrics.successfulExecutions++;

      // Queue next nodes based on outgoing edges
      const outgoingEdges = workflow.edges.filter(e => e.source === nodeId);
      for (const edge of outgoingEdges) {
        if (this.evaluateEdgeCondition(edge, nodeExecution.output, execution.variables)) {
          // Merge output with existing input data
          const mergedInput = this.mergeNodeData(inputData, nodeExecution.output);
          nodeQueue.set(edge.target, mergedInput);
        }
      }
    }
  }

  private getNodeDependencies(workflow: Workflow, nodeId: string): string[] {
    return workflow.edges
      .filter(e => e.target === nodeId)
      .map(e => e.source);
  }

  private evaluateEdgeCondition(edge: WorkflowEdge, nodeOutput: any, variables: Record<string, any>): boolean {
    if (!edge.condition) {
      return true; // No condition, always pass
    }

    try {
      // Simple condition evaluation
      const { field, operator, value } = edge.condition;
      const fieldValue = this.getFieldValue(nodeOutput, field);

      switch (operator) {
        case 'equals':
          return fieldValue === value;
        case 'not_equals':
          return fieldValue !== value;
        case 'greater_than':
          return Number(fieldValue) > Number(value);
        case 'less_than':
          return Number(fieldValue) < Number(value);
        case 'contains':
          return String(fieldValue).includes(String(value));
        case 'not_contains':
          return !String(fieldValue).includes(String(value));
        case 'exists':
          return fieldValue !== undefined && fieldValue !== null;
        case 'not_exists':
          return fieldValue === undefined || fieldValue === null;
        default:
          return true;
      }
    } catch (error) {
      console.warn('Failed to evaluate edge condition:', error);
      return true; // Default to passing if condition evaluation fails
    }
  }

  private getFieldValue(obj: any, field: string): any {
    return field.split('.').reduce((current, key) => current?.[key], obj);
  }

  private mergeNodeData(existingData: any, newData: any): any {
    return {
      ...existingData,
      ...newData,
    };
  }

  private async executeNode(
    node: WorkflowNode,
    input: any,
    workflowExecution: WorkflowExecution
  ): Promise<NodeExecution> {
    const startTime = new Date();
    const nodeExecution: NodeExecution = {
      id: uuidv4(),
      nodeId: node.id,
      status: ExecutionStatus.RUNNING,
      input,
      startTime,
      metrics: {
        duration: 0,
        cost: 0,
        tokens: 0,
      },
    };

    try {
      const handler = this.nodeHandlers.get(node.type);
      if (!handler) {
        throw new Error(`No handler found for node type: ${node.type}`);
      }

      const output = await handler.execute(node, input, workflowExecution);
      nodeExecution.output = output;
      nodeExecution.status = ExecutionStatus.COMPLETED;
    } catch (error) {
      nodeExecution.status = ExecutionStatus.FAILED;
      nodeExecution.error = error instanceof Error ? error.message : 'Unknown error';
      workflowExecution.metrics.failedExecutions++;
    } finally {
      nodeExecution.endTime = new Date();
      nodeExecution.metrics.duration = nodeExecution.endTime.getTime() - nodeExecution.startTime.getTime();

      // Update workflow metrics
      workflowExecution.metrics.totalCost += nodeExecution.metrics.cost;
      workflowExecution.metrics.totalTokens += nodeExecution.metrics.tokens;
      workflowExecution.metrics.nodeExecutions++;
    }

    return nodeExecution;
  }

  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId);
  }

  async stopExecution(executionId: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== ExecutionStatus.RUNNING) {
      return false;
    }

    execution.status = ExecutionStatus.CANCELLED;
    execution.endTime = new Date();
    return true;
  }

  async retryExecution(executionId: string, failedNodeId?: string): Promise<WorkflowExecution> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error('Execution not found');
    }

    // This would implement retry logic
    // For now, just return the existing execution
    return execution;
  }
}

// Node Handler Interface
interface NodeHandler {
  execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any>;
}

// Specific Node Handlers
class AgentNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    const agentId = node.data.agentId;
    if (!agentId) {
      throw new Error('Agent node requires agentId');
    }

    // This would get the actual agent from a service
    const agent = { id: agentId } as any; // Placeholder

    const agentExecution = await agentExecutionEngine.executeAgent(agent, JSON.stringify(input), {
      debugMode: false,
    });

    return {
      result: agentExecution.output,
      execution: agentExecution,
    };
  }
}

class TriggerNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    // Trigger nodes don't do much execution, they just pass through data
    return {
      triggered: true,
      triggerType: node.data.triggerType,
      timestamp: new Date().toISOString(),
      input,
    };
  }
}

class ConditionNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    const condition = node.data.condition;
    const conditionType = node.data.conditionType || 'expression';

    let result = false;

    try {
      switch (conditionType) {
        case 'expression':
          result = this.evaluateExpression(condition, input, workflowExecution.variables);
          break;
        case 'javascript':
          result = this.evaluateJavaScript(condition, input, workflowExecution.variables);
          break;
        case 'comparison':
          result = this.evaluateComparison(condition, input);
          break;
        default:
          result = Boolean(condition);
      }
    } catch (error) {
      throw new Error(`Condition evaluation failed: ${error}`);
    }

    return {
      condition: condition,
      result,
      input,
    };
  }

  private evaluateExpression(expression: string, input: any, variables: Record<string, any>): boolean {
    // Simple expression evaluation
    // In a real implementation, you'd use a proper expression parser
    try {
      const func = new Function('input', 'variables', `return ${expression}`);
      return Boolean(func(input, variables));
    } catch {
      return false;
    }
  }

  private evaluateJavaScript(code: string, input: any, variables: Record<string, any>): boolean {
    try {
      const func = new Function('input', 'variables', code);
      return Boolean(func(input, variables));
    } catch {
      return false;
    }
  }

  private evaluateComparison(comparison: any, input: any): boolean {
    const { left, operator, right } = comparison;
    const leftValue = this.getValue(input, left);
    const rightValue = this.getValue(input, right);

    switch (operator) {
      case '==': return leftValue == rightValue;
      case '===': return leftValue === rightValue;
      case '!=': return leftValue != rightValue;
      case '!==': return leftValue !== rightValue;
      case '>': return leftValue > rightValue;
      case '>=': return leftValue >= rightValue;
      case '<': return leftValue < rightValue;
      case '<=': return leftValue <= rightValue;
      default: return false;
    }
  }

  private getValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

class ActionNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    const actionType = node.data.actionType;
    const actionConfig = node.data.actionConfig;

    switch (actionType) {
      case 'send_email':
        return this.sendEmail(actionConfig, input);
      case 'call_api':
        return this.callApi(actionConfig, input);
      case 'create_file':
        return this.createFile(actionConfig, input);
      case 'send_notification':
        return this.sendNotification(actionConfig, input);
      default:
        return { action: actionType, config: actionConfig, input };
    }
  }

  private async sendEmail(config: any, input: any) {
    // Placeholder for email sending
    return {
      sent: true,
      to: config.to,
      subject: config.subject,
      message: config.message,
    };
  }

  private async callApi(config: any, input: any) {
    // Placeholder for API calls
    const response = await fetch(config.url, {
      method: config.method || 'POST',
      headers: config.headers,
      body: JSON.stringify(input),
    });

    const data = await response.json();
    return {
      status: response.status,
      data,
    };
  }

  private async createFile(config: any, input: any) {
    // Placeholder for file creation
    return {
      created: true,
      path: config.path,
      content: config.content || JSON.stringify(input),
    };
  }

  private async sendNotification(config: any, input: any) {
    // Placeholder for notification sending
    return {
      sent: true,
      message: config.message,
      channels: config.channels,
    };
  }
}

class ToolNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    const toolType = node.data.toolType;
    const toolConfig = node.data.toolConfig;

    // This would integrate with the actual tool system
    return {
      tool: toolType,
      config: toolConfig,
      input,
      output: `Tool ${toolType} executed`,
    };
  }
}

class InputNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    return {
      input: input,
      nodeId: node.id,
    };
  }
}

class OutputNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    return {
      output: input,
      nodeId: node.id,
    };
  }
}

class DelayNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    const delayAmount = node.data.delayAmount || 1;
    const delayUnit = node.data.delayUnit || 'seconds';

    const delayMs = this.convertToMilliseconds(delayAmount, delayUnit);
    await new Promise(resolve => setTimeout(resolve, delayMs));

    return {
      delayed: true,
      delayAmount,
      delayUnit,
      input,
    };
  }

  private convertToMilliseconds(amount: number, unit: string): number {
    switch (unit) {
      case 'milliseconds': return amount;
      case 'seconds': return amount * 1000;
      case 'minutes': return amount * 60 * 1000;
      case 'hours': return amount * 60 * 60 * 1000;
      case 'days': return amount * 24 * 60 * 60 * 1000;
      default: return amount * 1000;
    }
  }
}

class LoopNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    const loopType = node.data.loopType;
    const loopCondition = node.data.loopCondition;
    const maxIterations = node.data.maxIterations || 100;

    const results = [];
    let iterations = 0;

    while (iterations < maxIterations) {
      iterations++;

      // Evaluate loop condition
      let shouldContinue = false;
      try {
        switch (loopType) {
          case 'for':
            shouldContinue = iterations < maxIterations;
            break;
          case 'while':
            shouldContinue = this.evaluateCondition(loopCondition, input, workflowExecution.variables);
            break;
          case 'foreach':
            // Handle foreach logic
            shouldContinue = iterations < (Array.isArray(input) ? input.length : 1);
            break;
        }
      } catch (error) {
        break;
      }

      if (!shouldContinue) {
        break;
      }

      // Execute loop body (this would be more complex in a real implementation)
      const iterationResult = {
        iteration: iterations,
        input: Array.isArray(input) ? input[iterations - 1] : input,
      };

      results.push(iterationResult);
    }

    return {
      loopType,
      iterations,
      results,
      input,
    };
  }

  private evaluateCondition(condition: string, input: any, variables: Record<string, any>): boolean {
    try {
      const func = new Function('input', 'variables', `return ${condition}`);
      return Boolean(func(input, variables));
    } catch {
      return false;
    }
  }
}

class MergeNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    // Merge multiple inputs into one
    return {
      merged: true,
      input,
      nodeId: node.id,
    };
  }
}

class SplitNodeHandler implements NodeHandler {
  async execute(node: WorkflowNode, input: any, workflowExecution: WorkflowExecution): Promise<any> {
    // Split input into multiple outputs
    return {
      split: true,
      input,
      outputs: Array.isArray(input) ? input : [input],
      nodeId: node.id,
    };
  }
}

// Singleton instance
export const workflowEngine = new WorkflowEngine();