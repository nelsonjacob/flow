import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import CompletionCheckbox from './CompletionCheckbox';
import NodeContent from './NodeContent';
import { useNodeDimensions } from '../../hooks/useNodeDimensions';
import ColorUtils from '../../utils/ui/ColorUtils';
import { useHandleLogic } from '../../hooks/useHandleLogic';

interface CustomNodeData {
  label: string;
  completed?: boolean;
  completedAt?: Date;
  width?: number;
  height?: number;
  isDragging?: boolean;
  onLabelChange?: (id: string, newLabel: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
  onToggleComplete?: (id: string, completed: boolean) => void;
}

const DEFAULT_WIDTH = 160;
const DEFAULT_HEIGHT = 80;
const MAX_WIDTH = 400;
const MAX_HEIGHT = 300;
const BUFFER_SPACE = 60;

const HANDLE_POSITIONS = [
  { type: 'source', position: Position.Top, id: 'top-center' },
  { type: 'source', position: Position.Right, id: 'right-center' },
  { type: 'source', position: Position.Bottom, id: 'bottom-center' },
  { type: 'source', position: Position.Left, id: 'left-center' }
];

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, isConnectable, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [labelValue, setLabelValue] = useState(data.label || '');
  
  useEffect(() => {
    setLabelValue(data.label || '');
  }, [data.label]);
  
  const {
    nodeWidth,
    nodeHeight,
    wasManuallyResized,
    textareaRef,
    autoResizeNode,
    handleManualResize,
    finalizeSize
  } = useNodeDimensions(id, labelValue, {
    defaultWidth: DEFAULT_WIDTH,
    defaultHeight: DEFAULT_HEIGHT,
    maxWidth: MAX_WIDTH,
    maxHeight: MAX_HEIGHT,
    bufferSpace: BUFFER_SPACE,
    initialWidth: data.width,
    initialHeight: data.height,
    onResize: data.onResize
  });
  
  // Extract all handle logic to custom hook
  const {
    getHandleStyle,
    handleHandleMouseEnter,
    handleHandleMouseLeave,
    handleHandleMouseDown,
    handleHandleMouseUp
  } = useHandleLogic({
    id,
    isHovered,
    isEditing,
    isDragging: data.isDragging || false
  });

  // Node event handlers
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleDoubleClick = () => setIsEditing(true);

  const handleChange = (newValue: string) => {
    setLabelValue(newValue);
    if (!wasManuallyResized) autoResizeNode(newValue);
  };

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (data.onLabelChange) data.onLabelChange(id, labelValue);
    finalizeSize(labelValue);
  }, [id, labelValue, data, finalizeSize]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  const handleToggleComplete = useCallback(() => {
    if (data.onToggleComplete) {
      data.onToggleComplete(id, !data.completed);
    }
  }, [data.onToggleComplete, id, data.completed]);

  const nodeClasses = `bg-white rounded-xl shadow-md flex items-start relative
    ${isEditing 
      ? 'border-2' 
      : selected
        ? 'border-2 border-apptheme-green-flowchart' 
        : 'border border-grays-200'   
    }
    ${isEditing ? 'nodrag' : ''}`;

  return (
    <>
      <NodeResizer 
        minWidth={DEFAULT_WIDTH}
        minHeight={DEFAULT_HEIGHT}
        maxWidth={MAX_WIDTH}
        maxHeight={MAX_HEIGHT}
        isVisible={isEditing}
        handleStyle={{
          width: 10,
          height: 10,
          borderRadius: 6,
          backgroundColor: ColorUtils.appthemeGreenFlowchart.default,
          borderColor: 'white',
        }}
        lineStyle={{
          borderWidth: 2,
          borderColor: ColorUtils.appthemeGreenFlowchart.default,
          borderStyle: 'dashed'
        }}
        onResize={(_, { width, height }) => {
          handleManualResize(width, height);
        }}
      />
      
      <div 
        className={nodeClasses}
        style={{ width: `${nodeWidth}px`, height: `${nodeHeight}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Render handles dynamically */}
        {HANDLE_POSITIONS.map(({ type, position, id: handleId }) => {
          const fullHandleId = `${id}-${handleId}`;
          return (
            <Handle
              key={fullHandleId}
              type={type as any}
              position={position}
              id={fullHandleId}
              isConnectable={isConnectable && !isEditing}
              style={getHandleStyle(fullHandleId)}
              onMouseEnter={() => handleHandleMouseEnter(fullHandleId)}
              onMouseLeave={handleHandleMouseLeave}
              onMouseDown={() => handleHandleMouseDown(fullHandleId)}
              onMouseUp={handleHandleMouseUp}
            />
          );
        })}

        <CompletionCheckbox
          completed={data.completed || false}
          isNodeHovered={selected}
          onToggleComplete={handleToggleComplete}
        />
        <NodeContent
          isEditing={isEditing}
          labelValue={labelValue}
          onLabelChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          textareaRef={textareaRef}
          onDoubleClick={handleDoubleClick}
        />
      </div>
    </>
  );
};

export default CustomNode;