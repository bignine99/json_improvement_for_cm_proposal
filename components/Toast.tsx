
/**
 * Toast Notification Component
 * Replaces native alert() with elegant slide-in toasts
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastItemProps {
    toast: ToastMessage;
    onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const duration = toast.duration || 3500;
        const exitTimer = setTimeout(() => setIsExiting(true), duration - 400);
        const removeTimer = setTimeout(() => onRemove(toast.id), duration);
        return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
    }, [toast, onRemove]);

    const icons = {
        success: <CheckCircle size={18} className="text-emerald-400 shrink-0" />,
        error: <AlertCircle size={18} className="text-red-400 shrink-0" />,
        info: <Info size={18} className="text-[#8AB4F8] shrink-0" />,
    };

    const borders = {
        success: 'border-emerald-500/30',
        error: 'border-red-500/30',
        info: 'border-[#8AB4F8]/30',
    };

    const glows = {
        success: 'shadow-emerald-500/10',
        error: 'shadow-red-500/10',
        info: 'shadow-[#8AB4F8]/10',
    };

    return (
        <div
            className={`
        flex items-start gap-4 px-5 py-4 bg-[#111] border ${borders[toast.type]} rounded-sm 
        shadow-2xl ${glows[toast.type]} backdrop-blur-sm min-w-[320px] max-w-[420px]
        transition-all duration-400 ease-out
        ${isExiting
                    ? 'opacity-0 translate-x-8 scale-95'
                    : 'opacity-100 translate-x-0 scale-100 animate-in slide-in-from-right-8 fade-in duration-300'
                }
      `}
        >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
                <div className="text-[11px] font-black text-white uppercase tracking-wider">{toast.title}</div>
                {toast.message && (
                    <div className="text-[10px] text-[#888] mt-1 leading-relaxed">{toast.message}</div>
                )}
            </div>
            <button
                onClick={() => { setIsExiting(true); setTimeout(() => onRemove(toast.id), 300); }}
                className="text-[#333] hover:text-white transition-colors p-1 shrink-0"
            >
                <X size={12} />
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: ToastMessage[];
    onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col-reverse gap-3">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

// Hook for easy toast usage
export const useToast = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((type: ToastType, title: string, message?: string, duration?: number) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, type, title, message, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (title: string, message?: string) => addToast('success', title, message),
        error: (title: string, message?: string) => addToast('error', title, message),
        info: (title: string, message?: string) => addToast('info', title, message),
    };

    return { toasts, removeToast, toast };
};
