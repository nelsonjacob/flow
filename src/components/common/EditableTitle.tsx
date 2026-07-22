import { PencilIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

interface EditableTitleProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  className?: string;
}

const DEFAULT_TITLE = 'Untitled Flowchart';

export function EditableTitle({
  title,
  onTitleChange,
  className = '',
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setTitleValue(title), [title]);
  useEffect(() => {
    if (!isEditing) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  const saveTitle = () => {
    setIsEditing(false);
    const finalTitle = titleValue.trim() === '' ? DEFAULT_TITLE : titleValue;
    if (finalTitle !== title) onTitleChange(finalTitle);
    setTitleValue(finalTitle);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveTitle();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setTitleValue(title);
    }
  };

  return (
    <div className={`rounded-md border border-grays-200 bg-white px-3 py-2 shadow-sm ${className}`}>
      {isEditing ? (
        <div className="flex items-center border-b border-apptheme-green-flowchart">
          <input
            ref={inputRef}
            type="text"
            aria-label="Flowchart title"
            value={titleValue}
            onChange={(event) => setTitleValue(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleKeyDown}
            className="nodrag w-full min-w-36 bg-transparent py-0.5 text-xl font-semibold focus:outline-none"
            placeholder={DEFAULT_TITLE}
          />
        </div>
      ) : (
        <button
          type="button"
          className="flex max-w-full items-center gap-2 text-left"
          onClick={() => setIsEditing(true)}
          aria-label={`Edit flowchart title: ${titleValue || DEFAULT_TITLE}`}
        >
          <span className="truncate text-xl font-semibold text-gray-800">
            {titleValue || DEFAULT_TITLE}
          </span>
          <PencilIcon
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-colors hover:text-apptheme-green-flowchart"
          />
        </button>
      )}
    </div>
  );
}
