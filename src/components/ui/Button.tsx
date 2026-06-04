import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-display font-semibold rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-white border-2 border-primary hover:bg-transparent hover:text-primary shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-white border-2 border-secondary hover:bg-transparent hover:text-secondary shadow-lg shadow-secondary/20",
    accent: "bg-accent text-white border-2 border-accent hover:bg-transparent hover:text-accent shadow-lg shadow-accent/20",
    outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white",
    ghost: "bg-transparent text-dark hover:bg-light"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
