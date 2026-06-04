import React from 'react';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral',
  className = '',
  icon
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-game-primary/10 text-game-primary border-game-primary/20';
      case 'success':
        return 'bg-game-success/10 text-game-success border-game-success/20';
      case 'danger':
        return 'bg-game-danger/10 text-game-danger border-game-danger/20';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${getVariantClasses()} ${className}`}>
      {icon && <span className="text-base leading-none">{icon}</span>}
      {children}
    </span>
  );
};
