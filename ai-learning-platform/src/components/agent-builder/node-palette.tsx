'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NodeType } from '@/types/agents';
import {
  Bot,
  Zap,
  GitBranch,
  Play,
  Wrench,
  Input,
  Output,
  Clock,
  RefreshCw,
  Merge,
  GitFork,
  Search,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NodePaletteProps {
  onAddNode: (nodeType: NodeType, position: { x: number; y: number }) => void;
}

const nodeCategories = [
  {
    name: 'Core Components',
    nodes: [
      {
        type: NodeType.AGENT,
        name: 'AI Agent',
        description: 'Intelligent agent with LLM capabilities',
        icon: Bot,
        color: 'bg-blue-500',
        category: 'core'
      },
      {
        type: NodeType.TRIGGER,
        name: 'Trigger',
        description: 'Workflow trigger event',
        icon: Zap,
        color: 'bg-green-500',
        category: 'core'
      },
      {
        type: NodeType.CONDITION,
        name: 'Condition',
        description: 'Conditional logic branching',
        icon: GitBranch,
        color: 'bg-yellow-500',
        category: 'core'
      },
      {
        type: NodeType.ACTION,
        name: 'Action',
        description: 'Execute specific actions',
        icon: Play,
        color: 'bg-purple-500',
        category: 'core'
      }
    ]
  },
  {
    name: 'Tools & Integration',
    nodes: [
      {
        type: NodeType.TOOL,
        name: 'Tool',
        description: 'External tool integration',
        icon: Wrench,
        color: 'bg-red-500',
        category: 'tools'
      },
      {
        type: NodeType.INPUT,
        name: 'Input',
        description: 'Data input node',
        icon: Input,
        color: 'bg-gray-500',
        category: 'tools'
      },
      {
        type: NodeType.OUTPUT,
        name: 'Output',
        description: 'Data output node',
        icon: Output,
        color: 'bg-gray-500',
        category: 'tools'
      }
    ]
  },
  {
    name: 'Flow Control',
    nodes: [
      {
        type: NodeType.DELAY,
        name: 'Delay',
        description: 'Add time delay',
        icon: Clock,
        color: 'bg-orange-500',
        category: 'flow'
      },
      {
        type: NodeType.LOOP,
        name: 'Loop',
        description: 'Iterative processing',
        icon: RefreshCw,
        color: 'bg-cyan-500',
        category: 'flow'
      },
      {
        type: NodeType.MERGE,
        name: 'Merge',
        description: 'Combine multiple flows',
        icon: Merge,
        color: 'bg-indigo-500',
        category: 'flow'
      },
      {
        type: NodeType.SPLIT,
        name: 'Split',
        description: 'Split into parallel flows',
        icon: GitFork,
        color: 'bg-pink-500',
        category: 'flow'
      }
    ]
  }
];

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Core Components', 'Tools & Integration']));
  const [draggedNodeType, setDraggedNodeType] = useState<NodeType | null>(null);

  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    setDraggedNodeType(nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedNodeType(null);
  };

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredNodes = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Node Categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredNodes.map((category) => (
          <div key={category.name} className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCategory(category.name)}
              className="w-full justify-between p-2 h-auto font-semibold text-gray-700 hover:bg-gray-100"
            >
              <span>{category.name}</span>
              {expandedCategories.has(category.name) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>

            {expandedCategories.has(category.name) && (
              <div className="space-y-2 pl-2">
                {category.nodes.map((node) => {
                  const Icon = node.icon;
                  return (
                    <Card
                      key={node.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node.type)}
                      onDragEnd={handleDragEnd}
                      className="cursor-move hover:shadow-md transition-shadow p-3 border-l-4 border-l-gray-200 hover:border-l-blue-400"
                      style={{ borderLeftColor: node.color.replace('bg-', '#').replace('500', '400') }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 ${node.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">
                            {node.name}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {node.description}
                          </div>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {node.category}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Drop Zone Indicator */}
      {draggedNodeType && (
        <div className="p-3 border-t border-gray-200 bg-blue-50">
          <div className="text-sm text-blue-700 font-medium">
            Drag to canvas to add {draggedNodeType}
          </div>
        </div>
      )}

      {/* Templates Section */}
      <div className="p-3 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            // Open templates dialog
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Browse Templates
        </Button>
      </div>
    </div>
  );
}

// Canvas Drop Zone Component
export function CanvasDropZone({ children, onDrop }: { children: React.ReactNode; onDrop: (nodeType: NodeType, position: { x: number; y: number }) => void }) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const nodeType = e.dataTransfer.getData('nodeType') as NodeType;
    if (!nodeType) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    onDrop(nodeType, position);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative w-full h-full"
    >
      {children}
    </div>
  );
}