// components/ui/label-app.tsx
import { Label } from "@/components/ui/label";

interface LabelAppProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

const LabelApp = ({ children, htmlFor, className = "" }: LabelAppProps) => {
  return (
    <Label htmlFor={htmlFor} className={`text-sm font-medium ${className}`}>
      {children}
    </Label>
  );
};

export default LabelApp;
