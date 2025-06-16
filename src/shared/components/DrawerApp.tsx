import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface DrawerAppProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function DrawerApp({ open, onClose, children, className }: DrawerAppProps) {
  // Cierra con ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Fondo oscuro con fade */}
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer lateral con slide y fade */}
          <motion.aside
            key="drawer"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50"
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
