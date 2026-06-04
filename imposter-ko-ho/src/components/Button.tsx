import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  size?: 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-2xl no-tap-highlight focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95';
  
  const variants = {
    primary: 'bg-game-primary text-white shadow-sm shadow-game-primary/20 hover:shadow-md hover:shadow-game-primary/30 hover:bg-opacity-90 active:bg-opacity-100',
    secondary: 'bg-white text-game-text shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 active:bg-gray-50',
    danger: 'bg-game-danger text-white shadow-sm shadow-game-danger/20 hover:shadow-md hover:shadow-game-danger/30 hover:bg-opacity-90 active:bg-opacity-100',
    ghost: 'bg-transparent text-gray-500 hover:text-game-text hover:bg-gray-100 active:bg-gray-200',
  };

  const sizes = {
    md: 'px-4 py-3 min-h-[48px] text-base',
    lg: 'px-6 py-4 min-h-[56px] text-lg',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
