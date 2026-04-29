import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        // Navigation
        dashboard: 'Dashboard',
        courses: 'Courses',
        schedule: 'Appointments',
        peerTutoring: 'Peer Tutoring',
        events: 'Events',
        complaints: 'Complaints',
        lostAndFound: 'Lost & Found',
        settings: 'Settings',
        logout: 'Logout',

        // Settings Page
        settingsTitle: 'Settings',
        settingsSubtitle: 'Manage your account settings and preferences',

        // Profile Section
        userProfile: 'User Profile',
        profileSubtitle: 'Your personal information',
        fullName: 'Full Name',
        email: 'Email',
        studentId: 'Student ID',
        faculty: 'Faculty',
        editProfile: 'Edit Profile',

        // Language Section
        language: 'Language',
        languageSubtitle: 'Choose your preferred language',
        english: 'English',
        arabic: 'العربية',

        // Appearance Section
        appearance: 'Appearance',
        appearanceSubtitle: 'Customize how the app looks',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        darkModeDesc: 'Switch between light and dark themes',

        // Security Section
        security: 'Security',
        securitySubtitle: 'Manage your password and security settings',
        resetPassword: 'Reset Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        updatePassword: 'Update Password',

        // Common
        save: 'Save',
        cancel: 'Cancel',
        back: 'Back',
        search: 'Search',
        viewAll: 'View All',
        submit: 'Submit',
        signOut: 'Sign out of your account',

        // Dashboard
        welcomeBack: 'Welcome back',
        studentPortal: 'Student Portal',
        facultyPortal: 'Faculty Portal',
        adminPortal: 'Admin Portal',
        universityName: 'New Mansoura Univ.',

        // Student Dashboard
        goodMorning: 'Good Morning',
        hereIsOverview: "Here's your overview for today",
        currentGPA: 'Current GPA',
        completedCredits: 'Completed Credits',
        upcomingExams: 'Upcoming Exams',
        pendingAssignments: 'Pending Assignments',
        todaysSchedule: "Today's Schedule",
        quickActions: 'Quick Actions',
        bookAppointment: 'Book Appointment',
        findTutor: 'Find a Tutor',
        reportIssue: 'Report Issue',
        findItem: 'Find Item',
        recentAnnouncements: 'Recent Announcements',
        campusEvent: 'Campus Event',
        examSchedule: 'Exam Schedule',
        libraryHours: 'Library Hours',
        credits: 'credits',
        days: 'days',
        appointment: 'Appointment',
        bookAdvisor: 'Book advisor',
        campusLife: 'Campus life',
        voiceIssues: 'Voice issues',
        findItems: 'Find items',
        myClasses: 'My classes',
        viewFullCalendar: 'View Full Calendar',
        happeningNow: 'Happening Now',
        searchPlaceholder: 'Search courses, professors...',
        semester: 'Semester',
        computerScience: 'Computer Science',
        fall: 'Fall',

        // Faculty Dashboard
        totalStudents: 'Total Students',
        pendingRequests: 'Pending Requests',
        unreadMessages: 'Unread Messages',
        officeHours: 'Office Hours',

        // Admin Dashboard
        dashboardOverview: 'Dashboard Overview',
        welcomeBackAdmin: "Welcome back, here's what's happening at NMU today.",
        openComplaints: 'Open Complaints',
        recentActivity: 'Recent Activity',
        action: 'Action',
        status: 'Status',
        pending: 'Pending',

        // Login Page
        unifiedPortal: 'Unified Portal',
        signIn: 'Sign In',
        signInSubtitle: 'Access your student account',
        universityEmail: 'University Email',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        quickAccess: 'Quick Access',
        academicCalendar: 'Academic Calendar',
        campusMap: 'Campus Map',
        itSupport: 'IT Support',

        // Peer Tutoring Page
        peerTutoringMarketplace: 'Peer Tutoring Marketplace',
        peerTutoringDesc: 'Connect with fellow students for academic help or offer your expertise to others.',
        becomeTutor: 'Become a Tutor',
        requestTutor: 'Request a Tutor',
        activeTutors: 'Active Tutors',
        tutorsAvailable: 'tutors available now',
        subjectsCovered: 'Subjects Covered',
        academicAreas: 'academic areas',
        sessionsThisMonth: 'Sessions This Month',
        hoursOfLearning: 'hours of learning',
        avgRating: 'Avg. Rating',
        fromReviews: 'from reviews',
        browseBySubject: 'Browse by Subject',
        featuredTutors: 'Featured Tutors',
        sessions: 'sessions',
        bookSession: 'Book Session',
        available: 'Available',
        unavailable: 'Unavailable',

        // Events Page
        eventsAnnouncements: 'Events & Announcements',
        eventsDesc: 'Stay updated with campus activities and important announcements.',
        createEvent: 'Create Event',
        upcomingEvents: 'Upcoming Events',
        allEvents: 'All Events',
        academic: 'Academic',
        career: 'Career',
        sports: 'Sports',
        social: 'Social',
        attendees: 'attendees',
        featured: 'Featured',
        register: 'Register',
        announcements: 'Announcements',
        important: 'Important',

        // Complaints Page
        complaintsBoard: 'Complaints & Feedback Board',
        complaintsDesc: 'Voice your concerns clearly and help us improve New Mansoura University together. We value transparency.',
        submitComplaint: 'Submit Complaint',
        aiSummary: 'AI Summary',
        topIssue: 'Top Issue',
        resolved: 'Resolved',
        complaintsResolved: 'complaints resolved',
        avgResponseTime: 'Avg. Response Time',
        responseTime: 'response time',
        recentComplaints: 'Recent Complaints',
        anonymous: 'Anonymous',
        upvotes: 'upvotes',
        comments: 'comments',
        inProgress: 'In Progress',
        underReview: 'Under Review',

        // Lost & Found Page
        lostFoundBoard: 'Lost & Found Board',
        lostFoundDesc: 'Report lost items or help reunite found belongings with their owners.',
        reportLost: 'Report Lost',
        reportFound: 'Report Found',
        allItems: 'All Items',
        electronics: 'Electronics',
        documents: 'Documents',
        accessories: 'Accessories',
        books: 'Books',
        clothing: 'Clothing',
        other: 'Other',
        lost: 'Lost',
        found: 'Found',
        claimed: 'Claimed',
        recentItems: 'Recent Items',
        contactOwner: 'Contact',
        claimItem: 'Claim',

        // Common
        profile: 'My Profile',
    },
    ar: {
        // Navigation
        dashboard: 'لوحة التحكم',
        courses: 'المقررات',
        schedule: 'المواعيد',
        peerTutoring: 'التدريس الخصوصي',
        events: 'الفعاليات',
        complaints: 'الشكاوى',
        lostAndFound: 'المفقودات',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج',

        // Settings Page
        settingsTitle: 'الإعدادات',
        settingsSubtitle: 'إدارة إعدادات حسابك وتفضيلاتك',

        // Profile Section
        userProfile: 'الملف الشخصي',
        profileSubtitle: 'معلوماتك الشخصية',
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        studentId: 'رقم الطالب',
        faculty: 'الكلية',
        editProfile: 'تعديل الملف',

        // Language Section
        language: 'اللغة',
        languageSubtitle: 'اختر لغتك المفضلة',
        english: 'English',
        arabic: 'العربية',

        // Appearance Section
        appearance: 'المظهر',
        appearanceSubtitle: 'تخصيص مظهر التطبيق',
        darkMode: 'الوضع الداكن',
        lightMode: 'الوضع الفاتح',
        darkModeDesc: 'التبديل بين المظهر الفاتح والداكن',

        // Security Section
        security: 'الأمان',
        securitySubtitle: 'إدارة كلمة المرور وإعدادات الأمان',
        resetPassword: 'إعادة تعيين كلمة المرور',
        currentPassword: 'كلمة المرور الحالية',
        newPassword: 'كلمة المرور الجديدة',
        confirmPassword: 'تأكيد كلمة المرور الجديدة',
        updatePassword: 'تحديث كلمة المرور',

        // Common
        save: 'حفظ',
        cancel: 'إلغاء',
        back: 'رجوع',
        search: 'بحث',
        viewAll: 'عرض الكل',
        submit: 'إرسال',
        signOut: 'تسجيل الخروج من حسابك',

        // Dashboard
        welcomeBack: 'مرحباً بعودتك',
        studentPortal: 'بوابة الطالب',
        facultyPortal: 'بوابة أعضاء هيئة التدريس',
        adminPortal: 'بوابة الإدارة',
        universityName: 'جامعة المنصورة الجديدة',

        // Student Dashboard
        goodMorning: 'صباح الخير',
        hereIsOverview: 'إليك نظرة عامة على يومك',
        currentGPA: 'المعدل التراكمي',
        completedCredits: 'الساعات المكتملة',
        upcomingExams: 'الامتحانات القادمة',
        pendingAssignments: 'الواجبات المعلقة',
        todaysSchedule: 'جدول اليوم',
        quickActions: 'إجراءات سريعة',
        bookAppointment: 'حجز موعد',
        findTutor: 'البحث عن مدرس',
        reportIssue: 'الإبلاغ عن مشكلة',
        findItem: 'البحث عن غرض',
        recentAnnouncements: 'آخر الإعلانات',
        campusEvent: 'فعالية الحرم الجامعي',
        examSchedule: 'جدول الامتحانات',
        libraryHours: 'ساعات المكتبة',
        credits: 'ساعة',
        days: 'أيام',
        appointment: 'موعد',
        bookAdvisor: 'حجز مستشار',
        campusLife: 'الحياة الجامعية',
        voiceIssues: 'تقديم شكوى',
        findItems: 'البحث عن غرض',
        myClasses: 'مقرراتي',
        viewFullCalendar: 'عرض التقويم الكامل',
        happeningNow: 'يحدث الآن',
        searchPlaceholder: 'البحث عن المقررات والأساتذة...',
        semester: 'الفصل الدراسي',
        computerScience: 'علوم الحاسوب',
        fall: 'الخريف',

        // Faculty Dashboard
        totalStudents: 'إجمالي الطلاب',
        pendingRequests: 'الطلبات المعلقة',
        unreadMessages: 'الرسائل غير المقروءة',
        officeHours: 'ساعات المكتب',

        // Admin Dashboard
        dashboardOverview: 'نظرة عامة على لوحة التحكم',
        welcomeBackAdmin: 'مرحباً بعودتك، إليك ما يحدث في الجامعة اليوم.',
        openComplaints: 'الشكاوى المفتوحة',
        recentActivity: 'النشاط الأخير',
        action: 'الإجراء',
        status: 'الحالة',
        pending: 'قيد الانتظار',

        // Login Page
        unifiedPortal: 'البوابة الموحدة',
        signIn: 'تسجيل الدخول',
        signInSubtitle: 'الوصول إلى حسابك الجامعي',
        universityEmail: 'البريد الجامعي',
        password: 'كلمة المرور',
        rememberMe: 'تذكرني',
        forgotPassword: 'نسيت كلمة المرور؟',
        quickAccess: 'وصول سريع',
        academicCalendar: 'التقويم الأكاديمي',
        campusMap: 'خريطة الحرم الجامعي',
        itSupport: 'الدعم التقني',

        // Peer Tutoring Page
        peerTutoringMarketplace: 'سوق التدريس الخصوصي',
        peerTutoringDesc: 'تواصل مع زملائك للحصول على المساعدة الأكاديمية أو قدم خبرتك للآخرين.',
        becomeTutor: 'كن مدرساً',
        requestTutor: 'اطلب مدرس',
        activeTutors: 'المدرسون النشطون',
        tutorsAvailable: 'مدرس متاح الآن',
        subjectsCovered: 'المواد المتاحة',
        academicAreas: 'مجال أكاديمي',
        sessionsThisMonth: 'جلسات هذا الشهر',
        hoursOfLearning: 'ساعة تعلم',
        avgRating: 'متوسط التقييم',
        fromReviews: 'من التقييمات',
        browseBySubject: 'تصفح حسب المادة',
        featuredTutors: 'المدرسون المميزون',
        sessions: 'جلسة',
        bookSession: 'احجز جلسة',
        available: 'متاح',
        unavailable: 'غير متاح',

        // Events Page
        eventsAnnouncements: 'الفعاليات والإعلانات',
        eventsDesc: 'ابق على اطلاع بأنشطة الحرم الجامعي والإعلانات المهمة.',
        createEvent: 'إنشاء فعالية',
        upcomingEvents: 'الفعاليات القادمة',
        allEvents: 'جميع الفعاليات',
        academic: 'أكاديمي',
        career: 'مهني',
        sports: 'رياضي',
        social: 'اجتماعي',
        attendees: 'حضور',
        featured: 'مميز',
        register: 'تسجيل',
        announcements: 'الإعلانات',
        important: 'مهم',

        // Complaints Page
        complaintsBoard: 'لوحة الشكاوى والملاحظات',
        complaintsDesc: 'عبر عن مخاوفك بوضوح وساعدنا في تحسين جامعة المنصورة الجديدة معاً.',
        submitComplaint: 'تقديم شكوى',
        aiSummary: 'ملخص الذكاء الاصطناعي',
        topIssue: 'المشكلة الرئيسية',
        resolved: 'تم الحل',
        complaintsResolved: 'شكوى تم حلها',
        avgResponseTime: 'متوسط وقت الاستجابة',
        responseTime: 'وقت الاستجابة',
        recentComplaints: 'الشكاوى الأخيرة',
        anonymous: 'مجهول',
        upvotes: 'تصويت',
        comments: 'تعليقات',
        inProgress: 'قيد التنفيذ',
        underReview: 'قيد المراجعة',

        // Lost & Found Page
        lostFoundBoard: 'لوحة المفقودات',
        lostFoundDesc: 'بلّغ عن الأغراض المفقودة أو ساعد في إعادة الأغراض الموجودة لأصحابها.',
        reportLost: 'إبلاغ عن مفقود',
        reportFound: 'إبلاغ عن موجود',
        allItems: 'جميع الأغراض',
        electronics: 'إلكترونيات',
        documents: 'مستندات',
        accessories: 'إكسسوارات',
        books: 'كتب',
        clothing: 'ملابس',
        other: 'أخرى',
        lost: 'مفقود',
        found: 'موجود',
        claimed: 'تم استلامه',
        recentItems: 'الأغراض الأخيرة',
        contactOwner: 'تواصل',
        claimItem: 'استلام',

        // Common
        profile: 'ملفي الشخصي',
    }
};

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        const lang = saved || 'en';
        document.documentElement.lang = lang;
        return lang;
    });

    const isRTL = language === 'ar';

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        document.documentElement.lang = newLang;
        localStorage.setItem('language', newLang);
        setLanguage(newLang);
    };

    return (
        <LanguageContext.Provider value={{
            language, setLanguage: (lang) => {
                document.documentElement.lang = lang;
                localStorage.setItem('language', lang);
                setLanguage(lang);
            }, toggleLanguage, isRTL, t
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
