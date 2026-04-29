import { createContext, useContext, useState, useEffect } from 'react';

// Message status enum following the state machine
export const MessageStatus = {
    DRAFT: 'draft',
    SENDING: 'sending',
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed'
};

// Conversation type enum from ERD
export const ConversationType = {
    DIRECT: 'direct'
};

// User roles
export const UserRole = {
    STUDENT: 'student',
    TUTOR: 'tutor'
};

// Session request status - Chat only unlocks when ACCEPTED
export const SessionStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
    COMPLETED: 'completed'
};

// Mock users data - Only Students and Tutors
const mockUsers = [
    {
        user_id: 1,
        username: 'Ahmed Mohamed',
        email: 'ahmed.m@nmu.edu.eg',
        role: UserRole.STUDENT,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY',
        subject: null,
        created_at: '2024-01-15T10:00:00Z'
    },
    {
        user_id: 2,
        username: 'Sara Ahmed',
        email: 'sara.a@nmu.edu.eg',
        role: UserRole.TUTOR,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZLG2B0Z-b5sJw7P2X3pDjv0HG_R2ShC_qh5y5tz_nGx-RvEQBMtO5r0f8oVR5N',
        subject: 'Calculus',
        rating: 4.8,
        created_at: '2024-02-10T14:30:00Z'
    },
    {
        user_id: 3,
        username: 'Mohamed Hassan',
        email: 'mohamed.h@nmu.edu.eg',
        role: UserRole.TUTOR,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2kP9rT5wL3Nm8qV4xZaFb7YcHt6uDjS1oKm',
        subject: 'Data Structures',
        rating: 4.6,
        created_at: '2024-03-05T11:20:00Z'
    },
    {
        user_id: 4,
        username: 'Fatima Khalil',
        email: 'fatima.k@nmu.edu.eg',
        role: UserRole.TUTOR,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuE8mR6pQ2wT4Lk7nB9yVcGh3ZaFd5xJoUi',
        subject: 'Physics',
        rating: 4.9,
        created_at: '2024-01-20T09:15:00Z'
    },
    {
        user_id: 5,
        username: 'Omar Youssef',
        email: 'omar.y@nmu.edu.eg',
        role: UserRole.TUTOR,
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBftYZ3Jx6LD8P0q1N5wK8rM4vHT3uCaFbRnS7pYz2kX',
        subject: 'Programming',
        rating: 4.7,
        created_at: '2023-09-01T08:00:00Z'
    }
];

// Mock tutoring sessions - Chat is only available for ACCEPTED sessions
const initialSessions = [
    {
        session_id: 1,
        student_id: 1,
        tutor_id: 2,
        subject: 'Calculus',
        status: SessionStatus.ACCEPTED,
        scheduled_date: '2024-12-21T15:00:00Z',
        requested_at: '2024-12-18T10:00:00Z',
        accepted_at: '2024-12-18T12:00:00Z'
    },
    {
        session_id: 2,
        student_id: 1,
        tutor_id: 3,
        subject: 'Data Structures',
        status: SessionStatus.ACCEPTED,
        scheduled_date: '2024-12-22T14:00:00Z',
        requested_at: '2024-12-19T11:00:00Z',
        accepted_at: '2024-12-19T14:00:00Z'
    },
    {
        session_id: 3,
        student_id: 1,
        tutor_id: 4,
        subject: 'Physics',
        status: SessionStatus.PENDING, // Not accepted yet - NO chat allowed
        scheduled_date: '2024-12-23T10:00:00Z',
        requested_at: '2024-12-20T09:00:00Z',
        accepted_at: null
    }
];

// Initial mock conversations (only for accepted sessions)
const initialConversations = [
    {
        conversation_id: 1,
        type: ConversationType.DIRECT,
        session_id: 1, // Linked to session
        name: null,
        last_message_at: '2024-12-20T18:30:00Z'
    },
    {
        conversation_id: 2,
        type: ConversationType.DIRECT,
        session_id: 2, // Linked to session
        name: null,
        last_message_at: '2024-12-20T17:45:00Z'
    }
];

// Initial mock participants
const initialParticipants = [
    // Conversation 1: Ahmed (student) & Sara (tutor - Calculus) - Session accepted
    { participant_id: 1, conversation_id: 1, user_id: 1, joined_at: '2024-12-18T12:00:00Z' },
    { participant_id: 2, conversation_id: 1, user_id: 2, joined_at: '2024-12-18T12:00:00Z' },
    // Conversation 2: Ahmed (student) & Mohamed (tutor - Data Structures) - Session accepted
    { participant_id: 3, conversation_id: 2, user_id: 1, joined_at: '2024-12-19T14:00:00Z' },
    { participant_id: 4, conversation_id: 2, user_id: 3, joined_at: '2024-12-19T14:00:00Z' }
];

// Initial mock messages
const initialMessages = [
    // Conversation 1: Ahmed & Sara (Calculus tutor)
    {
        message_id: 1,
        conversation_id: 1,
        sender_id: 2,
        content: 'Hi Ahmed! I accepted your tutoring request. Where would you like to meet?',
        sent_at: '2024-12-18T12:05:00Z',
        status: MessageStatus.READ
    },
    {
        message_id: 2,
        conversation_id: 1,
        sender_id: 1,
        content: 'Great! How about the library, study room 3?',
        sent_at: '2024-12-18T12:10:00Z',
        status: MessageStatus.READ
    },
    {
        message_id: 3,
        conversation_id: 1,
        sender_id: 2,
        content: 'Perfect! I\'ll see you there tomorrow at 3 PM 📚',
        sent_at: '2024-12-20T18:30:00Z',
        status: MessageStatus.DELIVERED
    },
    // Conversation 2: Ahmed & Mohamed (Data Structures tutor)
    {
        message_id: 4,
        conversation_id: 2,
        sender_id: 3,
        content: 'Hello! I can help you with Data Structures. When are you free?',
        sent_at: '2024-12-19T14:05:00Z',
        status: MessageStatus.READ
    },
    {
        message_id: 5,
        conversation_id: 2,
        sender_id: 1,
        content: 'I\'m free on Sunday afternoon. Can we meet at the CS building?',
        sent_at: '2024-12-19T14:10:00Z',
        status: MessageStatus.READ
    },
    {
        message_id: 6,
        conversation_id: 2,
        sender_id: 3,
        content: 'Sure! Let\'s meet at room 204. See you then!',
        sent_at: '2024-12-20T17:45:00Z',
        status: MessageStatus.SENT
    }
];

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    // Current user (simulating logged-in student - Ahmed)
    const [currentUser] = useState(mockUsers[0]);

    // All available users
    const [users] = useState(mockUsers);

    // Tutoring sessions state
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem('nmu_tutor_sessions');
        return saved ? JSON.parse(saved) : initialSessions;
    });

    // Conversations, participants, and messages state
    const [conversations, setConversations] = useState(() => {
        const saved = localStorage.getItem('nmu_tutor_chat_conversations');
        return saved ? JSON.parse(saved) : initialConversations;
    });

    const [participants, setParticipants] = useState(() => {
        const saved = localStorage.getItem('nmu_tutor_chat_participants');
        return saved ? JSON.parse(saved) : initialParticipants;
    });

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('nmu_tutor_chat_messages');
        return saved ? JSON.parse(saved) : initialMessages;
    });

    // Currently selected conversation
    const [selectedConversationId, setSelectedConversationId] = useState(null);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('nmu_tutor_sessions', JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        localStorage.setItem('nmu_tutor_chat_conversations', JSON.stringify(conversations));
    }, [conversations]);

    useEffect(() => {
        localStorage.setItem('nmu_tutor_chat_participants', JSON.stringify(participants));
    }, [participants]);

    useEffect(() => {
        localStorage.setItem('nmu_tutor_chat_messages', JSON.stringify(messages));
    }, [messages]);

    // Get user by ID
    const getUserById = (userId) => {
        return users.find(u => u.user_id === userId);
    };

    // Get accepted sessions for current user (unlocks chat)
    const getAcceptedSessions = () => {
        return sessions.filter(s =>
            s.student_id === currentUser.user_id &&
            s.status === SessionStatus.ACCEPTED
        );
    };

    // Get tutor with accepted session (chat is allowed)
    const getTutorsWithAcceptedSessions = () => {
        const acceptedSessions = getAcceptedSessions();
        return acceptedSessions.map(session => {
            const tutor = getUserById(session.tutor_id);
            return { ...tutor, session };
        });
    };

    // Check if chat is allowed with a tutor
    const isChatAllowed = (tutorId) => {
        return sessions.some(s =>
            s.student_id === currentUser.user_id &&
            s.tutor_id === tutorId &&
            s.status === SessionStatus.ACCEPTED
        );
    };

    // Get participants of a conversation
    const getConversationParticipants = (conversationId) => {
        return participants
            .filter(p => p.conversation_id === conversationId)
            .map(p => getUserById(p.user_id))
            .filter(Boolean);
    };

    // Get the tutor in a conversation
    const getDirectChatPartner = (conversationId) => {
        const conversationParticipants = getConversationParticipants(conversationId);
        return conversationParticipants.find(u => u.user_id !== currentUser.user_id);
    };

    // Get session for a conversation
    const getConversationSession = (conversationId) => {
        const conversation = conversations.find(c => c.conversation_id === conversationId);
        if (conversation?.session_id) {
            return sessions.find(s => s.session_id === conversation.session_id);
        }
        return null;
    };

    // Get messages for a conversation
    const getConversationMessages = (conversationId) => {
        return messages
            .filter(m => m.conversation_id === conversationId)
            .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));
    };

    // Get last message for a conversation
    const getLastMessage = (conversationId) => {
        const conversationMessages = getConversationMessages(conversationId);
        return conversationMessages[conversationMessages.length - 1];
    };

    // Get unread count for a conversation
    const getUnreadCount = (conversationId) => {
        return messages.filter(
            m => m.conversation_id === conversationId &&
                m.sender_id !== currentUser.user_id &&
                m.status !== MessageStatus.READ
        ).length;
    };

    // Get conversation display name (shows tutor name)
    const getConversationDisplayName = (conversation) => {
        const partner = getDirectChatPartner(conversation.conversation_id);
        return partner?.username || 'Unknown User';
    };

    // Get tutor subject for display
    const getTutorSubject = (conversationId) => {
        const partner = getDirectChatPartner(conversationId);
        return partner?.subject || null;
    };

    // Get conversations sorted by last message (only for accepted sessions)
    const getSortedConversations = () => {
        return [...conversations].sort(
            (a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)
        );
    };

    // Find conversation for a session
    const findConversationBySession = (sessionId) => {
        return conversations.find(c => c.session_id === sessionId);
    };

    // Send a message
    const sendMessage = async (conversationId, content) => {
        const newMessageId = Math.max(...messages.map(m => m.message_id), 0) + 1;
        const now = new Date().toISOString();

        const newMessage = {
            message_id: newMessageId,
            conversation_id: conversationId,
            sender_id: currentUser.user_id,
            content,
            sent_at: now,
            status: MessageStatus.SENDING
        };

        setMessages(prev => [...prev, newMessage]);

        setConversations(prev => prev.map(conv =>
            conv.conversation_id === conversationId
                ? { ...conv, last_message_at: now }
                : conv
        ));

        setTimeout(() => {
            const shouldFail = Math.random() < 0.05;
            if (shouldFail) {
                updateMessageStatus(newMessageId, MessageStatus.FAILED);
            } else {
                updateMessageStatus(newMessageId, MessageStatus.SENT);
                setTimeout(() => {
                    updateMessageStatus(newMessageId, MessageStatus.DELIVERED);
                }, 1000);
            }
        }, 500);

        return newMessage;
    };

    // Update message status
    const updateMessageStatus = (messageId, status) => {
        setMessages(prev => prev.map(msg =>
            msg.message_id === messageId ? { ...msg, status } : msg
        ));
    };

    // Retry failed message
    const retryMessage = async (messageId) => {
        const message = messages.find(m => m.message_id === messageId);
        if (!message || message.status !== MessageStatus.FAILED) return;

        updateMessageStatus(messageId, MessageStatus.SENDING);

        setTimeout(() => {
            updateMessageStatus(messageId, MessageStatus.SENT);
            setTimeout(() => {
                updateMessageStatus(messageId, MessageStatus.DELIVERED);
            }, 1000);
        }, 500);
    };

    // Mark messages as read
    const markConversationAsRead = (conversationId) => {
        setMessages(prev => prev.map(msg =>
            msg.conversation_id === conversationId &&
                msg.sender_id !== currentUser.user_id &&
                msg.status !== MessageStatus.READ
                ? { ...msg, status: MessageStatus.READ }
                : msg
        ));
    };

    // Create conversation when session is accepted (called from tutoring page)
    const createConversationForSession = (sessionId) => {
        const session = sessions.find(s => s.session_id === sessionId);
        if (!session || session.status !== SessionStatus.ACCEPTED) return null;

        // Check if conversation already exists
        const existing = findConversationBySession(sessionId);
        if (existing) return existing;

        const newConversationId = Math.max(...conversations.map(c => c.conversation_id), 0) + 1;
        const now = new Date().toISOString();

        const newConversation = {
            conversation_id: newConversationId,
            type: ConversationType.DIRECT,
            session_id: sessionId,
            name: null,
            last_message_at: now
        };

        const newParticipantId = Math.max(...participants.map(p => p.participant_id), 0) + 1;
        const newParticipants = [
            { participant_id: newParticipantId, conversation_id: newConversationId, user_id: session.student_id, joined_at: now },
            { participant_id: newParticipantId + 1, conversation_id: newConversationId, user_id: session.tutor_id, joined_at: now }
        ];

        setConversations(prev => [...prev, newConversation]);
        setParticipants(prev => [...prev, ...newParticipants]);

        return newConversation;
    };

    // Get selected conversation
    const getSelectedConversation = () => {
        return conversations.find(c => c.conversation_id === selectedConversationId);
    };

    // Reset chat data
    const resetChatData = () => {
        localStorage.removeItem('nmu_tutor_sessions');
        localStorage.removeItem('nmu_tutor_chat_conversations');
        localStorage.removeItem('nmu_tutor_chat_participants');
        localStorage.removeItem('nmu_tutor_chat_messages');
        setSessions(initialSessions);
        setConversations(initialConversations);
        setParticipants(initialParticipants);
        setMessages(initialMessages);
        setSelectedConversationId(null);
    };

    const value = {
        // State
        currentUser,
        users,
        sessions,
        conversations,
        participants,
        messages,
        selectedConversationId,

        // Setters
        setSelectedConversationId,

        // Getters
        getUserById,
        getAcceptedSessions,
        getTutorsWithAcceptedSessions,
        isChatAllowed,
        getConversationParticipants,
        getDirectChatPartner,
        getConversationSession,
        getConversationMessages,
        getLastMessage,
        getUnreadCount,
        getConversationDisplayName,
        getTutorSubject,
        getSortedConversations,
        getSelectedConversation,
        findConversationBySession,

        // Actions
        sendMessage,
        updateMessageStatus,
        retryMessage,
        markConversationAsRead,
        createConversationForSession,
        resetChatData
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContext;
