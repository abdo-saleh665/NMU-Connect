import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const AdminAccounts = () => {
    const { t, isRTL } = useLanguage();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('students');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Students data
    const students = [
        { id: '20230154', name: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed', email: 'ahmed.m@nmu.edu.eg', faculty: isRTL ? 'علوم الحاسب' : 'Computer Science', year: '3rd', status: 'active', joined: 'Sep 2021' },
        { id: '20230089', name: isRTL ? 'سارة أحمد' : 'Sara Ahmed', email: 'sara.a@nmu.edu.eg', faculty: isRTL ? 'الطب' : 'Medicine', year: '2nd', status: 'active', joined: 'Sep 2022' },
        { id: '20230212', name: isRTL ? 'محمد خالد' : 'Mohamed Khaled', email: 'mohamed.k@nmu.edu.eg', faculty: isRTL ? 'الهندسة' : 'Engineering', year: '4th', status: 'active', joined: 'Sep 2020' },
        { id: '20230098', name: isRTL ? 'نور الدين' : 'Nour El-Din', email: 'nour.d@nmu.edu.eg', faculty: isRTL ? 'إدارة الأعمال' : 'Business', year: '1st', status: 'inactive', joined: 'Sep 2023' },
        { id: '20230156', name: isRTL ? 'ياسمين خليل' : 'Yasmine Khalil', email: 'yasmine.k@nmu.edu.eg', faculty: isRTL ? 'علوم الحاسب' : 'Computer Science', year: '2nd', status: 'active', joined: 'Sep 2022' },
        { id: '20230045', name: isRTL ? 'علي حسن' : 'Ali Hassan', email: 'ali.h@nmu.edu.eg', faculty: isRTL ? 'العلوم' : 'Science', year: '3rd', status: 'suspended', joined: 'Sep 2021' }
    ];

    // Faculty/Staff data
    const faculty = [
        { id: 'FAC-001', name: isRTL ? 'د. أحمد حسن' : 'Dr. Ahmed Hassan', email: 'ahmed.hassan@nmu.edu.eg', department: isRTL ? 'علوم الحاسب' : 'Computer Science', role: isRTL ? 'أستاذ مساعد' : 'Assistant Professor', status: 'active', joined: 'Jan 2018' },
        { id: 'FAC-002', name: isRTL ? 'د. فاطمة علي' : 'Dr. Fatima Ali', email: 'fatima.ali@nmu.edu.eg', department: isRTL ? 'الطب' : 'Medicine', role: isRTL ? 'أستاذ' : 'Professor', status: 'active', joined: 'Sep 2015' },
        { id: 'FAC-003', name: isRTL ? 'د. محمد إبراهيم' : 'Dr. Mohamed Ibrahim', email: 'mohamed.i@nmu.edu.eg', department: isRTL ? 'الهندسة' : 'Engineering', role: isRTL ? 'محاضر' : 'Lecturer', status: 'active', joined: 'Mar 2020' },
        { id: 'FAC-004', name: isRTL ? 'د. سمر أحمد' : 'Dr. Samar Ahmed', email: 'samar.a@nmu.edu.eg', department: isRTL ? 'إدارة الأعمال' : 'Business', role: isRTL ? 'أستاذ مساعد' : 'Assistant Professor', status: 'on_leave', joined: 'Aug 2019' },
        { id: 'FAC-005', name: isRTL ? 'د. خالد يوسف' : 'Dr. Khaled Youssef', email: 'khaled.y@nmu.edu.eg', department: isRTL ? 'العلوم' : 'Science', role: isRTL ? 'أستاذ' : 'Professor', status: 'active', joined: 'Feb 2014' }
    ];

    const tabs = [
        { id: 'students', label: isRTL ? 'الطلاب' : 'Students', count: students.length, icon: 'school' },
        { id: 'faculty', label: isRTL ? 'هيئة التدريس' : 'Faculty', count: faculty.length, icon: 'person_book' },
        { id: 'admins', label: isRTL ? 'المشرفين' : 'Admins', count: 5, icon: 'admin_panel_settings' }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
            suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            on_leave: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
        };
        const labels = {
            active: isRTL ? 'نشط' : 'Active',
            inactive: isRTL ? 'غير نشط' : 'Inactive',
            suspended: isRTL ? 'موقوف' : 'Suspended',
            on_leave: isRTL ? 'في إجازة' : 'On Leave'
        };
        return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${styles[status]}`}>{labels[status]}</span>;
    };

    const currentData = activeTab === 'students' ? students : faculty;
    const filteredData = currentData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <Link to="/admin" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">dashboard</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('dashboard')}</span>
                        </Link>
                        <Link to="/admin/accounts" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary transition-colors">
                            <span className="material-symbols-outlined icon-filled">manage_accounts</span>
                            <span className="text-sm font-semibold">{isRTL ? 'إدارة الحسابات' : 'Accounts'}</span>
                        </Link>
                        <Link to="/admin/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">campaign</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors">{t('complaints')}</span>
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
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'إدارة الحسابات' : 'Account Management'}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                            {isRTL ? 'إضافة حساب' : 'Add Account'}
                        </button>
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

                {/* Tabs and Search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark">
                    <div className="flex gap-2 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#e7d0d1] dark:hover:bg-[#4a3a3a]'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                {tab.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#e7d0d1] dark:bg-[#4a3a3a]'}`}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex w-full sm:w-64 items-stretch rounded-lg bg-[#f3e7e8] dark:bg-[#3a2a2a]">
                        <div className="text-primary flex items-center justify-center pl-3">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input
                            className="w-full h-10 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-sm px-3"
                            placeholder={isRTL ? 'بحث في الحسابات...' : 'Search accounts...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Stats Summary */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-4 flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center justify-center">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{activeTab === 'students' ? '5' : '4'}</p>
                                    <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'نشط' : 'Active'}</p>
                                </div>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-4 flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400 flex items-center justify-center">
                                    <span className="material-symbols-outlined">do_not_disturb</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">1</p>
                                    <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'غير نشط' : 'Inactive'}</p>
                                </div>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-4 flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center justify-center">
                                    <span className="material-symbols-outlined">block</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{activeTab === 'students' ? '1' : '0'}</p>
                                    <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'موقوف' : 'Suspended'}</p>
                                </div>
                            </div>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-4 flex items-center gap-4">
                                <div className="size-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center">
                                    <span className="material-symbols-outlined">groups</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{filteredData.length}</p>
                                    <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'إجمالي' : 'Total'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-[#f3e7e8]/50 dark:bg-[#3a2a2a]/50">
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{activeTab === 'students' ? (isRTL ? 'الطالب' : 'Student') : (isRTL ? 'الدكتور' : 'Faculty')}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'البريد' : 'Email'}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{activeTab === 'students' ? (isRTL ? 'الكلية' : 'Faculty') : (isRTL ? 'القسم' : 'Department')}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{activeTab === 'students' ? (isRTL ? 'السنة' : 'Year') : (isRTL ? 'المنصب' : 'Role')}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الحالة' : 'Status'}</th>
                                        <th className="text-left px-6 py-4 text-sm font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الإجراءات' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="border-b border-[#e7d0d1]/50 dark:border-[#3a2a2a]/50 hover:bg-[#f3e7e8]/30 dark:hover:bg-[#3a2a2a]/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-[#1b0e0e] dark:text-white">{item.name}</p>
                                                        <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{item.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[#5c4545] dark:text-[#d0c0c0]">{item.email}</td>
                                            <td className="px-6 py-4 text-sm text-[#1b0e0e] dark:text-white">{item.faculty || item.department}</td>
                                            <td className="px-6 py-4 text-sm text-[#5c4545] dark:text-[#d0c0c0]">{item.year || item.role}</td>
                                            <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <button className="p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors text-[#5c4545] dark:text-[#d0c0c0]" title={isRTL ? 'عرض' : 'View'}>
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors text-[#5c4545] dark:text-[#d0c0c0]" title={isRTL ? 'تعديل' : 'Edit'}>
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600" title={isRTL ? 'حذف' : 'Delete'}>
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
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

            {/* Add Account Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl w-full max-w-md p-6 animate-[fadeIn_0.2s_ease-out]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'إضافة حساب جديد' : 'Add New Account'}</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-[#5c4545]">close</span>
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">{isRTL ? 'نوع الحساب' : 'Account Type'}</label>
                                <select className="w-full h-10 px-3 rounded-lg border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark text-[#1b0e0e] dark:text-white text-sm">
                                    <option>{isRTL ? 'طالب' : 'Student'}</option>
                                    <option>{isRTL ? 'هيئة تدريس' : 'Faculty'}</option>
                                    <option>{isRTL ? 'مشرف' : 'Admin'}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">{isRTL ? 'الاسم الكامل' : 'Full Name'}</label>
                                <input type="text" className="w-full h-10 px-3 rounded-lg border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark text-[#1b0e0e] dark:text-white text-sm" placeholder={isRTL ? 'أدخل الاسم' : 'Enter name'} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
                                <input type="email" className="w-full h-10 px-3 rounded-lg border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark text-[#1b0e0e] dark:text-white text-sm" placeholder={isRTL ? 'أدخل البريد' : 'Enter email'} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">{isRTL ? 'الكلية/القسم' : 'Faculty/Department'}</label>
                                <select className="w-full h-10 px-3 rounded-lg border border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark text-[#1b0e0e] dark:text-white text-sm">
                                    <option>{isRTL ? 'علوم الحاسب' : 'Computer Science'}</option>
                                    <option>{isRTL ? 'الهندسة' : 'Engineering'}</option>
                                    <option>{isRTL ? 'الطب' : 'Medicine'}</option>
                                    <option>{isRTL ? 'إدارة الأعمال' : 'Business'}</option>
                                    <option>{isRTL ? 'العلوم' : 'Science'}</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] text-sm font-medium rounded-xl hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                    {isRTL ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button type="submit" className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover transition-colors">
                                    {isRTL ? 'إضافة' : 'Add Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAccounts;
