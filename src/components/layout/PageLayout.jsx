import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingScreen from '../LoadingScreen';

/**
 * PageLayout Component - Wrapper layout for all portal pages
 * Combines Sidebar, Header, and content area with loading screen
 * 
 * @param {Object} props
 * @param {'student'|'faculty'|'admin'} props.portalType - Type of portal
 * @param {string} props.activeItem - Currently active navigation item id
 * @param {string} props.title - Page title for header
 * @param {React.ReactNode} props.children - Page content
 * @param {Array} [props.notifications] - Optional notifications for header
 * @param {boolean} [props.showLoading=true] - Whether to show loading screen
 * 
 * @example
 * <PageLayout 
 *   portalType="student" 
 *   activeItem="dashboard" 
 *   title="Welcome Back, Ahmed"
 * >
 *   <DashboardContent />
 * </PageLayout>
 */
const PageLayout = ({
    portalType = 'student',
    activeItem,
    title,
    children,
    notifications,
    showLoading = true
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(showLoading);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark">
            {/* Loading Screen */}
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

            {/* Sidebar */}
            <Sidebar
                portalType={portalType}
                activeItem={activeItem}
                isOpen={sidebarOpen}
                onToggle={handleSidebarToggle}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <Header
                    title={title}
                    showMenuButton={!sidebarOpen}
                    onMenuClick={() => setSidebarOpen(true)}
                    portalType={portalType}
                    notifications={notifications}
                />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default PageLayout;
