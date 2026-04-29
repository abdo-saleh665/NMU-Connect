import { useToast, ToastType } from '../context/ToastContext';

/**
 * Toast icon mapping
 */
const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
};

/**
 * Toast color styles
 */
const styles = {
    success: {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-200 dark:border-emerald-800',
        icon: 'text-emerald-500',
        title: 'text-emerald-800 dark:text-emerald-200',
        message: 'text-emerald-700 dark:text-emerald-300'
    },
    error: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-500',
        title: 'text-red-800 dark:text-red-200',
        message: 'text-red-700 dark:text-red-300'
    },
    warning: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        icon: 'text-amber-500',
        title: 'text-amber-800 dark:text-amber-200',
        message: 'text-amber-700 dark:text-amber-300'
    },
    info: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'text-blue-500',
        title: 'text-blue-800 dark:text-blue-200',
        message: 'text-blue-700 dark:text-blue-300'
    }
};

/**
 * Individual Toast component
 */
const ToastItem = ({ toast, onRemove }) => {
    const style = styles[toast.type] || styles.info;
    const icon = icons[toast.type] || icons.info;

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${style.bg} ${style.border} animate-[slideIn_0.3s_ease-out]`}
            role="alert"
        >
            <span className={`material-symbols-outlined text-[22px] ${style.icon} shrink-0`}>
                {icon}
            </span>
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className={`font-bold text-sm ${style.title}`}>{toast.title}</p>
                )}
                <p className={`text-sm ${style.message} ${toast.title ? 'mt-0.5' : ''}`}>
                    {toast.message}
                </p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className={`shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${style.icon}`}
            >
                <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
        </div>
    );
};

/**
 * Toast Container - Renders all active toasts
 * Place this component once at the app root level
 */
const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <ToastItem toast={toast} onRemove={removeToast} />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
