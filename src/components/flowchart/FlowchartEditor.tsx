import ReactFlow, {
  Background,
  ConnectionMode,
  Controls,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from 'reactflow';
import CustomNode from '../nodes/CustomNode';
import type { FlowEdge, FlowNode } from '../../flowchart/model';
import {
  BASE_EDGE_STYLE,
  useEdgeInteractions,
} from '../../hooks/useEdgeInteractions';

interface FlowchartEditorProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

const nodeTypes = { customNode: CustomNode };

export const FlowchartEditor = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
}: FlowchartEditorProps) => {
  const edgeInteractions = useEdgeInteractions(edges, onEdgesChange);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edgeInteractions.styledEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgeMouseEnter={edgeInteractions.onEdgeMouseEnter}
      onEdgeMouseLeave={edgeInteractions.onEdgeMouseLeave}
      onEdgeClick={edgeInteractions.onEdgeClick}
      onEdgeDoubleClick={edgeInteractions.onEdgeDoubleClick}
      onPaneClick={edgeInteractions.onPaneClick}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      defaultEdgeOptions={{ type: 'default', style: BASE_EDGE_STYLE }}
      fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      connectOnClick={false}
      deleteKeyCode={null}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default FlowchartEditor;
