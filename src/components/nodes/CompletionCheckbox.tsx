import { CheckIcon } from '@heroicons/react/24/outline';

interface CompletionCheckboxProps {
  completed: boolean;
  isNodeHovered: boolean;
  onToggleComplete: () => void;
}

export function CompletionCheckbox({
  completed,
  isNodeHovered,
  onToggleComplete,
}: CompletionCheckboxProps) {
  if (!completed && !isNodeHovered) return null;

  return (
    <div className="absolute right-2 top-2 z-10">
      <button
        type="button"
        onClick={onToggleComplete}
        aria-label={completed ? 'Mark task incomplete' : 'Mark task complete'}
        aria-pressed={completed}
        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 ${
          completed
            ? 'border-apptheme-green-flowchart bg-apptheme-green-flowchart text-white shadow-sm'
            : 'border-grays-300 hover:border-apptheme-green-flowchart hover:bg-apptheme-green-flowchart/5'
        }`}
      >
        {completed && <CheckIcon aria-hidden="true" className="h-3 w-3" />}
      </button>
    </div>
  );
}
