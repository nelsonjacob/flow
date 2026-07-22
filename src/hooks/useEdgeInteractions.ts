import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import type { Edge, OnEdgesChange } from 'reactflow';
import type { FlowEdge } from '../flowchart/model';
import { themeColors } from '../theme/tokens';

export const BASE_EDGE_STYLE = {
  strokeWidth: 2,
  stroke: themeColors.flowchart.edge,
  transition: 'all 0.2s ease-in-out',
};

const HOVERED_EDGE_STYLE = {
  ...BASE_EDGE_STYLE,
  stroke: themeColors.flowchart.edgeHover,
  strokeDasharray: '8,4',
};

const CLICKED_EDGE_STYLE = {
  ...BASE_EDGE_STYLE,
  stroke: themeColors.status.error,
  strokeDasharray: '8,4',
};

export const styleInteractiveEdges = (
  edges: FlowEdge[],
  hoveredEdge: string | null,
  clickedEdge: string | null,
) => {
  if (!hoveredEdge && !clickedEdge) return edges;

  return edges.map((edge) => {
    const interactionStyle =
      clickedEdge === edge.id
        ? CLICKED_EDGE_STYLE
        : hoveredEdge === edge.id
          ? HOVERED_EDGE_STYLE
          : undefined;
    return interactionStyle
      ? { ...edge, style: { ...edge.style, ...interactionStyle } }
      : edge;
  });
};

export const useEdgeInteractions = (
  edges: FlowEdge[],
  onEdgesChange: OnEdgesChange,
) => {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [clickedEdge, setClickedEdge] = useState<string | null>(null);
  const styledEdges = useMemo(
    () => styleInteractiveEdges(edges, hoveredEdge, clickedEdge),
    [clickedEdge, edges, hoveredEdge],
  );

  const onEdgeMouseEnter = useCallback((_: MouseEvent, edge: Edge) => {
    setHoveredEdge(edge.id);
  }, []);
  const onEdgeMouseLeave = useCallback(() => setHoveredEdge(null), []);
  const onEdgeClick = useCallback((_: MouseEvent, edge: Edge) => {
    setClickedEdge((current) => (current === edge.id ? null : edge.id));
  }, []);
  const onDeleteEdge = useCallback(
    (edgeId: string) => {
      onEdgesChange([{ type: 'remove', id: edgeId }]);
      setClickedEdge(null);
    },
    [onEdgesChange],
  );
  const onEdgeDoubleClick = useCallback(
    (_: MouseEvent, edge: Edge) => {
      if (clickedEdge === edge.id) onDeleteEdge(edge.id);
    },
    [clickedEdge, onDeleteEdge],
  );
  const onPaneClick = useCallback(() => setClickedEdge(null), []);

  return {
    styledEdges,
    onEdgeMouseEnter,
    onEdgeMouseLeave,
    onEdgeClick,
    onEdgeDoubleClick,
    onPaneClick,
  };
};
