import { useState } from 'react';
import { useChat, ConversationType } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

const ConversationList = ({ onNewChat, onNewGroup }) => {
    const {
        getSortedConversations,
        getConversationDisplayName,
        getLastMessage,
        getUnreadCount,
        getDirectChatPartner,
        selectedConversationId,
        setSelectedConversationId,
        currentUser
    } = useChat();
    const { isRTL } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    const conversations = getSortedConversations();

    // Filter conversations by search query
    const filteredConversations = conversations.filter(conv => {
        const name = getConversationDisplayName(conv);
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Format time for conversation preview
    const formatPreviewTime = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else if (diffDays === 1) {
            return isRTL ? 'أمس' : 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface-light dark:bg-surface-dark border-r border-[#e7d0d1] dark:border-[#3a2a2a]">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white">
                        {isRTL ? 'المحادثات' : 'Messages'}
                    </h2>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onNewChat}
                            className="p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                            title={isRTL ? 'محادثة جديدة' : 'New chat'}
                        >
                            <span className="material-symbols-outlined text-[22px]">edit_square</span>
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-[#994d51]">
                        search
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isRTL ? 'بحث في المحادثات...' : 'Search conversations...'}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    />
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 flex gap-2 px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                <button
                    onClick={onNewChat}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    <span>{isRTL ? 'محادثة جديدة' : 'New Chat'}</span>
                </button>
                <button
                    onClick={onNewGroup}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">group_add</span>
                    <span>{isRTL ? 'مجموعة جديدة' : 'New Group'}</span>
                </button>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                        <span className="material-symbols-outlined text-4xl text-[#998888] mb-3">
                            forum
                        </span>
                        <p className="text-sm text-[#5c4545] dark:text-[#998888]">
                            {searchQuery
                                ? (isRTL ? 'لا توجد نتائج' : 'No results found')
                                : (isRTL ? 'لا توجد محادثات' : 'No conversations yet')}
                        </p>
                    </div>
                ) : (
                    filteredConversations.map(conv => {
                        const isGroup = conv.type === ConversationType.GROUP;
                        const partner = isGroup ? null : getDirectChatPartner(conv.conversation_id);
                        const lastMessage = getLastMessage(conv.conversation_id);
                        const unreadCount = getUnreadCount(conv.conversation_id);
                        const isSelected = selectedConversationId === conv.conversation_id;

                        return (
                            <div
                                key={conv.conversation_id}
                                onClick={() => setSelectedConversationId(conv.conversation_id)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected
                                        ? 'bg-primary/10 border-r-3 border-primary'
                                        : 'hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a]'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative flex-shrink-0">
                                    {isGroup ? (
                                        <div className="size-12 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined">group</span>
                                        </div>
                                    ) : (
                                        <div
                                            className="size-12 rounded-full bg-center bg-cover bg-no-repeat border-2 border-[#f3e7e8] dark:border-[#3a2a2a]"
                                            style={{ backgroundImage: partner?.avatar_url ? `url("${partner.avatar_url}")` : 'none' }}
                                        >
                                            {!partner?.avatar_url && (
                                                <div className="size-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined">person</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Online indicator */}
                                    {!isGroup && (
                                        <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className={`font-semibold truncate ${unreadCount > 0
                                                ? 'text-[#1b0e0e] dark:text-white'
                                                : 'text-[#5c4545] dark:text-[#d0c0c0]'
                                            }`}>
                                            {getConversationDisplayName(conv)}
                                        </h4>
                                        <span className="text-xs text-[#998888] flex-shrink-0">
                                            {formatPreviewTime(conv.last_message_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-0.5">
                                        <p className={`text-sm truncate ${unreadCount > 0
                                                ? 'text-[#1b0e0e] dark:text-[#d0c0c0] font-medium'
                                                : 'text-[#5c4545] dark:text-[#998888]'
                                            }`}>
                                            {lastMessage
                                                ? (lastMessage.sender_id === currentUser.user_id
                                                    ? `${isRTL ? 'أنت: ' : 'You: '}${lastMessage.content}`
                                                    : lastMessage.content)
                                                : (isRTL ? 'لا توجد رسائل' : 'No messages yet')}
                                        </p>
                                        {unreadCount > 0 && (
                                            <span className="flex-shrink-0 size-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
