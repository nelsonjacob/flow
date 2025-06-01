import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ClearFlowChartModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ClearFlowChartModal: React.FC<ClearFlowChartModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl border border-grays-100 max-w-sm w-full">
        <div className="p-6">
          <div className="text-left">
          <h3 className="relative pl-8 text-lg font-semibold text-grays-900 mb-3">
            <ExclamationTriangleIcon className="absolute left-0 top-0 w-6 h-6 text-status-error" />
            {title}
          </h3>
          <p className="text-grays-600 text-sm">
            {message}
          </p>
          </div>
        </div>
        
        <div className="border-t border-grays-100 px-6 py-4 flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-grays-700 bg-grays-200 hover:bg-grays-300 rounded-md transition-colors font-medium width"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="px-3 py-1.5 rounded-md transition-colors font-medium text-white bg-status-error hover:bg-red-600"
        >
          {confirmText}
        </button>
        </div>
      </div>
    </div>
  );
};

export default ClearFlowChartModal;