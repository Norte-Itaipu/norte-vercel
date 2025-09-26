import React from "react";

interface ButtonProps {
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;