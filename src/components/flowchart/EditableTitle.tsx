import React, { useState, useEffect, useRef } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

interface EditableTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  className?: string;
}

const EditableTitle: React.FC<EditableTitleProps> = ({
  title,
  onTitleChange,
  className = ''
}) => {
  // Constants
  const DEFAULT_TITLE = 'Untitled Flowchart';
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Effects
  useEffect(() => {
    setTitleValue(title);
  }, [title]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  // Event handlers
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    
    const finalTitle = titleValue.trim() === '' ? DEFAULT_TITLE : titleValue;
    if (finalTitle !== title) {
      onTitleChange(finalTitle);
    }
    
    setTitleValue(finalTitle);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitleValue(title); // Restore original value
    }
  };
  
  // Main component structure
  return (
    <div className={`bg-white border border-grays-200 rounded-md shadow-sm px-3 py-2 ${className}`}>
      {isEditing ? (
        // Edit mode
        <div className="flex items-center border-b border-apptheme-green-flowchart">
          <input
            ref={inputRef}
            type="text"
            value={titleValue}
            onChange={handleInputChange}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="bg-transparent w-full text-sm font-medium nodrag focus:outline-none py-0.5"
            style={{ minWidth: '150px' }}
            placeholder={DEFAULT_TITLE}
          />
        </div>
      ) : (
        // Display mode
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={handleStartEditing}
        >
          <span className="text-sm font-medium text-gray-700 truncate">
            {titleValue || DEFAULT_TITLE}
          </span>
          <PencilIcon className="w-3.5 h-3.5 text-gray-400 hover:text-apptheme-green-flowchart transition-colors" />
        </div>
      )}
    </div>
  );
};

export default EditableTitle;