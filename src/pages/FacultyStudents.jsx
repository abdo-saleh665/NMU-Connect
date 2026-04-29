import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const FacultyStudents = () => {
    const { t, isRTL } = useLanguage();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const courses = [
        { id: 'all', name: isRTL ? 'جميع المقررات' : 'All Courses', count: 153 },
        { id: 'cs101', name: 'CS101', count: 45 },
        { id: 'cs201', name: 'CS201', count: 38 },
        { id: 'cs301', name: 'CS301', count: 42 },
        { id: 'cs401', name: 'CS401', count: 28 }
    ];

    const students = [
        { id: '20230154', name: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed', email: 'ahmed.m@nmu.edu.eg', course: 'CS101', grade: 'A', attendance: 95, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY' },
        { id: '20230089', name: isRTL ? 'سارة أحمد' : 'Sara Ahmed', email: 'sara.a@nmu.edu.eg', course: 'CS201', grade: 'A+', attendance: 98, image: null },
        { id: '20230212', name: isRTL ? 'محمد خالد' : 'Mohamed Khaled', email: 'mohamed.k@nmu.edu.eg', course: 'CS101', grade: 'B+', attendance: 88, image: null },
        { id: '20230098', name: isRTL ? 'نور الدين' : 'Nour El-Din', email: 'nour.d@nmu.edu.eg', course: 'CS301', grade: 'A', attendance: 92, image: null },
        { id: '20230156', name: isRTL ? 'ياسمين خليل' : 'Yasmine Khalil', email: 'yasmine.k@nmu.edu.eg', course: 'CS401', grade: 'A', attendance: 96, image: null },
        { id: '20230045', name: isRTL ? 'علي حسن' : 'Ali Hassan', email: 'ali.h@nmu.edu.eg', course: 'CS201', grade: 'B', attendance: 85, image: null },
        { id: '20230078', name: isRTL ? 'فاطمة علي' : 'Fatima Ali', email: 'fatima.a@nmu.edu.eg', course: 'CS301', grade: 'A-', attendance: 90, image: null },
        { id: '20230123', name: isRTL ? 'عمر يوسف' : 'Omar Youssef', email: 'omar.y@nmu.edu.eg', course: 'CS401', grade: 'B+', attendance: 87, image: null }
    ];

    const filteredStudents = students.filter(student => {
        const matchesCourse = selectedCourse === 'all' || student.course.toLowerCase() === selectedCourse;
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.id.includes(searchQuery);
        return matchesCourse && matchesSearch;
    });

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
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
                        <Link to="/faculty/students" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">groups</span>
                            <span className="text-sm font-semibold">{isRTL ? 'الطلاب' : 'Students'}</span>
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
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الطلاب' : 'Students'}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-64 items-stretch rounded-lg bg-[#f3e7e8] dark:bg-[#3a2a2a]">
                            <div className="text-primary flex items-center justify-center pl-3">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="w-full h-10 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-sm px-3"
                                placeholder={isRTL ? 'بحث عن الطلاب...' : 'Search students...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
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

                {/* Course Filter */}
                <div className="flex gap-2 px-6 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark overflow-x-auto">
                    {courses.map((course) => (
                        <button
                            key={course.id}
                            onClick={() => setSelectedCourse(course.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${selectedCourse === course.id ? 'bg-primary text-white' : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#e7d0d1] dark:hover:bg-[#4a3a3a]'}`}
                        >
                            {course.name}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCourse === course.id ? 'bg-white/20' : 'bg-[#e7d0d1] dark:bg-[#4a3a3a]'}`}>{course.count}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-[#f3e7e8]/50 dark:bg-[#3a2a2a]/50">
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الطالب' : 'Student'}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'المقرر' : 'Course'}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الدرجة' : 'Grade'}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الحضور' : 'Attendance'}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="border-b border-[#e7d0d1]/50 dark:border-[#3a2a2a]/50 hover:bg-[#f3e7e8]/30 dark:hover:bg-[#3a2a2a]/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {student.image ? (
                                                        <div className="size-10 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url("${student.image}")` }}></div>
                                                    ) : (
                                                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                            <span className="material-symbols-outlined text-[20px]">person</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-[#1b0e0e] dark:text-white">{student.name}</p>
                                                        <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{student.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">{student.course}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold px-2 py-1 rounded-lg ${getGradeColor(student.grade)}`}>{student.grade}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-[#f3e7e8] dark:bg-[#3a2a2a] rounded-full h-2">
                                                        <div className={`h-2 rounded-full ${student.attendance >= 90 ? 'bg-green-500' : student.attendance >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${student.attendance}%` }}></div>
                                                    </div>
                                                    <span className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{student.attendance}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors text-[#5c4545] dark:text-[#d0c0c0]">
                                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors text-[#5c4545] dark:text-[#d0c0c0]">
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FacultyStudents;
