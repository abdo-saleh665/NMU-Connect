import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from '../components/layout';
import ConnectionStatus from '../components/ConnectionStatus';
import { DashboardSkeleton } from '../components/Skeleton';
import { getUpcomingEvents } from '../api/events';
import { getAppointments } from '../api/appointments';
import { getMyComplaints } from '../api/complaints';
import { getMyItems } from '../api/lostItems';

const StudentDashboard = () => {
    const { t, isRTL } = useLanguage();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [appointmentCount, setAppointmentCount] = useState(0);
    const [complaintCount, setComplaintCount] = useState(0);
    const [lostItemCount, setLostItemCount] = useState(0);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [eventsResult, appointmentsResult, complaintsResult, lostItemsResult] = await Promise.all([
                    getUpcomingEvents(2),
                    getAppointments(),
                    getMyComplaints(),
                    getMyItems()
                ]);

                if (eventsResult.success) setUpcomingEvents(eventsResult.events || []);
                if (appointmentsResult.success) setAppointmentCount(appointmentsResult.appointments?.length || 0);
                if (complaintsResult.success) setComplaintCount(complaintsResult.complaints?.length || 0);
                if (lostItemsResult.success) setLostItemCount(lostItemsResult.items?.length || 0);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Get user's first name
    const userName = user?.name?.split(' ')[0] || 'Student';

    // Sample notifications data
    const notifications = [
        {
            id: 1,
            type: 'event',
            title: isRTL ? 'معرض التوظيف التقني غداً' : 'Tech Career Fair Tomorrow',
            message: isRTL ? 'لا تنسى حضور الفعالية في القاعة الرئيسية' : 'Don\'t forget to attend at the Main Auditorium',
            time: isRTL ? 'منذ ساعة' : '1 hour ago',
            read: false,
            icon: 'event'
        },
        {
            id: 2,
            type: 'appointment',
            title: isRTL ? 'تأكيد الموعد' : 'Appointment Confirmed',
            message: isRTL ? 'موعدك مع د. أحمد حسن يوم الأحد الساعة 10 صباحاً' : 'Your appointment with Dr. Ahmed Hassan is set for Sunday at 10 AM',
            time: isRTL ? 'منذ 3 ساعات' : '3 hours ago',
            read: false,
            icon: 'calendar_month'
        },
    ];

    // Get current date dynamically
    const today = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentMonth = isRTL ? monthNamesAr[today.getMonth()] : monthNames[today.getMonth()];
    const currentDay = today.getDate();
    const currentYear = today.getFullYear();
    const formattedDate = isRTL ? `${currentDay} ${currentMonth} ${currentYear}` : `${currentMonth} ${currentDay}, ${currentYear}`;

    // Generate upcoming events (next 7 days)
    const getUpcomingDate = (daysFromNow) => {
        const date = new Date(today);
        date.setDate(today.getDate() + daysFromNow);
        return {
            month: isRTL ? monthNamesAr[date.getMonth()] : monthNames[date.getMonth()],
            day: date.getDate()
        };
    };

    const event1Date = getUpcomingDate(5);
    const event2Date = getUpcomingDate(7);

    return (
        <PageLayout
            portalType="student"
            activeItem="dashboard"
            title={`${t('welcomeBack')}, ${userName}`}
            notifications={notifications}
        >
            <div className="flex flex-col gap-8">
                {/* Show skeleton while loading */}
                {isLoading ? (
                    <DashboardSkeleton />
                ) : (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1 max-w-xl">
                                <div className="flex w-full items-stretch rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <div className="text-primary flex items-center justify-center pl-4">
                                        <span className="material-symbols-outlined text-[22px]">search</span>
                                    </div>
                                    <input className="w-full h-12 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-base px-3" placeholder={isRTL ? 'ابحث في البوابة...' : 'Search the portal...'} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-surface-dark px-4 py-2 rounded-lg shadow-sm border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#1b0e0e] dark:text-white">
                                <span className="material-symbols-outlined text-primary">calendar_today</span>
                                <span>{formattedDate}</span>
                            </div>
                            <ConnectionStatus showLabel={true} className="bg-white dark:bg-surface-dark px-3 py-2 rounded-lg shadow-sm border border-[#e7d0d1] dark:border-[#3a2a2a]" />
                        </div>

                        {/* Quick Actions - 5 cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <Link to="/appointment" className="group flex flex-col gap-3 rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark p-5 shadow-sm hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">event_available</span>
                                </div>
                                <div>
                                    <h3 className="text-[#1b0e0e] dark:text-white font-bold text-sm group-hover:text-primary transition-colors">{t('appointment')}</h3>
                                    <p className="text-xs text-[#5c4545] dark:text-[#998888] mt-1">{t('bookAdvisor')}</p>
                                </div>
                            </Link>
                            <Link to="/tutoring" className="group flex flex-col gap-3 rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark p-5 shadow-sm hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">school</span>
                                </div>
                                <div>
                                    <h3 className="text-[#1b0e0e] dark:text-white font-bold text-sm group-hover:text-primary transition-colors">{t('peerTutoring')}</h3>
                                    <p className="text-xs text-[#5c4545] dark:text-[#998888] mt-1">{t('findTutor')}</p>
                                </div>
                            </Link>
                            <Link to="/events" className="group flex flex-col gap-3 rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark p-5 shadow-sm hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">event</span>
                                </div>
                                <div>
                                    <h3 className="text-[#1b0e0e] dark:text-white font-bold text-sm group-hover:text-primary transition-colors">{t('events')}</h3>
                                    <p className="text-xs text-[#5c4545] dark:text-[#998888] mt-1">{t('campusLife')}</p>
                                </div>
                            </Link>
                            <Link to="/complaints" className="group flex flex-col gap-3 rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark p-5 shadow-sm hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">campaign</span>
                                </div>
                                <div>
                                    <h3 className="text-[#1b0e0e] dark:text-white font-bold text-sm group-hover:text-primary transition-colors">{t('complaints')}</h3>
                                    <p className="text-xs text-[#5c4545] dark:text-[#998888] mt-1">{t('voiceIssues')}</p>
                                </div>
                            </Link>
                            <Link to="/lost-found" className="group flex flex-col gap-3 rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark p-5 shadow-sm hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <div>
                                    <h3 className="text-[#1b0e0e] dark:text-white font-bold text-sm group-hover:text-primary transition-colors">{t('lostAndFound')}</h3>
                                    <p className="text-xs text-[#5c4545] dark:text-[#998888] mt-1">{t('findItems')}</p>
                                </div>
                            </Link>
                        </div>

                        {/* Main content grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                            <div className="lg:col-span-2 flex flex-col gap-8">
                                {/* Upcoming Events Widget */}
                                <section className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الفعاليات القادمة' : 'Upcoming Events'}</h3>
                                        <Link className="text-sm font-medium text-primary hover:underline" to="/events">{isRTL ? 'عرض الكل' : 'View All'}</Link>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-primary to-red-700 rounded-xl p-5 text-white">
                                            <div className="flex items-center gap-2 text-white/80 text-xs font-medium mb-2">
                                                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                {event1Date.month} {event1Date.day} • 10:00 AM
                                            </div>
                                            <h4 className="font-bold text-lg mb-1">{isRTL ? 'معرض التوظيف التقني 2024' : 'Tech Career Fair 2024'}</h4>
                                            <p className="text-sm text-white/80">{isRTL ? 'القاعة الرئيسية' : 'Main Auditorium'}</p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{isRTL ? '234 حاضر' : '234 attending'}</span>
                                            </div>
                                        </div>
                                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a]">
                                            <div className="flex items-center gap-2 text-[#5c4545] dark:text-[#d0c0c0] text-xs font-medium mb-2">
                                                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                {event2Date.month} {event2Date.day} • 2:00 PM
                                            </div>
                                            <h4 className="font-bold text-lg text-[#1b0e0e] dark:text-white mb-1">{isRTL ? 'ورشة الذكاء الاصطناعي' : 'AI Workshop'}</h4>
                                            <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'مبنى علوم الحاسوب، غرفة 301' : 'CS Building, Room 301'}</p>
                                            <button className="mt-3 text-xs font-bold text-primary">{isRTL ? 'سجل الآن ←' : 'RSVP Now →'}</button>
                                        </div>
                                    </div>
                                </section>

                                {/* Recent Complaints */}
                                <section className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الشكاوى الأخيرة' : 'Recent Complaints'}</h3>
                                        <Link className="text-sm font-medium text-primary hover:underline" to="/complaints">{isRTL ? 'عرض الكل' : 'View All'}</Link>
                                    </div>
                                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-sm overflow-hidden divide-y divide-[#e7d0d1] dark:divide-[#3a2a2a]">
                                        <div className="p-4 flex items-center gap-4 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
                                                <span className="material-symbols-outlined text-[20px]">pending</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[#1b0e0e] dark:text-white truncate">{isRTL ? 'مشكلة في المكتبة' : 'Library Issue'}</h4>
                                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] truncate">{isRTL ? 'الساعات الافتتاحية محدودة' : 'Limited opening hours'}</p>
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
                                                {isRTL ? 'قيد المراجعة' : 'In Review'}
                                            </span>
                                        </div>
                                        <div className="p-4 flex items-center gap-4 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shrink-0">
                                                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[#1b0e0e] dark:text-white truncate">{isRTL ? 'صيانة الحمامات' : 'Bathroom Maintenance'}</h4>
                                                <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] truncate">{isRTL ? 'المبنى الرئيسي - تم الحل' : 'Main Building - Resolved'}</p>
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 shrink-0">
                                                {isRTL ? 'تم الحل' : 'Resolved'}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="flex flex-col gap-8">
                                {/* Quick Stats */}
                                <section className="flex flex-col gap-4">
                                    <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}</h3>
                                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-5 shadow-sm">
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center justify-between pb-4 border-b border-[#f3e7e8] dark:border-[#3a2a2a]">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-full text-primary"><span className="material-symbols-outlined text-[20px]">calendar_month</span></div>
                                                    <span className="text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'المواعيد' : 'Appointments'}</span>
                                                </div>
                                                <span className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{appointmentCount}</span>
                                            </div>
                                            <div className="flex items-center justify-between pb-4 border-b border-[#f3e7e8] dark:border-[#3a2a2a]">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-orange-500/10 p-2 rounded-full text-orange-500"><span className="material-symbols-outlined text-[20px]">report_problem</span></div>
                                                    <span className="text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'الشكاوى' : 'Complaints'}</span>
                                                </div>
                                                <span className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{complaintCount}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-teal-500/10 p-2 rounded-full text-teal-500"><span className="material-symbols-outlined text-[20px]">search</span></div>
                                                    <span className="text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'المفقودات' : 'Lost Items'}</span>
                                                </div>
                                                <span className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{lostItemCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Available Tutors Widget */}
                                <section className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'المدرسون المتاحون' : 'Available Tutors'}</h3>
                                        <Link className="text-sm font-medium text-primary hover:underline" to="/tutoring">{isRTL ? 'عرض الكل' : 'View All'}</Link>
                                    </div>
                                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-5 shadow-sm space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                                <span className="material-symbols-outlined text-[18px]">person</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-[#1b0e0e] dark:text-white truncate">{isRTL ? 'سارة أحمد' : 'Sara Ahmed'}</p>
                                                <p className="text-xs text-[#5c4545] dark:text-[#998888]">{isRTL ? 'التفاضل والتكامل' : 'Calculus'}</p>
                                            </div>
                                            <span className="size-2 bg-emerald-500 rounded-full"></span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                                <span className="material-symbols-outlined text-[18px]">person</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-[#1b0e0e] dark:text-white truncate">{isRTL ? 'محمد ح.' : 'Mohamed H.'}</p>
                                                <p className="text-xs text-[#5c4545] dark:text-[#998888]">{isRTL ? 'هياكل البيانات' : 'Data Structures'}</p>
                                            </div>
                                            <span className="size-2 bg-emerald-500 rounded-full"></span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    );
};

export default StudentDashboard;
