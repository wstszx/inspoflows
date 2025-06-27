import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'filled' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'outline', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-8 py-3 border text-base font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-outline transition-all duration-200 disabled:cursor-not-allowed";
  
  const outlineClasses = "border-outline text-onBackground hover:bg-onSurface/10 disabled:bg-onSurface/5 disabled:text-onSurface/40 disabled:border-outline/30";

  const filledClasses = "border-transparent bg-onSurface text-surface hover:bg-onSurface/90 disabled:bg-onSurface/20 disabled:text-onSurface/40";
  
  const variantClasses = variant === 'filled' ? filledClasses : outlineClasses;

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
