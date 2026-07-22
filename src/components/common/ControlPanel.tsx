import {
  PlusIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ControlButton } from './ControlButton';

interface ControlPanelProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onClearChart: () => void;
  onHelpGuide: () => void;
}

export function ControlPanel({
  onAddNode,
  onDeleteNode,
  onClearChart,
  onHelpGuide,
}: ControlPanelProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-xl border border-grays-200 bg-white/90 p-3 shadow-lg backdrop-blur-md">
        <ControlButton
          label="Add task"
          onClick={onAddNode}
          icon={<PlusIcon aria-hidden="true" className="h-5 w-5" />}
        />
        <div aria-hidden="true" className="mx-1 h-7 w-px bg-grays-300" />
        <ControlButton
          label="Delete selected tasks"
          onClick={onDeleteNode}
          icon={<XMarkIcon aria-hidden="true" className="h-5 w-5" />}
          variant="remove"
        />
        <ControlButton
          label="Clear chart"
          onClick={onClearChart}
          icon={<TrashIcon aria-hidden="true" className="h-5 w-5" />}
          variant="remove"
        />
        <div aria-hidden="true" className="mx-1 h-7 w-px bg-grays-300" />
        <ControlButton
          label="Open help"
          onClick={onHelpGuide}
          icon={<QuestionMarkCircleIcon aria-hidden="true" className="h-5 w-5" />}
          variant="help"
        />
      </div>
    </div>
  );
}
