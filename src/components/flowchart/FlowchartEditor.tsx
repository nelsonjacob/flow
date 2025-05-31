import React, { useState, useCallback, useMemo } from 'react';
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
import ColorUtils from '../../utils/ui/ColorUtils';

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
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [clickedEdge, setClickedEdge] = useState<string | null>(null);

  // Create base edge styles once
  const baseEdgeStyle = useMemo(() => ({
    strokeWidth: 2,
    stroke: ColorUtils.flowchart.line.default,
    transition: 'all 0.2s ease-in-out'
  }), []);

  const hoveredEdgeStyle = useMemo(() => ({
    strokeWidth: 2,
    stroke: ColorUtils.flowchart.line.hover,
    strokeDasharray: '8,4',
    transition: 'all 0.2s ease-in-out'
  }), []);

  const clickedEdgeStyle = useMemo(() => ({
    strokeWidth: 2,
    stroke: ColorUtils.status.error,
    strokeDasharray: '8,4',
    transition: 'all 0.2s ease-in-out'
  }), []);

  // Only apply styles to edges that need them - much more efficient
  const styledEdges = useMemo(() => {
    if (!hoveredEdge && !clickedEdge) {
      return edges; // Return original edges if no special styling needed
    }
    
    return edges.map(edge => {
      if (clickedEdge === edge.id) {
        return { ...edge, style: { ...edge.style, ...clickedEdgeStyle } };
      }
      if (hoveredEdge === edge.id) {
        return { ...edge, style: { ...edge.style, ...hoveredEdgeStyle } };
      }
      return edge; // Return unchanged edge
    });
  }, [edges, hoveredEdge, clickedEdge, hoveredEdgeStyle, clickedEdgeStyle]);

  const onEdgeMouseEnter = useCallback((_: React.MouseEvent, edge: Edge) => {
    setHoveredEdge(edge.id);
  }, []);

  const onEdgeMouseLeave = useCallback(() => {
    setHoveredEdge(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    // Toggle clicked state - click again to deselect
    setClickedEdge(clickedEdge === edge.id ? null : edge.id);
  }, [clickedEdge]);

  const onDeleteEdge = useCallback((edgeId: string) => {
    onEdgesChange([{ type: 'remove', id: edgeId }]);
    setClickedEdge(null);
  }, [onEdgesChange]);

  // Handle double-click to delete selected edge
  const onEdgeDoubleClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    if (clickedEdge === edge.id) {
      onDeleteEdge(edge.id);
    }
  }, [clickedEdge, onDeleteEdge]);

  const onPaneClick = useCallback(() => {
    setClickedEdge(null);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={styledEdges} // Use styled edges instead of raw edges
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgeMouseEnter={onEdgeMouseEnter}
      onEdgeMouseLeave={onEdgeMouseLeave}
      onEdgeClick={onEdgeClick}
      onEdgeDoubleClick={onEdgeDoubleClick}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      defaultEdgeOptions={{
        type: 'default',
        style: baseEdgeStyle,
      }}
      fitViewOptions={{
        padding: 0.2,
        maxZoom: 1.5
      }}
      defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      connectOnClick={false}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default FlowchartEditor;