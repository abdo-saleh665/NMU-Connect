import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChatProvider, useChat, MessageStatus } from '../context/ChatContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingScreen from '../components/LoadingScreen';

// Chat page content - matches website style
const ChatPageContent = ({ portalType = 'student' }) => {
    const { t, isRTL } = useLanguage();
    const {
        selectedConversationId,
        setSelectedConversationId,
        getSortedConversations,
        getConversationDisplayName,
        getTutorSubject,
        getUnreadCount,
        getDirectChatPartner,
        getConversationMessages,
        sendMessage,
        markConversationAsRead,
        currentUser,
        getUserById,
        retryMessage
    } = useChat();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    const conversations = getSortedConversations();
    const selectedConversation = conversations.find(c => c.conversation_id === selectedConversationId);
    const messages = selectedConversationId ? getConversationMessages(selectedConversationId) : [];
    const partner = selectedConversationId ? getDirectChatPartner(selectedConversationId) : null;

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark as read when conversation is selected
    useEffect(() => {
        if (selectedConversationId) {
            markConversationAsRead(selectedConversationId);
        }
    }, [selectedConversationId, markConversationAsRead]);

    // Get navigation items
    const getNavItems = () => {
        const baseItems = {
            student: [
                { path: '/student', icon: 'dashboard', label: t('dashboard') },
                { path: '/tutoring', icon: 'school', label: t('peerTutoring') },
                { path: '/appointment', icon: 'calendar_month', label: t('schedule') },
                { path: '/events', icon: 'event', label: t('events') },
                { path: '/complaints', icon: 'report_problem', label: t('complaints') },
                { path: '/lost-found', icon: 'search', label: t('lostAndFound') }
            ]
        };
        return baseItems[portalType] || baseItems.student;
    };

    const navItems = getNavItems();

    const handleSend = () => {
        if (!message.trim() || !selectedConversationId) return;
        sendMessage(selectedConversationId, message.trim());
        setMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    // Get status icon
    const getStatusIcon = (status, msgId) => {
        switch (status) {
            case MessageStatus.SENDING:
                return <span className="text-[#998888] text-xs">○</span>;
            case MessageStatus.SENT:
                return <span className="text-[#998888] text-xs">✓</span>;
            case MessageStatus.DELIVERED:
                return <span className="text-[#998888] text-xs">✓✓</span>;
            case MessageStatus.READ:
                return <span className="text-primary text-xs">✓✓</span>;
            case MessageStatus.FAILED:
                return (
                    <button onClick={() => retryMessage(msgId)} className="text-red-500 text-xs hover:underline">
                        {isRTL ? 'إعادة' : 'Retry'}
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark">
            {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

            {/* SideNavBar */}
            <aside className={`${sidebarOpen ? 'w-64 p-4' : 'w-0 p-0'} flex-shrink-0 bg-surface-light dark:bg-surface-dark ${sidebarOpen ? (isRTL ? 'border-l' : 'border-r') : ''} border-[#e7d0d1] dark:border-[#3a2a2a] flex-col justify-between hidden md:flex h-full overflow-hidden transition-all duration-300`}>
                <div className={`flex flex-col gap-6 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <div className="flex items-center justify-between px-2">
                        <h1 className="text-[#1b0e0e] dark:text-white text-lg font-bold">{t('studentPortal') || 'Student Portal'}</h1>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">menu_open</span>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] transition-colors group">
                                <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white">{item.icon}</span>
                                <p className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white">{item.label}</p>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark px-6 py-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg">
                                <span className="material-symbols-outlined text-[#1b0e0e] dark:text-white">menu</span>
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">
                            {isRTL ? 'محادثات المعلمين' : 'Tutor Chats'}
                        </h2>
                    </div>
                </header>

                {/* Chat Layout - 2 Panel */}
                <div className="flex-1 flex min-h-0">
                    {/* Conversations List */}
                    <div className="w-80 flex-shrink-0 border-r border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark overflow-y-auto">
                        <div className="p-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                            <h3 className="font-semibold text-[#1b0e0e] dark:text-white">{isRTL ? 'الجلسات المقبولة' : 'Accepted Sessions'}</h3>
                        </div>

                        {conversations.length === 0 ? (
                            <div className="p-6 text-center">
                                <span className="material-symbols-outlined text-4xl text-[#998888] mb-2 block">chat_bubble</span>
                                <p className="text-sm text-[#5c4545] dark:text-[#886a6a]">{isRTL ? 'لا توجد جلسات' : 'No accepted sessions'}</p>
                                <Link to="/tutoring" className="text-primary text-sm hover:underline mt-2 inline-block">
                                    {isRTL ? 'طلب جلسة' : 'Request a session'}
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-[#e7d0d1] dark:divide-[#3a2a2a]">
                                {conversations.map(conv => {
                                    const tutorPartner = getDirectChatPartner(conv.conversation_id);
                                    const subject = getTutorSubject(conv.conversation_id);
                                    const unread = getUnreadCount(conv.conversation_id);
                                    const isActive = selectedConversationId === conv.conversation_id;

                                    return (
                                        <div
                                            key={conv.conversation_id}
                                            onClick={() => setSelectedConversationId(conv.conversation_id)}
                                            className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a]'}`}
                                        >
                                            <div className="size-12 rounded-full bg-center bg-cover bg-[#f3e7e8] dark:bg-[#3a2a2a] flex-shrink-0" style={{ backgroundImage: tutorPartner?.avatar_url ? `url("${tutorPartner.avatar_url}")` : 'none' }}>
                                                {!tutorPartner?.avatar_url && <div className="size-full rounded-full flex items-center justify-center text-[#998888]"><span className="material-symbols-outlined">person</span></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className={`font-semibold truncate ${unread > 0 ? 'text-[#1b0e0e] dark:text-white' : 'text-[#5c4545] dark:text-[#d0c0c0]'}`}>
                                                        {getConversationDisplayName(conv)}
                                                    </h4>
                                                    {unread > 0 && <span className="size-5 flex items-center justify-center bg-primary text-white text-xs rounded-full">{unread}</span>}
                                                </div>
                                                {subject && <p className="text-sm text-primary">{subject}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col bg-[#faf8f8] dark:bg-[#1a1a1a]">
                        {!selectedConversationId ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                                <span className="material-symbols-outlined text-6xl text-[#998888] mb-4">forum</span>
                                <h3 className="text-lg font-semibold text-[#1b0e0e] dark:text-white mb-2">
                                    {isRTL ? 'اختر محادثة' : 'Select a Conversation'}
                                </h3>
                                <p className="text-[#5c4545] dark:text-[#886a6a]">
                                    {isRTL ? 'اختر معلم من القائمة لبدء المحادثة' : 'Choose a tutor from the list to start chatting'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center gap-4 px-6 py-4 bg-surface-light dark:bg-surface-dark border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                    <div className="size-10 rounded-full bg-center bg-cover bg-[#f3e7e8] dark:bg-[#3a2a2a]" style={{ backgroundImage: partner?.avatar_url ? `url("${partner.avatar_url}")` : 'none' }}>
                                        {!partner?.avatar_url && <div className="size-full rounded-full flex items-center justify-center text-[#998888]"><span className="material-symbols-outlined text-xl">person</span></div>}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#1b0e0e] dark:text-white">{partner?.username}</h4>
                                        <p className="text-sm text-primary">{partner?.subject}</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {messages.map((msg, index) => {
                                        const isOwn = msg.sender_id === currentUser.user_id;
                                        const sender = getUserById(msg.sender_id);
                                        const isLastOwn = isOwn && (!messages[index + 1] || messages[index + 1].sender_id !== currentUser.user_id);

                                        return (
                                            <div key={msg.message_id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                                                    <div className={`px-4 py-3 rounded-2xl ${isOwn ? 'bg-primary text-white rounded-br-md' : 'bg-surface-light dark:bg-surface-dark text-[#1b0e0e] dark:text-white rounded-bl-md border border-[#e7d0d1] dark:border-[#3a2a2a]'}`}>
                                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                    </div>
                                                    <div className={`flex items-center gap-2 mt-1 text-xs text-[#998888] ${isOwn ? 'justify-end' : ''}`}>
                                                        <span>{formatTime(msg.sent_at)}</span>
                                                        {isOwn && isLastOwn && getStatusIcon(msg.status, msg.message_id)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 bg-surface-light dark:bg-surface-dark border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={isRTL ? 'اكتب رسالة...' : 'Type a message...'}
                                            className="flex-1 px-4 py-3 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#998888] rounded-xl border-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!message.trim()}
                                            className="p-3 bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Wrap with ChatProvider
const ChatPage = (props) => {
    return (
        <ChatProvider>
            <ChatPageContent {...props} />
        </ChatProvider>
    );
};

export default ChatPage;
