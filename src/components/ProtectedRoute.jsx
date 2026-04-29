import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

/**
 * ProtectedRoute - Wrapper component to protect routes from unauthorized access
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected content to render
 * @param {string|string[]} [props.allowedRoles] - Optional role(s) that can access this route
 * @returns {React.ReactNode}
 * 
 * @example
 * // Protect route for authenticated users only
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect route for specific role
 * <ProtectedRoute allowedRoles="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect route for multiple roles
 * <ProtectedRoute allowedRoles={['admin', 'faculty']}>
 *   <ManagementPanel />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, isLoading, user, getDashboardPath } = useAuth();
    const location = useLocation();

    // Show loading screen while checking authentication
    if (isLoading) {
        return <LoadingScreen onComplete={() => { }} />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Save the attempted URL for redirecting after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access
    if (allowedRoles) {
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(user.role)) {
            // User doesn't have the required role, redirect to their dashboard
            return <Navigate to={getDashboardPath()} replace />;
        }
    }

    // User is authenticated and has the required role (if specified)
    return children;
};

/**
 * PublicRoute - Wrapper for routes that should only be accessible when NOT authenticated
 * (e.g., login page - redirect to dashboard if already logged in)
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The public content to render
 * @returns {React.ReactNode}
 */
export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading, getDashboardPath } = useAuth();
    const location = useLocation();

    // Show loading screen while checking authentication
    if (isLoading) {
        return <LoadingScreen onComplete={() => { }} />;
    }

    // If authenticated, redirect to dashboard or the page they tried to access
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || getDashboardPath();
        return <Navigate to={from} replace />;
    }

    return children;
};

export default ProtectedRoute;
