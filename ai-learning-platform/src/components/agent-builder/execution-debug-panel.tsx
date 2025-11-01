'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExecutionStep, ExecutionStatus } from '@/types/agents';
import { Bug, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { ExecutionDebugPanelProps } from '@/types/agents';

export function ExecutionDebugPanel({ steps, isRunning }: ExecutionDebugPanelProps) {
  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case ExecutionStatus.RUNNING:
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case ExecutionStatus.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case ExecutionStatus.FAILED:
        return <XCircle className="w-4 h-4 text-red-500" />;
      case ExecutionStatus.PENDING:
        return <Clock className="w-4 h-4 text-gray-500" />;
      case ExecutionStatus.CANCELLED:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case ExecutionStatus.TIMEOUT:
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: ExecutionStatus) => {
    const variants = {
      [ExecutionStatus.RUNNING]: 'default',
      [ExecutionStatus.COMPLETED]: 'success',
      [ExecutionStatus.FAILED]: 'destructive',
      [ExecutionStatus.PENDING]: 'secondary',
      [ExecutionStatus.CANCELLED]: 'outline',
      [ExecutionStatus.TIMEOUT]: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status] || 'secondary'} className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = end.getTime() - new Date(startTime).getTime();
    return `${duration.toFixed(0)}ms`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bug className="w-5 h-5" />
          Execution Debug
          {isRunning && (
            <Badge variant="outline" className="ml-auto">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Running...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-48 px-4 pb-4">
          {steps.length === 0 && !isRunning ? (
            <div className="text-center text-gray-500 py-8">
              <Bug className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No execution steps yet</p>
              <p className="text-xs text-gray-400 mt-1">Run a workflow to see debug information</p>
            </div>
          ) : (
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="font-medium text-sm">{step.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(step.status)}
                      {getStatusBadge(step.status)}
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Duration: {formatDuration(step.startTime, step.endTime)}</span>
                    </div>

                    {step.error && (
                      <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded mt-2">
                        <div className="font-medium">Error:</div>
                        <div className="text-xs mt-1">{step.error}</div>
                      </div>
                    )}

                    {(step.input || step.output) && (
                      <div className="space-y-1 mt-2">
                        {step.input && (
                          <div className="bg-white dark:bg-gray-900 p-2 rounded border">
                            <div className="font-medium text-xs mb-1">Input:</div>
                            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                              {typeof step.input === 'string'
                                ? step.input
                                : JSON.stringify(step.input, null, 2)
                              }
                            </pre>
                          </div>
                        )}

                        {step.output && (
                          <div className="bg-white dark:bg-gray-900 p-2 rounded border">
                            <div className="font-medium text-xs mb-1">Output:</div>
                            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                              {typeof step.output === 'string'
                                ? step.output
                                : JSON.stringify(step.output, null, 2)
                              }
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {step.metadata && Object.keys(step.metadata).length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded mt-2">
                        <div className="font-medium text-xs mb-1">Metadata:</div>
                        <pre className="text-xs">
                          {JSON.stringify(step.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isRunning && (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Workflow execution in progress...
                  </p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}