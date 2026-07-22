import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import type { NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { CompletionCheckbox } from './CompletionCheckbox';
import { NodeContent } from './NodeContent';
import { NodeHandles } from './NodeHandles';
import { useNodeDimensions } from '../../hooks/useNodeDimensions';
import { useHandleLogic } from '../../hooks/useHandleLogic';
import {
  DEFAULT_NODE_HEIGHT,
  DEFAULT_NODE_WIDTH,
  type FlowNodeData,
} from '../../flowchart/model';
import { useFlowchartNodeActions } from './useFlowchartNodeActions';
import { themeColors } from '../../theme/tokens';

const DEFAULT_WIDTH = DEFAULT_NODE_WIDTH;
const DEFAULT_HEIGHT = DEFAULT_NODE_HEIGHT;
const MAX_WIDTH = 400;
const MAX_HEIGHT = 300;
const BUFFER_SPACE = 60;

const RESIZER_HANDLE_STYLE = {
  width: 10,
  height: 10,
  borderRadius: 6,
  backgroundColor: themeColors.flowchart.accent,
  borderColor: 'white',
};

const RESIZER_LINE_STYLE = {
  borderWidth: 2,
  borderColor: themeColors.flowchart.accent,
  borderStyle: 'dashed',
};

const getNodeClasses = (isEditing: boolean, selected: boolean) => {
  const border = isEditing
    ? 'border-2'
    : selected
      ? 'border-2 border-apptheme-green-flowchart'
      : 'border border-grays-200';
  return `relative flex items-start rounded-xl bg-white shadow-md ${border} ${
    isEditing ? 'nodrag' : ''
  }`;
};

export function CustomNode({
  data,
  dragging,
  isConnectable,
  id,
  selected,
}: NodeProps<FlowNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [labelValue, setLabelValue] = useState(data.label || '');
  const { onLabelChange, onResize, onToggleComplete } = useFlowchartNodeActions();

  useEffect(() => {
    setLabelValue(data.label || '');
  }, [data.label]);
  
  const {
    nodeWidth,
    nodeHeight,
    textareaRef,
    handleManualResize
  } = useNodeDimensions(id, labelValue, {
    defaultWidth: DEFAULT_WIDTH,
    defaultHeight: DEFAULT_HEIGHT,
    maxWidth: MAX_WIDTH,
    maxHeight: MAX_HEIGHT,
    bufferSpace: BUFFER_SPACE,
    initialWidth: data.width,
    initialHeight: data.height,
    onResize,
  });

  const {
    getHandleStyle,
    handleHandleMouseEnter,
    handleHandleMouseLeave,
    handleHandleMouseDown,
    handleHandleMouseUp,
  } = useHandleLogic({
    id,
    isHovered,
    isEditing,
    isDragging: dragging,
  });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleDoubleClick = () => setIsEditing(true);

  const handleChange = (newValue: string) => {
    setLabelValue(newValue);
  };

  const { completed } = data;

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onLabelChange(id, labelValue);
  }, [id, labelValue, onLabelChange]);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  const handleToggleComplete = useCallback(() => {
    onToggleComplete(id, !completed);
  }, [completed, id, onToggleComplete]);

  const nodeClasses = getNodeClasses(isEditing, selected);

  return (
    <>
      <NodeResizer
        minWidth={DEFAULT_WIDTH}
        minHeight={DEFAULT_HEIGHT}
        maxWidth={MAX_WIDTH}
        maxHeight={MAX_HEIGHT}
        isVisible={isEditing}
        handleStyle={RESIZER_HANDLE_STYLE}
        lineStyle={RESIZER_LINE_STYLE}
        onResize={(_, { width, height }) => handleManualResize(width, height)}
      />
      <div
        className={nodeClasses}
        style={{ width: `${nodeWidth}px`, height: `${nodeHeight}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NodeHandles
          nodeId={id}
          isConnectable={isConnectable}
          isEditing={isEditing}
          getHandleStyle={getHandleStyle}
          onMouseEnter={handleHandleMouseEnter}
          onMouseLeave={handleHandleMouseLeave}
          onMouseDown={handleHandleMouseDown}
          onMouseUp={handleHandleMouseUp}
        />

        <CompletionCheckbox
          completed={completed}
          isNodeHovered={isHovered || selected}
          onToggleComplete={handleToggleComplete}
        />
        <NodeContent
          isEditing={isEditing}
          labelValue={labelValue}
          onLabelChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          textareaRef={textareaRef}
          onStartEditing={handleDoubleClick}
        />
      </div>
    </>
  );
}
