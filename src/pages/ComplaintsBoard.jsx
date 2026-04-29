import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import { getComplaints, getMyComplaints, voteComplaint } from '../api/complaints';

const ComplaintsBoard = () => {
    const { t, isRTL } = useLanguage();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [complaintType, setComplaintType] = useState('university');
    const [complaints, setComplaints] = useState([]);
    const [myComplaints, setMyComplaints] = useState([]);
    const [error, setError] = useState(null);
    const [voteLoading, setVoteLoading] = useState(null);
    const dataLoaded = useRef(false);
    const animationComplete = useRef(false);

    const handleLoadingComplete = () => {
        animationComplete.current = true;
        if (dataLoaded.current) {
            setIsLoading(false);
        }
    };

    // Fetch complaints from API
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const [allResult, myResult] = await Promise.all([
                    getComplaints({ type: complaintType }),
                    getMyComplaints()
                ]);

                if (allResult.success) {
                    setComplaints(allResult.complaints.map(c => ({
                        id: c._id,
                        title: c.title,
                        titleAr: c.titleAr || c.title,
                        description: c.description,
                        descriptionAr: c.descriptionAr || c.description,
                        category: c.category,
                        categoryAr: c.category,
                        professor: c.professor?.name,
                        professorAr: c.professor?.nameAr,
                        subject: c.subject,
                        subjectAr: c.subjectAr,
                        status: c.status,
                        statusAr: c.status === 'resolved' ? 'تم الحل' : c.status === 'in_progress' ? 'قيد التنفيذ' : 'قيد المراجعة',
                        statusColor: c.status === 'resolved' ? 'bg-green-100 text-green-700'
                            : c.status === 'in_progress' ? 'bg-blue-100 text-blue-700'
                                : 'bg-orange-100 text-orange-700',
                        votes: c.voteCount || 0,
                        comments: c.commentCount || 0,
                        time: new Date(c.createdAt).toLocaleDateString(),
                        timeAr: new Date(c.createdAt).toLocaleDateString('ar-EG'),
                        anonymous: c.isAnonymous,
                        author: c.author?.name,
                        userVote: c.userVote
                    })));
                }

                if (myResult.success) {
                    setMyComplaints(myResult.complaints.filter(c => c.type === complaintType).map(c => ({
                        id: c._id,
                        title: c.title,
                        titleAr: c.titleAr || c.title,
                        category: c.category,
                        categoryAr: c.category,
                        status: c.status,
                        statusColor: c.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        date: new Date(c.createdAt).toLocaleDateString(),
                        dateAr: new Date(c.createdAt).toLocaleDateString('ar-EG'),
                        type: c.type
                    })));
                }
            } catch (err) {
                console.error('Error fetching complaints:', err);
                setError('Failed to load complaints');
            } finally {
                dataLoaded.current = true;
                if (animationComplete.current) {
                    setIsLoading(false);
                }
            }
        };

        fetchComplaints();
    }, [complaintType]);

    // Handle voting
    const handleVote = async (complaintId, vote) => {
        setVoteLoading(complaintId);
        try {
            const result = await voteComplaint(complaintId, vote);
            if (result.success) {
                setComplaints(prev => prev.map(c =>
                    c.id === complaintId
                        ? { ...c, votes: result.voteCount, userVote: result.userVote }
                        : c
                ));
            }
        } catch (err) {
            console.error('Vote error:', err);
        } finally {
            setVoteLoading(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Notifications
    const notifications = [
        { id: 1, title: isRTL ? 'تحديث الشكوى' : 'Complaint Update', message: isRTL ? 'تم حل مشكلتك' : 'Your issue has been resolved', time: isRTL ? 'منذ ساعة' : '1h ago', read: false, icon: 'check_circle' },
        { id: 2, title: isRTL ? 'رد جديد' : 'New Reply', message: isRTL ? 'الإدارة ردت على شكواك' : 'Admin replied to your complaint', time: isRTL ? 'منذ 4 ساعات' : '4h ago', read: true, icon: 'reply' },
    ];

    // Complaint type tabs
    const complaintTypes = [
        { id: 'university', icon: 'domain', en: 'University', ar: 'الجامعة', descEn: 'General university complaints', descAr: 'شكاوى عامة للجامعة' },
        { id: 'faculty', icon: 'school', en: 'Faculty', ar: 'الكلية', descEn: 'Faculty & professor complaints', descAr: 'شكاوى الكلية والأساتذة' },
    ];

    // Filters
    const universityFilters = [
        { id: 'all', en: 'All', ar: 'الكل' },
        { id: 'facilities', en: 'Facilities', ar: 'المرافق' },
        { id: 'it', en: 'IT & Tech', ar: 'تقنية المعلومات' },
        { id: 'housing', en: 'Housing', ar: 'السكن' },
        { id: 'services', en: 'Services', ar: 'الخدمات' },
    ];

    const facultyFilters = [
        { id: 'all', en: 'All Subjects', ar: 'جميع المواد' },
        { id: 'cs101', en: 'CS 101', ar: 'علوم حاسب 101' },
        { id: 'math201', en: 'Math 201', ar: 'رياضيات 201' },
        { id: 'physics101', en: 'Physics 101', ar: 'فيزياء 101' },
    ];

    const filters = complaintType === 'university' ? universityFilters : facultyFilters;
    const allComplaints = complaints;
    const filteredMyComplaints = myComplaints;

    return (
        <div className={`flex h-screen w-full bg-background-light dark:bg-background-dark`}>
            {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
            {/* SideNavBar - Matching StudentDashboard */}
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
                        <Link to="/appointment" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">calendar_month</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('schedule')}</p>
                        </Link>
                        <Link to="/tutoring" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">school</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('peerTutoring')}</p>
                        </Link>
                        <Link to="/events" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">event</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('events')}</p>
                        </Link>
                        {/* Active: Complaints */}
                        <Link to="/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">report_problem</span>
                            <p className="text-sm font-semibold leading-normal">{t('complaints')}</p>
                        </Link>
                        <Link to="/lost-found" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">search</span>
                            <p className="text-sm font-medium leading-normal group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('lostAndFound')}</p>
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header - Matching StudentDashboard */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark px-6 py-4 flex-shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className={`${sidebarOpen ? 'hidden' : 'hidden md:flex'} p-2 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors`}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <button className="md:hidden p-2 text-[#1b0e0e] dark:text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{t('complaints')}</h2>
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

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8 space-y-8">
                        {/* Error Alert */}
                        {error && (
                            <ErrorAlert
                                message={error}
                                messageAr="فشل في تحميل الشكاوى"
                                onRetry={() => window.location.reload()}
                            />
                        )}
                        {/* Header Row with Search and Submit */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 max-w-xl">
                                <div className="flex w-full items-stretch rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <div className="text-primary flex items-center justify-center pl-4">
                                        <span className="material-symbols-outlined text-[22px]">search</span>
                                    </div>
                                    <input className="w-full h-12 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-base px-3" placeholder={isRTL ? 'ابحث عن الشكاوى...' : 'Search complaints...'} />
                                </div>
                            </div>
                            <button className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 cursor-pointer shrink-0">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                {t('submitComplaint')}
                            </button>
                        </div>

                        {/* Complaint Type Selector */}
                        <div className="grid grid-cols-2 gap-4">
                            {complaintTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => { setComplaintType(type.id); setSelectedFilter('all'); }}
                                    className={`relative overflow-hidden flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${complaintType === type.id
                                        ? 'border-primary bg-primary text-white shadow-lg shadow-primary/25'
                                        : 'border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark text-[#1b0e0e] dark:text-white hover:border-primary/50 hover:shadow-md'
                                        }`}
                                >
                                    {complaintType === type.id && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                    )}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0 ${complaintType === type.id ? 'bg-white/20' : 'bg-gradient-to-br from-primary/20 to-primary/40'
                                        }`}>
                                        <span className={`material-symbols-outlined text-3xl ${complaintType === type.id ? 'text-white' : 'text-primary'}`}>{type.icon}</span>
                                    </div>
                                    <div className="text-left relative z-10">
                                        <span className="text-lg font-bold block">{isRTL ? type.ar : type.en}</span>
                                        <span className={`text-sm block ${complaintType === type.id ? 'text-white/80' : 'text-[#5c4545] dark:text-[#d0c0c0]'}`}>
                                            {isRTL ? type.descAr : type.descEn}
                                        </span>
                                    </div>
                                    {complaintType === type.id && (
                                        <div className="absolute top-3 right-3">
                                            <span className="material-symbols-outlined text-white/80">check_circle</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* My Complaints Section */}
                        {filteredMyComplaints.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">folder_open</span>
                                    {isRTL ? 'شكاواي' : 'My Complaints'}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredMyComplaints.map((complaint) => (
                                        <div key={complaint.id} className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl p-5 border border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${complaint.statusColor}`}>
                                                            {complaint.status}
                                                        </span>
                                                        <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">• {isRTL ? complaint.categoryAr : complaint.category}</span>
                                                    </div>
                                                    <h3 className="font-bold text-[#1b0e0e] dark:text-white group-hover:text-primary transition-colors">
                                                        {isRTL ? complaint.titleAr : complaint.title}
                                                    </h3>
                                                    {complaint.professor && (
                                                        <p className="text-sm text-primary font-medium mt-1 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">person</span>
                                                            {isRTL ? complaint.professorAr : complaint.professor}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mt-1 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                        {isRTL ? complaint.dateAr : complaint.date}
                                                    </p>
                                                </div>
                                                <span className="material-symbols-outlined text-[#5c4545] dark:text-[#d0c0c0] group-hover:text-primary transition-colors">chevron_right</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Widget - Enhanced */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-2xl shadow-lg shadow-purple-500/20 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex items-center gap-3 mb-3 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                    </div>
                                    <span className="text-sm font-medium opacity-90">{isRTL ? 'ملخص الذكاء الاصطناعي' : 'AI Summary'}</span>
                                </div>
                                <h3 className="text-lg font-bold relative z-10">{isRTL ? 'أهم مشكلة: الواي فاي' : 'Top Issue: Wi-Fi Access'}</h3>
                                <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                                    <div className="bg-white h-2 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                                <p className="text-xs opacity-80 mt-2">{isRTL ? '78% من الشكاوى الجديدة متعلقة بالشبكة' : '78% of new complaints are network related.'}</p>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'تم الحل هذا الأسبوع' : 'Resolved This Week'}</span>
                                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600">check_circle</span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-[#1b0e0e] dark:text-white">142</h3>
                                <p className="text-sm text-green-600 font-medium flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>+12% {isRTL ? 'من الأسبوع الماضي' : 'from last week'}
                                </p>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'متوسط وقت الاستجابة' : 'Avg Response Time'}</span>
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-amber-600">timelapse</span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'يومان' : '2 Days'}</h3>
                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] font-medium mt-1">{isRTL ? 'أسرع من معيار الجامعة' : 'Faster than university standard.'}</p>
                            </div>
                        </div>

                        {/* Filters - Enhanced */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-wrap gap-2">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSelectedFilter(filter.id)}
                                        className={`h-9 px-4 rounded-full text-sm font-medium transition-all cursor-pointer ${selectedFilter === filter.id
                                            ? 'bg-primary text-white shadow-md shadow-primary/25'
                                            : 'bg-surface-light dark:bg-surface-dark border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#1b0e0e] dark:text-white hover:border-primary/50'
                                            }`}
                                    >
                                        {isRTL ? filter.ar : filter.en}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'ترتيب:' : 'Sort by:'}</span>
                                <select className="h-9 rounded-lg border border-[#e7d0d1] dark:border-[#3a2a2a] px-3 text-sm font-medium text-[#1b0e0e] dark:text-white bg-surface-light dark:bg-surface-dark focus:border-primary focus:ring-primary cursor-pointer">
                                    <option>{isRTL ? 'الأكثر تصويتاً' : 'Most Voted'}</option>
                                    <option>{isRTL ? 'الأحدث أولاً' : 'Newest First'}</option>
                                    <option>{isRTL ? 'الحالة: مفتوح' : 'Status: Open'}</option>
                                </select>
                            </div>
                        </div>

                        {/* Complaints Feed - Enhanced */}
                        <div className="space-y-4">
                            {allComplaints.map((complaint) => (
                                <div key={complaint.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex gap-5">
                                    <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                        <button className="text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary transition-colors p-1 rounded-lg hover:bg-primary/10 cursor-pointer">
                                            <span className="material-symbols-outlined icon-filled">expand_less</span>
                                        </button>
                                        <span className="font-bold text-xl text-primary">{complaint.votes}</span>
                                        <button className="text-[#5c4545] dark:text-[#d0c0c0] hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer">
                                            <span className="material-symbols-outlined">expand_more</span>
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${complaint.statusColor}`}>{isRTL ? complaint.statusAr : complaint.status}</span>
                                                {complaintType === 'faculty' && complaint.subject && (
                                                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium">
                                                        {isRTL ? complaint.subjectAr : complaint.subject}
                                                    </span>
                                                )}
                                                {complaintType === 'university' && (
                                                    <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0] font-medium">• {isRTL ? complaint.categoryAr : complaint.category}</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0] flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {isRTL ? complaint.timeAr : complaint.time}
                                            </span>
                                        </div>
                                        {complaintType === 'faculty' && complaint.professor && (
                                            <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-primary/5 dark:bg-primary/10">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-sm">person</span>
                                                </div>
                                                <span className="text-sm font-medium text-primary">{isRTL ? complaint.professorAr : complaint.professor}</span>
                                            </div>
                                        )}
                                        <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-2 hover:text-primary transition-colors cursor-pointer">{isRTL ? complaint.titleAr : complaint.title}</h3>
                                        <p className="text-[#5c4545] dark:text-[#d0c0c0] text-sm leading-relaxed mb-4">
                                            {isRTL ? complaint.descriptionAr : complaint.description}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-[#e7d0d1] dark:border-[#3a2a2a] pt-4">
                                            <div className="flex items-center gap-4">
                                                <button className="flex items-center gap-1.5 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary text-sm transition-colors cursor-pointer">
                                                    <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                                                    <span>{complaint.comments} {isRTL ? 'تعليق' : 'Comments'}</span>
                                                </button>
                                                <button className="flex items-center gap-1.5 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary text-sm transition-colors cursor-pointer">
                                                    <span className="material-symbols-outlined text-[18px]">share</span>
                                                    <span>{isRTL ? 'مشاركة' : 'Share'}</span>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="size-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-sm text-primary">person</span>
                                                </div>
                                                <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{complaint.anonymous ? (isRTL ? 'طالب مجهول' : 'Anonymous Student') : complaint.author}</span>
                                            </div>
                                        </div>
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

export default ComplaintsBoard;



