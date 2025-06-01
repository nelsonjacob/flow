import { useState, useEffect, useRef } from 'react';
import { measureTextWidth } from '../utils/flowchart/textMeasurement';

interface NodeDimensionsOptions {
  defaultWidth: number;
  defaultHeight: number;
  bufferSpace: number;
  initialWidth?: number;
  initialHeight?: number;
  onResize?: (id: string, width: number, height: number) => void;
  maxWidth?: number;
  maxHeight?: number;
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
  
  
  const [nodeWidth, setNodeWidth] = useState(Math.max(initialWidth || defaultWidth, defaultWidth));
  const [nodeHeight, setNodeHeight] = useState(Math.max(initialHeight || defaultHeight, defaultHeight));
  
  const [wasManuallyResized, setWasManuallyResized] = useState(false);
  const prevTextLengthRef = useRef(text.length);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (initialWidth && initialWidth !== nodeWidth) {
      setNodeWidth(Math.max(initialWidth, defaultWidth));
    }
    if (initialHeight && initialHeight !== nodeHeight) {
      setNodeHeight(Math.max(initialHeight, defaultHeight));
    }
  }, [initialWidth, initialHeight]);
  
  const autoResizeNode = (text: string) => {
    if (!textareaRef.current || !onResize) return;
    

    const scrollPosition = textareaRef.current.scrollTop;
    textareaRef.current.style.height = 'auto';
    
    const textWidth = measureTextWidth(text);
    const isDeleting = text.length < prevTextLengthRef.current;
    prevTextLengthRef.current = text.length;
    
    const calculatedWidth = Math.min(Math.max(textWidth + bufferSpace, defaultWidth), maxWidth);
    const scrollHeight = textareaRef.current.scrollHeight;
    
    // multiple lines has padding at the bottom for visual clarity (jumps from 24px to 32px)
    const hasMultipleLines = text.includes('\n'); // 24px = typical single line height
    const paddingAmount = hasMultipleLines ? 32 : 0; // Only add padding for multi-line content
    
    const calculatedHeight = Math.min(Math.max(scrollHeight + paddingAmount, defaultHeight), maxHeight);
    
    if (isDeleting) {
      // When deleting, allow node to shrink (but not below min size)
      if (calculatedWidth < nodeWidth || calculatedHeight < nodeHeight) {
        const newWidth = Math.max(calculatedWidth, defaultWidth);
        const newHeight = Math.max(calculatedHeight, defaultHeight);
        
        setNodeWidth(newWidth);
        setNodeHeight(newHeight);
        onResize(id, newWidth, newHeight);

        if (text.length < 5) {
          setWasManuallyResized(false);
        }
      }
    } else if (!wasManuallyResized) {
      if (calculatedWidth > nodeWidth || calculatedHeight > nodeHeight) {
        const newWidth = Math.min(calculatedWidth, maxWidth);
        const newHeight = Math.min(calculatedHeight, maxHeight);
        
        setNodeWidth(newWidth);
        setNodeHeight(newHeight);
        onResize(id, newWidth, newHeight);
      }
    }
    
    // Update textarea height to match content (subtract padding from available space)
    const availableTextareaHeight = Math.min(scrollHeight, maxHeight - paddingAmount);
    textareaRef.current.style.height = `${availableTextareaHeight}px`;
    
    if (textareaRef.current.scrollHeight > textareaRef.current.clientHeight) {
      textareaRef.current.scrollTop = scrollPosition;
    } else {
      textareaRef.current.scrollTop = 0;
    }
  };
  
  const handleManualResize = (width: number, height: number) => {
    setWasManuallyResized(true);

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