import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Header Component - Reusable header with notifications and profile dropdown
 * 
 * @param {Object} props
 * @param {string} props.title - Page title to display
 * @param {boolean} props.showMenuButton - Whether to show the menu toggle button
 * @param {Function} props.onMenuClick - Callback when menu button is clicked
 * @param {'student'|'faculty'|'admin'} props.portalType - Type of portal for settings/profile links
 * @param {Array} [props.notifications] - Optional notifications array
 */
const Header = ({
    title,
    showMenuButton = false,
    onMenuClick,
    portalType = 'student',
    notifications: propNotifications
}) => {
    const { t, isRTL } = useLanguage();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // Default notifications if none provided
    const defaultNotifications = [
        {
            id: 1,
            title: isRTL ? 'إشعار جديد' : 'New Notification',
            message: isRTL ? 'لديك إشعار جديد' : 'You have a new notification',
            time: isRTL ? 'منذ ساعة' : '1 hour ago',
            read: false,
            icon: 'notifications'
        }
    ];

    const notifications = propNotifications || defaultNotifications;
    const unreadCount = notifications.filter(n => !n.read).length;

    // Build paths based on portal type
    const profilePath = portalType === 'student' ? '/profile' : `/${portalType}/profile`;
    const settingsPath = portalType === 'student' ? '/settings' : `/${portalType}/settings`;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get user display info
    const userName = user?.name?.split(' ')[0] || 'User';
    const userFullName = user?.name || 'User';
    const userEmail = user?.email || '';
    const userAvatar = user?.avatar || 'https://via.placeholder.com/40';
    const userId = user?.studentId || user?.id || '';

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark px-6 py-4 flex-shrink-0 z-10">
            <div className="flex items-center gap-4">
                {/* Menu toggle button */}
                <button
                    onClick={onMenuClick}
                    className={`${showMenuButton ? 'hidden md:flex' : 'hidden'} p-2 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg transition-colors`}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <button className="md:hidden p-2 text-[#1b0e0e] dark:text-white" onClick={onMenuClick}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileMenuOpen(false); }}
                        className="relative flex items-center justify-center size-10 rounded-full hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 size-2.5 bg-primary rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {notificationsOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg z-50 animate-[fadeIn_0.15s_ease-out] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <h3 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الإشعارات' : 'Notifications'}</h3>
                                <button className="text-xs text-primary font-medium hover:underline">{isRTL ? 'تحديد الكل كمقروء' : 'Mark all as read'}</button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`flex gap-3 px-4 py-3 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors cursor-pointer border-b border-[#e7d0d1]/50 dark:border-[#3a2a2a]/50 last:border-0 ${!notification.read ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${!notification.read ? 'bg-primary/10 text-primary' : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0]'}`}>
                                            <span className="material-symbols-outlined text-[20px]">{notification.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-medium truncate ${!notification.read ? 'text-[#1b0e0e] dark:text-white' : 'text-[#5c4545] dark:text-[#d0c0c0]'}`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.read && <span className="size-2 bg-primary rounded-full shrink-0 mt-1.5"></span>}
                                            </div>
                                            <p className="text-xs text-[#5c4545] dark:text-[#998888] truncate mt-0.5">{notification.message}</p>
                                            <p className="text-xs text-[#994d51] mt-1">{notification.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <button className="w-full py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                    {isRTL ? 'عرض جميع الإشعارات' : 'View all notifications'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-[1px] bg-[#e7d0d1] dark:bg-[#3a2a2a] mx-1"></div>

                {/* Profile Menu */}
                <div className="relative">
                    <button
                        onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); }}
                        className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity"
                    >
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-[#f3e7e8] dark:border-[#3a2a2a]"
                            style={{ backgroundImage: `url("${userAvatar}")` }}
                        ></div>
                        <div className="hidden md:flex flex-col items-start">
                            <p className="text-sm font-bold text-[#1b0e0e] dark:text-white leading-none">{userName}</p>
                            {userId && <p className="text-xs text-[#994d51] mt-1 leading-none">ID: {userId}</p>}
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-[#5c4545] dark:text-[#d0c0c0] hidden md:block">
                            {profileMenuOpen ? 'expand_less' : 'expand_more'}
                        </span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {profileMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                            <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <p className="text-sm font-bold text-[#1b0e0e] dark:text-white">{userFullName}</p>
                                <p className="text-xs text-[#994d51]">{userEmail}</p>
                            </div>
                            <Link to={profilePath} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                {t('profile') || 'My Profile'}
                            </Link>
                            <Link to={settingsPath} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                {t('settings')}
                            </Link>
                            <div className="border-t border-[#e7d0d1] dark:border-[#3a2a2a] mt-2 pt-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">logout</span>
                                    {t('logout') || 'Logout'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
