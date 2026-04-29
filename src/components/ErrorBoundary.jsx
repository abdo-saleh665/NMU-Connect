import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 * 
 * Usage:
 * <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so next render shows fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console (in production, send to error reporting service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI provided via props
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6">
                    <div className="max-w-md w-full bg-surface-light dark:bg-surface-dark rounded-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] p-8 text-center">
                        <div className="size-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-red-500 text-[32px]">error</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                        >
                            Refresh Page
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-sm text-red-500 cursor-pointer hover:underline">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs text-red-700 dark:text-red-300 overflow-auto max-h-48">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
