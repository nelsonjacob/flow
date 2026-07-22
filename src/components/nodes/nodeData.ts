export interface FlowNodeData {
  label: string;
  completed: boolean;
  completedAt?: number;
  width: number;
  height: number;
  isDragging?: boolean;
}

export const DEFAULT_NODE_WIDTH = 160;
export const DEFAULT_NODE_HEIGHT = 80;

export const createDefaultNodeData = (): FlowNodeData => ({
  label: '',
  completed: false,
  width: DEFAULT_NODE_WIDTH,
  height: DEFAULT_NODE_HEIGHT,
});

export const mergeNodeData = (
  persistedData: Partial<FlowNodeData> = {},
): FlowNodeData => ({
  ...createDefaultNodeData(),
  ...persistedData,
});
