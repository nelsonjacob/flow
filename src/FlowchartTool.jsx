// FlowchartTool.jsx
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from 'reactflow';
import { PlusCircle, Trash2, Download, Upload } from 'lucide-react';
import EditableNode from './EditableNode';

// Define node types mapping
const nodeTypes = {
  editableNode: EditableNode,
};

function FlowchartTool() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  const reactFlowInstance = useReactFlow();
  const fileInputRef = useRef(null);

  const onConnect = useCallback(
    (params) => {
      // Add the connection without restrictions
      setEdges((eds) => addEdge({
        ...params,
        type: 'default',
        animated: false,
        style: { stroke: '#555', strokeWidth: 2 },
      }, eds));
    },
    [setEdges]
  );

  // Update node content
  const onNodeUpdate = useCallback((id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          // Update the node data with new label
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

  // Add a new node
  const addNode = useCallback(() => {
    const newNode = {
      id: `node-${nodeId}`,
      type: 'editableNode', // Use our custom node type
      data: { 
        label: `Task ${nodeId}`,
        onNodeUpdate: onNodeUpdate, // Pass the update function to the node
      },
      position: { x: 100, y: 100 + (nodeId * 70) % 300 },
    };
    
    setNodes((nds) => nds.concat(newNode));
    setNodeId((id) => id + 1);
  }, [nodeId, setNodes, onNodeUpdate]);

  // Delete selected nodes
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  // Export flowchart to JSON
  const handleExport = useCallback(() => {
    if (!reactFlowInstance) return;

    // Get current flow data
    const flow = reactFlowInstance.toObject();
    
    // Remove the function references that can't be serialized
    const serializedFlow = {
      ...flow,
      nodes: flow.nodes.map(node => ({
        ...node,
        data: {
          label: node.data.label,
          // Exclude functions from serialization
        }
      }))
    };

    // Create a JSON blob and download it
    const jsonString = JSON.stringify(serializedFlow, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flowchart.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [reactFlowInstance]);

  // Import flowchart from JSON
  const handleImport = useCallback((event) => {
    const fileReader = new FileReader();
    const file = event.target.files[0];
    
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const flowData = JSON.parse(e.target.result);
        
        // Extract the highest node ID to continue the counter
        let highestId = 0;
        flowData.nodes.forEach(node => {
          const match = node.id.match(/node-(\d+)/);
          if (match) {
            const id = parseInt(match[1]);
            highestId = Math.max(highestId, id);
          }
        });
        
        // Add the onNodeUpdate function back to each node
        const nodesWithCallbacks = flowData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onNodeUpdate: onNodeUpdate,
          }
        }));
        
        // Update state
        setNodeId(highestId + 1);
        setNodes(nodesWithCallbacks);
        setEdges(flowData.edges);
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error importing flowchart:', error);
        alert('Failed to import flowchart. Invalid JSON file.');
      }
    };
    
    fileReader.readAsText(file);
  }, [setNodes, setEdges, onNodeUpdate]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Flowchart Tool</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={addNode}
            style={{
              padding: '8px 16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <PlusCircle size={16} />
            Add Node
          </button>
          <button 
            onClick={deleteSelected}
            style={{
              padding: '8px 16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
          <button 
            onClick={handleExport}
            style={{
              padding: '8px 16px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Download size={16} />
            Export JSON
          </button>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '8px 16px',
                background: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Upload size={16} />
              Import JSON
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            connectionMode="loose" // Add this line
            connectionLineStyle={{ stroke: '#555' }}
            defaultEdgeOptions={{
              style: { stroke: '#555' },
              type: 'default',
            }}
          >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default FlowchartTool;