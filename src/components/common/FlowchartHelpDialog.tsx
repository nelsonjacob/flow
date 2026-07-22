import { XMarkIcon } from '@heroicons/react/24/outline';

interface FlowchartHelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { label: 'Add new task', key: 'Ctrl/Cmd + N' },
  { label: 'Remove selected task', key: 'Delete / Backspace' },
];

export function FlowchartHelpDialog({
  isOpen,
  onClose,
}: FlowchartHelpDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-guide-title"
        className="mx-4 w-full max-w-2xl rounded-t-xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b p-6">
          <h2 id="help-guide-title" className="text-2xl font-bold">
            Help Guide
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            aria-label="Close help"
          >
            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
          </button>
        </header>
        <section className="m-6 rounded-lg border border-blue-100 bg-blue-50 p-6">
          <h3 className="mb-3 font-semibold text-blue-900">Keyboard Shortcuts</h3>
          {shortcuts.map(({ label, key }) => (
            <div key={key} className="flex items-center justify-between py-1">
              <span>{label}</span>
              <kbd className="rounded border bg-white px-3 py-1 font-mono text-sm shadow-sm">
                {key}
              </kbd>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
