import { CheckCircle2, X } from 'lucide-react';
import { formatMoney } from '../utils/format';

interface CheckoutModalProps {
  open: boolean;
  itemCount: number;
  total: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function CheckoutModal({ open, itemCount, total, onClose, onConfirm }: CheckoutModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="modal-card">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <CheckCircle2 size={40} className="modal-icon" />
        <h2 id="checkout-title">Ready to checkout?</h2>
        <p>
          {itemCount} {itemCount === 1 ? 'item' : 'items'} · Order total{' '}
          <strong>${formatMoney(total)}</strong>
        </p>
        <div className="modal-actions">
          <button type="button" className="btn-checkout" onClick={onConfirm}>
            Place order
          </button>
          <button type="button" className="btn-clear" onClick={onClose}>
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
