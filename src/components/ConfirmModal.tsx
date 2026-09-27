import React from 'react';
import { AlertTriangle, Trash2, RotateCcw, X, ShieldCheck } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  showBackupNotice?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Bevestigen',
  cancelLabel = 'Annuleren',
  variant = 'danger',
  showBackupNotice = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  variant === 'danger'
                    ? 'bg-rose-100 text-rose-600'
                    : variant === 'warning'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {variant === 'danger' ? (
                  <Trash2 className="w-5 h-5" />
                ) : variant === 'warning' ? (
                  <RotateCcw className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">{message}</p>

          {showBackupNotice && (
            <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-100 p-2.5 rounded-lg text-[11px] text-blue-800">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                Geen zorgen: je huidige versie wordt automatisch veilig bewaard in de{' '}
                <strong>Geschiedenis</strong>.
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition cursor-pointer active:scale-[0.98] ${
                variant === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : variant === 'warning'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
