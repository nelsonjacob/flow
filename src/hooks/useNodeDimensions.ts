import { useState, useEffect, useRef } from 'react';
import { measureTextWidth } from '../utils/flowchart/textMeasurement';

interface NodeDimensionsOptions {
  defaultWidth: number;
  defaultHeight: number;
  bufferSpace: number;
  initialWidth?: number;
  initialHeight?: number;
  onResize?: (id: string, width: number, height: number) => void;
  maxWidth?: number;  // Added max constraints
  maxHeight?: number; // Added max constraints
}

export const useNodeDimensions = (id: string, text: string, options: NodeDimensionsOptions) => {
  const { 
    defaultWidth, 
    defaultHeight, 
    bufferSpace, 
    initialWidth, 
    initialHeight,
    onResize,
    maxWidth = 500,    // Default max width
    maxHeight = 400    // Default max height
  } = options;
  
  // Use dimensions from props or defaults, never smaller than defaults
  const [nodeWidth, setNodeWidth] = useState(Math.max(initialWidth || defaultWidth, defaultWidth));
  const [nodeHeight, setNodeHeight] = useState(Math.max(initialHeight || defaultHeight, defaultHeight));
  
  // Track if node was manually resized
  const [wasManuallyResized, setWasManuallyResized] = useState(false);
  
  // Track previous text length to detect deletions
  const prevTextLengthRef = useRef(text.length);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update dimensions when props change (for loading saved flowcharts)
  useEffect(() => {
    if (initialWidth && initialWidth !== nodeWidth) {
      setNodeWidth(Math.max(initialWidth, defaultWidth));
    }
    if (initialHeight && initialHeight !== nodeHeight) {
      setNodeHeight(Math.max(initialHeight, defaultHeight));
    }
  }, [initialWidth, initialHeight]);
  
  // Auto-resize based on content
  const autoResizeNode = (text: string) => {
    if (!textareaRef.current || !onResize) return;
    
    // Store current scroll position
    const scrollPosition = textareaRef.current.scrollTop;
    
    // Reset textarea height to get accurate scrollHeight measurement
    textareaRef.current.style.height = 'auto';
    
    // Measure content dimensions
    const textWidth = measureTextWidth(text);
    
    // Check if text was deleted
    const isDeleting = text.length < prevTextLengthRef.current;
    prevTextLengthRef.current = text.length;
    
    // Calculate dimensions but respect minimums and maximums
    const calculatedWidth = Math.min(Math.max(textWidth + bufferSpace, defaultWidth), maxWidth);
    
    // Get scrollHeight for height calculation (accounts for line wrapping)
    const scrollHeight = textareaRef.current.scrollHeight;
    const calculatedHeight = Math.min(Math.max(scrollHeight + 24, defaultHeight), maxHeight);
    
    // Update dimensions based on content changes and resize status
    if (isDeleting) {
      // When deleting, allow node to shrink (but not below min size)
      if (calculatedWidth < nodeWidth || calculatedHeight < nodeHeight) {
        const newWidth = Math.max(calculatedWidth, defaultWidth);
        const newHeight = Math.max(calculatedHeight, defaultHeight);
        
        setNodeWidth(newWidth);
        setNodeHeight(newHeight);
        onResize(id, newWidth, newHeight);
        
        // If deleting everything or nearly everything, reset the manually resized flag
        if (text.length < 5) {
          setWasManuallyResized(false);
        }
      }
    } else if (!wasManuallyResized) {
      // When adding text and not manually resized, allow node to grow
      if (calculatedWidth > nodeWidth || calculatedHeight > nodeHeight) {
        const newWidth = Math.min(calculatedWidth, maxWidth);
        const newHeight = Math.min(calculatedHeight, maxHeight);
        
        setNodeWidth(newWidth);
        setNodeHeight(newHeight);
        onResize(id, newWidth, newHeight);
      }
    }
    
    // Update textarea height to match content
    textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight - 24)}px`;
    
    // Restore the scroll position if content overflows
    if (textareaRef.current.scrollHeight > textareaRef.current.clientHeight) {
      textareaRef.current.scrollTop = scrollPosition;
    } else {
      // If no overflow, scroll to top
      textareaRef.current.scrollTop = 0;
    }
  };
  
  // Handle manual resize
  const handleManualResize = (width: number, height: number) => {
    // Set flag that user manually resized this node
    setWasManuallyResized(true);
    
    // Enforce minimum and maximum sizes
    const newWidth = Math.min(Math.max(width, defaultWidth), maxWidth);
    const newHeight = Math.min(Math.max(height, defaultHeight), maxHeight);
    
    if (onResize) {
      setNodeWidth(newWidth);
      setNodeHeight(newHeight);
      onResize(id, newWidth, newHeight);
    }
  };
  
  return {
    nodeWidth,
    nodeHeight,
    wasManuallyResized,
    textareaRef,
    autoResizeNode,
    handleManualResize
  };
};