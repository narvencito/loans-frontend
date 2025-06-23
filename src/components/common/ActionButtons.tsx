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
      variant="outline"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-red-100 hover:bg-red-200 text-red-800 border-red-300",
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
      variant="outline"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300",
        className
      )}
    >
      {loading ? 'Procesando...' : children}
    </Button>
  );
}; 