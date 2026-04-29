import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const AdminDashboard = () => {
    const { t, isRTL } = useLanguage();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Stats data
    const stats = [
        {
            label: isRTL ? 'إجمالي الطلاب' : 'Total Students',
            value: '12,450',
            change: '+5.2%',
            trend: 'up',
            icon: 'school',
            color: 'blue'
        },
        {
            label: isRTL ? 'هيئة التدريس' : 'Academic Staff',
            value: '486',
            change: '+2.1%',
            trend: 'up',
            icon: 'person_book',
            color: 'purple'
        },
        {
            label: isRTL ? 'الشكاوى المفتوحة' : 'Open Complaints',
            value: '23',
            change: '-12%',
            trend: 'down',
            icon: 'campaign',
            color: 'orange'
        },
        {
            label: isRTL ? 'المواعيد اليوم' : 'Appointments Today',
            value: '47',
            change: '+8%',
            trend: 'up',
            icon: 'calendar_month',
            color: 'green'
        }
    ];

    // Chart data for enrollment by faculty
    const enrollmentData = [
        { faculty: isRTL ? 'علوم الحاسب' : 'Computer Science', students: 2840, percentage: 23 },
        { faculty: isRTL ? 'الهندسة' : 'Engineering', students: 2650, percentage: 21 },
        { faculty: isRTL ? 'الطب' : 'Medicine', students: 1980, percentage: 16 },
        { faculty: isRTL ? 'إدارة الأعمال' : 'Business', students: 2100, percentage: 17 },
        { faculty: isRTL ? 'العلوم' : 'Science', students: 1520, percentage: 12 },
        { faculty: isRTL ? 'أخرى' : 'Others', students: 1360, percentage: 11 }
    ];

    // Monthly registration data
    const monthlyData = [
        { month: 'Sep', students: 3200, faculty: 45 },
        { month: 'Oct', students: 2800, faculty: 38 },
        { month: 'Nov', students: 1950, faculty: 22 },
        { month: 'Dec', students: 1200, faculty: 15 }
    ];

    // Recent activities
    const recentActivities = [
        { id: 'ACT-001', action: isRTL ? 'تسجيل طالب جديد' : 'New student registration', user: 'Ahmed Mohamed', time: '5 min ago', status: 'completed' },
        { id: 'ACT-002', action: isRTL ? 'شكوى جديدة' : 'New complaint submitted', user: 'Sara Ahmed', time: '15 min ago', status: 'pending' },
        { id: 'ACT-003', action: isRTL ? 'تعديل بيانات دكتور' : 'Faculty profile updated', user: 'Dr. Hassan Ali', time: '1 hour ago', status: 'completed' },
        { id: 'ACT-004', action: isRTL ? 'طلب موعد' : 'Appointment request', user: 'Mohamed Khaled', time: '2 hours ago', status: 'pending' },
        { id: 'ACT-005', action: isRTL ? 'إنشاء حدث جديد' : 'New event created', user: 'Admin', time: '3 hours ago', status: 'completed' }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
            orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
            green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className={`flex h-screen w-full bg-background-light dark:bg-background-dark`}>
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64 p-4' : 'w-0 p-0'} flex-shrink-0 bg-surface-light dark:bg-surface-dark ${sidebarOpen ? (isRTL ? 'border-l' : 'border-r') : ''} border-[#e7d0d1] dark:border-[#3a2a2a] flex-col justify-between hidden md:flex h-full overflow-hidden transition-all duration-300`}>
                <div className={`flex flex-col gap-6 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                            <h1 className="text-[#1b0e0e] dark:text-white text-lg font-bold leading-normal">
                                {isRTL ? 'لوحة الإدارة' : 'Admin Portal'}
                            </h1>
                            <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">
                                {isRTL ? 'إدارة الجامعة' : 'University Management'}
                            </p>
                        </div>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-[20px]">menu_open</span>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <Link to="/admin" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">dashboard</span>
                            <span className="text-sm font-semibold">{t('dashboard')}</span>
                        </Link>
                        <Link to="/admin/accounts" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">manage_accounts</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'إدارة الحسابات' : 'Accounts'}</span>
                        </Link>
                        <Link to="/admin/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">campaign</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('complaints')}</span>
                            <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">23</span>
                        </Link>
                        <Link to="/admin/events" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">event</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'الفعاليات' : 'Events'}</span>
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
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{t('dashboard')}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-64 items-stretch rounded-lg bg-[#f3e7e8] dark:bg-[#3a2a2a]">
                            <div className="text-primary flex items-center justify-center pl-3">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="w-full h-10 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-sm px-3"
                                placeholder={isRTL ? 'بحث...' : 'Search...'}
                            />
                        </div>
                        <div className="relative">
                            <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity">
                                <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-full size-9 border-2 border-[#f3e7e8] dark:border-[#3a2a2a] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="text-sm font-bold text-[#1b0e0e] dark:text-white leading-none">{isRTL ? 'المدير العام' : 'Admin User'}</p>
                                    <p className="text-xs text-primary mt-1 leading-none">{isRTL ? 'مسؤول النظام' : 'System Admin'}</p>
                                </div>
                                <span className="material-symbols-outlined text-[18px] text-[#5c4545] dark:text-[#d0c0c0] hidden md:block">{profileMenuOpen ? 'expand_less' : 'expand_more'}</span>
                            </button>
                            {profileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                                    <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <p className="text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'المدير العام' : 'Admin User'}</p>
                                        <p className="text-xs text-primary">admin@nmu.edu.eg</p>
                                    </div>
                                    <Link to="/admin/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                        {isRTL ? 'الملف الشخصي' : 'My Profile'}
                                    </Link>
                                    <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
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
                    <div className="max-w-7xl mx-auto flex flex-col gap-6">
                        {/* Welcome */}
                        <div className="flex flex-col gap-1">
                            <h2 className="text-2xl font-bold text-[#1b0e0e] dark:text-white">
                                {isRTL ? 'مرحباً بك في لوحة الإدارة' : 'Welcome to Admin Dashboard'}
                            </h2>
                            <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                {isRTL ? 'نظرة عامة على النظام والإحصائيات' : 'System overview and analytics'}
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{stat.label}</p>
                                            <h3 className="text-2xl font-bold text-[#1b0e0e] dark:text-white mt-1">{stat.value}</h3>
                                            <p className={`text-xs mt-2 flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                                <span className="material-symbols-outlined text-[14px]">{stat.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                                                {stat.change} {isRTL ? 'من الشهر الماضي' : 'from last month'}
                                            </p>
                                        </div>
                                        <div className={`size-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
                                            <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Enrollment by Faculty Chart */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-6">
                                <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-4">
                                    {isRTL ? 'التسجيل حسب الكلية' : 'Enrollment by Faculty'}
                                </h3>
                                <div className="space-y-4">
                                    {enrollmentData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-28 text-sm text-[#5c4545] dark:text-[#d0c0c0] truncate">{item.faculty}</div>
                                            <div className="flex-1 h-6 bg-[#f3e7e8] dark:bg-[#3a2a2a] rounded-lg overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-lg transition-all duration-500"
                                                    style={{ width: `${item.percentage}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-20 text-sm font-bold text-[#1b0e0e] dark:text-white text-right">
                                                {item.students.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Monthly Registration Chart */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-6">
                                <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-4">
                                    {isRTL ? 'التسجيل الشهري' : 'Monthly Registrations'}
                                </h3>
                                <div className="flex items-end justify-around h-48 gap-4">
                                    {monthlyData.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                            <div className="flex flex-col items-center gap-1 w-full">
                                                <div
                                                    className="w-full max-w-[40px] bg-gradient-to-t from-primary to-primary-hover rounded-t-lg transition-all duration-500"
                                                    style={{ height: `${(item.students / 3200) * 140}px` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-[#5c4545] dark:text-[#d0c0c0]">{item.month}</span>
                                            <span className="text-xs font-bold text-primary">{item.students}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'الطلاب' : 'Students'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[32px] opacity-80">school</span>
                                    <div>
                                        <p className="text-2xl font-bold">6</p>
                                        <p className="text-xs opacity-80">{isRTL ? 'كليات' : 'Faculties'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[32px] opacity-80">menu_book</span>
                                    <div>
                                        <p className="text-2xl font-bold">284</p>
                                        <p className="text-xs opacity-80">{isRTL ? 'مقررات' : 'Courses'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[32px] opacity-80">event_available</span>
                                    <div>
                                        <p className="text-2xl font-bold">12</p>
                                        <p className="text-xs opacity-80">{isRTL ? 'فعاليات قادمة' : 'Upcoming Events'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[32px] opacity-80">pending_actions</span>
                                    <div>
                                        <p className="text-2xl font-bold">156</p>
                                        <p className="text-xs opacity-80">{isRTL ? 'طلبات معلقة' : 'Pending Requests'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">
                                    {isRTL ? 'النشاط الأخير' : 'Recent Activity'}
                                </h3>
                                <button className="text-sm text-primary hover:underline">
                                    {isRTL ? 'عرض الكل' : 'View All'}
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                            <th className="text-left px-4 py-3 text-xs font-bold text-[#5c4545] dark:text-[#d0c0c0] uppercase">{isRTL ? 'المعرف' : 'ID'}</th>
                                            <th className="text-left px-4 py-3 text-xs font-bold text-[#5c4545] dark:text-[#d0c0c0] uppercase">{isRTL ? 'الإجراء' : 'Action'}</th>
                                            <th className="text-left px-4 py-3 text-xs font-bold text-[#5c4545] dark:text-[#d0c0c0] uppercase">{isRTL ? 'المستخدم' : 'User'}</th>
                                            <th className="text-left px-4 py-3 text-xs font-bold text-[#5c4545] dark:text-[#d0c0c0] uppercase">{isRTL ? 'الوقت' : 'Time'}</th>
                                            <th className="text-left px-4 py-3 text-xs font-bold text-[#5c4545] dark:text-[#d0c0c0] uppercase">{isRTL ? 'الحالة' : 'Status'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentActivities.map((activity) => (
                                            <tr key={activity.id} className="border-b border-[#e7d0d1]/50 dark:border-[#3a2a2a]/50 hover:bg-[#f3e7e8]/30 dark:hover:bg-[#3a2a2a]/30 transition-colors">
                                                <td className="px-4 py-3 text-sm font-medium text-primary">{activity.id}</td>
                                                <td className="px-4 py-3 text-sm text-[#1b0e0e] dark:text-white">{activity.action}</td>
                                                <td className="px-4 py-3 text-sm text-[#5c4545] dark:text-[#d0c0c0]">{activity.user}</td>
                                                <td className="px-4 py-3 text-sm text-[#5c4545] dark:text-[#d0c0c0]">{activity.time}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${activity.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                        {activity.status === 'completed' ? (isRTL ? 'مكتمل' : 'Completed') : (isRTL ? 'قيد الانتظار' : 'Pending')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
