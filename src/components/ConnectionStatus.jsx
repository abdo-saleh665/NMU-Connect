/**
 * Connection Status Indicator
 * Shows real-time connection status with animated indicator
 */

import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';

const ConnectionStatus = ({ showLabel = true, className = '' }) => {
    const { isConnected } = useSocket();
    const { isRTL } = useLanguage();

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Animated dot indicator */}
            <div className="relative">
                <div
                    className={`w-2.5 h-2.5 rounded-full ${isConnected
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                />
                {/* Ping animation for connected state */}
                {isConnected && (
                    <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
                )}
            </div>

            {/* Optional label */}
            {showLabel && (
                <span className={`text-xs ${isConnected
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                    {isConnected
                        ? (isRTL ? 'متصل' : 'Connected')
                        : (isRTL ? 'غير متصل' : 'Offline')
                    }
                </span>
            )}
        </div>
    );
};

export default ConnectionStatus;
