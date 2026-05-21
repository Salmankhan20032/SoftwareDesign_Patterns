import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: number;
  text: string;
  type?: 'info' | 'success';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  const Icon = toast.type === 'success' ? CheckCircle2 : Info;

  return (
    <div className={`toast toast-${toast.type ?? 'info'}`} role="status">
      <Icon size={20} />
      <span>{toast.text}</span>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
