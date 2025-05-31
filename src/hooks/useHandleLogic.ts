// hooks/useHandleLogic.ts
import { useState, useMemo } from 'react';
import { useReactFlow } from 'reactflow';
import ColorUtils from '../utils/ui/ColorUtils';

interface UseHandleLogicProps {
  id: string;
  isHovered: boolean;
  isEditing: boolean;
  isDragging: boolean;
}

interface HandleStyle {
  width?: string;
  height?: string;
  borderRadius?: string;
  transition?: string;
  opacity?: number;
  pointerEvents?: 'auto' | 'none';
  backgroundColor?: string;
  border?: string;
}

interface UseHandleLogicReturn {
  getHandleStyle: (handleId: string) => HandleStyle;
  handleHandleMouseEnter: (handleId: string) => void;
  handleHandleMouseLeave: () => void;
  handleHandleMouseDown: (handleId: string) => void;
  handleHandleMouseUp: () => void;
  isHandleConnected: (handleId: string) => boolean;
  isHandleVisible: (handleId: string) => boolean;
}

export const useHandleLogic = ({
  isHovered, 
  isEditing, 
  isDragging 
}: UseHandleLogicProps): UseHandleLogicReturn => {
  const [hoveredHandle, setHoveredHandle] = useState<string | null>(null);
  const [clickedHandle, setClickedHandle] = useState<string | null>(null);
  const { getEdges } = useReactFlow();

  // Get the actual edges data for dependency
  const edges = getEdges();

  // Memoize connected handles to react to edge changes
  const connectedHandles = useMemo(() => {
    const connected = new Set<string>();
    edges.forEach(edge => {
      if (edge.sourceHandle) connected.add(edge.sourceHandle);
      if (edge.targetHandle) connected.add(edge.targetHandle);
    });
    return connected;
  }, [edges]); // Depend on the actual edges array

  const isHandleConnected = (handleId: string): boolean => {
    return connectedHandles.has(handleId);
  };

  const isHandleVisible = (handleId: string): boolean => {
    return isHandleConnected(handleId) || isHovered || isEditing || 
           hoveredHandle === handleId || clickedHandle === handleId || isDragging;
  };

  const getHandleStyle = (handleId: string): HandleStyle => {
    const baseStyle: HandleStyle = {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      transition: 'all 0.2s ease-in-out'
    };

    if (!isHandleVisible(handleId)) {
      return { 
        ...baseStyle, 
        opacity: 0,
        pointerEvents: 'none'
      };
    }

    // Priority order: clicked > hovered > connected > dragging > node hovered > editing
    if (clickedHandle === handleId || hoveredHandle === handleId || isHandleConnected(handleId)) {
      return {
        ...baseStyle,
        opacity: 1,
        pointerEvents: 'auto',
        backgroundColor: 'white',
        border: `2px solid ${ColorUtils.appthemeGreenFlowchart.default}`
      };
    }

    if (isHovered) {
      return {
        ...baseStyle,
        opacity: 1,
        pointerEvents: 'auto',
        width: '10px',
        height: '10px',
        backgroundColor: '#6B7280',
        border: 'none'
      };
    }

    // Default visible (editing)
    return {
      ...baseStyle,
      opacity: 1,
      pointerEvents: 'auto',
      backgroundColor: 'white',
      border: `2px solid ${ColorUtils.appthemeGreenFlowchart.default}`
    };
  };

  const handleHandleMouseEnter = (handleId: string): void => setHoveredHandle(handleId);
  const handleHandleMouseLeave = (): void => setHoveredHandle(null);
  const handleHandleMouseDown = (handleId: string): void => setClickedHandle(handleId);
  const handleHandleMouseUp = (): void => setClickedHandle(null);

  return {
    getHandleStyle,
    handleHandleMouseEnter,
    handleHandleMouseLeave,
    handleHandleMouseDown,
    handleHandleMouseUp,
    isHandleConnected,
    isHandleVisible
  };
};