import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const FacultyDashboard = () => {
    const { t, isRTL } = useLanguage();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get current date dynamically
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    const formattedDate = isRTL
        ? `${dayNamesAr[today.getDay()]}، ${today.getDate()} ${monthNamesAr[today.getMonth()]} ${today.getFullYear()}`
        : `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

    // Sample notifications
    const notifications = [
        {
            id: 1,
            type: 'appointment',
            title: isRTL ? 'طلب موعد جديد' : 'New Appointment Request',
            message: isRTL ? 'طالب يطلب موعد للمناقشة الأكاديمية' : 'Student requests academic discussion',
            time: isRTL ? 'منذ 30 دقيقة' : '30 min ago',
            read: false,
            icon: 'calendar_month'
        },
        {
            id: 2,
            type: 'complaint',
            title: isRTL ? 'شكوى جديدة' : 'New Complaint',
            message: isRTL ? 'شكوى طالب بخصوص درجات الامتحان' : 'Student complaint about exam grades',
            time: isRTL ? 'منذ ساعة' : '1 hour ago',
            read: false,
            icon: 'report_problem'
        },
        {
            id: 3,
            type: 'event',
            title: isRTL ? 'اجتماع القسم غداً' : 'Department Meeting Tomorrow',
            message: isRTL ? 'تذكير: اجتماع هيئة التدريس الساعة 10 صباحاً' : 'Reminder: Faculty meeting at 10 AM',
            time: isRTL ? 'منذ 3 ساعات' : '3 hours ago',
            read: true,
            icon: 'groups'
        }
    ];

    // Today's classes
    const todayClasses = [
        {
            id: 1,
            name: isRTL ? 'مقدمة في علوم الحاسب' : 'Introduction to Computer Science',
            code: 'CS101',
            time: '09:00 AM - 10:30 AM',
            location: isRTL ? 'القاعة أ - المبنى الرئيسي' : 'Hall A - Main Building',
            students: 45,
            status: 'upcoming'
        },
        {
            id: 2,
            name: isRTL ? 'ساعات مكتبية' : 'Office Hours',
            code: '',
            time: '11:00 AM - 01:00 PM',
            location: isRTL ? 'مكتب 304' : 'Room 304',
            students: null,
            status: 'upcoming'
        },
        {
            id: 3,
            name: isRTL ? 'هياكل البيانات والخوارزميات' : 'Data Structures & Algorithms',
            code: 'CS201',
            time: '02:00 PM - 03:30 PM',
            location: isRTL ? 'معمل الحاسب 2' : 'Computer Lab 2',
            students: 38,
            status: 'upcoming'
        }
    ];

    // Pending appointments
    const pendingAppointments = [
        {
            id: 1,
            studentName: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
            studentId: '20230154',
            reason: isRTL ? 'مناقشة المشروع' : 'Project Discussion',
            requestedTime: isRTL ? 'الأحد، 10:00 ص' : 'Sunday, 10:00 AM',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY'
        },
        {
            id: 2,
            studentName: isRTL ? 'سارة أحمد' : 'Sara Ahmed',
            studentId: '20230089',
            reason: isRTL ? 'استفسار عن الدرجات' : 'Grade Inquiry',
            requestedTime: isRTL ? 'الإثنين، 11:30 ص' : 'Monday, 11:30 AM',
            image: null
        },
        {
            id: 3,
            studentName: isRTL ? 'محمد خالد' : 'Mohamed Khaled',
            studentId: '20230212',
            reason: isRTL ? 'إرشاد أكاديمي' : 'Academic Advising',
            requestedTime: isRTL ? 'الثلاثاء، 02:00 م' : 'Tuesday, 02:00 PM',
            image: null
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
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">menu_open</span>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <Link to="/faculty" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">dashboard</span>
                            <span className="text-sm font-semibold">{t('dashboard')}</span>
                        </Link>
                        <Link to="/faculty/classes" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">class</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'المحاضرات' : 'My Classes'}</span>
                        </Link>
                        <Link to="/faculty/appointments" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">calendar_month</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'المواعيد' : 'Appointments'}</span>
                            <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
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
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className={`${sidebarOpen ? 'hidden' : 'hidden md:flex'} p-2 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors`}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="hidden sm:flex flex-col min-w-64 h-10">
                            <div className="flex w-full flex-1 items-stretch rounded-lg bg-[#f3e7e8] dark:bg-[#3a2a2a] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                <div className="text-primary flex items-center justify-center pl-3">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </div>
                                <input className="w-full bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-sm px-3" placeholder={isRTL ? 'بحث عن الطلاب، المحاضرات...' : 'Search students, classes...'} />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileMenuOpen(false); }}
                                className="relative flex items-center justify-center size-10 rounded-full hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-1 right-1 size-2.5 bg-primary rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
                            </button>

                            {notificationsOpen && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg z-50 animate-[fadeIn_0.15s_ease-out] overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <h3 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الإشعارات' : 'Notifications'}</h3>
                                        <button className="text-xs text-primary font-medium hover:underline">{isRTL ? 'تحديد الكل كمقروء' : 'Mark all as read'}</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`flex gap-3 px-4 py-3 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors cursor-pointer border-b border-[#e7d0d1]/50 dark:border-[#3a2a2a]/50 last:border-0 ${!notification.read ? 'bg-primary/5' : ''}`}
                                            >
                                                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${!notification.read ? 'bg-primary/10 text-primary' : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0]'}`}>
                                                    <span className="material-symbols-outlined text-[20px]">{notification.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm font-medium truncate ${!notification.read ? 'text-[#1b0e0e] dark:text-white' : 'text-[#5c4545] dark:text-[#d0c0c0]'}`}>
                                                            {notification.title}
                                                        </p>
                                                        {!notification.read && <span className="size-2 bg-primary rounded-full shrink-0 mt-1.5"></span>}
                                                    </div>
                                                    <p className="text-xs text-[#5c4545] dark:text-[#998888] truncate mt-0.5">{notification.message}</p>
                                                    <p className="text-xs text-[#994d51] mt-1">{notification.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-3 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <button className="w-full py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                            {isRTL ? 'عرض جميع الإشعارات' : 'View all notifications'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-8 w-[1px] bg-[#e7d0d1] dark:bg-[#3a2a2a] mx-1"></div>

                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); }}
                                className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity"
                            >
                                <div className="bg-gradient-to-br from-primary/20 to-primary/40 rounded-full size-9 border-2 border-[#f3e7e8] dark:border-[#3a2a2a] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="text-sm font-bold text-[#1b0e0e] dark:text-white leading-none">{isRTL ? 'د. أحمد حسن' : 'Dr. Ahmed Hassan'}</p>
                                    <p className="text-xs text-[#994d51] mt-1 leading-none">{isRTL ? 'علوم الحاسب' : 'Computer Science'}</p>
                                </div>
                                <span className="material-symbols-outlined text-[18px] text-[#5c4545] dark:text-[#d0c0c0] hidden md:block">{profileMenuOpen ? 'expand_less' : 'expand_more'}</span>
                            </button>

                            {profileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                                    <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <p className="text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'د. أحمد حسن' : 'Dr. Ahmed Hassan'}</p>
                                        <p className="text-xs text-[#994d51]">ahmed.hassan@nmu.edu.eg</p>
                                    </div>
                                    <Link to="/faculty/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                        {t('profile') || 'My Profile'}
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
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto flex flex-col gap-8">
                        {/* Welcome Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-[#1b0e0e] dark:text-white text-3xl font-bold tracking-tight">
                                    {isRTL ? 'مرحباً، د. أحمد' : 'Welcome back, Dr. Ahmed'}
                                </h2>
                                <p className="text-[#5c4545] dark:text-[#d0c0c0]">
                                    {isRTL ? 'إليك جدولك ونشاطاتك لهذا اليوم' : 'Here\'s your schedule and activities for today'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-surface-dark px-4 py-2 rounded-lg shadow-sm border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#1b0e0e] dark:text-white">
                                <span className="material-symbols-outlined text-primary">calendar_today</span>
                                <span>{formattedDate}</span>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">groups</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">142</p>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'إجمالي الطلاب' : 'Total Students'}</p>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">class</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">3</p>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'محاضرات اليوم' : 'Classes Today'}</p>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">pending_actions</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">3</p>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'طلبات مواعيد' : 'Pending Requests'}</p>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">5</p>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'رسائل غير مقروءة' : 'Unread Messages'}</p>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Today's Schedule */}
                            <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                    <h3 className="font-bold text-lg text-[#1b0e0e] dark:text-white">{isRTL ? 'جدول اليوم' : 'Today\'s Schedule'}</h3>
                                    <button className="text-sm text-primary font-medium hover:underline">{isRTL ? 'عرض الكل' : 'View All'}</button>
                                </div>
                                <div className="divide-y divide-[#e7d0d1] dark:divide-[#3a2a2a]">
                                    {todayClasses.map((cls) => (
                                        <div key={cls.id} className="p-5 hover:bg-[#f3e7e8]/50 dark:hover:bg-[#3a2a2a]/50 transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                                                    <span className="material-symbols-outlined">{cls.code ? 'class' : 'schedule'}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h4 className="font-bold text-[#1b0e0e] dark:text-white">{cls.name}</h4>
                                                            {cls.code && <p className="text-sm text-primary font-medium">{cls.code}</p>}
                                                        </div>
                                                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full shrink-0">
                                                            {isRTL ? 'قادم' : 'Upcoming'}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                            {cls.time}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                            {cls.location}
                                                        </span>
                                                        {cls.students && (
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[16px]">group</span>
                                                                {cls.students} {isRTL ? 'طالب' : 'students'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pending Appointments */}
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                    <h3 className="font-bold text-lg text-[#1b0e0e] dark:text-white">{isRTL ? 'طلبات المواعيد' : 'Appointment Requests'}</h3>
                                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">3</span>
                                </div>
                                <div className="divide-y divide-[#e7d0d1] dark:divide-[#3a2a2a]">
                                    {pendingAppointments.map((apt) => (
                                        <div key={apt.id} className="p-4 hover:bg-[#f3e7e8]/50 dark:hover:bg-[#3a2a2a]/50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                {apt.image ? (
                                                    <div className="size-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${apt.image}")` }}></div>
                                                ) : (
                                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-[#1b0e0e] dark:text-white text-sm">{apt.studentName}</p>
                                                    <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{apt.reason}</p>
                                                    <p className="text-xs text-primary mt-1">{apt.requestedTime}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <button className="flex-1 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors">
                                                    {isRTL ? 'قبول' : 'Accept'}
                                                </button>
                                                <button className="flex-1 py-1.5 border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] text-xs font-medium rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                                    {isRTL ? 'رفض' : 'Decline'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-3 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                                    <button className="w-full py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                        {isRTL ? 'عرض جميع الطلبات' : 'View All Requests'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FacultyDashboard;
