import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const FacultyComplaints = () => {
    const { t, isRTL } = useLanguage();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [roleView, setRoleView] = useState('professor');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Course-specific complaints (for professors)
    const courseComplaints = [
        {
            id: 1,
            course: 'CS101',
            courseName: isRTL ? 'مقدمة في علوم الحاسب' : 'Introduction to Computer Science',
            title: isRTL ? 'صعوبة الواجبات' : 'Assignment Difficulty',
            description: isRTL ? 'الواجبات صعبة جداً ولا تتناسب مع مستوى المحاضرات' : 'The assignments are too difficult and don\'t match the lecture content level',
            studentName: isRTL ? 'طالب مجهول' : 'Anonymous Student',
            date: 'Dec 15, 2024',
            status: 'pending',
            votes: 12
        },
        {
            id: 2,
            course: 'CS201',
            courseName: isRTL ? 'هياكل البيانات والخوارزميات' : 'Data Structures & Algorithms',
            title: isRTL ? 'سرعة شرح المحتوى' : 'Content Pace Too Fast',
            description: isRTL ? 'سرعة الشرح عالية جداً ولا نستطيع المتابعة' : 'The lecture pace is too fast, we can\'t keep up with the content',
            studentName: isRTL ? 'طالب مجهول' : 'Anonymous Student',
            date: 'Dec 14, 2024',
            status: 'under_review',
            votes: 8
        },
        {
            id: 3,
            course: 'CS101',
            courseName: isRTL ? 'مقدمة في علوم الحاسب' : 'Introduction to Computer Science',
            title: isRTL ? 'طلب ساعات مكتبية إضافية' : 'Request for Extra Office Hours',
            description: isRTL ? 'نحتاج ساعات مكتبية إضافية قبل الامتحانات' : 'We need additional office hours before exams',
            studentName: isRTL ? 'طالب مجهول' : 'Anonymous Student',
            date: 'Dec 12, 2024',
            status: 'resolved',
            votes: 25,
            response: isRTL ? 'تم إضافة ساعات مكتبية يوم الخميس من 2-4 مساءً' : 'Added office hours on Thursday 2-4 PM'
        }
    ];

    // Faculty/Department-wide complaints (for deans/program managers)
    const facultyComplaints = [
        {
            id: 101,
            category: isRTL ? 'مرافق' : 'Facilities',
            title: isRTL ? 'مشاكل تكييف في المبنى ب' : 'AC Issues in Building B',
            description: isRTL ? 'التكييف في مبنى الكلية ب لا يعمل بشكل صحيح مما يؤثر على المحاضرات' : 'The AC in Faculty Building B is not working properly, affecting lectures',
            department: isRTL ? 'علوم الحاسب' : 'Computer Science',
            date: 'Dec 16, 2024',
            status: 'pending',
            votes: 45,
            affectedStudents: 320
        },
        {
            id: 102,
            category: isRTL ? 'أكاديمي' : 'Academic',
            title: isRTL ? 'تداخل جدول الامتحانات' : 'Exam Schedule Conflicts',
            description: isRTL ? 'هناك تداخل في جداول امتحانات بعض المقررات' : 'There are conflicts in the exam schedules for some courses',
            department: isRTL ? 'هندسة البرمجيات' : 'Software Engineering',
            date: 'Dec 15, 2024',
            status: 'under_review',
            votes: 38,
            affectedStudents: 150
        },
        {
            id: 103,
            category: isRTL ? 'تقنية' : 'IT',
            title: isRTL ? 'بطء شبكة الواي فاي' : 'Slow Wi-Fi Network',
            description: isRTL ? 'شبكة الواي فاي بطيئة جداً في معامل الحاسب' : 'Wi-Fi network is very slow in computer labs',
            department: isRTL ? 'الكلية عام' : 'Faculty-wide',
            date: 'Dec 14, 2024',
            status: 'in_progress',
            votes: 89,
            affectedStudents: 500
        },
        {
            id: 104,
            category: isRTL ? 'إداري' : 'Administrative',
            title: isRTL ? 'تأخر إعلان نتائج منتصف الفصل' : 'Delayed Midterm Results',
            description: isRTL ? 'تأخر إعلان نتائج امتحانات منتصف الفصل لأكثر من أسبوعين' : 'Midterm exam results delayed for more than 2 weeks',
            department: isRTL ? 'نظم المعلومات' : 'Information Systems',
            date: 'Dec 10, 2024',
            status: 'resolved',
            votes: 22,
            affectedStudents: 180,
            response: isRTL ? 'تم إعلان جميع النتائج وتنبيه المدرسين بالالتزام بالموعد' : 'All results published, instructors reminded of deadlines'
        }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            under_review: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
            in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        };
        const labels = {
            pending: isRTL ? 'قيد الانتظار' : 'Pending',
            under_review: isRTL ? 'قيد المراجعة' : 'Under Review',
            in_progress: isRTL ? 'قيد التنفيذ' : 'In Progress',
            resolved: isRTL ? 'تم الحل' : 'Resolved'
        };
        return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${styles[status]}`}>{labels[status]}</span>;
    };

    const complaints = roleView === 'professor' ? courseComplaints : facultyComplaints;

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
                        <Link to="/faculty/appointments" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">calendar_month</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'المواعيد' : 'Appointments'}</span>
                        </Link>
                        <Link to="/faculty/students" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">groups</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{isRTL ? 'الطلاب' : 'Students'}</span>
                        </Link>
                        <Link to="/faculty/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">campaign</span>
                            <span className="text-sm font-semibold">{t('complaints')}</span>
                            <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{complaints.filter(c => c.status === 'pending').length}</span>
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
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{t('complaints')}</h2>
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

                {/* Role Toggle */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setRoleView('professor')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${roleView === 'professor' ? 'bg-primary text-white' : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0]'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">school</span>
                            {isRTL ? 'شكاوى المقررات' : 'Course Complaints'}
                        </button>
                        <button
                            onClick={() => setRoleView('dean')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${roleView === 'dean' ? 'bg-primary text-white' : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0]'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">domain</span>
                            {isRTL ? 'شكاوى الكلية' : 'Faculty Complaints'}
                        </button>
                    </div>
                    <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                        {complaints.length} {isRTL ? 'شكوى' : 'complaints'}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {roleView === 'professor' ? (
                            // Professor View - Course-specific complaints
                            courseComplaints.map((complaint) => (
                                <div key={complaint.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                            <button className="text-[#5c4545] hover:text-primary transition-colors p-1 rounded hover:bg-primary/10">
                                                <span className="material-symbols-outlined">expand_less</span>
                                            </button>
                                            <span className="font-bold text-lg text-primary">{complaint.votes}</span>
                                            <button className="text-[#5c4545] hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50">
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{complaint.course}</span>
                                                {getStatusBadge(complaint.status)}
                                            </div>
                                            <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-2">{complaint.title}</h3>
                                            <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-3">{complaint.description}</p>

                                            {complaint.response && (
                                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-3">
                                                    <p className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                        {complaint.response}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{complaint.date}</span>
                                                {complaint.status !== 'resolved' && (
                                                    <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors">
                                                        {isRTL ? 'الرد' : 'Respond'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Dean/Program Manager View - Faculty-wide complaints
                            facultyComplaints.map((complaint) => (
                                <div key={complaint.id} className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center gap-1 min-w-[50px]">
                                            <button className="text-[#5c4545] hover:text-primary transition-colors p-1 rounded hover:bg-primary/10">
                                                <span className="material-symbols-outlined">expand_less</span>
                                            </button>
                                            <span className="font-bold text-lg text-primary">{complaint.votes}</span>
                                            <button className="text-[#5c4545] hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50">
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-xs font-bold bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] px-2 py-1 rounded-lg">{complaint.category}</span>
                                                <span className="text-xs font-medium text-[#5c4545] dark:text-[#d0c0c0]">• {complaint.department}</span>
                                                {getStatusBadge(complaint.status)}
                                            </div>
                                            <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-2">{complaint.title}</h3>
                                            <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-3">{complaint.description}</p>

                                            <div className="flex items-center gap-4 mb-3 p-3 bg-[#f3e7e8] dark:bg-[#3a2a2a] rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-[18px]">group</span>
                                                    <span className="text-sm font-medium text-[#1b0e0e] dark:text-white">{complaint.affectedStudents}</span>
                                                    <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'طالب متأثر' : 'affected students'}</span>
                                                </div>
                                            </div>

                                            {complaint.response && (
                                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 mb-3">
                                                    <p className="text-sm text-green-700 dark:text-green-400 flex items-start gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                        {complaint.response}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{complaint.date}</span>
                                                {complaint.status !== 'resolved' && (
                                                    <div className="flex gap-2">
                                                        <button className="px-4 py-2 border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] text-sm font-medium rounded-xl hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                                            {isRTL ? 'تعيين مسؤول' : 'Assign'}
                                                        </button>
                                                        <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors">
                                                            {isRTL ? 'اتخاذ إجراء' : 'Take Action'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FacultyComplaints;
