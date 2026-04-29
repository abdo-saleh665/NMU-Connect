import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

// Floating Contacts Sidebar - Shows only tutors with ACCEPTED sessions
const MessengerSidebar = () => {
    const {
        getSortedConversations,
        getConversationDisplayName,
        getTutorSubject,
        getUnreadCount,
        getDirectChatPartner,
        getConversationSession,
        selectedConversationId,
        setSelectedConversationId
    } = useChat();
    const { isRTL } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    // Get only conversations with accepted sessions
    const conversations = getSortedConversations();

    // Simulated online status
    const [onlineUsers] = useState(() => {
        return [2, 3]; // Sara and Mohamed are online
    });

    // Filter conversations
    const filteredConversations = conversations.filter(conv => {
        const name = getConversationDisplayName(conv);
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className={`fixed ${isRTL ? 'left-0' : 'right-0'} top-0 h-full z-40 flex flex-col transition-all duration-300 ${isExpanded ? 'w-72' : 'w-16'}`}>
            {/* Main sidebar container - NMU Theme */}
            <div className="flex-1 flex flex-col bg-surface-light dark:bg-surface-dark border-l border-[#e7d0d1] dark:border-[#3a2a2a] shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                    {isExpanded ? (
                        <>
                            <div>
                                <h3 className="text-[#1b0e0e] dark:text-white font-bold text-base">
                                    {isRTL ? 'المعلمين' : 'My Tutors'}
                                </h3>
                                <p className="text-[11px] text-[#5c4545] dark:text-[#886a6a]">
                                    {isRTL ? 'جلسات مقبولة' : 'Accepted sessions'}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-full transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">search</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="w-full flex justify-center p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                        </button>
                    )}
                </div>

                {/* Search bar */}
                {isExpanded && showSearch && (
                    <div className="px-3 py-2 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isRTL ? 'بحث...' : 'Search tutors...'}
                            className="w-full px-3 py-2 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] rounded-full border-none focus:ring-2 focus:ring-primary/50 text-sm"
                            autoFocus
                        />
                    </div>
                )}

                {/* Tutors list (only accepted sessions) */}
                <div className="flex-1 overflow-y-auto py-2">
                    {filteredConversations.length === 0 && isExpanded && (
                        <div className="px-4 py-8 text-center text-[#5c4545] dark:text-[#886a6a] text-sm">
                            <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">chat_bubble</span>
                            <p>{isRTL ? 'لا توجد جلسات مقبولة' : 'No accepted sessions'}</p>
                            <p className="text-xs mt-1">{isRTL ? 'اطلب جلسة من صفحة التدريس' : 'Request a session from Peer Tutoring'}</p>
                        </div>
                    )}

                    {filteredConversations.map(conv => {
                        const partner = getDirectChatPartner(conv.conversation_id);
                        const subject = getTutorSubject(conv.conversation_id);
                        const unreadCount = getUnreadCount(conv.conversation_id);
                        const isSelected = selectedConversationId === conv.conversation_id;
                        const isOnline = partner && onlineUsers.includes(partner.user_id);

                        if (!isExpanded) {
                            // Collapsed view - just avatars
                            return (
                                <div
                                    key={conv.conversation_id}
                                    onClick={() => setSelectedConversationId(conv.conversation_id)}
                                    className="flex justify-center py-2 cursor-pointer group"
                                >
                                    <div className="relative">
                                        <div
                                            className="size-10 rounded-full bg-center bg-cover bg-no-repeat bg-[#f3e7e8] dark:bg-[#3a2a2a] group-hover:ring-2 ring-primary"
                                            style={{ backgroundImage: partner?.avatar_url ? `url("${partner.avatar_url}")` : 'none' }}
                                        />
                                        {isOnline && (
                                            <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
                                        )}
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 size-5 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        // Expanded view
                        return (
                            <div
                                key={conv.conversation_id}
                                onClick={() => setSelectedConversationId(conv.conversation_id)}
                                className={`flex items-center gap-3 px-3 py-2.5 mx-2 cursor-pointer rounded-lg transition-colors ${isSelected
                                        ? 'bg-primary/10'
                                        : 'hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a]'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    <div
                                        className="size-10 rounded-full bg-center bg-cover bg-no-repeat bg-[#f3e7e8] dark:bg-[#3a2a2a]"
                                        style={{ backgroundImage: partner?.avatar_url ? `url("${partner.avatar_url}")` : 'none' }}
                                    >
                                        {!partner?.avatar_url && (
                                            <div className="size-full rounded-full flex items-center justify-center text-[#5c4545] dark:text-[#d0c0c0]">
                                                <span className="material-symbols-outlined text-[20px]">person</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Online indicator */}
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
                                    )}
                                </div>

                                {/* Name and Subject */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm truncate ${unreadCount > 0 ? 'text-[#1b0e0e] dark:text-white font-semibold' : 'text-[#1b0e0e] dark:text-white font-medium'
                                            }`}>
                                            {getConversationDisplayName(conv)}
                                        </span>
                                        {unreadCount > 0 && (
                                            <span className="flex-shrink-0 size-5 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full ml-2">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    {subject && (
                                        <p className="text-xs text-primary truncate">{subject}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Collapse button */}
                {isExpanded && (
                    <div className="p-2 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="w-full flex items-center justify-center gap-2 py-2 text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg text-sm transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {isRTL ? 'chevron_left' : 'chevron_right'}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessengerSidebar;
