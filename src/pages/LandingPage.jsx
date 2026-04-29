import { Link } from 'react-router-dom';

const LandingPage = () => {
    const features = [
        {
            icon: 'event_available',
            title: 'Appointment Booking',
            description: 'Schedule consultations with academic advisors and faculty members with real-time availability.',
            color: 'bg-blue-500',
            link: '/appointment'
        },
        {
            icon: 'school',
            title: 'Peer Tutoring',
            description: 'Connect with fellow students for academic help or offer your expertise to others.',
            color: 'bg-emerald-500',
            link: '/tutoring'
        },
        {
            icon: 'calendar_month',
            title: 'Events & Calendar',
            description: 'Stay updated with campus events, workshops, and important academic dates.',
            color: 'bg-purple-500',
            link: '/events'
        },
        {
            icon: 'campaign',
            title: 'Complaints Board',
            description: 'Voice your concerns transparently and track resolution with community voting.',
            color: 'bg-orange-500',
            link: '/complaints'
        },
        {
            icon: 'search',
            title: 'Lost & Found',
            description: 'Report lost items or help reunite found belongings with their owners.',
            color: 'bg-teal-500',
            link: '/lost-found'
        },
        {
            icon: 'dashboard',
            title: 'Unified Dashboard',
            description: 'Access all university services from one centralized, personalized portal.',
            color: 'bg-primary',
            link: '/login'
        }
    ];

    const stats = [
        { value: '12,450+', label: 'Active Students' },
        { value: '450+', label: 'Faculty Members' },
        { value: '2,500+', label: 'Issues Resolved' },
        { value: '98%', label: 'Satisfaction Rate' }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1a0f0f]/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <img src="/nmu-logo.png" alt="NMU Logo" className="size-10 rounded-full" />
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">NMU Connect</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">New Mansoura University</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all hover:scale-105"
                            >
                                Get Started
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8">
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                        Transforming Campus Life
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-6">
                        Your University,
                        <br />
                        <span className="bg-gradient-to-r from-primary via-rose-600 to-pink-500 bg-clip-text text-transparent">
                            Fully Connected
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        NMU Connect brings together all student services, academic tools, and campus life into one
                        powerful, unified platform. Book appointments, find tutors, track events, and more.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary-hover transition-all hover:scale-105 text-lg"
                        >
                            <span className="material-symbols-outlined">login</span>
                            Access Portal
                        </Link>
                        <a
                            href="#features"
                            className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
                        >
                            <span className="material-symbols-outlined">play_circle</span>
                            Explore Features
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#1a0f0f] border-y border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl sm:text-4xl font-black text-primary mb-2">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
                            Everything You Need, One Platform
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Access all university services seamlessly. From academic support to campus facilities, we've got you covered.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Link
                                key={index}
                                to={feature.link}
                                className="group relative bg-white dark:bg-[#251515] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-800/50 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                <div className={`size-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="flex items-center gap-2 mt-5 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span>Learn more</span>
                                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-rose-700 to-pink-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                        Ready to Transform Your University Experience?
                    </h2>
                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                        Join thousands of students and faculty members already using NMU Connect to simplify their campus life.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-lg"
                        >
                            <span className="material-symbols-outlined">rocket_launch</span>
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0f0808] border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <img src="/nmu-logo.png" alt="NMU Logo" className="size-10 rounded-full" />
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">NMU Connect</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">New Mansoura University</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2024 New Mansoura University. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;



