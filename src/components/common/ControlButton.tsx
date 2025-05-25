import React from 'react';

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
}

/**
 * A reusable control button component for flowchart operations
 */
const ControlButton: React.FC<ControlButtonProps> = ({
  onClick,
  icon
}) => {
  // Base classes that are always applied
  const baseClasses = [
    'flex items-center justify-center',
    'w-10 h-10 rounded-lg',
    'transition-all duration-200 ease-in-out'
  ];

  // Classes that depend on props
  const stateClasses = 'hover:scale-105 active:scale-95';

  // Style classes (primary vs secondary)
  const styleClasses = "bg-white text-grays-700 border border-grays-200 hover:border-apptheme-green-flowchart";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses.join(' ')} ${stateClasses} ${styleClasses}`}
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)'
      }}
    >
      {icon}
    </button>
  );
};

export default ControlButton; 