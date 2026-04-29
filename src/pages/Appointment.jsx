import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import ErrorAlert from '../components/ErrorAlert';
import { getAppointments, createAppointment } from '../api/appointments';

const Appointment = () => {
    const { t, isRTL } = useLanguage();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('academic');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);
    const dataLoaded = useRef(false);
    const animationComplete = useRef(false);

    const handleLoadingComplete = () => {
        animationComplete.current = true;
        if (dataLoaded.current) {
            setIsLoading(false);
        }
    };

    // Fetch appointments from API
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const result = await getAppointments();
                if (result.success) {
                    setUpcomingAppointments(result.appointments.map(apt => {
                        const scheduledDate = new Date(apt.scheduledAt);
                        return {
                            id: apt._id,
                            staff: apt.faculty?.name || 'Staff',
                            staffAr: apt.faculty?.nameAr || apt.faculty?.name,
                            dept: apt.faculty?.department || 'Department',
                            deptAr: apt.faculty?.departmentAr || apt.faculty?.department,
                            date: scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            dateAr: scheduledDate.toLocaleDateString('ar-EG'),
                            time: scheduledDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                            office: apt.faculty?.office || 'TBD',
                            status: apt.status
                        };
                    }));
                }
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Failed to load appointments');
            } finally {
                dataLoaded.current = true;
                if (animationComplete.current) {
                    setIsLoading(false);
                }
            }
        };

        fetchAppointments();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const categories = [
        { id: 'academic', icon: 'school', en: 'Academic Staff', ar: 'هيئة التدريس', descEn: 'Book with professors & instructors', descAr: 'احجز مع الأساتذة والمدرسين', gradient: 'from-blue-500 to-indigo-600' },
        { id: 'affairs', icon: 'groups', en: 'Student Affairs', ar: 'شؤون الطلاب', descEn: 'Administrative support services', descAr: 'خدمات الدعم الإداري', gradient: 'from-emerald-500 to-teal-600' },
    ];

    // Quick stats (dynamic) - handle different status values from API
    const upcomingCount = upcomingAppointments.filter(a =>
        a.status !== 'completed' && a.status !== 'cancelled' && a.status !== 'rejected'
    ).length;
    const completedCount = upcomingAppointments.filter(a => a.status === 'completed').length;

    const stats = [
        { label: 'This Month', labelAr: 'هذا الشهر', value: upcomingAppointments.length, icon: 'calendar_month', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
        { label: 'Upcoming', labelAr: 'القادمة', value: upcomingCount, icon: 'schedule', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
        { label: 'Completed', labelAr: 'المكتملة', value: completedCount, icon: 'check_circle', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    ];

    const staffByCategory = {
        academic: [
            { name: 'Dr. Ahmed Hassan', nameAr: 'د. أحمد حسن', dept: 'Computer Science', deptAr: 'علوم الحاسوب', office: '302', status: 'available', specialty: 'AI & Machine Learning', specialtyAr: 'الذكاء الاصطناعي وتعلم الآلة', rating: 4.9, reviews: 45, nextSlot: '10:00 AM Today' },
            { name: 'Eng. Fatima Ali', nameAr: 'م. فاطمة علي', dept: 'Engineering', deptAr: 'الهندسة', office: '205', status: 'busy', specialty: 'Structural Engineering', specialtyAr: 'الهندسة الإنشائية', rating: 4.7, reviews: 32, nextSlot: 'Tomorrow' },
            { name: 'Prof. Mohamed Salem', nameAr: 'أ.د. محمد سالم', dept: 'Medicine', deptAr: 'الطب', office: '108', status: 'available', specialty: 'Internal Medicine', specialtyAr: 'الطب الباطني', rating: 4.8, reviews: 67, nextSlot: '11:30 AM Today' },
        ],
        affairs: [
            { name: 'Ms. Noura Ahmed', nameAr: 'أ. نورة أحمد', dept: 'Student Services', deptAr: 'خدمات الطلاب', office: '101', status: 'available', specialty: 'Student Support', specialtyAr: 'دعم الطلاب', rating: 4.6, reviews: 28, nextSlot: '9:30 AM Today' },
            { name: 'Mr. Khaled Mostafa', nameAr: 'أ. خالد مصطفى', dept: 'Activities', deptAr: 'الأنشطة', office: '103', status: 'available', specialty: 'Campus Events', specialtyAr: 'فعاليات الحرم', rating: 4.5, reviews: 19, nextSlot: '2:00 PM Today' },
        ],
    };

    // Generate remaining dates in current work week (Sat-Thu)
    // Friday is off. If past Thu or it's Fri, show next week
    const getDates = () => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayNamesAr = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
        const dates = [];
        const now = new Date();
        const currentDay = now.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
        const currentHour = now.getHours();

        // Work days: Sat(6), Sun(0), Mon(1), Tue(2), Wed(3), Thu(4)
        // Friday(5) is off

        let startDate = new Date(now);

        // If past 3 PM, start from tomorrow
        if (currentHour >= 15) {
            startDate.setDate(startDate.getDate() + 1);
        }

        // If it's Friday, jump to Saturday
        if (startDate.getDay() === 5) {
            startDate.setDate(startDate.getDate() + 1);
        }

        // Calculate days until end of work week (Thursday)
        // From current day, count remaining days until Thursday (inclusive)
        const currentStartDay = startDate.getDay();

        // Add remaining days of this work week
        let tempDate = new Date(startDate);
        while (tempDate.getDay() !== 5) { // Stop before Friday
            if (tempDate.getDay() !== 5) { // Skip Friday (should not happen but safety check)
                dates.push({
                    day: dayNames[tempDate.getDay()],
                    dayAr: dayNamesAr[tempDate.getDay()],
                    date: tempDate.getDate(),
                    month: tempDate.getMonth() + 1,
                    fullDate: new Date(tempDate)
                });
            }
            tempDate.setDate(tempDate.getDate() + 1);

            // If we've passed Thursday and reached Friday, break
            if (tempDate.getDay() === 5) break;
        }

        // If no dates available (it's Thu after 3PM or Fri), show next week Sat-Thu
        if (dates.length === 0) {
            // Find next Saturday
            let nextSat = new Date(now);
            while (nextSat.getDay() !== 6) {
                nextSat.setDate(nextSat.getDate() + 1);
            }

            // Add Sat through Thu (6 days)
            for (let i = 0; i < 6; i++) {
                dates.push({
                    day: dayNames[nextSat.getDay()],
                    dayAr: dayNamesAr[nextSat.getDay()],
                    date: nextSat.getDate(),
                    month: nextSat.getMonth() + 1,
                    fullDate: new Date(nextSat)
                });
                nextSat.setDate(nextSat.getDate() + 1);
            }
        }

        return dates;
    };

    const dates = getDates();

    const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'];

    const handleBookAppointment = (staff) => {
        setSelectedStaff(staff);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleConfirmBooking = () => {
        setShowConfirmation(true);
    };

    const handleCloseModal = () => {
        setSelectedStaff(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setShowConfirmation(false);
    };

    return (
        <div className={`flex h-screen w-full bg-background-light dark:bg-background-dark`}>
            {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
            {/* SideNavBar */}
            <aside className={`${sidebarOpen ? 'w-64 p-4' : 'w-0 p-0'} flex-shrink-0 bg-surface-light dark:bg-surface-dark ${sidebarOpen ? (isRTL ? 'border-l' : 'border-r') : ''} border-[#e7d0d1] dark:border-[#3a2a2a] flex-col justify-between hidden md:flex h-full overflow-hidden transition-all duration-300`}>
                <div className={`flex flex-col gap-6 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                            <h1 className="text-[#1b0e0e] dark:text-white text-lg font-bold leading-normal">
                                {t('studentPortal')}
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
                        <Link to="/student" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">dashboard</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('dashboard')}</p>
                        </Link>
                        <Link to="/appointment" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">calendar_month</span>
                            <p className="text-sm font-semibold leading-normal">{t('schedule')}</p>
                        </Link>
                        <Link to="/tutoring" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">school</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('peerTutoring')}</p>
                        </Link>
                        <Link to="/events" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">event</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('events')}</p>
                        </Link>
                        <Link to="/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">report_problem</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('complaints')}</p>
                        </Link>
                        <Link to="/lost-found" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">search</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('lostAndFound')}</p>
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
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{t('schedule')}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notification Button */}
                        <div className="relative">
                            <button
                                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileMenuOpen(false); }}
                                className="relative flex items-center justify-center size-10 rounded-full hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-1 right-1 size-2.5 bg-primary rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
                            </button>
                            {notificationsOpen && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg z-50 overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <h3 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الإشعارات' : 'Notifications'}</h3>
                                        <button className="text-xs text-primary font-medium hover:underline">{isRTL ? 'تحديد الكل كمقروء' : 'Mark all as read'}</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        <div className="flex gap-3 px-4 py-3 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors cursor-pointer border-b border-[#e7d0d1]/50 dark:border-[#3a2a2a]/50 bg-primary/5">
                                            <div className="size-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                                                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[#1b0e0e] dark:text-white truncate">{isRTL ? 'تأكيد الموعد' : 'Appointment Confirmed'}</p>
                                                <p className="text-xs text-[#5c4545] dark:text-[#998888] truncate mt-0.5">{isRTL ? 'موعدك مع د. أحمد حسن تم تأكيده' : 'Your appointment with Dr. Ahmed Hassan is confirmed'}</p>
                                                <p className="text-xs text-[#994d51] mt-1">{isRTL ? 'منذ ساعتين' : '2 hours ago'}</p>
                                            </div>
                                            <span className="size-2 bg-primary rounded-full shrink-0 mt-1.5"></span>
                                        </div>
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
                        <div className="relative">
                            <button
                                onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); }}
                                className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity"
                            >
                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-[#f3e7e8] dark:border-[#3a2a2a]" style={{ backgroundImage: `url("${user?.avatar || 'https://via.placeholder.com/40'}")` }}></div>
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="text-sm font-bold text-[#1b0e0e] dark:text-white leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
                                    <p className="text-xs text-[#994d51] mt-1 leading-none">ID: {user?.studentId || user?._id?.slice(-6) || ''}</p>
                                </div>
                                <span className="material-symbols-outlined text-[18px] text-[#5c4545] dark:text-[#d0c0c0] hidden md:block">{profileMenuOpen ? 'expand_less' : 'expand_more'}</span>
                            </button>
                            {profileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50">
                                    <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <p className="text-sm font-bold text-[#1b0e0e] dark:text-white">{user?.name || 'User'}</p>
                                        <p className="text-xs text-[#994d51]">{user?.email || ''}</p>
                                    </div>
                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                        {t('profile') || 'My Profile'}
                                    </Link>
                                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
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

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex flex-col gap-8">
                        {/* Error Alert */}
                        {error && (
                            <ErrorAlert
                                message={error}
                                messageAr="فشل في تحميل المواعيد"
                                onRetry={() => window.location.reload()}
                            />
                        )}
                        {/* Search Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 max-w-xl">
                                <div className="flex w-full items-stretch rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <div className="text-primary flex items-center justify-center pl-4">
                                        <span className="material-symbols-outlined text-[22px]">search</span>
                                    </div>
                                    <input className="w-full h-12 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-base px-3" placeholder={isRTL ? 'ابحث عن الموظفين أو الخدمات...' : 'Search for staff or services...'} />
                                </div>
                            </div>
                            <button className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 cursor-pointer shrink-0">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                {isRTL ? 'حجز موعد جديد' : 'Book New Appointment'}
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-[#e7d0d1] dark:border-[#3a2a2a] flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                        <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{stat.value}</p>
                                        <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? stat.labelAr : stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Upcoming Appointments */}
                        {upcomingAppointments.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">event_upcoming</span>
                                        {isRTL ? 'مواعيدك القادمة' : 'Your Upcoming Appointments'}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {upcomingAppointments.map((apt) => (
                                        <div key={apt.id} className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl p-5 border border-primary/20 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="flex items-start justify-between relative z-10">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-primary text-2xl">person</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? apt.staffAr : apt.staff}</h3>
                                                        <p className="text-sm text-primary font-medium">{isRTL ? apt.deptAr : apt.dept}</p>
                                                        <div className="flex items-center gap-3 mt-2 text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                                {isRTL ? apt.dateAr : apt.date}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                                {apt.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                    {apt.status === 'confirmed' ? (isRTL ? 'مؤكد' : 'Confirmed') : (isRTL ? 'قيد الانتظار' : 'Pending')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/10">
                                                <span className="material-symbols-outlined text-[16px] text-[#5c4545] dark:text-[#d0c0c0]">location_on</span>
                                                <span className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'مكتب' : 'Office'} {apt.office}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Category Selection - Enhanced */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white">
                                {isRTL ? 'حجز موعد جديد' : 'Book New Appointment'}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`relative overflow-hidden flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${selectedCategory === cat.id
                                            ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25'
                                            : 'border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark text-[#1b0e0e] dark:text-white hover:border-primary/50 hover:shadow-md'
                                            }`}
                                    >
                                        {selectedCategory === cat.id && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                        )}
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${selectedCategory === cat.id ? 'bg-white/20' : `bg-gradient-to-br ${cat.gradient} text-white`}`}>
                                            <span className={`material-symbols-outlined text-4xl ${selectedCategory === cat.id ? 'icon-filled' : ''}`}>{cat.icon}</span>
                                        </div>
                                        <div className="text-center relative z-10">
                                            <span className="text-base font-bold block">{isRTL ? cat.ar : cat.en}</span>
                                            <span className={`text-xs mt-1 block ${selectedCategory === cat.id ? 'text-white/80' : 'text-[#5c4545] dark:text-[#d0c0c0]'}`}>
                                                {isRTL ? cat.descAr : cat.descEn}
                                            </span>
                                        </div>
                                        {selectedCategory === cat.id && (
                                            <div className="absolute top-3 right-3">
                                                <span className="material-symbols-outlined text-white/80">check_circle</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Staff List - Enhanced */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white">
                                    {isRTL ? 'اختر موظفاً' : 'Select Staff Member'}
                                </h2>
                                <span className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                    {staffByCategory[selectedCategory]?.length} {isRTL ? 'متاح' : 'available'}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {staffByCategory[selectedCategory]?.map((staff, index) => (
                                    <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                        <div className="flex items-start gap-4">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary/20">
                                                    <span className="material-symbols-outlined text-3xl text-white">person</span>
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-surface-light dark:border-surface-dark flex items-center justify-center ${staff.status === 'available' ? 'bg-green-500' : 'bg-amber-500'}`}>
                                                    <span className="material-symbols-outlined text-white text-[12px]">{staff.status === 'available' ? 'check' : 'schedule'}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-[#1b0e0e] dark:text-white group-hover:text-primary transition-colors truncate">
                                                    {isRTL ? staff.nameAr : staff.name}
                                                </h3>
                                                <p className="text-sm text-primary font-medium truncate">
                                                    {isRTL ? staff.deptAr : staff.dept}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-[#e7d0d1] dark:border-[#3a2a2a] space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'التخصص' : 'Specialty'}</span>
                                                <span className="text-[#1b0e0e] dark:text-white font-medium truncate max-w-[60%]">{isRTL ? staff.specialtyAr : staff.specialty}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'المكتب' : 'Office'}</span>
                                                <span className="text-[#1b0e0e] dark:text-white font-medium">{staff.office}</span>
                                            </div>
                                            {staff.status === 'available' && (
                                                <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg">
                                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                    <span className="font-medium">{isRTL ? 'متاح الآن: ' : 'Next: '}{staff.nextSlot}</span>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleBookAppointment(staff)}
                                            disabled={staff.status !== 'available'}
                                            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all text-sm ${staff.status === 'available' ? 'bg-primary text-white hover:bg-primary-hover hover:shadow-lg cursor-pointer' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
                                        >
                                            {staff.status === 'available' ? (isRTL ? 'حجز موعد' : 'Book Appointment') : (isRTL ? 'غير متاح حالياً' : 'Currently Unavailable')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {selectedStaff && !showConfirmation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl w-full max-w-lg shadow-2xl animate-[fadeIn_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                            <div>
                                <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">
                                    {isRTL ? 'حجز موعد' : 'Book Appointment'}
                                </h2>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                    {isRTL ? selectedStaff.nameAr : selectedStaff.name}
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-[#5c4545] dark:text-[#d0c0c0]">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Date Selection */}
                            <div>
                                <h3 className="text-sm font-semibold text-[#1b0e0e] dark:text-white mb-3">
                                    {isRTL ? 'اختر التاريخ' : 'Select Date'}
                                </h3>
                                <div className="flex gap-2">
                                    {dates.map((d, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(d.date)}
                                            className={`flex-1 flex flex-col items-center py-3 rounded-xl border-2 transition-all cursor-pointer ${selectedDate === d.date
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-[#e7d0d1] dark:border-[#3a2a2a] text-[#1b0e0e] dark:text-white hover:border-primary/50'
                                                }`}
                                        >
                                            <span className="text-xs font-medium">{isRTL ? d.dayAr : d.day}</span>
                                            <span className="text-lg font-bold">{d.date}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div>
                                <h3 className="text-sm font-semibold text-[#1b0e0e] dark:text-white mb-3">
                                    {isRTL ? 'اختر الوقت' : 'Select Time'}
                                </h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map((time, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all cursor-pointer ${selectedTime === time
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-[#e7d0d1] dark:border-[#3a2a2a] text-[#1b0e0e] dark:text-white hover:border-primary/50'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Working Hours Note */}
                            <div className="flex items-center gap-2 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                                <span className="material-symbols-outlined text-primary text-xl">info</span>
                                <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">
                                    {isRTL ? 'ساعات العمل: الأحد - الخميس، 9 ص - 3 م' : 'Working hours: Sun - Thu, 9 AM - 3 PM'}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                            <button onClick={handleCloseModal} className="flex-1 py-3 rounded-xl border-2 border-[#e7d0d1] dark:border-[#3a2a2a] font-semibold text-[#1b0e0e] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                {isRTL ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                                onClick={handleConfirmBooking}
                                disabled={!selectedDate || !selectedTime}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${selectedDate && selectedTime ? 'bg-primary text-white hover:bg-primary-hover cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                {isRTL ? 'تأكيد الحجز' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl w-full max-w-md p-8 shadow-2xl animate-[fadeIn_0.3s_ease-out] text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1b0e0e] dark:text-white mb-2">
                            {isRTL ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}
                        </h2>
                        <p className="text-[#5c4545] dark:text-[#d0c0c0] mb-6">
                            {isRTL
                                ? `تم حجز موعدك مع ${selectedStaff.nameAr} يوم ${selectedDate} ديسمبر الساعة ${selectedTime}`
                                : `Your appointment with ${selectedStaff.name} is confirmed for Dec ${selectedDate} at ${selectedTime}`
                            }
                        </p>
                        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-center gap-2 text-primary">
                                <span className="material-symbols-outlined">mail</span>
                                <span className="text-sm font-medium">{isRTL ? 'تم إرسال تأكيد عبر البريد الإلكتروني' : 'Confirmation email sent'}</span>
                            </div>
                        </div>
                        <button onClick={handleCloseModal} className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors cursor-pointer">
                            {isRTL ? 'تم' : 'Done'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointment;



