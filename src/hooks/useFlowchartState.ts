import { useCallback, useEffect, useState } from 'react';
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from 'reactflow';

import { useReactFlow } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { useConnectionConfig } from './useConnectionConfig';
import { useLocalStorage } from './useLocalStorage';
import { useNodeCallbacks } from './useNodeCallbacks';
// Storage keys
const STORAGE_KEY_NODES = 'flowchart-nodes';
const STORAGE_KEY_EDGES = 'flowchart-edges';
const STORAGE_KEY_TITLE = 'flowchart-title';

export const useFlowchartState = (initialNodes: Node[] = [], initialEdges: Edge[] = [], initialTitle: string = 'My Flowchart') => {
  const { loadFromStorage, saveToStorage } = useLocalStorage();
  const { isValidConnection } = useConnectionConfig();
  const { getViewport } = useReactFlow();
  
  // Load initial nodes and edges
  const loadedNodes = loadFromStorage(STORAGE_KEY_NODES, initialNodes);
  const loadedEdges = loadFromStorage(STORAGE_KEY_EDGES, initialEdges);
  const loadedTitle = loadFromStorage(STORAGE_KEY_TITLE, initialTitle);
  
  // Initialize states with the loaded data
  const [nodes, setNodes, onNodesChange] = useNodesState(loadedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadedEdges);
  const [title, setTitle] = useState(loadedTitle);
  
  // Get node callback functions
  const { onLabelChange, onNodeResize, attachCallbacksToNodes } = useNodeCallbacks(setNodes);
  
  // Attach callbacks to nodes
  useEffect(() => {
    attachCallbacksToNodes();
  }, [attachCallbacksToNodes]);
  
  // Save nodes to localStorage when they change
  useEffect(() => {
    const nodesToStore = nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onLabelChange: undefined,
        onResize: undefined,
      }
    }));
    saveToStorage(STORAGE_KEY_NODES, nodesToStore);
  }, [nodes, saveToStorage]);


  useEffect(() => {
    const edgesToStore = edges.map(edge => ({
      ...edge,
      selected: false,
    }));
    saveToStorage(STORAGE_KEY_EDGES, edgesToStore);
  }, [edges, saveToStorage]);
  
  // Save title to localStorage when it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEY_TITLE, title);
  }, [title, saveToStorage]);
  
  // Title update handler
  const updateTitle = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);
  // Connection handling
  const onConnect = useCallback(
    (connection: Connection) => {
      if (isValidConnection(connection)) {
        const uniqueEdge = {
          ...connection,
          id: `edge-${uuidv4()}`,
          animated: false,
          style: { 
            stroke: '#555', 
            strokeWidth: 2 
          }
        };
        
        setEdges((eds) => addEdge(uniqueEdge, eds));
      }
    },
    [setEdges, isValidConnection]
  );

  // Node operations
  const addNode = useCallback(() => {
    const viewPort = getViewport();

    const flowElement = document.querySelector('.react-flow');
    const rect = flowElement?.getBoundingClientRect();


    var newNodePosition: { x: number; y: number } = {x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 };

    if (rect && viewPort) {
      const screenCenterX = rect.width / 2;
      const screenCenterY = rect.height * 0.4; // 40% from top instead of 50%
      
      // Transform screen coordinates to flow coordinates
      const flowX = (screenCenterX - viewPort.x) / viewPort.zoom;
      const flowY = (screenCenterY - viewPort.y) / viewPort.zoom;

      newNodePosition = {
        x: flowX,
        y: flowY
      };
    }
    
    const newNode: Node = {
      id: uuidv4(),
      type: 'customNode',
      data: { 
        label: '',
        onLabelChange,
        onResize: onNodeResize,
        width: 160,
        height: 80,
      },
      position: { 
        x: newNodePosition.x,
        y: newNodePosition.y
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, onLabelChange, onNodeResize]);

  const deleteSelectedNodes = useCallback(() => {
    const nodesToDelete = nodes.filter(node => node.selected).map(node => node.id);
    
    setNodes((nds) => nds.filter((node) => !node.selected));
    
    setEdges((eds) => eds.filter((edge) => 
      !edge.selected && 
      !nodesToDelete.includes(edge.source) && 
      !nodesToDelete.includes(edge.target)
    ));
  }, [nodes, setNodes, setEdges]);

  return {
    nodes,
    edges,
    title,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteSelectedNodes,
    updateTitle,
  };
};