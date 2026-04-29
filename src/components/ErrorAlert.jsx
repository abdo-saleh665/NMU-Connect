import { useLanguage } from '../context/LanguageContext';

/**
 * ErrorAlert - Displays error messages when API calls fail
 * @param {Object} props
 * @param {string} props.message - Error message in English
 * @param {string} [props.messageAr] - Error message in Arabic
 * @param {Function} [props.onRetry] - Optional retry callback
 */
const ErrorAlert = ({ message, messageAr, onRetry }) => {
    const { isRTL } = useLanguage();

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-4">
            <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <span className="material-symbols-outlined">error</span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-red-800 dark:text-red-300 text-sm">
                    {isRTL ? 'حدث خطأ' : 'Something went wrong'}
                </h4>
                <p className="text-red-600 dark:text-red-400 text-sm">
                    {isRTL ? (messageAr || message) : message}
                </p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="shrink-0 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                    {isRTL ? 'إعادة المحاولة' : 'Retry'}
                </button>
            )}
        </div>
    );
};

export default ErrorAlert;
