// ReactFlow v11 Type Definitions
// This file provides type definitions for ReactFlow components and utilities

import { ReactElement, ReactNode, MouseEvent as ReactMouseEvent, CSSProperties } from 'react';

// Base Node and Edge interfaces
export interface Node<TData extends Record<string, any> = Record<string, any>> {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: TData;
  width?: number;
  height?: number;
  style?: CSSProperties;
  className?: string;
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left';
  targetPosition?: 'top' | 'right' | 'bottom' | 'left';
  hidden?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  selected?: boolean;
  dragging?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  extent?: 'parent' | [[number, number], [number, number]];
  expandParent?: boolean;
  positionAbsolute?: { x: number; y: number };
  ariaLabel?: string;
  focusable?: boolean;
  resizeObserver?: boolean;
  zIndex?: number;
  origin?: [number, number];
}

export interface Edge<TData extends Record<string, any> = Record<string, any>> {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  data?: TData;
  style?: CSSProperties;
  className?: string;
  animated?: boolean;
  selected?: boolean;
  hidden?: boolean;
  deletable?: boolean;
  focusable?: boolean;
  updatable?: boolean;
  markerStart?: string;
  markerEnd?: string;
  pathOptions?: any;
  interactionWidth?: number;
  zIndex?: number;
  ariaLabel?: string;
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
}

export interface Connection {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

// Hook types
export interface NodeChange {
  id: string;
  type: string;
  [key: string]: any;
}

export interface EdgeChange {
  id: string;
  type: string;
  [key: string]: any;
}

export type OnNodesChange = (changes: NodeChange[]) => void;
export type OnEdgesChange = (changes: EdgeChange[]) => void;
export type OnConnect = (connection: Connection) => void;
export type OnNodeClick = (event: ReactMouseEvent, node: Node) => void;
export type OnEdgeClick = (event: ReactMouseEvent, edge: Edge) => void;
export type OnPaneClick = (event: ReactMouseEvent) => void;

// ReactFlow component props
export interface ReactFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  onNodeClick?: OnNodeClick;
  onEdgeClick?: OnEdgeClick;
  onPaneClick?: OnPaneClick;
  nodeTypes?: Record<string, ReactElement>;
  edgeTypes?: Record<string, ReactElement>;
  fitView?: boolean;
  attributionPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  readOnly?: boolean;
  children?: ReactNode;
  [key: string]: any;
}

// ReactFlow component
export declare const ReactFlow: React.ComponentType<ReactFlowProps>;

// Controls component
export interface ControlsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  children?: ReactNode;
}

export declare const Controls: React.ComponentType<ControlsProps>;

// MiniMap component
export interface MiniMapProps {
  nodeColor?: string | ((node: Node) => string);
  nodeStrokeColor?: string | ((node: Node) => string);
  nodeBorderRadius?: number;
  nodeStrokeWidth?: number;
  maskColor?: string;
  pannable?: boolean;
  zoomable?: boolean;
  ariaLabel?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export declare const MiniMap: React.ComponentType<MiniMapProps>;

// Background component
export interface BackgroundProps {
  variant?: 'dots' | 'lines' | 'cross';
  gap?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export declare const Background: React.ComponentType<BackgroundProps>;

export declare const BackgroundVariant: {
  Dots: 'dots';
  Lines: 'lines';
  Cross: 'cross';
};

// Hook functions
export declare function useNodesState(initialNodes: Node[]): [
  Node[],
  React.Dispatch<React.SetStateAction<Node[]>>,
  OnNodesChange
];

export declare function useEdgesState(initialEdges: Edge[]): [
  Edge[],
  React.Dispatch<React.SetStateAction<Edge[]>>,
  OnEdgesChange
];

export declare function addEdge(params: Edge | Connection, edges: Edge[]): Edge[];

export declare function applyNodeChanges(changes: NodeChange[], nodes: Node[]): Node[];
export declare function applyEdgeChanges(changes: EdgeChange[], edges: Edge[]): Edge[];

// Utility functions
export declare function getConnectedEdges(nodes: Node[], edges: Edge[]): Edge[];
export declare function getIncomers(node: Node, nodes: Node[], edges: Edge[]): Node[];
export declare function getOutgoers(node: Node, nodes: Node[], edges: Edge[]): Node[];

// Default export
declare const ReactFlowDefault: React.ComponentType<ReactFlowProps>;
export default ReactFlowDefault;