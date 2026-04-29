import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

const NewGroupModal = ({ isOpen, onClose }) => {
    const { getOtherUsers, createGroupConversation } = useChat();
    const { isRTL } = useLanguage();
    const [step, setStep] = useState(1); // 1: Select members, 2: Name group
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const users = getOtherUsers();

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUser = (userId) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleNext = () => {
        if (selectedUserIds.length >= 1) {
            setStep(2);
        }
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleCreate = () => {
        if (groupName.trim() && selectedUserIds.length >= 1) {
            createGroupConversation(groupName.trim(), selectedUserIds);
            handleClose();
        }
    };

    const handleClose = () => {
        onClose();
        setStep(1);
        setSelectedUserIds([]);
        setGroupName('');
        setSearchQuery('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                    <div className="flex items-center gap-2">
                        {step === 2 && (
                            <button
                                onClick={handleBack}
                                className="p-1 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                        )}
                        <h2 className="text-lg font-bold text-[#1b0e0e] dark:text-white">
                            {step === 1
                                ? (isRTL ? 'اختر الأعضاء' : 'Select Members')
                                : (isRTL ? 'تسمية المجموعة' : 'Name Your Group')}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {step === 1 ? (
                    <>
                        {/* Selected members preview */}
                        {selectedUserIds.length > 0 && (
                            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a] overflow-x-auto">
                                {selectedUserIds.map(userId => {
                                    const user = users.find(u => u.user_id === userId);
                                    return (
                                        <div
                                            key={userId}
                                            className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                        >
                                            <span>{user?.username?.split(' ')[0]}</span>
                                            <button
                                                onClick={() => toggleUser(userId)}
                                                className="hover:bg-primary/20 rounded-full"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">close</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

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
                                    placeholder={isRTL ? 'ابحث عن مستخدم...' : 'Search for users...'}
                                    className="w-full pl-10 pr-4 py-3 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Users list */}
                        <div className="max-h-64 overflow-y-auto">
                            {filteredUsers.map(user => {
                                const isSelected = selectedUserIds.includes(user.user_id);
                                return (
                                    <div
                                        key={user.user_id}
                                        onClick={() => toggleUser(user.user_id)}
                                        className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${isSelected
                                                ? 'bg-primary/10'
                                                : 'hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a]'
                                            }`}
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

                                        {/* Checkbox */}
                                        <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-[#d0c0c0] dark:border-[#5c4545]'
                                            }`}>
                                            {isSelected && (
                                                <span className="material-symbols-outlined text-[16px]">check</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                            <button
                                onClick={handleNext}
                                disabled={selectedUserIds.length < 1}
                                className={`w-full py-3 rounded-xl font-semibold transition-colors ${selectedUserIds.length >= 1
                                        ? 'bg-primary text-white hover:bg-primary-hover'
                                        : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#998888] cursor-not-allowed'
                                    }`}
                            >
                                {isRTL ? 'التالي' : 'Next'} ({selectedUserIds.length} {isRTL ? 'مختار' : 'selected'})
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Group name input */}
                        <div className="p-6">
                            <div className="flex flex-col items-center mb-6">
                                <div className="size-20 rounded-full bg-gradient-to-br from-primary to-red-700 flex items-center justify-center text-white mb-4">
                                    <span className="material-symbols-outlined text-4xl">group</span>
                                </div>
                                <p className="text-sm text-[#5c4545] dark:text-[#998888]">
                                    {selectedUserIds.length + 1} {isRTL ? 'أعضاء' : 'members'}
                                </p>
                            </div>

                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder={isRTL ? 'اسم المجموعة...' : 'Group name...'}
                                className="w-full px-4 py-3 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-base text-center"
                                autoFocus
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                            <button
                                onClick={handleCreate}
                                disabled={!groupName.trim()}
                                className={`w-full py-3 rounded-xl font-semibold transition-colors ${groupName.trim()
                                        ? 'bg-primary text-white hover:bg-primary-hover'
                                        : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#998888] cursor-not-allowed'
                                    }`}
                            >
                                {isRTL ? 'إنشاء المجموعة' : 'Create Group'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewGroupModal;
