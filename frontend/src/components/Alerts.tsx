import { Modal } from './Modal';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export type AlertType = 'warning' | 'hint' | 'success' | 'error';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: AlertType;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-100',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
  },
  hint: {
    icon: Info,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
  },
  error: {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-100',
    buttonColor: 'bg-red-500 hover:bg-red-600',
  }
};

export function AlertModal({ 
  isOpen, 
  onClose, 
  type, 
  title, 
  message, 
  actionText = 'OK', 
  onAction 
}: AlertModalProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  const handleAction = () => {
    if (onAction) onAction();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOutsideClick={true}>
      <div className="p-8 text-center flex flex-col items-center">
        <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-lg", config.bg, config.color)}>
          <Icon className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[var(--foreground)] mb-2">{title}</h2>
        <p className="text-[var(--muted-foreground)] font-bold text-sm mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 w-full">
          {onAction && (
            <button 
              onClick={onClose} 
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 rounded-md font-bold hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={handleAction} 
            className={cn("flex-1 py-3 px-4 text-white rounded-md font-bold transition-colors", config.buttonColor)}
          >
            {actionText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
