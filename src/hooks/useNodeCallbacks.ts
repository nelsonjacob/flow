import { useCallback } from 'react';
import { SetStateAction } from 'react';
import { Node } from 'reactflow';

export const updateNodeLabel = (nodes: Node[], nodeId: string, newLabel: string): Node[] =>
  nodes.map((node: Node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        data: {
          ...node.data,
          label: newLabel,
        },
      };
    }
    return node;
  });

export const updateNodeSize = (
  nodes: Node[],
  nodeId: string,
  width: number,
  height: number,
): Node[] =>
  nodes.map((node: Node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        data: {
          ...node.data,
          width,
          height,
        },
        style: {
          ...node.style,
          width,
          height,
        },
      };
    }
    return node;
  });

export const updateNodeCompletion = (
  nodes: Node[],
  nodeId: string,
  completed: boolean,
): Node[] =>
  nodes.map((node: Node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        data: {
          ...node.data,
          completed,
          completedAt: completed ? Date.now() : undefined,
        },
      };
    }
    return node;
  });

export const useNodeCallbacks = (setNodes: React.Dispatch<SetStateAction<Node[]>>) => {
  const onLabelChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds: Node[]) => updateNodeLabel(nds, nodeId, newLabel));
  }, [setNodes]);

  const onNodeResize = useCallback((nodeId: string, width: number, height: number) => {
    setNodes((nds: Node[]) => updateNodeSize(nds, nodeId, width, height));
  }, [setNodes]);

  const onToggleComplete = useCallback((nodeId: string, completed: boolean) => {
    setNodes((nds: Node[]) => updateNodeCompletion(nds, nodeId, completed));
  }, [setNodes]);

  return {
    onLabelChange,
    onNodeResize,
    onToggleComplete
  };
};

export default useNodeCallbacks;
