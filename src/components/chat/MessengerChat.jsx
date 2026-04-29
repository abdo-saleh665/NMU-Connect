import { useState, useEffect } from 'react';
import { ChatProvider, useChat, ConversationType } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';
import MessengerSidebar from './MessengerSidebar';
import ChatPopup from './ChatPopup';

// Container that manages the sidebar and popup windows
const MessengerChatContent = () => {
    const { selectedConversationId, setSelectedConversationId, conversations } = useChat();
    const [openChats, setOpenChats] = useState([]); // Array of conversation IDs
    const maxPopups = 3; // Maximum number of popup windows

    // When a conversation is selected from sidebar, open it as a popup
    useEffect(() => {
        if (selectedConversationId && !openChats.includes(selectedConversationId)) {
            setOpenChats(prev => {
                const newChats = [selectedConversationId, ...prev];
                // Limit to max popups
                return newChats.slice(0, maxPopups);
            });
        }
    }, [selectedConversationId]);

    // Close a popup
    const closeChat = (convId) => {
        setOpenChats(prev => prev.filter(id => id !== convId));
        if (selectedConversationId === convId) {
            setSelectedConversationId(null);
        }
    };

    return (
        <>
            {/* Floating sidebar */}
            <MessengerSidebar />

            {/* Popup chat windows */}
            {openChats.map((convId, index) => (
                <ChatPopup
                    key={convId}
                    conversationId={convId}
                    position={index}
                    onClose={() => closeChat(convId)}
                />
            ))}
        </>
    );
};

// Wrapped with context provider
const MessengerChat = () => {
    return (
        <ChatProvider>
            <MessengerChatContent />
        </ChatProvider>
    );
};

export default MessengerChat;
