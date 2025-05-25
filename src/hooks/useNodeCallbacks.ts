import { on } from 'events';
import { useCallback } from 'react';
import { SetStateAction } from 'react';
import { Node } from 'reactflow';

export const useNodeCallbacks = (setNodes: React.Dispatch<SetStateAction<Node[]>>) => {
  const onLabelChange = useCallback((nodeId: string, newLabel: string) => {
    setNodes((nds: Node[]) =>
      nds.map((node: Node) => {
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
      })
    );
  }, [setNodes]);

  const onNodeResize = useCallback((nodeId: string, width: number, height: number) => {
    setNodes((nds: Node[]) =>
      nds.map((node: Node) => {
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
      })
    );
  }, [setNodes]);

  const onToggleComplete = useCallback((nodeId: string, completed: boolean) => {
    setNodes((nds: Node[]) =>
      nds.map((node: Node) => {
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
      })
    );
  }, [setNodes]);

  
  const attachCallbacksToNodes = useCallback(() => {
    setNodes((nds: Node[]) =>
      nds.map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange,
          onResize: onNodeResize,
          onToggleComplete
        }
      }))
    );
  }, [setNodes, onLabelChange, onNodeResize, onToggleComplete]);

  return {
    onLabelChange,
    onNodeResize,
    attachCallbacksToNodes,
    onToggleComplete
  };
};

export default useNodeCallbacks;