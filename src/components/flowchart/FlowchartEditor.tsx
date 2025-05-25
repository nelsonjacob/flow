import React from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from '../nodes/CustomNode';
import { useConnectionConfig } from '../../hooks/useConnectionConfig';

interface FlowchartEditorProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

const nodeTypes = {
  customNode: CustomNode,
};

export const FlowchartEditor: React.FC<FlowchartEditorProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}) => {
  const {} = useConnectionConfig();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      defaultEdgeOptions={{
        type: 'default',
        style: { stroke: '#555', strokeWidth: 2 },
      }}
      fitViewOptions={{
        padding: 0.2,
        maxZoom: 1.5
      }}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      // Setting this to false allows connections between any handle types
      connectOnClick={false}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default FlowchartEditor;