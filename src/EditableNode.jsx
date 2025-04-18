// EditableNode.jsx
import React, { useState, useRef, useEffect, memo } from 'react';
import { Handle, Position } from 'reactflow';

const EditableNode = memo(({ id, data, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeText, setNodeText] = useState(data.label);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);
  const contentRef = useRef(null);
  
  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);
  
  // Update local text when data.label changes externally
  useEffect(() => {
    setNodeText(data.label);
  }, [data.label]);
  
  // Handle document clicks to exit edit mode
  useEffect(() => {
    if (isEditing) {
      const handleClickOutside = (e) => {
        if (nodeRef.current && !nodeRef.current.contains(e.target)) {
          saveChanges();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, nodeText]);
  
  const saveChanges = () => {
    if (data.label !== nodeText) {
      data.onNodeUpdate(id, nodeText);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveChanges();
    } else if (e.key === 'Escape') {
      setNodeText(data.label);
      setIsEditing(false);
    }
  };
  
  // Handle double-click specifically for editing
  const handleDoubleClick = (e) => {
    // Don't activate editing when clicking on handles
    if (e.target.classList.contains('react-flow__handle')) {
      return;
    }
    
    if (!isEditing) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };
  
  // Common handle style
  const handleStyle = {
    background: '#555',
    width: '8px',
    height: '8px',
  };
  
  return (
    <div 
      ref={nodeRef}
      style={{
        background: 'white',
        boxShadow: isEditing 
          ? '0 8px 20px rgba(0,0,0,0.25)' 
          : '0 3px 6px rgba(0,0,0,0.12)',
        borderRadius: '8px',
        padding: '16px',
        minWidth: 180,
        minHeight: 60,
        position: 'relative',
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'all 0.2s ease',
        border: isEditing ? '2px solid #4299e1' : '1px solid #e2e8f0',
      }}
      onDoubleClick={handleDoubleClick}
      // Remove the onClick and nodrag class from here
    >
      {/* Top handle */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        isConnectable={isConnectable}
        style={{ ...handleStyle }}
      />
      
      {/* Bottom handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        isConnectable={isConnectable}
        style={{ ...handleStyle }}
      />
      
      {/* Left handle */}
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        style={{ ...handleStyle }}
      />
      
      {/* Right handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        style={{ ...handleStyle }}
      />
      
      <div ref={contentRef}>
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="nodrag" // Only apply nodrag to the textarea
            value={nodeText}
            onChange={(e) => setNodeText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveChanges}
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
            style={{
              width: '100%',
              minHeight: '50px',
              padding: '0',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '14px',
              lineHeight: '1.5',
              fontFamily: 'inherit',
              color: '#2d3748',
            }}
          />
        ) : (
          <div 
            style={{ 
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#2d3748',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {data.label}
          </div>
        )}
      </div>
    </div>
  );
});

export default EditableNode;