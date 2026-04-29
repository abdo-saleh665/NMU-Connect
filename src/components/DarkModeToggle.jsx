import { useDarkMode } from '../context/DarkModeContext';

const DarkModeToggle = () => {
    const { isDark, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="fixed top-4 right-4 z-50 p-3 rounded-full bg-slate-800 text-white shadow-lg dark:bg-white dark:text-black opacity-70 hover:opacity-100 transition-opacity"
            title="Toggle Dark Mode"
        >
            <span className="material-symbols-outlined text-xl">
                {isDark ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );
};

export default DarkModeToggle;
