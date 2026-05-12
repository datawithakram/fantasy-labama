import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  closeOnOutsideClick?: boolean;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  closeOnOutsideClick = true 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className={cn("bg-[var(--card)] w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200", className)}>
        {!title && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:bg-[var(--muted)] p-2 rounded-xl transition-all z-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {title && (
          <div className="flex justify-between items-center p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-[var(--muted-foreground)] hover:bg-[var(--muted)] p-2 rounded-xl transition-all"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
