type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
  };
  
  export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✕</button>
          {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
          {children}
        </div>
      </div>
    );
  }
  