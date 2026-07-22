import type { Connection } from 'reactflow';
import type { FlowEdge, FlowNode } from './model';

export const isValidConnection = (connection: Connection) =>
  connection.source !== connection.target;

export const updateNodeLabel = (
  nodes: FlowNode[],
  nodeId: string,
  label: string,
): FlowNode[] =>
  nodes.map((node) =>
    node.id === nodeId
      ? { ...node, data: { ...node.data, label } }
      : node,
  );

export const updateNodeSize = (
  nodes: FlowNode[],
  nodeId: string,
  width: number,
  height: number,
): FlowNode[] =>
  nodes.map((node) =>
    node.id === nodeId
      ? {
          ...node,
          data: { ...node.data, width, height },
          style: { ...node.style, width, height },
        }
      : node,
  );

export const updateNodeCompletion = (
  nodes: FlowNode[],
  nodeId: string,
  completed: boolean,
  completedAt = Date.now(),
): FlowNode[] =>
  nodes.map((node) =>
    node.id === nodeId
      ? {
          ...node,
          data: {
            ...node.data,
            completed,
            completedAt: completed ? completedAt : undefined,
          },
        }
      : node,
  );

export const removeSelectedElements = (
  nodes: FlowNode[],
  edges: FlowEdge[],
) => {
  const nodeIds = new Set(
    nodes.filter((node) => node.selected).map((node) => node.id),
  );

  return {
    nodes: nodes.filter((node) => !node.selected),
    edges: edges.filter(
      (edge) =>
        !edge.selected &&
        !nodeIds.has(edge.source) &&
        !nodeIds.has(edge.target),
    ),
  };
};
