import type { KeyboardEvent, RefObject } from 'react';

interface NodeContentProps {
  isEditing: boolean;
  labelValue: string;
  onLabelChange: (value: string) => void;
  onBlur: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onStartEditing: () => void;
}

export function NodeContent({
  isEditing,
  labelValue,
  onLabelChange,
  onBlur,
  onKeyDown,
  textareaRef,
  onStartEditing,
}: NodeContentProps) {
  return (
    <div
      className="flex h-full w-full flex-col items-start p-4"
      onDoubleClick={onStartEditing}
    >
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={labelValue}
          onChange={(event) => onLabelChange(event.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          aria-label="Task label"
          className="nodrag w-full resize-none overflow-auto bg-transparent text-xl focus:outline-none"
          style={{ height: 'auto', maxHeight: 'calc(100% - 16px)' }}
          autoFocus
        />
      ) : (
        <div
          className="min-h-8 w-full overflow-auto whitespace-pre-wrap text-left text-xl font-normal text-gray-800"
          style={{ maxHeight: 'calc(100% - 16px)' }}
        >
          {labelValue || <span className="italic text-gray-500">Add a task!</span>}
        </div>
      )}
    </div>
  );
}
