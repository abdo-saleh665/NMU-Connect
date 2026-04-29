import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const FacultyClasses = () => {
    const { t, isRTL } = useLanguage();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const classes = [
        {
            id: 1,
            name: isRTL ? 'مقدمة في علوم الحاسب' : 'Introduction to Computer Science',
            code: 'CS101',
            schedule: isRTL ? 'الأحد، الثلاثاء - 9:00 ص' : 'Sun, Tue - 9:00 AM',
            location: isRTL ? 'القاعة أ - المبنى الرئيسي' : 'Hall A - Main Building',
            students: 45,
            semester: isRTL ? 'خريف 2024' : 'Fall 2024',
            progress: 65
        },
        {
            id: 2,
            name: isRTL ? 'هياكل البيانات والخوارزميات' : 'Data Structures & Algorithms',
            code: 'CS201',
            schedule: isRTL ? 'الإثنين، الأربعاء - 2:00 م' : 'Mon, Wed - 2:00 PM',
            location: isRTL ? 'معمل الحاسب 2' : 'Computer Lab 2',
            students: 38,
            semester: isRTL ? 'خريف 2024' : 'Fall 2024',
            progress: 58
        },
        {
            id: 3,
            name: isRTL ? 'الذكاء الاصطناعي' : 'Artificial Intelligence',
            code: 'CS401',
            schedule: isRTL ? 'الخميس - 11:00 ص' : 'Thu - 11:00 AM',
            location: isRTL ? 'معمل الحاسب 1' : 'Computer Lab 1',
            students: 28,
            semester: isRTL ? 'خريف 2024' : 'Fall 2024',
            progress: 45
        },
        {
            id: 4,
            name: isRTL ? 'قواعد البيانات' : 'Database Systems',
            code: 'CS301',
            schedule: isRTL ? 'الأحد، الثلاثاء - 11:00 ص' : 'Sun, Tue - 11:00 AM',
            location: isRTL ? 'القاعة ب' : 'Hall B',
            students: 42,
            semester: isRTL ? 'خريف 2024' : 'Fall 2024',
            progress: 70
        }
    ];

    return (
        <div className={`flex h-screen w-full bg-background-light dark:bg-background-dark`}>
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64 p-4' : 'w-0 p-0'} flex-shrink-0 bg-surface-light dark:bg-surface-dark ${sidebarOpen ? (isRTL ? 'border-l' : 'border-r') : ''} border-[#e7d0d1] dark:border-[#3a2a2a] flex-col justify-between hidden md:flex h-full overflow-hidden transition-all duration-300`}>
                <div className={`flex flex-col gap-6 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                            <h1 className="text-[#1b0e0e] dark:text-white text-lg font-bold leading-normal">
                                {isRTL ? 'بوابة هيئة التدريس' : 'Faculty Portal'}
                            </h1>
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">menu_open</span>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <Link to="/faculty" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">dashboard</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('dashboard')}</span>
                        </Link>
                        <Link to="/faculty/classes" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">class</span>
                            <span className="text-sm font-semibold">{isRTL ? 'المحاضرات' : 'My Classes'}</span>
                        </Link>
                        <Link to="/faculty/appointments" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">calendar_month</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'المواعيد' : 'Appointments'}</span>
                        </Link>
                        <Link to="/faculty/students" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">groups</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'الطلاب' : 'Students'}</span>
                        </Link>
                        <Link to="/faculty/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">campaign</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('complaints')}</span>
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark px-6 py-4 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className={`${sidebarOpen ? 'hidden' : 'hidden md:flex'} p-2 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors`}>
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'المحاضرات' : 'My Classes'}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity">
                                <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-full size-9 border-2 border-[#f3e7e8] dark:border-[#3a2a2a] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="text-sm font-bold text-[#1b0e0e] dark:text-white leading-none">{isRTL ? 'د. أحمد حسن' : 'Dr. Ahmed Hassan'}</p>
                                    <p className="text-xs text-primary mt-1 leading-none">{isRTL ? 'علوم الحاسب' : 'Computer Science'}</p>
                                </div>
                                <span className="material-symbols-outlined text-[18px] text-[#5c4545] dark:text-[#d0c0c0] hidden md:block">{profileMenuOpen ? 'expand_less' : 'expand_more'}</span>
                            </button>
                            {profileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                                    <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <p className="text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'د. أحمد حسن' : 'Dr. Ahmed Hassan'}</p>
                                        <p className="text-xs text-primary">ahmed.hassan@nmu.edu.eg</p>
                                    </div>
                                    <Link to="/faculty/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                        {isRTL ? 'الملف الشخصي' : 'My Profile'}
                                    </Link>
                                    <Link to="/faculty/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">settings</span>
                                        {t('settings')}
                                    </Link>
                                    <div className="border-t border-[#e7d0d1] dark:border-[#3a2a2a] mt-2 pt-2">
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">logout</span>
                                            {t('logout') || 'Logout'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {classes.map((cls) => (
                                <div key={cls.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{cls.code}</span>
                                            <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mt-2">{cls.name}</h3>
                                        </div>
                                        <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0] bg-[#f3e7e8] dark:bg-[#3a2a2a] px-2 py-1 rounded-lg">{cls.semester}</span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                                            {cls.schedule}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                            {cls.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                            <span className="material-symbols-outlined text-[18px]">group</span>
                                            {cls.students} {isRTL ? 'طالب' : 'students'}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'تقدم المنهج' : 'Course Progress'}</span>
                                            <span className="font-bold text-primary">{cls.progress}%</span>
                                        </div>
                                        <div className="w-full bg-[#f3e7e8] dark:bg-[#3a2a2a] rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${cls.progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors">
                                            {isRTL ? 'عرض التفاصيل' : 'View Details'}
                                        </button>
                                        <button className="py-2 px-4 border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] text-sm font-medium rounded-xl hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FacultyClasses;
