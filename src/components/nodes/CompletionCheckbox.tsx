import { CheckIcon } from '@heroicons/react/24/outline';
import React, {useState} from 'react';

interface CompletionCheckboxProps {
    completed: boolean;
    isNodeHovered: boolean;

    onToggleComplete: () => void;

};



const CompletionCheckbox: React.FC<CompletionCheckboxProps> = ({
    completed,
    isNodeHovered,
    onToggleComplete
}) => {
    const shouldShowNode = completed || isNodeHovered;
    if (!shouldShowNode) {
        return null;
    }

    return (
        <div className="absolute top-2 right-2 z-10">
            <button
                onClick={onToggleComplete}
                className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center
                    transition-all duration-200 ease-in-out
                    hover:scale-110 active:scale-95
                    ${completed 
                        ? 'bg-apptheme-green-flowchart border-apptheme-green-flowchart text-white shadow-sm' 
                        : 'border-grays-300 hover:border-apptheme-green-flowchart hover:bg-apptheme-green-flowchart/5'
                    }
                `}
            >
                {completed && <CheckIcon className="w-3 h-3" />}
            </button>
        </div>
    );
};




export default CompletionCheckbox;