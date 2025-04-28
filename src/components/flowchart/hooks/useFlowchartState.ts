import { useCallback, useEffect } from 'react';
import {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { useConnectionConfig } from './useConnectionConfig';
import { useLocalStorage } from './useLocalStorage';
import { useNodeCallbacks } from './useNodeCallbacks';
// Storage keys
const STORAGE_KEY_NODES = 'flowchart-nodes';
const STORAGE_KEY_EDGES = 'flowchart-edges';

export const useFlowchartState = (initialNodes: Node[] = [], initialEdges: Edge[] = []) => {
  const { loadFromStorage, saveToStorage } = useLocalStorage();
  const { isValidConnection } = useConnectionConfig();
  
  // Load initial nodes and edges
  const loadedNodes = loadFromStorage(STORAGE_KEY_NODES, initialNodes);
  const loadedEdges = loadFromStorage(STORAGE_KEY_EDGES, initialEdges);
  
  // Initialize states with the loaded data
  const [nodes, setNodes, onNodesChange] = useNodesState(loadedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(loadedEdges);
  
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
  
  // Save edges to localStorage when they change
  useEffect(() => {
    saveToStorage(STORAGE_KEY_EDGES, edges);
  }, [edges, saveToStorage]);
  
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
        x: 100 + Math.random() * 100, 
        y: 100 + Math.random() * 100 
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
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteSelectedNodes,
  };
};