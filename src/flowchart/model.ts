import type { Edge, Node, XYPosition } from 'reactflow';

export interface FlowNodeData {
  label: string;
  completed: boolean;
  completedAt?: number;
  width: number;
  height: number;
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

export interface FlowchartSnapshot {
  nodes: FlowNode[];
  edges: FlowEdge[];
  title: string;
}

export const DEFAULT_NODE_WIDTH = 160;
export const DEFAULT_NODE_HEIGHT = 80;

export const createDefaultNodeData = (): FlowNodeData => ({
  label: '',
  completed: false,
  width: DEFAULT_NODE_WIDTH,
  height: DEFAULT_NODE_HEIGHT,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const finiteNumberOr = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

export const normalizeNodeData = (value: unknown): FlowNodeData => {
  const data = isRecord(value) ? value : {};
  const normalized: FlowNodeData = {
    label: typeof data.label === 'string' ? data.label : '',
    completed: typeof data.completed === 'boolean' ? data.completed : false,
    width: finiteNumberOr(data.width, DEFAULT_NODE_WIDTH),
    height: finiteNumberOr(data.height, DEFAULT_NODE_HEIGHT),
  };

  if (typeof data.completedAt === 'number' && Number.isFinite(data.completedAt)) {
    normalized.completedAt = data.completedAt;
  }

  return normalized;
};

export const createFlowNode = (id: string, position: XYPosition): FlowNode => ({
  id,
  type: 'customNode',
  data: createDefaultNodeData(),
  position,
});
