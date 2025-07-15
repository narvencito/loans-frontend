import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const CancelButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  children = 'Cancelar'
}: ActionButtonProps) => {
  return (
    <Button
      variant="destructive"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "transition-all duration-200",
        className
      )}
    >
      {loading ? 'Cancelando...' : children}
    </Button>
  );
};

export const ConfirmButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  className,
  children = 'Aceptar'
}: ActionButtonProps) => {
  return (
    <Button
      variant="default"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "transition-all duration-200",
        className
      )}
    >
      {loading ? 'Procesando...' : children}
    </Button>
  );
}; 