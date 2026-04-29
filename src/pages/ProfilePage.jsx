import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LoadingScreen from '../components/LoadingScreen';

const ProfilePage = ({ portalType = 'student' }) => {
    const { t, isRTL } = useLanguage();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');

    // Determine back path based on portal type
    const backPath = portalType === 'faculty' ? '/faculty' : portalType === 'admin' ? '/admin' : '/student';

    const userInfo = {
        name: 'Ahmed Mohamed',
        nameAr: 'أحمد محمد',
        email: 'ahmed.m@nmu.edu.eg',
        phone: '+20 123 456 7890',
        studentId: '20230154',
        department: 'Computer Science',
        departmentAr: 'علوم الحاسوب',
        faculty: 'Faculty of Computer Science',
        facultyAr: 'كلية علوم الحاسوب',
        level: '3rd Year',
        levelAr: 'السنة الثالثة',
        gpa: '3.75',
        status: 'Active',
        statusAr: 'نشط',
        joinDate: 'September 2021',
        joinDateAr: 'سبتمبر 2021',
        advisor: 'Dr. Mohamed Hassan',
        advisorAr: 'د. محمد حسن',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY'
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', labelAr: 'المعلومات الشخصية', icon: 'person' },
        { id: 'academic', label: 'Academic Info', labelAr: 'المعلومات الأكاديمية', icon: 'school' },
        { id: 'security', label: 'Security', labelAr: 'الأمان', icon: 'security' }
    ];

    return (
        <div className={`min-h-screen w-full bg-background-light dark:bg-background-dark overflow-y-auto`}>
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

            {/* Header */}
            <header className="sticky top-0 flex items-center justify-between whitespace-nowrap border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark px-6 py-4 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white transition-colors">
                        <span className={`material-symbols-outlined ${isRTL ? 'rotate-180' : ''}`}>arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">
                            {isRTL ? 'الملف الشخصي' : 'My Profile'}
                        </h2>
                        <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">
                            {isRTL ? 'عرض وإدارة معلوماتك الشخصية' : 'View and manage your personal information'}
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Profile Header */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <div
                                    className="size-32 rounded-full bg-cover bg-center border-4 border-primary/20"
                                    style={{ backgroundImage: `url("${userInfo.image}")` }}
                                ></div>
                                <button className="absolute bottom-0 right-0 size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                                </button>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl font-bold text-[#1b0e0e] dark:text-white mb-1">
                                    {isRTL ? userInfo.nameAr : userInfo.name}
                                </h1>
                                <p className="text-primary font-medium mb-2">{userInfo.email}</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                        ID: {userInfo.studentId}
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                                        {isRTL ? userInfo.statusAr : userInfo.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-light dark:bg-surface-dark border border-[#e7d0d1] dark:border-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] hover:border-primary/50'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                {isRTL ? tab.labelAr : tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-6">
                        {activeTab === 'personal' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'الاسم الكامل' : 'Full Name'}
                                    </label>
                                    <input
                                        type="text"
                                        value={isRTL ? userInfo.nameAr : userInfo.name}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                                    </label>
                                    <input
                                        type="email"
                                        value={userInfo.email}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                                    </label>
                                    <input
                                        type="tel"
                                        value={userInfo.phone}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'الرقم الجامعي' : 'Student ID'}
                                    </label>
                                    <input
                                        type="text"
                                        value={userInfo.studentId}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'academic' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'الكلية' : 'Faculty'}
                                    </label>
                                    <input
                                        type="text"
                                        value={isRTL ? userInfo.facultyAr : userInfo.faculty}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'القسم' : 'Department'}
                                    </label>
                                    <input
                                        type="text"
                                        value={isRTL ? userInfo.departmentAr : userInfo.department}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'المستوى الدراسي' : 'Academic Level'}
                                    </label>
                                    <input
                                        type="text"
                                        value={isRTL ? userInfo.levelAr : userInfo.level}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'المعدل التراكمي' : 'GPA'}
                                    </label>
                                    <input
                                        type="text"
                                        value={userInfo.gpa}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'المرشد الأكاديمي' : 'Academic Advisor'}
                                    </label>
                                    <input
                                        type="text"
                                        value={isRTL ? userInfo.advisorAr : userInfo.advisor}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                        {isRTL ? 'تاريخ الالتحاق' : 'Enrollment Date'}
                                    </label>
                                    <input
                                        type="text"
                                        value={isRTL ? userInfo.joinDateAr : userInfo.joinDate}
                                        readOnly
                                        className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-4">
                                        {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                                {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                                {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#5c4545] dark:text-[#d0c0c0] mb-2">
                                                {isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full h-12 px-4 rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] border border-transparent text-[#1b0e0e] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <button className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors">
                                            {isRTL ? 'تحديث كلمة المرور' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;



