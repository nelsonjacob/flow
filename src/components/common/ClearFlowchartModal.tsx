import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef } from 'react';

interface ClearFlowchartModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ClearFlowchartModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ClearFlowchartModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) cancelButtonRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clear-flowchart-title"
        aria-describedby="clear-flowchart-message"
        className="relative w-full max-w-sm rounded-xl border border-grays-100 bg-white shadow-2xl"
      >
        <div className="p-6 text-left">
          <h2
            id="clear-flowchart-title"
            className="relative mb-3 pl-8 text-lg font-semibold text-grays-900"
          >
            <ExclamationTriangleIcon
              aria-hidden="true"
              className="absolute left-0 top-0 h-6 w-6 text-status-error"
            />
            {title}
          </h2>
          <p id="clear-flowchart-message" className="text-sm text-grays-600">
            {message}
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t border-grays-100 px-6 py-4">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="rounded-md bg-grays-200 px-3 py-1.5 font-medium text-grays-700 transition-colors hover:bg-grays-300"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-status-error px-3 py-1.5 font-medium text-white transition-colors hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
