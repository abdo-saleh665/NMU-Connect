import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import { getEvents, rsvpEvent } from '../api/events';

const Events = () => {
    const { t, isRTL } = useLanguage();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [error, setError] = useState(null);
    const [rsvpLoading, setRsvpLoading] = useState(null);
    const dataLoaded = useRef(false);
    const animationComplete = useRef(false);

    // Handle loading screen completion - only hide when both API and animation are done
    const handleLoadingComplete = () => {
        animationComplete.current = true;
        if (dataLoaded.current) {
            setIsLoading(false);
        }
    };

    // Fetch events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const result = await getEvents({ upcoming: 'true' });
                if (result.success) {
                    setEvents(result.events.map(e => ({
                        id: e._id,
                        title: e.title,
                        titleAr: e.titleAr || e.title,
                        date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        dateAr: new Date(e.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
                        time: e.time || new Date(e.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        location: e.location,
                        locationAr: e.locationAr || e.location,
                        category: e.category || 'other',
                        categoryLabel: e.category?.charAt(0).toUpperCase() + e.category?.slice(1) || 'Other',
                        categoryLabelAr: e.category || 'أخرى',
                        color: 'bg-primary',
                        attendees: e.attendeeCount || 0,
                        featured: e.isFeatured,
                        description: e.description,
                        descriptionAr: e.descriptionAr || e.description,
                        isAttending: e.isAttending || false
                    })));

                    // Filter for user's registered events
                    setMyEvents(result.events.filter(e => e.isAttending).map(e => ({
                        id: e._id,
                        title: e.title,
                        titleAr: e.titleAr || e.title,
                        date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        dateAr: new Date(e.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
                        time: e.time || new Date(e.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        status: 'confirmed',
                        statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    })));
                } else {
                    setError(result.error || 'Failed to load events');
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events');
            } finally {
                dataLoaded.current = true;
                if (animationComplete.current) {
                    setIsLoading(false);
                }
            }
        };

        fetchEvents();
    }, []);

    // Handle RSVP
    const handleRSVP = async (eventId) => {
        setRsvpLoading(eventId);
        try {
            const result = await rsvpEvent(eventId);
            if (result.success) {
                setEvents(prev => prev.map(e =>
                    e.id === eventId
                        ? { ...e, isAttending: result.isAttending, attendees: result.attendeeCount }
                        : e
                ));
            }
        } catch (err) {
            console.error('RSVP error:', err);
        } finally {
            setRsvpLoading(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Notifications data
    const notifications = [
        { id: 1, title: isRTL ? 'حدث جديد' : 'New Event', message: isRTL ? 'تم إضافة معرض التوظيف' : 'Tech Career Fair added', time: isRTL ? 'منذ ساعة' : '1h ago', read: false, icon: 'event' },
        { id: 2, title: isRTL ? 'تذكير' : 'Reminder', message: isRTL ? 'ورشة الذكاء الاصطناعي غداً' : 'AI Workshop tomorrow', time: isRTL ? 'منذ 3 ساعات' : '3h ago', read: true, icon: 'notifications' },
    ];

    // Stats (dynamic based on loaded events)
    const stats = [
        { icon: 'event', label: 'Total Events', labelAr: 'إجمالي الفعاليات', value: String(events.length), color: 'bg-primary/10 text-primary' },
        { icon: 'event_available', label: 'This Week', labelAr: 'هذا الأسبوع', value: String(events.filter(e => e.featured).length), color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
        { icon: 'how_to_reg', label: 'Registered', labelAr: 'مسجل بها', value: String(myEvents.length), color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    ];

    const categories = [
        { id: 'all', name: 'All Events', nameAr: 'جميع الفعاليات', icon: 'event', count: 24 },
        { id: 'academic', name: 'Academic', nameAr: 'أكاديمي', icon: 'school', count: 8 },
        { id: 'career', name: 'Career', nameAr: 'وظائف', icon: 'work', count: 5 },
        { id: 'sports', name: 'Sports', nameAr: 'رياضة', icon: 'sports_soccer', count: 6 },
        { id: 'social', name: 'Social', nameAr: 'اجتماعي', icon: 'groups', count: 5 }
    ];

    const filteredEvents = selectedCategory === 'all'
        ? events
        : events.filter(e => e.category === selectedCategory);

    const announcements = [
        {
            title: 'Registration Deadline Extended',
            titleAr: 'تمديد موعد التسجيل',
            message: 'Spring semester registration deadline extended to Nov 15.',
            messageAr: 'تم تمديد موعد تسجيل الفصل الربيعي إلى 15 نوفمبر.',
            type: 'important',
            time: '2 hours ago',
            timeAr: 'منذ ساعتين'
        }
    ];

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark">
            {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64 p-4' : 'w-0 p-0'} flex-shrink-0 bg-surface-light dark:bg-surface-dark ${sidebarOpen ? 'border-r' : ''} border-[#e7d0d1] dark:border-[#3a2a2a] flex-col justify-between hidden lg:flex h-full overflow-hidden transition-all duration-300`}>
                <div className={`flex flex-col gap-6 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                            <h1 className="text-[#1b0e0e] dark:text-white text-lg font-bold leading-normal">Student Portal</h1>
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
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('dashboard')}</span>
                        </Link>
                        <Link to="/appointment" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">calendar_month</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('schedule')}</span>
                        </Link>
                        <Link to="/tutoring" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">school</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('peerTutoring')}</span>
                        </Link>
                        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined icon-filled">event</span>
                            <span className="text-sm font-semibold">{t('events')}</span>
                        </div>
                        <Link to="/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">campaign</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('complaints')}</span>
                        </Link>
                        <Link to="/lost-found" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">search</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('lostAndFound')}</span>
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-surface-light dark:bg-surface-dark border-b border-[#e7d0d1] dark:border-[#3a2a2a] shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className={`${sidebarOpen ? 'hidden' : 'hidden lg:flex'} p-2 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors`}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{t('events')}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileMenuOpen(false); }}
                                className="relative p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">notifications</span>
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute top-1 right-1 size-2 bg-primary rounded-full"></span>
                                )}
                            </button>
                            {notificationsOpen && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50">
                                    <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a] flex items-center justify-between">
                                        <h3 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الإشعارات' : 'Notifications'}</h3>
                                        <span className="text-xs text-primary font-medium cursor-pointer hover:underline">{isRTL ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div key={notification.id} className={`px-4 py-3 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                        <span className="material-symbols-outlined text-[16px]">{notification.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-[#1b0e0e] dark:text-white">{notification.title}</p>
                                                        <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0] truncate">{notification.message}</p>
                                                        <p className="text-xs text-[#994d51] mt-1">{notification.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="h-8 w-[1px] bg-[#e7d0d1] dark:bg-[#3a2a2a]"></div>
                        <div className="relative">
                            <button
                                onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); }}
                                className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity"
                            >
                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-[#f3e7e8] dark:border-[#3a2a2a]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY")' }}></div>
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="text-sm font-bold text-[#1b0e0e] dark:text-white leading-none">Ahmed M.</p>
                                    <p className="text-xs text-[#994d51] mt-1 leading-none">ID: 20230154</p>
                                </div>
                                <span className="material-symbols-outlined text-[18px] text-[#5c4545] dark:text-[#d0c0c0] hidden md:block">{profileMenuOpen ? 'expand_less' : 'expand_more'}</span>
                            </button>
                            {profileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50">
                                    <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <p className="text-sm font-bold text-[#1b0e0e] dark:text-white">Ahmed Mohamed</p>
                                        <p className="text-xs text-[#994d51]">ahmed.m@nmu.edu.eg</p>
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="space-y-8">
                        {/* Error Alert */}
                        {error && (
                            <ErrorAlert
                                message={error}
                                messageAr="فشل في تحميل الفعاليات"
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
                                    <input
                                        className="w-full h-12 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-base px-3"
                                        placeholder={isRTL ? 'ابحث عن الفعاليات...' : 'Search events...'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
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

                        {/* My Events Section */}
                        {myEvents.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">bookmark</span>
                                    {isRTL ? 'فعالياتي المسجلة' : 'My Registered Events'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {myEvents.map((event) => (
                                        <div key={event.id} className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl p-5 border border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${event.statusColor}`}>
                                                            {event.status === 'confirmed' ? (isRTL ? 'مؤكد' : 'Confirmed') : (isRTL ? 'قيد الانتظار' : 'Pending')}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-[#1b0e0e] dark:text-white group-hover:text-primary transition-colors">
                                                        {isRTL ? event.titleAr : event.title}
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-2 text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                            {isRTL ? event.dateAr : event.date}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                            {event.time}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="material-symbols-outlined text-[#5c4545] dark:text-[#d0c0c0] group-hover:text-primary transition-colors">chevron_right</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Announcements Banner */}
                        <div className="bg-gradient-to-r from-primary to-red-700 rounded-2xl p-5 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="flex items-center gap-2 mb-3 relative z-10">
                                <span className="material-symbols-outlined">campaign</span>
                                <span className="font-bold">{isRTL ? 'آخر الإعلانات' : 'Latest Announcements'}</span>
                            </div>
                            {announcements.slice(0, 1).map((announcement, index) => (
                                <div key={index} className="relative z-10">
                                    <p className="font-medium">{isRTL ? announcement.titleAr : announcement.title}</p>
                                    <p className="text-sm text-white/80">{isRTL ? announcement.messageAr : announcement.message}</p>
                                </div>
                            ))}
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${selectedCategory === category.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'bg-surface-light dark:bg-surface-dark text-[#5c4545] dark:text-[#d0c0c0] border border-[#e7d0d1] dark:border-[#3a2a2a] hover:border-primary/50'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{category.icon}</span>
                                    {isRTL ? category.nameAr : category.name}
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.id ? 'bg-white/20' : 'bg-[#f3e7e8] dark:bg-[#3a2a2a]'
                                        }`}>
                                        {category.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Featured Events */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredEvents.filter(e => e.featured).map((event) => (
                                <div
                                    key={event.id}
                                    className="relative bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-[#e7d0d1] dark:border-[#3a2a2a] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                                >
                                    <div className={`h-32 ${event.color} relative`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase">
                                                {isRTL ? 'مميز' : 'Featured'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-2xl font-black">{isRTL ? event.dateAr : event.date}</p>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                            <div>
                                                <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold mb-2">
                                                    {isRTL ? event.categoryLabelAr : event.categoryLabel}
                                                </span>
                                                <h3 className="text-xl font-bold text-[#1b0e0e] dark:text-white group-hover:text-primary transition-colors">
                                                    {isRTL ? event.titleAr : event.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-4 line-clamp-2">
                                            {isRTL ? event.descriptionAr : event.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-4">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                                {event.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[18px]">location_on</span>
                                                {isRTL ? event.locationAr : event.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-[#251515] flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-xs text-[#5c4545]">person</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-[#5c4545]">{event.attendees} {isRTL ? 'مشترك' : 'attending'}</span>
                                            </div>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25">
                                                {isRTL ? 'التسجيل' : 'RSVP'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* All Events List */}
                        <div>
                            <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white mb-4">{isRTL ? 'الفعاليات القادمة' : 'Upcoming Events'}</h2>
                            <div className="space-y-4">
                                {filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-300 flex gap-5"
                                    >
                                        <div className={`size-16 ${event.color} rounded-2xl flex flex-col items-center justify-center text-white shrink-0`}>
                                            <span className="text-xs font-medium uppercase">{event.date.split(' ')[0]}</span>
                                            <span className="text-xl font-bold">{event.date.split(' ')[1]}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <span className="text-xs font-bold text-primary uppercase">{isRTL ? event.categoryLabelAr : event.categoryLabel}</span>
                                                    <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">{isRTL ? event.titleAr : event.title}</h3>
                                                </div>
                                                <button className="shrink-0 px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary/20 transition-colors">
                                                    {isRTL ? 'التسجيل' : 'RSVP'}
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                    {event.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                    {isRTL ? event.locationAr : event.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">group</span>
                                                    {event.attendees} {isRTL ? 'مشترك' : 'attending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Events;



