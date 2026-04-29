import { useChat, ConversationType } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

const ChatHeader = ({ conversation }) => {
    const { getConversationParticipants, getDirectChatPartner, currentUser } = useChat();
    const { isRTL } = useLanguage();

    if (!conversation) return null;

    const isGroup = conversation.type === ConversationType.GROUP;
    const participants = getConversationParticipants(conversation.conversation_id);
    const partner = isGroup ? null : getDirectChatPartner(conversation.conversation_id);

    // Get display name
    const displayName = isGroup
        ? conversation.name
        : partner?.username || (isRTL ? 'مستخدم غير معروف' : 'Unknown User');

    // Get avatar URL
    const avatarUrl = isGroup
        ? null
        : partner?.avatar_url;

    // Get member count for groups
    const memberCount = participants.length;

    // Simulated online status
    const isOnline = !isGroup && Math.random() > 0.3; // Random for demo

    return (
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark">
            {/* Left side - Avatar and info */}
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                    {isGroup ? (
                        <div className="size-11 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[22px]">group</span>
                        </div>
                    ) : (
                        <div
                            className="size-11 rounded-full bg-center bg-cover bg-no-repeat border-2 border-[#f3e7e8] dark:border-[#3a2a2a]"
                            style={{ backgroundImage: avatarUrl ? `url("${avatarUrl}")` : 'none' }}
                        >
                            {!avatarUrl && (
                                <div className="size-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Online indicator for direct chats */}
                    {!isGroup && isOnline && (
                        <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
                    )}
                </div>

                {/* Name and status */}
                <div className="flex flex-col">
                    <h3 className="font-bold text-[#1b0e0e] dark:text-white text-base">
                        {displayName}
                    </h3>
                    <p className="text-xs text-[#5c4545] dark:text-[#998888]">
                        {isGroup
                            ? `${memberCount} ${isRTL ? 'أعضاء' : 'members'}`
                            : isOnline
                                ? (isRTL ? 'متصل الآن' : 'Online')
                                : (isRTL ? 'غير متصل' : 'Offline')
                        }
                    </p>
                </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1">
                {/* Video call button */}
                <button
                    className="p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title={isRTL ? 'مكالمة فيديو' : 'Video call'}
                >
                    <span className="material-symbols-outlined text-[22px]">videocam</span>
                </button>

                {/* Voice call button */}
                <button
                    className="p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title={isRTL ? 'مكالمة صوتية' : 'Voice call'}
                >
                    <span className="material-symbols-outlined text-[22px]">call</span>
                </button>

                {/* Search in chat */}
                <button
                    className="p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title={isRTL ? 'بحث في المحادثة' : 'Search in chat'}
                >
                    <span className="material-symbols-outlined text-[22px]">search</span>
                </button>

                {/* More options */}
                <button
                    className="p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title={isRTL ? 'المزيد' : 'More options'}
                >
                    <span className="material-symbols-outlined text-[22px]">more_vert</span>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
