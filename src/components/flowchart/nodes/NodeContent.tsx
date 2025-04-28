import React, { useEffect } from 'react';

interface NodeContentProps {
  isEditing: boolean;
  labelValue: string;
  onLabelChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onDoubleClick: () => void;
}

const NodeContent: React.FC<NodeContentProps> = ({
  isEditing,
  labelValue,
  onLabelChange,
  onBlur,
  onKeyDown,
  textareaRef,
  onDoubleClick
}) => {
  // Adjust textarea height when entering edit mode or when labelValue changes
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      // Store current scroll position
      const scrollPosition = textareaRef.current.scrollTop;
      
      // Reset height before measuring
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight to fit content (but limit to parent container)
      const parentHeight = textareaRef.current.parentElement?.clientHeight || 0;
      const maxHeight = parentHeight - 16; // Account for padding
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
      
      // Restore scroll position
      textareaRef.current.scrollTop = scrollPosition;
    }
  }, [isEditing, labelValue, textareaRef]);

  return (
    <div className="pl-4 pt-4 pr-4 w-full h-full flex flex-col items-start" onDoubleClick={onDoubleClick}>
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={labelValue}
          onChange={(e) => onLabelChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder=""
          className="text-lg focus:outline-none bg-transparent nodrag w-full resize-none overflow-auto"
          style={{ 
            height: 'auto',
            maxHeight: 'calc(100% - 16px)'
          }}
          autoFocus
        />
      ) : (
        <div className="text-lg text-gray-800 w-full min-h-8 whitespace-pre-wrap overflow-auto" 
             style={{ maxHeight: 'calc(100% - 16px)' }}>
          {labelValue || <span className="text-gray-400 italic">Add a task!</span>}
        </div>
      )}
    </div>
  );
};

export default NodeContent;