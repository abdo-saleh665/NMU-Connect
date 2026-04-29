import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useLanguage } from '../../context/LanguageContext';

const MessageInput = ({ conversationId }) => {
    const [message, setMessage] = useState('');
    const { sendMessage } = useChat();
    const { isRTL } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedMessage = message.trim();
        if (!trimmedMessage || !conversationId) return;

        sendMessage(conversationId, trimmedMessage);
        setMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex-shrink-0 border-t border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark p-4"
        >
            <div className="flex items-end gap-3">
                {/* Attachment button (placeholder for future) */}
                <button
                    type="button"
                    className="flex-shrink-0 p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title={isRTL ? 'إرفاق ملف' : 'Attach file'}
                >
                    <span className="material-symbols-outlined text-[22px]">attach_file</span>
                </button>

                {/* Text input */}
                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isRTL ? 'اكتب رسالة...' : 'Type a message...'}
                        rows={1}
                        className="w-full px-4 py-3 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] rounded-2xl border-none focus:ring-2 focus:ring-primary/20 resize-none text-sm leading-relaxed max-h-32 overflow-y-auto"
                        style={{
                            minHeight: '48px',
                            direction: isRTL ? 'rtl' : 'ltr'
                        }}
                    />
                </div>

                {/* Emoji button (placeholder for future) */}
                <button
                    type="button"
                    className="flex-shrink-0 p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title={isRTL ? 'إضافة إيموجي' : 'Add emoji'}
                >
                    <span className="material-symbols-outlined text-[22px]">sentiment_satisfied</span>
                </button>

                {/* Send button */}
                <button
                    type="submit"
                    disabled={!message.trim()}
                    className={`flex-shrink-0 p-3 rounded-full transition-all duration-200 ${message.trim()
                            ? 'bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-xl hover:scale-105'
                            : 'bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#994d51] dark:text-[#886a6a] cursor-not-allowed'
                        }`}
                    title={isRTL ? 'إرسال' : 'Send'}
                >
                    <span className="material-symbols-outlined text-[22px]">send</span>
                </button>
            </div>

            {/* Helper text */}
            <p className="text-[10px] text-[#998888] mt-2 text-center">
                {isRTL ? 'اضغط Enter للإرسال، Shift+Enter لسطر جديد' : 'Press Enter to send, Shift+Enter for new line'}
            </p>
        </form>
    );
};

export default MessageInput;
