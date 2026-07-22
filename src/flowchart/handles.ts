import type { FlowEdge } from './model';

export const getConnectedHandleIds = (nodeId: string, edges: FlowEdge[]) => {
  const connected = new Set<string>();

  for (const edge of edges) {
    if (edge.source === nodeId && edge.sourceHandle) {
      connected.add(edge.sourceHandle);
    }
    if (edge.target === nodeId && edge.targetHandle) {
      connected.add(edge.targetHandle);
    }
  }

  return connected;
};
