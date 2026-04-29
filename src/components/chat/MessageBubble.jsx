import { useChat, MessageStatus } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

const MessageBubble = ({ message, showSender = false }) => {
    const { currentUser, getUserById, retryMessage } = useChat();
    const { isRTL } = useLanguage();

    const isOwn = message.sender_id === currentUser.user_id;
    const sender = getUserById(message.sender_id);

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get status icon
    const getStatusIcon = () => {
        switch (message.status) {
            case MessageStatus.SENDING:
                return (
                    <span className="material-symbols-outlined text-[14px] text-gray-400 animate-pulse">
                        schedule
                    </span>
                );
            case MessageStatus.SENT:
                return (
                    <span className="material-symbols-outlined text-[14px] text-gray-400">
                        check
                    </span>
                );
            case MessageStatus.DELIVERED:
                return (
                    <span className="material-symbols-outlined text-[14px] text-gray-400">
                        done_all
                    </span>
                );
            case MessageStatus.READ:
                return (
                    <span className="material-symbols-outlined text-[14px] text-blue-500">
                        done_all
                    </span>
                );
            case MessageStatus.FAILED:
                return (
                    <button
                        onClick={() => retryMessage(message.message_id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                        title={isRTL ? 'إعادة المحاولة' : 'Retry'}
                    >
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span className="text-xs font-medium">{isRTL ? 'إعادة' : 'Retry'}</span>
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                {/* Sender name for group chats */}
                {showSender && !isOwn && (
                    <span className="text-xs font-medium text-primary mb-1 px-2">
                        {sender?.username || 'Unknown'}
                    </span>
                )}

                {/* Message bubble */}
                <div
                    className={`relative px-4 py-2.5 rounded-2xl ${isOwn
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white rounded-bl-md'
                        } ${message.status === MessageStatus.FAILED ? 'opacity-70' : ''}`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>

                {/* Time and status */}
                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[11px] text-[#5c4545] dark:text-[#998888]">
                        {formatTime(message.sent_at)}
                    </span>
                    {isOwn && getStatusIcon()}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
