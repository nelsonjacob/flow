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
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleValue(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (titleValue.trim() === '') {
      setTitleValue('Untitled Flowchart');
      onTitleChange('Untitled Flowchart');
    } else {
      onTitleChange(titleValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitleValue(title);
    }
  };

  return (
    <div 
      className={`bg-white border border-grays-200 rounded-md shadow-sm px-3 py-2 ${className}`}
    >
      {isEditing ? (
        <div className="flex items-center border-b border-apptheme-green-flowchart">
          <input
            ref={inputRef}
            type="text"
            value={titleValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent w-full text-sm font-medium nodrag focus:outline-none py-0.5"
            style={{ minWidth: '150px' }}
            placeholder="Untitled Flowchart"
          />
        </div>
      ) : (
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={handleClick}
        >
          <span className="text-sm font-medium text-gray-700 truncate">
            {titleValue || 'Untitled Flowchart'}
          </span>
          <PencilIcon className="w-3.5 h-3.5 text-gray-400 hover:text-apptheme-green-flowchart transition-colors" />
        </div>
      )}
    </div>
  );
};

export default EditableTitle;