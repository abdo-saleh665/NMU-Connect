import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};

export const DarkModeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        // Get initial value from localStorage
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            return JSON.parse(saved);
        }
        // Fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        // Persist to localStorage
        localStorage.setItem('darkMode', JSON.stringify(isDark));
    }, [isDark]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Only update if user hasn't explicitly set a preference
            const saved = localStorage.getItem('darkMode');
            if (saved === null) {
                setIsDark(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleDarkMode = () => setIsDark(!isDark);

    // Reset to system preference
    const useSystemPreference = () => {
        localStorage.removeItem('darkMode');
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    return (
        <DarkModeContext.Provider value={{ isDark, toggleDarkMode, useSystemPreference }}>
            {children}
        </DarkModeContext.Provider>
    );
};
