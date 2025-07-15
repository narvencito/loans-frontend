import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ColorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
}

export const BlueButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  children,
  size = "default",
  ...props
}: ColorButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 transition-all duration-200",
        className
      )}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </Button>
  );
};

export const GreenButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  children,
  size = "default",
  ...props
}: ColorButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-green-100 hover:bg-green-200 text-green-800 border-green-300 transition-all duration-200",
        className
      )}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </Button>
  );
};

export const RedButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  children,
  size = "default",
  ...props
}: ColorButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-red-100 hover:bg-red-200 text-red-800 border-red-300 transition-all duration-200",
        className
      )}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </Button>
  );
};

export const YellowButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  children,
  size = "default",
  ...props
}: ColorButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300 transition-all duration-200",
        className
      )}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </Button>
  );
};

export const PurpleButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  children,
  size = "default",
  ...props
}: ColorButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300 transition-all duration-200",
        className
      )}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </Button>
  );
};

export const GrayButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  children,
  size = "default",
  ...props
}: ColorButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 transition-all duration-200",
        className
      )}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </Button>
  );
}; 