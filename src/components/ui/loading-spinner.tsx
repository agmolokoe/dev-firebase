
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  className = "" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full border-primary border-t-transparent animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};
