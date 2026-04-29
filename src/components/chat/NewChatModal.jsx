import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

const NewChatModal = ({ isOpen, onClose }) => {
    const { getOtherUsers, createDirectConversation, findDirectConversation, setSelectedConversationId } = useChat();
    const { isRTL } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');

    const users = getOtherUsers();

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectUser = (userId) => {
        // Check if conversation already exists
        const existing = findDirectConversation(userId);
        if (existing) {
            setSelectedConversationId(existing.conversation_id);
        } else {
            createDirectConversation(userId);
        }
        onClose();
        setSearchQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                    <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white">
                        {isRTL ? 'محادثة جديدة' : 'New Chat'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-[#994d51]">
                            search
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isRTL ? 'ابحث عن مستخدم...' : 'Search for a user...'}
                            className="w-full pl-10 pr-4 py-3 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Users list */}
                <div className="max-h-80 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <span className="material-symbols-outlined text-4xl text-[#998888] mb-3">
                                person_search
                            </span>
                            <p className="text-sm text-[#5c4545] dark:text-[#998888]">
                                {isRTL ? 'لا يوجد مستخدمون' : 'No users found'}
                            </p>
                        </div>
                    ) : (
                        filteredUsers.map(user => (
                            <div
                                key={user.user_id}
                                onClick={() => handleSelectUser(user.user_id)}
                                className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors"
                            >
                                {/* Avatar */}
                                <div
                                    className="size-11 rounded-full bg-center bg-cover bg-no-repeat border-2 border-[#f3e7e8] dark:border-[#3a2a2a]"
                                    style={{ backgroundImage: user.avatar_url ? `url("${user.avatar_url}")` : 'none' }}
                                >
                                    {!user.avatar_url && (
                                        <div className="size-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined">person</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-[#1b0e0e] dark:text-white truncate">
                                        {user.username}
                                    </h4>
                                    <p className="text-sm text-[#5c4545] dark:text-[#998888] truncate">
                                        {user.email}
                                    </p>
                                </div>

                                {/* Arrow */}
                                <span className="material-symbols-outlined text-[#998888]">
                                    chevron_right
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewChatModal;
