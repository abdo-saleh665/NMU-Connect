/**
 * Skeleton Loader Component
 * Displays placeholder UI while content is loading
 */

// Base skeleton component with pulse animation
const Skeleton = ({ className = '', variant = 'text', width, height }) => {
    const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

    const variantClasses = {
        text: 'h-4 rounded',
        title: 'h-6 rounded',
        avatar: 'rounded-full',
        thumbnail: 'rounded-lg',
        button: 'h-10 rounded-lg',
        card: 'rounded-xl'
    };

    const style = {
        width: width || (variant === 'avatar' ? '40px' : '100%'),
        height: height || undefined
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}
            style={style}
        />
    );
};

// Card skeleton for list items
export const CardSkeleton = ({ lines = 3 }) => (
    <div className="bg-white dark:bg-[#2a1a1a] rounded-xl p-4 border border-gray-200 dark:border-[#3a2a2a]">
        <div className="flex items-start gap-3">
            <Skeleton variant="avatar" className="w-12 h-12" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="title" width="60%" />
                {[...Array(lines)].map((_, i) => (
                    <Skeleton key={i} variant="text" width={`${100 - i * 15}%`} />
                ))}
            </div>
        </div>
    </div>
);

// Stats skeleton for dashboard stats
export const StatsSkeleton = ({ count = 4 }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#2a1a1a] rounded-xl p-4 border border-gray-200 dark:border-[#3a2a2a]">
                <div className="flex items-center gap-3">
                    <Skeleton variant="avatar" className="w-10 h-10" />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="50%" />
                        <Skeleton variant="title" width="30%" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Table skeleton for tabular data
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="bg-white dark:bg-[#2a1a1a] rounded-xl border border-gray-200 dark:border-[#3a2a2a] overflow-hidden">
        {/* Header */}
        <div className="flex gap-4 p-4 bg-gray-50 dark:bg-[#1a0a0a] border-b border-gray-200 dark:border-[#3a2a2a]">
            {[...Array(cols)].map((_, i) => (
                <Skeleton key={i} variant="text" className="flex-1" />
            ))}
        </div>
        {/* Rows */}
        {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 p-4 border-b border-gray-200 dark:border-[#3a2a2a] last:border-0">
                {[...Array(cols)].map((_, colIndex) => (
                    <Skeleton key={colIndex} variant="text" className="flex-1" />
                ))}
            </div>
        ))}
    </div>
);

// List skeleton for simple lists
export const ListSkeleton = ({ count = 5 }) => (
    <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
            <CardSkeleton key={i} lines={2} />
        ))}
    </div>
);

// Event card skeleton
export const EventSkeleton = () => (
    <div className="bg-white dark:bg-[#2a1a1a] rounded-xl border border-gray-200 dark:border-[#3a2a2a] overflow-hidden">
        <Skeleton variant="thumbnail" className="w-full h-40" />
        <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
                <Skeleton variant="text" width="20%" />
                <Skeleton variant="text" width="30%" />
            </div>
            <Skeleton variant="title" width="80%" />
            <Skeleton variant="text" width="60%" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton variant="text" width="25%" />
                <Skeleton variant="button" width="80px" height="32px" />
            </div>
        </div>
    </div>
);

// Events page skeleton
export const EventsPageSkeleton = () => (
    <div className="space-y-6">
        {/* Stats skeleton */}
        <StatsSkeleton count={3} />
        {/* Events grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <EventSkeleton key={i} />
            ))}
        </div>
    </div>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
    <div className="space-y-6">
        {/* Quick actions skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#2a1a1a] rounded-xl p-4 border border-gray-200 dark:border-[#3a2a2a]">
                    <Skeleton variant="avatar" className="w-10 h-10 mb-3" />
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="50%" height="12px" className="mt-1" />
                </div>
            ))}
        </div>
        {/* Stats skeleton */}
        <StatsSkeleton count={4} />
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ListSkeleton count={3} />
            <ListSkeleton count={3} />
        </div>
    </div>
);

export default Skeleton;
