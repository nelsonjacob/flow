import React from 'react';

type ButtonVariant = 'default' | 'remove' | 'help';
interface ControlButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  variant?: ButtonVariant;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  onClick,
  icon,
  variant = 'default'
}) => {
  const baseClasses = [
    'flex items-center justify-center',
    'w-10 h-10 rounded-lg',
    'transition-all duration-200 ease-in-out'
  ];
  
  const stateClasses = 'hover:scale-105 active:scale-95';
  
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'hover:border-apptheme-green-flowchart hover:bg-green-50 hover:text-apptheme-green-flowchart',
    remove: 'hover:border-status-error hover:bg-red-50 hover:text-status-error',
    help: 'hover:border-status-info hover:bg-blue-50 hover:text-status-info'
  };
  
  const styleClasses = `bg-white text-grays-700 border border-grays-200 ${variantStyles[variant]}`;
  
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