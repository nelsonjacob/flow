import React from 'react';

interface ButtonProps {
    title: string;
    onClick: () => void;
    className?: string;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ title, onClick, className, icon }) => {
    return (
        <button onClick={onClick} className={className}>
            {icon}
            {title}
        </button>
    );
};

export default Button;