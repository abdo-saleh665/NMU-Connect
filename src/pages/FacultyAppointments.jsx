import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const FacultyAppointments = () => {
    const { t, isRTL } = useLanguage();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const appointments = {
        pending: [
            { id: 1, studentName: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed', studentId: '20230154', reason: isRTL ? 'مناقشة المشروع' : 'Project Discussion', requestedTime: isRTL ? 'الأحد، 10:00 ص' : 'Sunday, 10:00 AM', date: 'Dec 22, 2024' },
            { id: 2, studentName: isRTL ? 'سارة أحمد' : 'Sara Ahmed', studentId: '20230089', reason: isRTL ? 'استفسار عن الدرجات' : 'Grade Inquiry', requestedTime: isRTL ? 'الإثنين، 11:30 ص' : 'Monday, 11:30 AM', date: 'Dec 23, 2024' },
            { id: 3, studentName: isRTL ? 'محمد خالد' : 'Mohamed Khaled', studentId: '20230212', reason: isRTL ? 'إرشاد أكاديمي' : 'Academic Advising', requestedTime: isRTL ? 'الثلاثاء، 2:00 م' : 'Tuesday, 2:00 PM', date: 'Dec 24, 2024' }
        ],
        upcoming: [
            { id: 4, studentName: isRTL ? 'نور الدين' : 'Nour El-Din', studentId: '20230098', reason: isRTL ? 'مراجعة البحث' : 'Research Review', requestedTime: isRTL ? 'الأربعاء، 9:00 ص' : 'Wednesday, 9:00 AM', date: 'Dec 25, 2024', status: 'confirmed' },
            { id: 5, studentName: isRTL ? 'ياسمين خليل' : 'Yasmine Khalil', studentId: '20230156', reason: isRTL ? 'مناقشة التدريب' : 'Internship Discussion', requestedTime: isRTL ? 'الخميس، 10:30 ص' : 'Thursday, 10:30 AM', date: 'Dec 26, 2024', status: 'confirmed' }
        ],
        completed: [
            { id: 6, studentName: isRTL ? 'علي حسن' : 'Ali Hassan', studentId: '20230045', reason: isRTL ? 'مشكلة في المقرر' : 'Course Issue', requestedTime: isRTL ? 'السبت، 11:00 ص' : 'Saturday, 11:00 AM', date: 'Dec 14, 2024', notes: isRTL ? 'تم حل المشكلة' : 'Issue resolved' },
            { id: 7, studentName: isRTL ? 'فاطمة علي' : 'Fatima Ali', studentId: '20230078', reason: isRTL ? 'استشارة أكاديمية' : 'Academic Consultation', requestedTime: isRTL ? 'الأحد، 2:00 م' : 'Sunday, 2:00 PM', date: 'Dec 15, 2024', notes: isRTL ? 'تمت المناقشة بنجاح' : 'Discussion completed successfully' }
        ]
    };

    const tabs = [
        { id: 'pending', label: isRTL ? 'قيد الانتظار' : 'Pending', count: appointments.pending.length },
        { id: 'upcoming', label: isRTL ? 'القادمة' : 'Upcoming', count: appointments.upcoming.length },
        { id: 'completed', label: isRTL ? 'مكتملة' : 'Completed', count: appointments.completed.length }
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
                        <Link to="/faculty/classes" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">class</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'المحاضرات' : 'My Classes'}</span>
                        </Link>
                        <Link to="/faculty/appointments" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">calendar_month</span>
                            <span className="text-sm font-semibold">{isRTL ? 'المواعيد' : 'Appointments'}</span>
                            <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{appointments.pending.length}</span>
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
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'المواعيد' : 'Appointments'}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            {isRTL ? 'ساعات مكتبية' : 'Office Hours'}
                        </button>
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

                {/* Tabs */}
                <div className="flex gap-2 px-6 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#e7d0d1] dark:hover:bg-[#4a3a3a]'}`}
                        >
                            {tab.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#e7d0d1] dark:bg-[#4a3a3a]'}`}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {appointments[activeTab].map((apt) => (
                            <div key={apt.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-5 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <span className="material-symbols-outlined">person</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-bold text-[#1b0e0e] dark:text-white">{apt.studentName}</h3>
                                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">ID: {apt.studentId}</p>
                                            </div>
                                            <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{apt.date}</span>
                                        </div>
                                        <div className="mt-3 p-3 bg-[#f3e7e8] dark:bg-[#3a2a2a] rounded-xl">
                                            <p className="text-sm font-medium text-[#1b0e0e] dark:text-white">{apt.reason}</p>
                                            <p className="text-xs text-primary mt-1">{apt.requestedTime}</p>
                                        </div>
                                        {apt.notes && (
                                            <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mt-3 italic">{apt.notes}</p>
                                        )}
                                        {activeTab === 'pending' && (
                                            <div className="flex gap-2 mt-4">
                                                <button className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors">
                                                    {isRTL ? 'قبول' : 'Accept'}
                                                </button>
                                                <button className="flex-1 py-2 border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] text-sm font-medium rounded-xl hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                                    {isRTL ? 'رفض' : 'Decline'}
                                                </button>
                                                <button className="py-2 px-4 border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] text-sm font-medium rounded-xl hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                                    {isRTL ? 'اقتراح وقت' : 'Suggest Time'}
                                                </button>
                                            </div>
                                        )}
                                        {activeTab === 'upcoming' && (
                                            <div className="flex gap-2 mt-4">
                                                <button className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors">
                                                    {isRTL ? 'بدء الاجتماع' : 'Start Meeting'}
                                                </button>
                                                <button className="py-2 px-4 border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] text-sm font-medium rounded-xl hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                                    {isRTL ? 'إعادة جدولة' : 'Reschedule'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FacultyAppointments;
