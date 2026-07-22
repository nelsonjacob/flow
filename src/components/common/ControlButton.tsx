import type { ReactNode } from 'react';

type ButtonVariant = 'default' | 'remove' | 'help';

interface ControlButtonProps {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'hover:border-apptheme-green-flowchart hover:bg-green-50 hover:text-apptheme-green-flowchart',
  remove: 'hover:border-status-error hover:bg-red-50 hover:text-status-error',
  help: 'hover:border-status-info hover:bg-blue-50 hover:text-status-info',
};

export function ControlButton({
  label,
  onClick,
  icon,
  variant = 'default',
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border border-grays-200 bg-white text-grays-700 shadow-sm transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 ${variantStyles[variant]}`}
    >
      {icon}
    </button>
  );
}
