import React from 'react';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ControlButton from './ControlButton';


interface ControlPanelProps {
  onAddNode: () => void;
  onDeleteNode: () => void;
  onClearChart: () => void;
}

/**
 * Control panel for flowchart operations like adding and deleting nodes
 */
const ControlPanel: React.FC<ControlPanelProps> = ({
  onAddNode,
  onDeleteNode,
  onClearChart
}) => {
  

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div className="
        flex items-center gap-2 p-3 
        bg-white/90
        backdrop-blur-md 
        rounded-xl 
        border border-grays-200
        shadow-lg
      ">
        <ControlButton
          onClick={onAddNode}
          icon={<PlusIcon className="w-5 h-5" />}
        />
        <div className="w-px h-7 bg-grays-300 mx-1"></div>
        
        <ControlButton
          onClick={onDeleteNode}
          icon={<XMarkIcon className="w-5 h-5" />}
        />

        <ControlButton
          onClick={onClearChart}
          icon={<TrashIcon className="w-5 h-5" />}
        />
      </div>
    </div>
  );
};

export default ControlPanel;