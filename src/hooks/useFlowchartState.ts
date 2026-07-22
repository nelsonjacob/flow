import { useCallback, useEffect, useState } from 'react';
import {
  addEdge,
  type Connection,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import {
  isValidConnection,
  removeSelectedElements,
  updateNodeCompletion,
  updateNodeLabel,
  updateNodeSize,
} from '../flowchart/graph';
import { createFlowNode, type FlowEdge, type FlowNode } from '../flowchart/model';
import { loadFlowchart, saveFlowchart } from '../flowchart/persistence';

export const useFlowchartState = (
  initialNodes: FlowNode[] = [],
  initialEdges: FlowEdge[] = [],
  initialTitle = 'My Flowchart',
) => {
  const { getViewport } = useReactFlow();
  const [initialSnapshot] = useState(() =>
    loadFlowchart(localStorage, {
      nodes: initialNodes,
      edges: initialEdges,
      title: initialTitle,
    }),
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialSnapshot.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialSnapshot.edges);
  const [title, setTitle] = useState(initialSnapshot.title);

  useEffect(() => {
    saveFlowchart(localStorage, { nodes, edges, title });
  }, [edges, nodes, title]);

  const updateTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!isValidConnection(connection)) return;

      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            id: `edge-${uuidv4()}`,
            animated: false,
            style: { stroke: '#555', strokeWidth: 2 },
          },
          currentEdges,
        ),
      );
    },
    [setEdges],
  );

  const addNode = useCallback(() => {
    const viewport = getViewport();
    const flowElement = document.querySelector('.react-flow');
    const rect = flowElement?.getBoundingClientRect();
    let position = {
      x: 100 + Math.random() * 100,
      y: 100 + Math.random() * 100,
    };

    if (rect) {
      position = {
        x: (rect.width / 2 - viewport.x) / viewport.zoom,
        y: (rect.height * 0.4 - viewport.y) / viewport.zoom,
      };
    }

    setNodes((currentNodes) => [
      ...currentNodes,
      createFlowNode(uuidv4(), position),
    ]);
  }, [getViewport, setNodes]);

  const deleteSelectedNodes = useCallback(() => {
    const remaining = removeSelectedElements(nodes, edges);
    setNodes(remaining.nodes);
    setEdges(remaining.edges);
  }, [edges, nodes, setEdges, setNodes]);

  const clearChart = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setTitle('Flowchart');
  }, [setEdges, setNodes]);

  const onLabelChange = useCallback(
    (nodeId: string, label: string) => {
      setNodes((currentNodes) => updateNodeLabel(currentNodes, nodeId, label));
    },
    [setNodes],
  );

  const onNodeResize = useCallback(
    (nodeId: string, width: number, height: number) => {
      setNodes((currentNodes) =>
        updateNodeSize(currentNodes, nodeId, width, height),
      );
    },
    [setNodes],
  );

  const onToggleComplete = useCallback(
    (nodeId: string, completed: boolean) => {
      setNodes((currentNodes) =>
        updateNodeCompletion(currentNodes, nodeId, completed),
      );
    },
    [setNodes],
  );

  return {
    nodes,
    edges,
    title,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    clearChart,
    deleteSelectedNodes,
    updateTitle,
    onLabelChange,
    onNodeResize,
    onToggleComplete,
  };
};
