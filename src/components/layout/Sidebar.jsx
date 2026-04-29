import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Navigation items configuration for each portal type
 */
const navigationConfig = {
    student: [
        { id: 'dashboard', path: '/student', icon: 'dashboard', labelKey: 'dashboard' },
        { id: 'schedule', path: '/appointment', icon: 'calendar_month', labelKey: 'schedule' },
        { id: 'tutoring', path: '/tutoring', icon: 'school', labelKey: 'peerTutoring' },
        { id: 'events', path: '/events', icon: 'event', labelKey: 'events' },
        { id: 'complaints', path: '/complaints', icon: 'report_problem', labelKey: 'complaints' },
        { id: 'lostFound', path: '/lost-found', icon: 'search', labelKey: 'lostAndFound' },
    ],
    faculty: [
        { id: 'dashboard', path: '/faculty', icon: 'dashboard', labelKey: 'dashboard' },
        { id: 'classes', path: '/faculty/classes', icon: 'class', labelKey: 'classes' },
        { id: 'appointments', path: '/faculty/appointments', icon: 'calendar_month', labelKey: 'appointments' },
        { id: 'students', path: '/faculty/students', icon: 'group', labelKey: 'students' },
        { id: 'complaints', path: '/faculty/complaints', icon: 'report_problem', labelKey: 'complaints' },
    ],
    admin: [
        { id: 'dashboard', path: '/admin', icon: 'dashboard', labelKey: 'dashboard' },
        { id: 'accounts', path: '/admin/accounts', icon: 'manage_accounts', labelKey: 'accounts' },
    ]
};

/**
 * Portal titles configuration
 */
const portalTitles = {
    student: { key: 'studentPortal', fallback: 'Student Portal' },
    faculty: { key: 'facultyPortal', fallback: 'Faculty Portal' },
    admin: { key: 'adminPortal', fallback: 'Admin Portal' }
};

/**
 * Sidebar Component - Reusable navigation sidebar for all portal types
 * 
 * @param {Object} props
 * @param {'student'|'faculty'|'admin'} props.portalType - Type of portal
 * @param {string} props.activeItem - Currently active navigation item id
 * @param {boolean} props.isOpen - Whether sidebar is open
 * @param {Function} props.onToggle - Callback to toggle sidebar
 */
const Sidebar = ({ portalType = 'student', activeItem, isOpen, onToggle }) => {
    const { t, isRTL } = useLanguage();
    const navigate = useNavigate();

    const navItems = navigationConfig[portalType] || navigationConfig.student;
    const portalTitle = portalTitles[portalType] || portalTitles.student;

    return (
        <aside
            className={`${isOpen ? 'w-64 p-4' : 'w-0 p-0'} flex-shrink-0 bg-surface-light dark:bg-surface-dark ${isOpen ? (isRTL ? 'border-l' : 'border-r') : ''} border-[#e7d0d1] dark:border-[#3a2a2a] flex-col justify-between hidden md:flex h-full overflow-hidden transition-all duration-300`}
        >
            <div className={`flex flex-col gap-6 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                        <h1 className="text-[#1b0e0e] dark:text-white text-lg font-bold leading-normal">
                            {t(portalTitle.key) || portalTitle.fallback}
                        </h1>
                    </div>
                    <button
                        onClick={onToggle}
                        className="p-1.5 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">menu_open</span>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = activeItem === item.id;
                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] group'
                                    }`}
                            >
                                <span className={`material-symbols-outlined ${isActive ? 'icon-filled' : 'group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors'}`}>
                                    {item.icon}
                                </span>
                                <p className={`text-sm leading-normal ${isActive
                                        ? 'font-semibold'
                                        : 'font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white transition-colors'
                                    }`}>
                                    {t(item.labelKey) || item.labelKey}
                                </p>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
