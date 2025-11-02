'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agent } from '@/types/agents';
import { deployAgent, getAgentDeployments, undeployAgent } from '@/lib/agent-framework/deployment-service';
import {
  Rocket,
  Server,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Globe,
  Shield,
  Zap,
  TrendingUp,
    Database,
  Cpu
} from 'lucide-react';

interface AgentDeployment {
  id: string;
  agentId: string;
  agentName: string;
  environment: 'development' | 'staging' | 'production';
  status: 'deploying' | 'deployed' | 'failed' | 'stopped';
  endpoint?: string;
  version: string;
  deployedAt: Date;
  lastHealthCheck?: Date;
  metrics: DeploymentMetrics;
  config: DeploymentConfig;
}

interface DeploymentMetrics {
  requestCount: number;
  errorRate: number;
  averageResponseTime: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  cost: number;
}

interface DeploymentConfig {
  autoScaling: boolean;
  maxInstances: number;
  minInstances: number;
  memoryLimit: string;
  cpuLimit: string;
  enableMonitoring: boolean;
  enableLogging: boolean;
  rateLimit?: number;
  authRequired: boolean;
}

export function AgentDeploymentDashboard({ agents }: { agents: Agent[] }) {
  const [deployments, setDeployments] = useState<AgentDeployment[]>([]);
  const [selectedDeployment, setSelectedDeployment] = useState<AgentDeployment | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentFilter, setDeploymentFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [activeTab, setActiveTab] = useState('deployments');

  useEffect(() => {
    loadDeployments();
    const interval = setInterval(loadDeployments, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDeployments = async () => {
    try {
      const data = await getAgentDeployments();
      setDeployments(data);
    } catch (error) {
      console.error('Failed to load deployments:', error);
    }
  };

  const handleDeploy = async (agentId: string, environment: 'development' | 'staging' | 'production') => {
    setIsDeploying(true);
    try {
      const deployment = await deployAgent(agentId, environment);
      setDeployments(prev => [...prev, deployment]);
    } catch (error) {
      console.error('Failed to deploy agent:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleUndeploy = async (deploymentId: string) => {
    try {
      await undeployAgent(deploymentId);
      setDeployments(prev => prev.filter(d => d.id !== deploymentId));
      if (selectedDeployment?.id === deploymentId) {
        setSelectedDeployment(null);
      }
    } catch (error) {
      console.error('Failed to undeploy agent:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'deploying':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'stopped':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'deploying':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'stopped':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEnvironmentIcon = (environment: string) => {
    switch (environment) {
      case 'production':
        return <Rocket className="w-4 h-4 text-red-500" />;
      case 'staging':
        return <Server className="w-4 h-4 text-yellow-500" />;
      case 'development':
        return <Globe className="w-4 h-4 text-green-500" />;
      default:
        return <Server className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredDeployments = deployments.filter(deployment => {
    if (deploymentFilter === 'all') return true;
    return deployment.environment === deploymentFilter;
  });

  const totalDeployed = deployments.filter(d => d.status === 'deployed').length;
  const totalFailed = deployments.filter(d => d.status === 'failed').length;
  const averageUptime = deployments.length > 0
    ? deployments.reduce((sum, d) => sum + d.metrics.uptime, 0) / deployments.length
    : 0;
  const totalCost = deployments.reduce((sum, d) => sum + d.metrics.cost, 0);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Agent Deployment</h1>
            <Badge variant="secondary">Production Ready</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={deploymentFilter} onValueChange={setDeploymentFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadDeployments}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Deployed Agents</p>
                <p className="text-2xl font-bold text-gray-900">{totalDeployed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Deployments</p>
                <p className="text-2xl font-bold text-gray-900">{totalFailed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{averageUptime.toFixed(1)}%</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(4)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-4">
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="deployments" className="flex-1 p-4 m-0 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deployments List */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Active Deployments</h3>
                <div className="space-y-3">
                  {filteredDeployments.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Server className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No deployments found.</p>
                    </div>
                  ) : (
                    filteredDeployments.map(deployment => (
                      <Card
                        key={deployment.id}
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedDeployment?.id === deployment.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setSelectedDeployment(deployment)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(deployment.status)}
                            <span className="font-medium">{deployment.agentName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getEnvironmentIcon(deployment.environment)}
                            <Badge className={getStatusColor(deployment.status)}>
                              {deployment.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Version:</span> {deployment.version}
                          </div>
                          <div>
                            <span className="font-medium">Deployed:</span> {deployment.deployedAt.toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Requests:</span> {deployment.metrics.requestCount.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Error Rate:</span> {(deployment.metrics.errorRate * 100).toFixed(2)}%
                          </div>
                        </div>
                        {deployment.endpoint && (
                          <div className="mt-2 text-xs text-blue-600 truncate">
                            {deployment.endpoint}
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </Card>

              {/* Deployment Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Deployment Details</h3>
                {selectedDeployment ? (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-medium mb-3">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Agent Name</span>
                          <span className="font-medium">{selectedDeployment.agentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Environment</span>
                          <div className="flex items-center gap-1">
                            {getEnvironmentIcon(selectedDeployment.environment)}
                            <span className="font-medium">{selectedDeployment.environment}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <Badge className={getStatusColor(selectedDeployment.status)}>
                            {selectedDeployment.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Version</span>
                          <span className="font-medium">{selectedDeployment.version}</span>
                        </div>
                        {selectedDeployment.endpoint && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Endpoint</span>
                            <span className="font-medium text-blue-600 text-xs">{selectedDeployment.endpoint}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div>
                      <h4 className="font-medium mb-3">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Uptime</span>
                            <span className="text-sm font-medium">{selectedDeployment.metrics.uptime.toFixed(1)}%</span>
                          </div>
                          <Progress value={selectedDeployment.metrics.uptime} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Memory Usage</span>
                            <span className="text-sm font-medium">{selectedDeployment.metrics.memoryUsage}%</span>
                          </div>
                          <Progress value={selectedDeployment.metrics.memoryUsage} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">CPU Usage</span>
                            <span className="text-sm font-medium">{selectedDeployment.metrics.cpuUsage}%</span>
                          </div>
                          <Progress value={selectedDeployment.metrics.cpuUsage} className="h-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Requests</span>
                            <div className="font-medium">{selectedDeployment.metrics.requestCount.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Response Time</span>
                            <div className="font-medium">{selectedDeployment.metrics.averageResponseTime}ms</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="font-medium mb-3">Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Logs
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUndeploy(selectedDeployment.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Undeploy
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <Server className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a deployment to view details.</p>
                  </div>
                )}
              </Card>
            </div>

            {/* New Deployment Section */}
            <Card className="mt-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Deploy New Agent</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.map(agent => (
                  <Card key={agent.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{agent.name}</span>
                      <Badge variant="outline">{agent.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeploy(agent.id, 'development')}
                        disabled={isDeploying}
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Dev
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeploy(agent.id, 'staging')}
                        disabled={isDeploying}
                      >
                        <Server className="w-4 h-4 mr-1" />
                        Staging
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeploy(agent.id, 'production')}
                        disabled={isDeploying}
                      >
                        <Rocket className="w-4 h-4 mr-1" />
                        Prod
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="flex-1 p-4 m-0">
            <Card className="h-full p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Real-time Monitoring
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3">System Health</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">CPU Usage</span>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Memory</span>
                      </div>
                      <span className="text-sm font-medium">2.3GB / 4GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Active Requests</span>
                      </div>
                      <span className="text-sm font-medium">127</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Security Status</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Secure
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Performance Metrics */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm font-medium">245ms</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Success Rate</span>
                        <span className="text-sm font-medium">98.5%</span>
                      </div>
                      <Progress value={98.5} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Throughput</span>
                        <span className="text-sm font-medium">1,234 req/min</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Error Rate</span>
                        <span className="text-sm font-medium">1.5%</span>
                      </div>
                      <Progress value={1.5} className="h-2" />
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-4 m-0">
            <Card className="h-full p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Usage Analytics
              </h3>
              <div className="text-center text-gray-500 py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Analytics dashboard coming soon.</p>
                <p className="text-sm">Track usage patterns, costs, and performance trends.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4 m-0">
            <Card className="h-full p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Deployment Settings
              </h3>
              <div className="text-center text-gray-500 py-12">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Deployment settings configuration coming soon.</p>
                <p className="text-sm">Configure deployment environments, scaling, and security settings.</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}