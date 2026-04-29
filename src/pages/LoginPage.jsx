import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import GraduationCapLogo from '../components/GraduationCapLogo';

const campusImages = [
    '/nmu-campus-1.jpg',
    '/nmu-campus-2.jpg',
    '/nmu-campus-3.jpg',
];

const taglines = [
    {
        en: { line1: 'Shaping the Future of', line2: 'Education' },
        ar: { line1: 'نصنع مستقبل', line2: 'التعليم' }
    },
    {
        en: { line1: 'Where Innovation Meets', line2: 'Excellence' },
        ar: { line1: 'حيث يلتقي الابتكار مع', line2: 'التميز' }
    },
    {
        en: { line1: 'Building Tomorrow\'s', line2: 'Leaders' },
        ar: { line1: 'نبني قادة', line2: 'المستقبل' }
    }
];

const LoginPage = () => {
    const navigate = useNavigate();
    const { t, isRTL, language, toggleLanguage } = useLanguage();
    const { login, getDashboardPath } = useAuth();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % campusImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentTagline = taglines[currentImageIndex][isRTL ? 'ar' : 'en'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!email.trim()) {
            setError(isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email');
            return;
        }
        if (!password) {
            setError(isRTL ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
            return;
        }

        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate(getDashboardPath());
        } catch (err) {
            setError(isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : err.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-display antialiased overflow-hidden flex-col md:flex-row">
            {/* Left Panel - Image Carousel */}
            <div className="hidden md:flex md:w-1/2 lg:w-5/12 relative bg-background-dark overflow-hidden group">
                {/* Image Carousel with High Quality Images */}
                {campusImages.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`NMU Campus ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${index === currentImageIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                            }`}
                        style={{
                            imageRendering: 'auto',
                            WebkitBackfaceVisibility: 'hidden',
                            backfaceVisibility: 'hidden'
                        }}
                        loading="eager"
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-primary/30"></div>

                {/* Animated floating shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-40 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    {/* Logo with hover effect */}
                    <div className="flex items-center gap-4 group/logo cursor-pointer transition-transform duration-300 hover:translate-x-2">
                        <GraduationCapLogo size="sm" className="drop-shadow-lg transition-transform duration-300 group-hover/logo:scale-110" />
                        <div>
                            <h2 className="text-xl font-bold tracking-wide">NMU <span className="text-primary">Connect</span></h2>
                            <p className="text-white/70 text-sm">{isRTL ? 'جامعة المنصورة الجديدة' : 'New Mansoura University'}</p>
                        </div>
                    </div>

                    {/* Tagline with animation - rotates with images */}
                    <div className="space-y-6" key={currentImageIndex}>
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight animate-[fadeIn_0.8s_ease-out]">
                            {currentTagline.line1}
                            <br />
                            <span className="text-white/90 inline-block transition-all duration-500 hover:text-white hover:translate-x-2">
                                {currentTagline.line2}
                            </span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-md leading-relaxed animate-[fadeIn_1s_ease-out]">
                            {isRTL ? 'بوابتك الموحدة للخدمات الأكاديمية والحياة الجامعية ونجاح الطلاب.' : 'Your unified gateway to academic services, campus life, and student success.'}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 pt-4">
                        <div className="transition-transform duration-300 hover:scale-105">
                            <p className="text-3xl font-bold">12K+</p>
                            <p className="text-white/60 text-sm">{isRTL ? 'طالب' : 'Students'}</p>
                        </div>
                        <div className="transition-transform duration-300 hover:scale-105">
                            <p className="text-3xl font-bold">215+</p>
                            <p className="text-white/60 text-sm">{isRTL ? 'عضو هيئة تدريس' : 'Faculty'}</p>
                        </div>
                        <div className="transition-transform duration-300 hover:scale-105">
                            <p className="text-3xl font-bold">98%</p>
                            <p className="text-white/60 text-sm">{isRTL ? 'رضا الطلاب' : 'Satisfaction'}</p>
                        </div>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex gap-3 pt-6">
                        {campusImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${index === currentImageIndex
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto relative">
                {/* Language Toggle Button */}
                <button
                    onClick={toggleLanguage}
                    className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium text-text-main dark:text-white transition-all duration-300 hover:border-primary/50 shadow-md hover:shadow-lg"
                >
                    <span className="material-symbols-outlined text-[18px] text-primary">translate</span>
                    {language === 'en' ? 'EN' : 'ع'}
                </button>
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24">
                    <div className="w-full max-w-md space-y-8 animate-[fadeIn_0.8s_ease-out]">
                        {/* Mobile logo */}
                        <div className="md:hidden flex justify-center mb-6">
                            <GraduationCapLogo size="md" className="drop-shadow-lg" />
                        </div>

                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-3xl font-bold text-text-main dark:text-white tracking-tight">
                                {t('welcomeBack')}!
                            </h2>
                            <p className="text-text-sub dark:text-gray-400">
                                {isRTL ? 'يرجى إدخال بياناتك لتسجيل الدخول.' : 'Please enter your details to sign in.'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-[fadeIn_0.3s_ease-out]">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-500">error</span>
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Demo Credentials Info */}
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                                {isRTL ? 'بيانات الدخول التجريبية:' : 'Demo Credentials:'}
                            </p>
                            <div className="text-xs text-blue-500 dark:text-blue-300 space-y-1">
                                <p>• ahmed.m@nmu.edu.eg / password123</p>
                                <p>• dr.ahmed@nmu.edu.eg / password123</p>
                                <p>• admin@nmu.edu.eg / password123</p>
                            </div>
                        </div>

                        <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
                            <div className="space-y-2 group">
                                <label className="text-sm font-medium text-text-main dark:text-gray-200 block transition-colors group-focus-within:text-primary">
                                    {t('universityEmail')}
                                </label>
                                <input
                                    className="block w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-surface-light dark:bg-surface-dark text-text-main dark:text-white transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300 dark:hover:border-gray-600"
                                    placeholder="student@nmu.edu.eg"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-sm font-medium text-text-main dark:text-gray-200 block transition-colors group-focus-within:text-primary">
                                    {t('password')}
                                </label>
                                <input
                                    className="block w-full px-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-surface-light dark:bg-surface-dark text-text-main dark:text-white transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-gray-300 dark:hover:border-gray-600"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSubmitting}
                                    autoComplete="current-password"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group/check">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
                                    <span className="text-text-sub dark:text-gray-400 group-hover/check:text-text-main dark:group-hover/check:text-white transition-colors">{t('rememberMe')}</span>
                                </label>
                                <a href="#" className="text-primary font-medium hover:underline transition-all hover:text-primary-hover">
                                    {t('forgotPassword')}
                                </a>
                            </div>

                            <button
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                        <span>{isRTL ? 'جاري التحميل...' : 'Signing in...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{t('signIn')}</span>
                                        <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                {/* Copyright at bottom */}
                <p className="text-center text-sm text-text-sub dark:text-gray-500 py-4" dir="ltr">
                    © {new Date().getFullYear()} {isRTL ? 'جامعة المنصورة الجديدة. جميع الحقوق محفوظة.' : 'New Mansoura University. All rights reserved.'}
                </p>
            </div>
        </div >
    );
};

export default LoginPage;




