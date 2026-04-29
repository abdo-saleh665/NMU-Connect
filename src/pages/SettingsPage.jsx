import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useLanguage } from '../context/LanguageContext';

const SettingsPage = ({ portalType = 'student' }) => {
    const navigate = useNavigate();
    const { isDark, toggleDarkMode } = useDarkMode();
    const { language, setLanguage, isRTL, t } = useLanguage();

    // Determine back path based on portal type
    const backPath = portalType === 'faculty' ? '/faculty' : portalType === 'admin' ? '/admin' : '/student';

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className={`min-h-screen w-full bg-background-light dark:bg-background-dark overflow-y-auto ${isRTL ? 'font-arabic' : ''}`}>
            {/* Header */}
            <header className="sticky top-0 flex items-center justify-between whitespace-nowrap border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark px-6 py-4 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white transition-colors">
                        <span className={`material-symbols-outlined ${isRTL ? 'rotate-180' : ''}`}>arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{t('settingsTitle')}</h2>
                        <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{t('settingsSubtitle')}</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6 md:p-8 pb-16">
                <div className="max-w-3xl mx-auto flex flex-col gap-6">

                    {/* Language Section */}
                    <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <span className="material-symbols-outlined text-2xl">translate</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">{t('language')}</h3>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{t('languageSubtitle')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${language === 'en'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-[#e7d0d1] dark:border-[#3a2a2a] hover:border-primary/50 text-[#5c4545] dark:text-[#d0c0c0]'
                                    }`}
                            >
                                <span className="font-medium">{t('english')}</span>
                            </button>
                            <button
                                onClick={() => setLanguage('ar')}
                                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${language === 'ar'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-[#e7d0d1] dark:border-[#3a2a2a] hover:border-primary/50 text-[#5c4545] dark:text-[#d0c0c0]'
                                    }`}
                            >
                                <span className="font-medium">{t('arabic')}</span>
                            </button>
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <span className="material-symbols-outlined text-2xl">palette</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">{t('appearance')}</h3>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{t('appearanceSubtitle')}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#f9f5f5] dark:bg-[#2a2020] rounded-lg">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#5c4545] dark:text-[#d0c0c0]">
                                    {isDark ? 'dark_mode' : 'light_mode'}
                                </span>
                                <div>
                                    <p className="font-medium text-[#1b0e0e] dark:text-white">
                                        {isDark ? t('darkMode') : t('lightMode')}
                                    </p>
                                    <p className="text-sm text-[#5c4545] dark:text-[#998888]">{t('darkModeDesc')}</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className={`relative w-14 h-8 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isDark ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')}`}></span>
                            </button>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
};

export default SettingsPage;



