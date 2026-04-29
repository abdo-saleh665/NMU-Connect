import { useLanguage } from '../context/LanguageContext';

const EmptyState = ({
    icon = 'inbox',
    title,
    titleAr,
    message,
    messageAr,
    actionLabel,
    actionLabelAr,
    onAction
}) => {
    const { isRTL } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl text-primary">{icon}</span>
            </div>
            <h3 className="text-xl font-bold text-[#1b0e0e] dark:text-white mb-2 text-center">
                {isRTL ? titleAr : title}
            </h3>
            <p className="text-[#5c4545] dark:text-[#d0c0c0] text-center max-w-md mb-6">
                {isRTL ? messageAr : message}
            </p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    {isRTL ? actionLabelAr : actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
