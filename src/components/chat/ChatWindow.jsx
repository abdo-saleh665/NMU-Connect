import { useEffect, useRef } from 'react';
import { useChat, ConversationType } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';
import MessageBubble from './MessageBubble';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';

const ChatWindow = () => {
    const {
        selectedConversationId,
        getSelectedConversation,
        getConversationMessages,
        markConversationAsRead
    } = useChat();
    const { isRTL } = useLanguage();
    const messagesEndRef = useRef(null);

    const conversation = getSelectedConversation();
    const messages = selectedConversationId
        ? getConversationMessages(selectedConversationId)
        : [];

    const isGroup = conversation?.type === ConversationType.GROUP;

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Mark messages as read when conversation is opened
    useEffect(() => {
        if (selectedConversationId) {
            markConversationAsRead(selectedConversationId);
        }
    }, [selectedConversationId, markConversationAsRead]);

    // Group messages by date
    const groupMessagesByDate = (msgs) => {
        const groups = {};
        msgs.forEach(msg => {
            const date = new Date(msg.sent_at).toLocaleDateString(
                isRTL ? 'ar-EG' : 'en-US',
                { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            );
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(msg);
        });
        return groups;
    };

    const groupedMessages = groupMessagesByDate(messages);

    // Empty state when no conversation is selected
    if (!conversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#faf8f8] dark:bg-[#1a1a1a] p-8">
                <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-5xl">chat</span>
                </div>
                <h3 className="text-xl font-bold text-[#1b0e0e] dark:text-white mb-2">
                    {isRTL ? 'مرحباً بك في المحادثات' : 'Welcome to Messages'}
                </h3>
                <p className="text-sm text-[#5c4545] dark:text-[#998888] text-center max-w-sm">
                    {isRTL
                        ? 'اختر محادثة من القائمة للبدء أو أنشئ محادثة جديدة'
                        : 'Select a conversation to start chatting or create a new one'}
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#faf8f8] dark:bg-[#1a1a1a]">
            {/* Header */}
            <ChatHeader conversation={conversation} />

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {Object.keys(groupedMessages).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <span className="material-symbols-outlined text-4xl text-[#998888] mb-3">
                            chat_bubble_outline
                        </span>
                        <p className="text-sm text-[#5c4545] dark:text-[#998888]">
                            {isRTL ? 'لا توجد رسائل بعد. ابدأ المحادثة!' : 'No messages yet. Start the conversation!'}
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date}>
                            {/* Date separator */}
                            <div className="flex items-center justify-center my-4">
                                <span className="px-3 py-1 text-xs font-medium text-[#5c4545] dark:text-[#998888] bg-[#f3e7e8] dark:bg-[#3a2a2a] rounded-full">
                                    {date}
                                </span>
                            </div>

                            {/* Messages for this date */}
                            {msgs.map((msg, index) => {
                                // Show sender name in groups when sender changes
                                const prevMsg = msgs[index - 1];
                                const showSender = isGroup && (!prevMsg || prevMsg.sender_id !== msg.sender_id);

                                return (
                                    <MessageBubble
                                        key={msg.message_id}
                                        message={msg}
                                        showSender={showSender}
                                    />
                                );
                            })}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <MessageInput conversationId={selectedConversationId} />
        </div>
    );
};

export default ChatWindow;
