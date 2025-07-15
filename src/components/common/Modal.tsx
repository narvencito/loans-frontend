type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
  };
  
  export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-surface p-6 rounded-lg shadow-lg max-w-md w-full relative border-2 border-primary">
          <button 
            onClick={onClose} 
            className="absolute top-2 right-2 text-primary hover:text-secondary transition-all duration-200"
          >
            ✕
          </button>
          {title && <h2 className="text-xl font-semibold mb-4 text-primary">{title}</h2>}
          {children}
        </div>
      </div>
    );
  }
  