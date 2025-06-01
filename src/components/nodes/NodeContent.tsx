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
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const scrollPosition = textareaRef.current.scrollTop;
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight to fit content (but limit to parent container)
      const parentHeight = textareaRef.current.parentElement?.clientHeight || 0;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, parentHeight)}px`;
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
          className="text-xl focus:outline-none bg-transparent nodrag w-full resize-none overflow-auto"
          style={{ 
            height: 'auto',
            maxHeight: 'calc(100%px)'
          }}
          autoFocus
        />
      ) : (
        <div className="text-xl text-gray-800 font-normal w-full min-h-8 whitespace-pre-wrap overflow-auto" 
             style={{ maxHeight: 'calc(100%px)' }}>
          {labelValue || <span className="text-gray-500 italic">Add a task!</span>}
        </div>
      )}
    </div>
  );
};

export default NodeContent;