import { createContext, useContext, useState, useEffect } from 'react';

// User roles
export const UserRole = {
    STUDENT: 'student',
    FACULTY: 'faculty',
    ADMIN: 'admin'
};

// Mock users for development (fallback when backend is not available)
const mockUsers = [
    {
        id: 1,
        email: 'ahmed.m@nmu.edu.eg',
        password: 'password123',
        name: 'Ahmed Mohamed',
        nameAr: 'أحمد محمد',
        role: UserRole.STUDENT,
        studentId: '20230154',
        department: 'Computer Science',
        departmentAr: 'علوم الحاسب',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY'
    },
    {
        id: 2,
        email: 'dr.ahmed@nmu.edu.eg',
        password: 'password123',
        name: 'Dr. Ahmed Hassan',
        nameAr: 'د. أحمد حسن',
        role: UserRole.FACULTY,
        department: 'Computer Science',
        departmentAr: 'علوم الحاسب',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSSxWDtmLKC2cbdTqkLlI6ngFA73SU4iF0aXNYGIKktvDyGOECITuCBUJd6LA5CnB_zsx7_FjT7pRFeIIKreTR_Xa5BmRaAtMSaNUoPcztVrKinBJY0pIdiseUOEeB7BKdAO5hM2nF3fvhSP9jmVDU8k-y0FNrZttwdnzw73rfx3aY2oJYu5n6tC-mbPDPFCqujxkJVatEovhP4xJcLJRljYNtuAhZVW729x4dmi7w6bfoV6mZxYU4A7NDgTGFOreA4EgnmQFkrgI'
    },
    {
        id: 3,
        email: 'admin@nmu.edu.eg',
        password: 'password123',
        name: 'System Admin',
        nameAr: 'مدير النظام',
        role: UserRole.ADMIN,
        department: 'IT Administration',
        departmentAr: 'إدارة تقنية المعلومات',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJiAXdiMDFducfoO-GV1NSX8dLZITG33McGYwEvb2N_zJY1NxoyUZoAPRc1Xai8OkNE4mQ1K1epbvGq5ffOy_pLvmvpPj9rNxDb2nFRuoeGUB0HhY0PlOoSIFtH-xEUVE_xw1OLi_rV_SeEuEgrfya2xyV1CnNPddh6qG_WNk7E9HgBSG7k3VdyKdiAReLPK3aaLOqwwpKF2TC8a050D2EhGw8_VdbpXrgyNbrK1b0qVAX-W7TDsGEliyKXhHCoN_HXec9DLTX4y0'
    }
];

const AUTH_STORAGE_KEY = 'nmu_auth_user';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);

                    // If user has a token (API login), restore directly
                    if (parsedUser.token || parsedUser._id) {
                        setUser(parsedUser);
                    } else {
                        // Fallback: validate against mock users for development
                        const validUser = mockUsers.find(u => u.id === parsedUser.id);
                        if (validUser) {
                            const { password, ...userWithoutPassword } = validUser;
                            setUser(userWithoutPassword);
                        } else {
                            localStorage.removeItem(AUTH_STORAGE_KEY);
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                localStorage.removeItem(AUTH_STORAGE_KEY);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    /**
     * Login with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} User object on success
     * @throws {Error} If credentials are invalid
     */
    const login = async (email, password) => {
        try {
            // Try real API first
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success && data.user) {
                // Store user with token
                const userWithToken = { ...data.user, token: data.token };
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithToken));
                setUser(userWithToken);
                return userWithToken;
            }

            throw new Error(data.message || 'Invalid email or password');
        } catch (error) {
            // If API fails, fall back to mock users for development
            if (error.message === 'Failed to fetch') {
                console.log('Backend not available, using mock login');
                const foundUser = mockUsers.find(
                    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
                );

                if (!foundUser) {
                    throw new Error('Invalid email or password');
                }

                const { password: _, ...userWithoutPassword } = foundUser;
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
                setUser(userWithoutPassword);
                return userWithoutPassword;
            }
            throw error;
        }
    };

    /**
     * Logout current user
     */
    const logout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
    };

    /**
     * Check if current user has a specific role
     * @param {string|string[]} roles - Role or array of roles to check
     * @returns {boolean}
     */
    const hasRole = (roles) => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };

    /**
     * Check if the user is authenticated
     */
    const isAuthenticated = !!user;

    /**
     * Get the dashboard path for the current user's role
     * @returns {string}
     */
    const getDashboardPath = () => {
        if (!user) return '/login';
        switch (user.role) {
            case UserRole.STUDENT:
                return '/student';
            case UserRole.FACULTY:
                return '/faculty';
            case UserRole.ADMIN:
                return '/admin';
            default:
                return '/login';
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasRole,
        getDashboardPath,
        UserRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
