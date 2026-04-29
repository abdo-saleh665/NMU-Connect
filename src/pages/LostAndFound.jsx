import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import { getLostItems, getMyItems, claimItem } from '../api/lostItems';

const LostAndFound = () => {
    const { t, isRTL } = useLanguage();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [items, setItems] = useState([]);
    const [myItems, setMyItems] = useState([]);
    const [error, setError] = useState(null);
    const [claimLoading, setClaimLoading] = useState(null);
    const dataLoaded = useRef(false);
    const animationComplete = useRef(false);

    const handleLoadingComplete = () => {
        animationComplete.current = true;
        if (dataLoaded.current) {
            setIsLoading(false);
        }
    };

    // Fetch items from API
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const [allResult, myResult] = await Promise.all([
                    getLostItems({ type: selectedFilter !== 'all' ? selectedFilter : undefined }),
                    getMyItems()
                ]);

                if (allResult.success) {
                    setItems(allResult.items.map(item => ({
                        id: item._id,
                        title: item.title,
                        titleAr: item.titleAr || item.title,
                        type: item.type,
                        category: item.category,
                        categoryAr: item.categoryAr || item.category,
                        location: item.location,
                        locationAr: item.locationAr || item.location,
                        date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        dateAr: new Date(item.createdAt).toLocaleDateString('ar-EG'),
                        description: item.description,
                        descriptionAr: item.descriptionAr || item.description,
                        status: item.status || 'active',
                        image: item.image
                    })));
                }

                if (myResult.success) {
                    setMyItems(myResult.items.map(item => ({
                        id: item._id,
                        title: item.title,
                        titleAr: item.titleAr || item.title,
                        type: item.type,
                        status: item.status || 'active',
                        statusColor: item.status === 'claimed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        dateAr: new Date(item.createdAt).toLocaleDateString('ar-EG'),
                        location: item.location,
                        locationAr: item.locationAr || item.location
                    })));
                }
            } catch (err) {
                console.error('Error fetching items:', err);
                setError('Failed to load items');
            } finally {
                dataLoaded.current = true;
                if (animationComplete.current) {
                    setIsLoading(false);
                }
            }
        };

        fetchItems();
    }, [selectedFilter]);

    // Handle claim
    const handleClaim = async (itemId) => {
        setClaimLoading(itemId);
        try {
            const result = await claimItem(itemId);
            if (result.success) {
                setItems(prev => prev.map(item =>
                    item.id === itemId ? { ...item, status: 'claimed' } : item
                ));
            }
        } catch (err) {
            console.error('Claim error:', err);
        } finally {
            setClaimLoading(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Notifications
    const notifications = [
        { id: 1, title: isRTL ? 'تطابق محتمل' : 'Possible Match', message: isRTL ? 'شخص ما وجد عنصراً مشابهاً' : 'Someone found a similar item', time: isRTL ? 'منذ 30 دقيقة' : '30m ago', read: false, icon: 'search' },
        { id: 2, title: isRTL ? 'تم المطالبة' : 'Item Claimed', message: isRTL ? 'تمت المطالبة بعنصرك' : 'Your item has been claimed', time: isRTL ? 'منذ ساعتين' : '2h ago', read: true, icon: 'check' },
    ];

    // Filter tabs
    const filterTabs = [
        { id: 'all', en: 'All Items', ar: 'كل العناصر', icon: 'category' },
        { id: 'lost', en: 'Lost', ar: 'مفقود', icon: 'search_off', color: 'from-red-500 to-rose-600' },
        { id: 'found', en: 'Found', ar: 'موجود', icon: 'inventory_2', color: 'from-green-500 to-emerald-600' },
    ];

    const categories = [
        { id: 'all', name: 'All Items', nameAr: 'جميع العناصر', count: items.length },
        { id: 'electronics', name: 'Electronics', nameAr: 'إلكترونيات', count: items.filter(i => i.category?.toLowerCase() === 'electronics').length },
        { id: 'documents', name: 'Documents', nameAr: 'مستندات', count: items.filter(i => i.category?.toLowerCase() === 'documents').length },
        { id: 'accessories', name: 'Accessories', nameAr: 'إكسسوارات', count: items.filter(i => i.category?.toLowerCase() === 'accessories').length },
        { id: 'books', name: 'Books', nameAr: 'كتب', count: items.filter(i => i.category?.toLowerCase() === 'books').length },
        { id: 'other', name: 'Other', nameAr: 'أخرى', count: items.filter(i => !['electronics', 'documents', 'accessories', 'books'].includes(i.category?.toLowerCase())).length }
    ];

    const filteredItems = items.filter(item => {
        if (selectedFilter !== 'all' && item.type !== selectedFilter) return false;
        if (selectedCategory !== 'all' && item.category?.toLowerCase() !== selectedCategory) return false;
        return true;
    });

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
                        <Link to="/events" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">event</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('events')}</span>
                        </Link>
                        <Link to="/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">campaign</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('complaints')}</span>
                        </Link>
                        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined icon-filled">search</span>
                            <span className="text-sm font-semibold">{t('lostAndFound')}</span>
                        </div>
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
                            className={`${sidebarOpen ? 'hidden' : 'hidden lg:flex'} p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors`}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{t('lostAndFound')}</h2>
                    </div>
                    <div className="flex items-center gap-3">
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
                                messageAr="فشل في تحميل العناصر"
                                onRetry={() => window.location.reload()}
                            />
                        )}
                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex-1 max-w-xl">
                                <div className="flex w-full items-stretch rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <div className="text-primary flex items-center justify-center pl-4">
                                        <span className="material-symbols-outlined text-[22px]">search</span>
                                    </div>
                                    <input
                                        className="w-full h-12 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-base px-3"
                                        placeholder={isRTL ? 'ابحث عن العناصر المفقودة أو الموجودة...' : 'Search lost or found items...'}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 px-5 py-3 bg-surface-light dark:bg-surface-dark border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] font-medium rounded-xl hover:border-primary/50 transition-colors">
                                    <span className="material-symbols-outlined text-[18px] text-primary">search_off</span>
                                    {t('reportLost')}
                                </button>
                                <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                                    {t('reportFound')}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-red-600">search_off</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">23</p>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'مفقودات' : 'Lost Items'}</p>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600">inventory_2</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">22</p>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'موجودات' : 'Found Items'}</p>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-blue-600">handshake</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">156</p>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'تم الإرجاع' : 'Reunited'}</p>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-amber-600">avg_pace</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'يومان' : '2 days'}</p>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'متوسط الاسترداد' : 'Avg. Recovery'}</p>
                            </div>
                        </div>

                        {/* My Items Section */}
                        {myItems.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">folder_open</span>
                                    {isRTL ? 'منشوراتي' : 'My Posts'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {myItems.map((item) => (
                                        <div key={item.id} className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl p-5 border border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium uppercase ${item.type === 'lost' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                                            {item.type === 'lost' ? (isRTL ? 'مفقود' : 'Lost') : (isRTL ? 'موجود' : 'Found')}
                                                        </span>
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${item.statusColor}`}>
                                                            {item.status === 'claimed' ? (isRTL ? 'تم الإرجاع' : 'Claimed') : (isRTL ? 'نشط' : 'Active')}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-[#1b0e0e] dark:text-white group-hover:text-primary transition-colors">
                                                        {isRTL ? item.titleAr : item.title}
                                                    </h3>
                                                    <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mt-1 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                        {isRTL ? item.locationAr : item.location}
                                                    </p>
                                                </div>
                                                <span className="material-symbols-outlined text-[#5c4545] dark:text-[#d0c0c0] group-hover:text-primary transition-colors">chevron_right</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filter Tabs - Enhanced */}
                        <div className="flex flex-wrap gap-3">
                            {filterTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedFilter(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${selectedFilter === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'bg-surface-light dark:bg-surface-dark border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#1b0e0e] dark:text-white hover:border-primary/50'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                    {isRTL ? tab.ar : tab.en}
                                </button>
                            ))}
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Categories Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] sticky top-6">
                                    <h3 className="font-bold text-[#1b0e0e] dark:text-white mb-4">{isRTL ? 'الفئات' : 'Categories'}</h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${selectedCategory === category.id
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a]'
                                                    }`}
                                            >
                                                <span>{isRTL ? category.nameAr : category.name}</span>
                                                <span className="text-xs bg-[#f3e7e8] dark:bg-[#3a2a2a] px-2 py-1 rounded-full">{category.count}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="lg:col-span-3">
                                {filteredItems.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`bg-surface-light dark:bg-surface-dark rounded-2xl border overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${item.status === 'claimed'
                                                    ? 'border-[#e7d0d1] dark:border-[#3a2a2a] opacity-60'
                                                    : 'border-[#e7d0d1] dark:border-[#3a2a2a] hover:border-primary/50'
                                                    }`}
                                            >
                                                {item.image && (
                                                    <div
                                                        className="h-40 bg-cover bg-center relative"
                                                        style={{ backgroundImage: `url("${item.image}")` }}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                                    </div>
                                                )}
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between gap-3 mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${item.type === 'lost'
                                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                                }`}>
                                                                {item.type === 'lost' ? (isRTL ? 'مفقود' : 'Lost') : (isRTL ? 'موجود' : 'Found')}
                                                            </span>
                                                            <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0] font-medium">{isRTL ? item.categoryAr : item.category}</span>
                                                        </div>
                                                        {item.status === 'claimed' && (
                                                            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-bold rounded-lg">
                                                                {isRTL ? 'تم الإرجاع' : 'Claimed'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-2 hover:text-primary transition-colors cursor-pointer">{isRTL ? item.titleAr : item.title}</h3>
                                                    <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-4 line-clamp-2">{isRTL ? item.descriptionAr : item.description}</p>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#5c4545] dark:text-[#d0c0c0] mb-4">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                            {isRTL ? item.locationAr : item.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                            {isRTL ? item.dateAr : item.date}
                                                        </span>
                                                    </div>

                                                    {item.status !== 'claimed' && (
                                                        <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 ${item.type === 'lost'
                                                            ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25'
                                                            : 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25'
                                                            }`}>
                                                            {item.type === 'lost' ? (isRTL ? 'وجدت هذا!' : 'I Found This!') : (isRTL ? 'هذا ملكي!' : 'This is Mine!')}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <EmptyState
                                            icon="search_off"
                                            title="No items found"
                                            titleAr="لا توجد عناصر"
                                            message="No items match your current filters. Try adjusting your search or report a new item."
                                            messageAr="لا توجد عناصر تطابق الفلاتر الحالية. حاول تعديل البحث أو أبلغ عن عنصر جديد."
                                            actionLabel="Report Item"
                                            actionLabelAr="الإبلاغ عن عنصر"
                                            onAction={() => { }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LostAndFound;



