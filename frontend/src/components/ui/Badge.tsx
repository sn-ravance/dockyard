import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-gray-600 text-gray-200',
      success: 'bg-green-600/20 text-green-400 border border-green-600/30',
      warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30',
      error: 'bg-red-600/20 text-red-400 border border-red-600/30',
      info: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
