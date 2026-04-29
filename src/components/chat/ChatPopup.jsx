import { useState, useEffect, useRef } from 'react';
import { useChat, MessageStatus, ConversationType } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

const ChatPopup = ({ conversationId, onClose, position = 0 }) => {
    const {
        conversations,
        getConversationDisplayName,
        getConversationMessages,
        getDirectChatPartner,
        getConversationParticipants,
        sendMessage,
        markConversationAsRead,
        currentUser,
        getUserById,
        retryMessage
    } = useChat();
    const { isRTL } = useLanguage();
    const [message, setMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);

    const conversation = conversations.find(c => c.conversation_id === conversationId);
    const messages = getConversationMessages(conversationId);
    const isGroup = conversation?.type === ConversationType.GROUP;
    const partner = isGroup ? null : getDirectChatPartner(conversationId);
    const displayName = conversation ? getConversationDisplayName(conversation) : '';

    // Scroll to bottom
    useEffect(() => {
        if (!isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isMinimized]);

    // Mark as read
    useEffect(() => {
        if (!isMinimized) {
            markConversationAsRead(conversationId);
        }
    }, [conversationId, isMinimized, markConversationAsRead]);

    const handleSend = () => {
        if (!message.trim()) return;
        sendMessage(conversationId, message.trim());
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
                return <span className="text-[#5c4545] dark:text-[#998888] text-[10px]">○</span>;
            case MessageStatus.SENT:
                return <span className="text-[#5c4545] dark:text-[#998888] text-[10px]">✓</span>;
            case MessageStatus.DELIVERED:
                return <span className="text-[#5c4545] dark:text-[#998888] text-[10px]">✓✓</span>;
            case MessageStatus.READ:
                return (
                    <div
                        className="size-3 rounded-full bg-center bg-cover bg-[#f3e7e8] dark:bg-[#3a2a2a]"
                        style={{ backgroundImage: partner?.avatar_url ? `url("${partner.avatar_url}")` : 'none' }}
                        title="Seen"
                    />
                );
            case MessageStatus.FAILED:
                return (
                    <button
                        onClick={() => retryMessage(msgId)}
                        className="text-red-500 text-[10px] hover:underline"
                    >
                        ⚠ Retry
                    </button>
                );
            default:
                return null;
        }
    };

    if (!conversation) return null;

    // Calculate position from right
    const rightPosition = 296 + (position * 340);

    return (
        <div
            className="fixed bottom-0 z-50 flex flex-col bg-surface-light dark:bg-surface-dark rounded-t-xl shadow-2xl border border-[#e7d0d1] dark:border-[#3a2a2a] border-b-0 overflow-hidden transition-all duration-200"
            style={{
                right: `${rightPosition}px`,
                width: '328px',
                height: isMinimized ? '52px' : '455px'
            }}
        >
            {/* Header - NMU Theme */}
            <div
                className="flex items-center gap-3 px-3 py-2.5 bg-primary cursor-pointer hover:bg-primary-hover transition-colors"
                onClick={() => setIsMinimized(!isMinimized)}
            >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    {isGroup ? (
                        <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[14px]">group</span>
                        </div>
                    ) : (
                        <div
                            className="size-8 rounded-full bg-center bg-cover bg-no-repeat bg-white/20 border-2 border-white/30"
                            style={{ backgroundImage: partner?.avatar_url ? `url("${partner.avatar_url}")` : 'none' }}
                        />
                    )}
                    <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-400 rounded-full border-2 border-primary"></span>
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                </div>

                {/* Actions - Text chat only, no calls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {isMinimized ? 'expand_less' : 'remove'}
                        </span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
            </div>

            {/* Chat content - hidden when minimized */}
            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 bg-[#faf8f8] dark:bg-[#1a1a1a] space-y-1.5">
                        {messages.map((msg, index) => {
                            const isOwn = msg.sender_id === currentUser.user_id;
                            const sender = getUserById(msg.sender_id);
                            const prevMsg = messages[index - 1];
                            const showAvatar = !isOwn && (!prevMsg || prevMsg.sender_id !== msg.sender_id);
                            const isLastOwn = isOwn && (!messages[index + 1] || messages[index + 1].sender_id !== currentUser.user_id);

                            return (
                                <div
                                    key={msg.message_id}
                                    className={`flex items-end gap-1.5 ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    {/* Avatar for received messages */}
                                    {!isOwn && (
                                        <div className="w-7 flex-shrink-0">
                                            {showAvatar && (
                                                <div
                                                    className="size-7 rounded-full bg-center bg-cover bg-no-repeat bg-[#f3e7e8] dark:bg-[#3a2a2a]"
                                                    style={{ backgroundImage: sender?.avatar_url ? `url("${sender.avatar_url}")` : 'none' }}
                                                    title={sender?.username}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Message bubble */}
                                    <div
                                        className={`max-w-[65%] px-3 py-2 rounded-2xl text-sm ${isOwn
                                            ? 'bg-primary text-white rounded-br-md'
                                            : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white rounded-bl-md'
                                            }`}
                                    >
                                        {/* Sender name in groups */}
                                        {isGroup && showAvatar && !isOwn && (
                                            <p className="text-[11px] text-primary font-medium mb-0.5">{sender?.username}</p>
                                        )}
                                        <p className="whitespace-pre-wrap break-words leading-snug">{msg.content}</p>
                                    </div>

                                    {/* Status indicator for own messages */}
                                    {isOwn && isLastOwn && (
                                        <div className="w-4 flex-shrink-0 flex items-center justify-center">
                                            {getStatusIcon(msg.status, msg.message_id)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-light dark:bg-surface-dark border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                        <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={isRTL ? 'اكتب رسالة...' : 'Type a message...'}
                                className="w-full px-3 py-2 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] rounded-full border-none focus:ring-2 focus:ring-primary/30 text-sm pr-10"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary">
                                <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
                            </button>
                        </div>
                        {message.trim() ? (
                            <button
                                onClick={handleSend}
                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </button>
                        ) : (
                            <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                                <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatPopup;
