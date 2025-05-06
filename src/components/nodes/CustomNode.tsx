import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import NodeContent from './NodeContent';
import { useNodeDimensions } from '../../hooks/useNodeDimensions';
import ColorUtils from '../../utils/ui/ColorUtils';

interface CustomNodeData {
  label: string;
  width?: number;
  height?: number;
  onLabelChange?: (id: string, newLabel: string) => void;
  onResize?: (id: string, width: number, height: number) => void;
}

// Update color references
const handleColor = ColorUtils.appthemeGreenFlowchart.default;
const DEFAULT_WIDTH = 160;
const DEFAULT_HEIGHT = 80;
const MAX_WIDTH = 400;
const MAX_HEIGHT = 300;
const BUFFER_SPACE = 60;

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, isConnectable, id, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelValue, setLabelValue] = useState(data.label || '');
  
  // Update labelValue when data.label changes
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
  

  /* handle functions */
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
    /* Needed to add the new line when shift + enter is pressed */
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  /* styles */
  const nodeClasses = `bg-white rounded-xl shadow-md flex items-start relative
    ${isEditing 
      ? 'border-2' // Gray border when editing
      : selected
        ? 'border-2 border-apptheme-green-flowchart' // App theme border when selected but not editing
        : 'border border-grays-200'   // Light border when not selected or editing
    }
    ${isEditing ? 'nodrag' : ''}`;

  const handleBaseStyle = {
    width: '12px',
    height: '12px'
  };

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
      >
        <Handle
          type="source"
          position={Position.Top}
          id={`${id}-top-center`}
          isConnectable={isConnectable && !isEditing}
          style={{
            ...handleBaseStyle,
            backgroundColor: handleColor
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-right-center`}
          isConnectable={isConnectable && !isEditing}
          style={{
            ...handleBaseStyle,
            backgroundColor: handleColor
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-bottom-center`}
          isConnectable={isConnectable && !isEditing}
          style={{
            ...handleBaseStyle,
            backgroundColor: handleColor
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id={`${id}-left-center`}
          isConnectable={isConnectable && !isEditing}
          style={{
            ...handleBaseStyle,
            backgroundColor: handleColor
          }}
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