import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 5000, title = null, details = null, linkTo = null) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration, title, details, linkTo }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    useEffect(() => {
        const handleGlobalToast = (event) => {
            const { message, type, duration, title, details, linkTo } = event.detail;
            addToast(message, type, duration, title, details, linkTo);
        };
        window.addEventListener('app-toast', handleGlobalToast);
        return () => window.removeEventListener('app-toast', handleGlobalToast);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-3 pointer-events-none w-full max-w-sm">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ message, type, duration, title, details, linkTo, onRemove }) => {
    const navigate = useNavigate();
    useEffect(() => {
        const displayDuration = details ? Math.max(duration || 5000, 7000) : (duration || 5000);
        const timer = setTimeout(onRemove, displayDuration);
        return () => clearTimeout(timer);
    }, [duration, details, onRemove]);

    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info',
    };

    const colors = {
        success: { icon: '#bdc2ff', bg: 'rgba(189, 194, 255, 0.06)' },
        error: { icon: '#ffb4ab', bg: 'rgba(255, 180, 171, 0.06)' },
        warning: { icon: '#f7bd3e', bg: 'rgba(247, 189, 62, 0.06)' },
        info: { icon: '#818cf8', bg: 'rgba(129, 140, 248, 0.06)' },
    };

    const c = colors[type] || colors.info;

    const handleClick = () => {
        if (linkTo) {
            navigate(linkTo);
            onRemove();
        }
    };

    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 p-4 ghost-border ${linkTo ? 'cursor-pointer hover:bg-surface-high/50 transition-colors' : ''}`}
            style={{
                background: c.bg,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '1rem',
                width: '100%',
            }}
            onClick={handleClick}
        >
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5" style={{ color: c.icon }}>{icons[type] || 'info'}</span>
            <div className="flex-1 min-w-0">
                {title && <h4 className="text-[14px] font-[700] text-on-surface mb-0.5">{title}</h4>}
                <p className={`text-[13px] font-[500] text-on-surface-variant leading-relaxed break-words ${!title ? 'text-on-surface text-[14px]' : ''}`}>
                    {message}
                </p>
                {details && details.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {details.map((detail, idx) => (
                            <p key={idx} className="text-[12px] text-error font-[500]">{detail}</p>
                        ))}
                    </div>
                )}
            </div>
            <button onClick={onRemove} className="shrink-0 p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
        </div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};
