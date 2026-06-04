import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-black/5 shadow-md shadow-black/[0.03] overflow-hidden transition-all duration-300 ${
        hoverEffect ? "hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/[0.08]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`p-6 border-b border-black/5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`p-6 bg-light/30 border-t border-black/5 ${className}`} {...props}>
      {children}
    </div>
  );
};
