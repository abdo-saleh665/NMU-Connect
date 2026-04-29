import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import LoadingScreen from '../components/LoadingScreen';
import ErrorAlert from '../components/ErrorAlert';
import { getTutors } from '../api/tutors';
import { joinChatRoom, leaveChatRoom, sendChatMessage, sendTypingIndicator } from '../services/socket';

// Session status
const SessionStatus = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
    COMPLETED: 'completed'
};

const PeerTutoring = () => {
    const { t, isRTL } = useLanguage();
    const { logout } = useAuth();
    const { socket, isConnected } = useSocket();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedSession, setSelectedSession] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [requestModal, setRequestModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [cancelModal, setCancelModal] = useState(null);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [tutors, setTutors] = useState([]);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const dataLoaded = useRef(false);
    const animationComplete = useRef(false);

    const handleLoadingComplete = () => {
        animationComplete.current = true;
        if (dataLoaded.current) {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Current student
    const currentUser = { id: 1, name: 'Ahmed Mohamed', nameAr: 'أحمد محمد' };

    // Sessions state with localStorage
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem('nmu_tutor_sessions');
        return saved ? JSON.parse(saved) : [];
    });

    // Messages state with localStorage
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('nmu_chat_messages');
        return saved ? JSON.parse(saved) : {};
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('nmu_tutor_sessions', JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        localStorage.setItem('nmu_chat_messages', JSON.stringify(messages));
    }, [messages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedSession]);

    // Socket.io event listeners
    useEffect(() => {
        if (!socket) return;

        // Listen for incoming messages
        const handleMessage = (data) => {
            if (data.senderId !== currentUser.id) {
                setMessages(prev => ({
                    ...prev,
                    [data.tutorId || data.sessionId]: [
                        ...(prev[data.tutorId || data.sessionId] || []),
                        {
                            id: data.id || Date.now(),
                            senderId: data.senderId,
                            text: data.message || data.text,
                            timestamp: data.timestamp || Date.now(),
                            time: new Date(data.timestamp || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            date: new Date(data.timestamp || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        }
                    ]
                }));
            }
        };

        // Listen for typing indicators
        const handleTyping = (data) => {
            if (data.userId !== currentUser.id) {
                setIsTyping(data.isTyping);
            }
        };

        socket.on('chat:message', handleMessage);
        socket.on('chat:typing', handleTyping);

        return () => {
            socket.off('chat:message', handleMessage);
            socket.off('chat:typing', handleTyping);
        };
    }, [socket, currentUser.id]);

    // Join/leave chat room when session is selected
    useEffect(() => {
        if (selectedSession && isConnected) {
            joinChatRoom(selectedSession.id);
        }
        return () => {
            if (selectedSession) {
                leaveChatRoom(selectedSession.id);
            }
        };
    }, [selectedSession, isConnected]);

    // Notifications
    const notifications = [
        { id: 1, title: isRTL ? 'جلسة جديدة' : 'New Session', message: isRTL ? 'سارة أحمد قبلت طلبك' : 'Sara Ahmed accepted your request', time: isRTL ? 'منذ ساعتين' : '2h ago', read: false, icon: 'school' },
    ];

    // Fetch tutors from API
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const result = await getTutors();
                if (result.success && result.tutors.length > 0) {
                    // Transform API data to match expected format
                    const transformedTutors = result.tutors.map(tutor => ({
                        id: tutor._id,
                        name: tutor.name,
                        nameAr: tutor.nameAr || tutor.name,
                        subject: tutor.tutorSubjects?.join(', ') || 'General',
                        subjectAr: tutor.tutorSubjects?.join('، ') || 'عام',
                        department: tutor.department,
                        departmentAr: tutor.departmentAr || tutor.department,
                        rating: tutor.tutorRating || 0,
                        sessions: tutor.tutorSessions || 0,
                        available: tutor.isAvailable || false,
                        image: tutor.avatar || 'https://via.placeholder.com/100'
                    }));
                    setTutors(transformedTutors);
                } else {
                    // Fallback to mock data if API fails or returns empty
                    setTutors([
                        { id: 1, name: 'Sara Ahmed', nameAr: 'سارة أحمد', subject: 'Calculus & Linear Algebra', subjectAr: 'حساب التفاضل والجبر الخطي', department: 'Mathematics', departmentAr: 'الرياضيات', rating: 4.9, sessions: 56, available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY' },
                        { id: 2, name: 'Mohamed Hassan', nameAr: 'محمد حسن', subject: 'Data Structures & Algorithms', subjectAr: 'هياكل البيانات والخوارزميات', department: 'Computer Science', departmentAr: 'علوم الحاسب', rating: 4.8, sessions: 42, available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSSxWDtmLKC2cbdTqkLlI6ngFA73SU4iF0aXNYGIKktvDyGOECITuCBUJd6LA5CnB_zsx7_FjT7pRFeIIKreTR_Xa5BmRaAtMSaNUoPcztVrKinBJY0pIdiseUOEeB7BKdAO5hM2nF3fvhSP9jmVDU8k-y0FNrZttwdnzw73rfx3aY2oJYu5n6tC-mbPDPFCqujxkJVatEovhP4xJcLJRljYNtuAhZVW729x4dmi7w6bfoV6mZxYU4A7NDgTGFOreA4EgnmQFkrgI' },
                        { id: 3, name: 'Nour El-Din', nameAr: 'نور الدين', subject: 'Physics & Mechanics', subjectAr: 'الفيزياء والميكانيكا', department: 'Engineering', departmentAr: 'الهندسة', rating: 4.7, sessions: 38, available: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJiAXdiMDFducfoO-GV1NSX8dLZITG33McGYwEvb2N_zJY1NxoyUZoAPRc1Xai8OkNE4mQ1K1epbvGq5ffOy_pLvmvpPj9rNxDb2nFRuoeGUB0HhY0PlOoSIFtH-xEUVE_xw1OLi_rV_SeEuEgrfya2xyV1CnNPddh6qG_WNk7E9HgBSG7k3VdyKdiAReLPK3aaLOqwwpKF2TC8a050D2EhGw8_VdbpXrgyNbrK1b0qVAX-W7TDsGEliyKXhHCoN_HXec9DLTX4y0' },
                        { id: 4, name: 'Yasmine Khalil', nameAr: 'ياسمين خليل', subject: 'Organic Chemistry', subjectAr: 'الكيمياء العضوية', department: 'Pharmacy', departmentAr: 'الصيدلة', rating: 5.0, sessions: 67, available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvBCO-b2WiECiTlKTyteI7OzOeaTKSvJ7RTeMbnS640N5_vM_f06sOghp8jO5DJZmsLK6RhsJgLMqubAvnS3-Fu6qJ18eArI9MGE6MQZM0JKEgdCs3eo5KKTQQa0GIjnW98CG68FwO4dmEuLduQ4-WFGW3ese-NU_fQ3DtCR5evBM-zwcZNj3FNPOKd1mpcH15Bj5RO-eGRTJXFUELdkiGAuW64WpJr5Gb6upxHB81NViC44zWcdY_OAWdiBYub2xijwlMRPinmEk' }
                    ]);
                }
            } catch (err) {
                console.error('Error fetching tutors:', err);
                setError('Failed to load tutors');
                // Fallback to mock data
                setTutors([
                    { id: 1, name: 'Sara Ahmed', nameAr: 'سارة أحمد', subject: 'Calculus & Linear Algebra', subjectAr: 'حساب التفاضل والجبر الخطي', department: 'Mathematics', departmentAr: 'الرياضيات', rating: 4.9, sessions: 56, available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY' },
                    { id: 2, name: 'Mohamed Hassan', nameAr: 'محمد حسن', subject: 'Data Structures & Algorithms', subjectAr: 'هياكل البيانات والخوارزميات', department: 'Computer Science', departmentAr: 'علوم الحاسب', rating: 4.8, sessions: 42, available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSSxWDtmLKC2cbdTqkLlI6ngFA73SU4iF0aXNYGIKktvDyGOECITuCBUJd6LA5CnB_zsx7_FjT7pRFeIIKreTR_Xa5BmRaAtMSaNUoPcztVrKinBJY0pIdiseUOEeB7BKdAO5hM2nF3fvhSP9jmVDU8k-y0FNrZttwdnzw73rfx3aY2oJYu5n6tC-mbPDPFCqujxkJVatEovhP4xJcLJRljYNtuAhZVW729x4dmi7w6bfoV6mZxYU4A7NDgTGFOreA4EgnmQFkrgI' },
                    { id: 3, name: 'Nour El-Din', nameAr: 'نور الدين', subject: 'Physics & Mechanics', subjectAr: 'الفيزياء والميكانيكا', department: 'Engineering', departmentAr: 'الهندسة', rating: 4.7, sessions: 38, available: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJiAXdiMDFducfoO-GV1NSX8dLZITG33McGYwEvb2N_zJY1NxoyUZoAPRc1Xai8OkNE4mQ1K1epbvGq5ffOy_pLvmvpPj9rNxDb2nFRuoeGUB0HhY0PlOoSIFtH-xEUVE_xw1OLi_rV_SeEuEgrfya2xyV1CnNPddh6qG_WNk7E9HgBSG7k3VdyKdiAReLPK3aaLOqwwpKF2TC8a050D2EhGw8_VdbpXrgyNbrK1b0qVAX-W7TDsGEliyKXhHCoN_HXec9DLTX4y0' },
                    { id: 4, name: 'Yasmine Khalil', nameAr: 'ياسمين خليل', subject: 'Organic Chemistry', subjectAr: 'الكيمياء العضوية', department: 'Pharmacy', departmentAr: 'الصيدلة', rating: 5.0, sessions: 67, available: true, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvBCO-b2WiECiTlKTyteI7OzOeaTKSvJ7RTeMbnS640N5_vM_f06sOghp8jO5DJZmsLK6RhsJgLMqubAvnS3-Fu6qJ18eArI9MGE6MQZM0JKEgdCs3eo5KKTQQa0GIjnW98CG68FwO4dmEuLduQ4-WFGW3ese-NU_fQ3DtCR5evBM-zwcZNj3FNPOKd1mpcH15Bj5RO-eGRTJXFUELdkiGAuW64WpJr5Gb6upxHB81NViC44zWcdY_OAWdiBYub2xijwlMRPinmEk' }
                ]);
            } finally {
                dataLoaded.current = true;
                if (animationComplete.current) {
                    setIsLoading(false);
                }
            }
        };

        fetchTutors();
    }, []);

    const subjects = [
        { id: 'all', name: 'All Subjects', nameAr: 'جميع المواد' },
        { id: 'mathematics', name: 'Mathematics', nameAr: 'الرياضيات' },
        { id: 'computer-science', name: 'Computer Science', nameAr: 'علوم الحاسب' },
        { id: 'physics', name: 'Physics', nameAr: 'الفيزياء' },
        { id: 'chemistry', name: 'Chemistry', nameAr: 'الكيمياء' },
        { id: 'engineering', name: 'Engineering', nameAr: 'الهندسة' },
    ];

    // Stats - with safe defaults for API data
    const activeTutorsCount = tutors.filter(t => t.available || t.isAvailable).length;
    const totalSessions = tutors.reduce((acc, t) => acc + (t.sessions || t.sessionsCompleted || 0), 0);
    const avgRating = tutors.length > 0
        ? (tutors.reduce((acc, t) => acc + (t.rating || t.averageRating || 0), 0) / tutors.length).toFixed(1)
        : '0.0';

    const stats = [
        { icon: 'group', label: 'Active Tutors', labelAr: 'المدرسين النشطين', value: activeTutorsCount.toString(), color: 'bg-primary/10 text-primary' },
        { icon: 'menu_book', label: 'Subjects', labelAr: 'المواد', value: (subjects.length - 1).toString(), color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
        { icon: 'handshake', label: 'Sessions Completed', labelAr: 'الجلسات المكتملة', value: totalSessions.toString(), color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
        { icon: 'star', label: 'Avg. Rating', labelAr: 'متوسط التقييم', value: avgRating, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    ];

    // Get sessions by status
    const acceptedSessions = sessions.filter(s => s.status === SessionStatus.ACCEPTED);
    const pendingSessions = sessions.filter(s => s.status === SessionStatus.PENDING);

    // Get tutor by ID
    const getTutor = (id) => tutors.find(t => t.id === id);

    // Check if session exists with tutor
    const getSessionWithTutor = (tutorId) => sessions.find(s => s.tutorId === tutorId);

    // Filter tutors by search, subject, and availability
    const getFilteredTutors = () => {
        return tutors.filter(tutor => {
            // Search filter
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                tutor.name.toLowerCase().includes(searchLower) ||
                tutor.nameAr.includes(searchQuery) ||
                tutor.subject.toLowerCase().includes(searchLower) ||
                tutor.subjectAr.includes(searchQuery) ||
                tutor.department.toLowerCase().includes(searchLower);

            // Subject filter
            const matchesSubject = selectedSubject === 'all' ||
                tutor.department.toLowerCase().includes(selectedSubject.replace('-', ' '));

            // Availability filter
            const matchesAvailability = !showAvailableOnly || tutor.available;

            return matchesSearch && matchesSubject && matchesAvailability;
        });
    };

    const filteredTutors = getFilteredTutors();

    // Request a session
    const requestSession = (tutorId) => {
        const tutor = getTutor(tutorId);
        if (!tutor) return;

        const newSession = {
            id: Date.now(),
            tutorId,
            status: SessionStatus.PENDING,
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            time: '3:00 PM',
            subject: tutor.subject.split('&')[0].trim()
        };

        setSessions(prev => [...prev, newSession]);
        setRequestModal(null);

        // Simulate tutor accepting after 3 seconds
        setTimeout(() => {
            setSessions(prev => prev.map(s =>
                s.id === newSession.id ? { ...s, status: SessionStatus.ACCEPTED } : s
            ));
            // Initialize chat
            setMessages(prev => ({
                ...prev,
                [tutorId]: [
                    { id: 1, senderId: 'tutor', text: `Hi! I accepted your tutoring request for ${tutor.subject.split('&')[0].trim()}. When would you like to meet?`, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
                ]
            }));
        }, 3000);
    };

    // Cancel a session
    const cancelSession = (sessionId) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        setCancelModal(null);
        if (selectedSession?.id === sessionId) {
            setSelectedSession(null);
        }
    };

    // Send message
    const sendMessage = (attachment = null) => {
        if ((!chatMessage.trim() && !attachment) || !selectedSession) return;

        const tutorId = selectedSession.tutorId;
        const now = new Date();
        const newMsg = {
            id: Date.now(),
            senderId: currentUser.id,
            text: chatMessage.trim(),
            image: attachment?.type === 'image' ? attachment.url : null,
            file: attachment?.type !== 'image' ? attachment : null,
            timestamp: now.getTime(),
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            seen: false
        };

        // Add to local state immediately for instant feedback
        setMessages(prev => ({
            ...prev,
            [tutorId]: [...(prev[tutorId] || []), newMsg]
        }));
        setChatMessage('');

        // Emit via Socket.io for real-time sync
        if (isConnected) {
            sendChatMessage({
                sessionId: selectedSession.id,
                tutorId: tutorId,
                message: chatMessage.trim(),
                senderId: currentUser.id,
                timestamp: now.getTime(),
                attachment: attachment
            });
        }

        // For demo: simulate tutor reply if not connected to socket
        if (!isConnected) {
            setIsTyping(true);
            setTimeout(() => {
                const replies = attachment
                    ? ['Got it! I\'ll review this before our session.', 'Thanks for sharing! This will be helpful.', 'Perfect! I\'ll take a look at it.']
                    : ['Sounds good! See you then.', 'Great! I\'ll prepare some materials.', 'Perfect! Looking forward to it.', 'Got it! Let me know if you need anything else.', 'Sure thing! I\'ll be ready.'];
                const replyTime = new Date();
                const reply = {
                    id: Date.now(),
                    senderId: 'tutor',
                    text: replies[Math.floor(Math.random() * replies.length)],
                    timestamp: replyTime.getTime(),
                    time: replyTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    date: replyTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                };

                setMessages(prev => ({
                    ...prev,
                    [tutorId]: [...(prev[tutorId] || []).map(m =>
                        m.senderId === currentUser.id ? { ...m, seen: true } : m
                    ), reply]
                }));
                setIsTyping(false);
            }, 2000 + Math.random() * 1000);
        }
    };

    // Get file type and icon
    const getFileInfo = (file) => {
        const ext = file.name.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return { type: 'pdf', icon: 'picture_as_pdf', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' };
        if (['ppt', 'pptx'].includes(ext)) return { type: 'pptx', icon: 'slideshow', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' };
        if (['doc', 'docx'].includes(ext)) return { type: 'doc', icon: 'description', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' };
        if (['xls', 'xlsx'].includes(ext)) return { type: 'excel', icon: 'table_chart', color: 'text-green-500 bg-green-100 dark:bg-green-900/30' };
        return { type: 'file', icon: 'attach_file', color: 'text-gray-500 bg-gray-100 dark:bg-gray-900/30' };
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check if image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                sendMessage({ type: 'image', url: event.target.result, name: file.name });
            };
            reader.readAsDataURL(file);
        } else {
            // For documents (PDF, PPTX, etc.), store file info
            const fileInfo = getFileInfo(file);
            sendMessage({
                type: fileInfo.type,
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                icon: fileInfo.icon,
                color: fileInfo.color
            });
        }
        e.target.value = '';
    };

    // Format message time with date for older messages
    const formatMessageTime = (msg) => {
        const today = new Date();
        const msgDate = new Date(msg.timestamp);
        const isToday = today.toDateString() === msgDate.toDateString();

        if (isToday) {
            return msg.time;
        }
        return `${msg.date}, ${msg.time}`;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark">
            {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64 p-4' : 'w-0 p-0'} flex-shrink-0 bg-surface-light dark:bg-surface-dark ${sidebarOpen ? 'border-r' : ''} border-[#e7d0d1] dark:border-[#3a2a2a] flex-col justify-between hidden lg:flex h-full overflow-hidden transition-all duration-300`}>
                <div className={`flex flex-col gap-6 ${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <div className="flex items-center justify-between px-2">
                        <h1 className="text-[#1b0e0e] dark:text-white text-lg font-bold">Student Portal</h1>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-[#1b0e0e] dark:text-white hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg">
                            <span className="material-symbols-outlined text-[20px]">menu_open</span>
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        <Link to="/student" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white">dashboard</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white">{t('dashboard')}</span>
                        </Link>
                        <Link to="/appointment" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white">calendar_month</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white">{t('schedule')}</span>
                        </Link>
                        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-primary/10 text-primary">
                            <span className="material-symbols-outlined icon-filled">school</span>
                            <span className="text-sm font-semibold">{t('peerTutoring')}</span>
                        </div>
                        <Link to="/events" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white">event</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white">{t('events')}</span>
                        </Link>
                        <Link to="/complaints" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white">campaign</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white">{t('complaints')}</span>
                        </Link>
                        <Link to="/lost-found" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] text-[#5c4545] dark:text-[#d0c0c0] group">
                            <span className="material-symbols-outlined group-hover:text-[#1b0e0e] dark:group-hover:text-white">search</span>
                            <span className="text-sm font-medium group-hover:text-[#1b0e0e] dark:group-hover:text-white">{t('lostAndFound')}</span>
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-surface-light dark:bg-surface-dark border-b border-[#e7d0d1] dark:border-[#3a2a2a] shrink-0">
                    <div className="flex items-center gap-4">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg">
                                <span className="material-symbols-outlined text-[#1b0e0e] dark:text-white">menu</span>
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-[#1b0e0e] dark:text-white">{t('peerTutoring')}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg">
                                <span className="material-symbols-outlined">notifications</span>
                                {notifications.filter(n => !n.read).length > 0 && <span className="absolute top-1 right-1 size-2 bg-primary rounded-full"></span>}
                            </button>
                            {notificationsOpen && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50">
                                    <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <h3 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? 'الإشعارات' : 'Notifications'}</h3>
                                    </div>
                                    {notifications.map((n) => (
                                        <div key={n.id} className={`px-4 py-3 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] ${!n.read ? 'bg-primary/5' : ''}`}>
                                            <div className="flex items-start gap-3">
                                                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <span className="material-symbols-outlined text-[16px]">{n.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-[#1b0e0e] dark:text-white">{n.title}</p>
                                                    <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{n.message}</p>
                                                    <p className="text-xs text-[#994d51] mt-1">{n.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="h-8 w-[1px] bg-[#e7d0d1] dark:bg-[#3a2a2a]"></div>
                        <div className="relative">
                            <button
                                onClick={() => { setProfileMenuOpen(!profileMenuOpen); setNotificationsOpen(false); }}
                                className="flex items-center gap-3 pl-1 hover:opacity-80 transition-opacity"
                            >
                                <div className="size-9 rounded-full bg-cover bg-center border-2 border-[#f3e7e8] dark:border-[#3a2a2a]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBHS0_Na6sZOzuerdCZJn4to4a1XzOCN3S-TbFkEIejpqZThT0K8ZDWPXG1jhZ7EP2iVte9nx8deDOkwTu86SgTW_QrT0PgkmH17tIM1iNaEsAwJHa6Dh5gbJRJ6-SYoRK9iNZTFt2AjAAJ6CmFtOnd170OeYuCU4iAa1JXnM3ntOAjG1YqrXQoN3uhj7SACRyjt7PECDT8Vuhoso_asheqq67cIWUpJa8PQpWPaeF2acZK9VDzkodG3FXp9FkggbhAKlhK_QPQjZY")' }}></div>
                                <div className="hidden md:flex flex-col items-start">
                                    <p className="text-sm font-bold text-[#1b0e0e] dark:text-white leading-none">Ahmed M.</p>
                                    <p className="text-xs text-[#994d51] mt-1 leading-none">ID: 20230154</p>
                                </div>
                                <span className="material-symbols-outlined text-[18px] text-[#5c4545] dark:text-[#d0c0c0] hidden md:block">{profileMenuOpen ? 'expand_less' : 'expand_more'}</span>
                            </button>

                            {/* Profile Dropdown Menu */}
                            {profileMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7d0d1] dark:border-[#3a2a2a] shadow-lg py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                                    <div className="px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                        <p className="text-sm font-bold text-[#1b0e0e] dark:text-white">Ahmed Mohamed</p>
                                        <p className="text-xs text-[#994d51]">ahmed.m@nmu.edu.eg</p>
                                    </div>
                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">person</span>
                                        {t('profile') || 'My Profile'}
                                    </Link>
                                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">settings</span>
                                        {t('settings')}
                                    </Link>
                                    <div className="border-t border-[#e7d0d1] dark:border-[#3a2a2a] mt-2 pt-2">
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">logout</span>
                                            {t('logout') || 'Logout'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content - 2 Panel Layout */}
                <div className="flex-1 flex min-h-0 overflow-hidden">
                    {/* Left Panel - Tutoring Content */}
                    <div className={`flex-1 overflow-y-auto p-6 ${selectedSession ? 'hidden lg:block' : ''}`}>
                        <div className="space-y-6">
                            {/* Error Alert */}
                            {error && (
                                <ErrorAlert
                                    message={error}
                                    messageAr="فشل في تحميل المعلمين"
                                    onRetry={() => window.location.reload()}
                                />
                            )}
                            {/* Search and Actions */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 max-w-xl">
                                    <div className="flex w-full items-stretch rounded-xl bg-[#f3e7e8] dark:bg-[#3a2a2a] focus-within:ring-2 focus-within:ring-primary/20">
                                        <div className="text-primary flex items-center justify-center pl-4">
                                            <span className="material-symbols-outlined text-[22px]">search</span>
                                        </div>
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-12 bg-transparent border-none focus:ring-0 text-[#1b0e0e] dark:text-white placeholder:text-[#994d51] dark:placeholder:text-[#886a6a] text-base px-3"
                                            placeholder={isRTL ? 'ابحث عن المعلمين والمواد...' : 'Search tutors, subjects...'}
                                        />
                                        {searchQuery && (
                                            <button onClick={() => setSearchQuery('')} className="px-3 text-[#994d51] hover:text-primary">
                                                <span className="material-symbols-outlined text-[20px]">close</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                        {t('becomeTutor')}
                                    </button>
                                    <button className="flex items-center gap-2 px-5 py-3 bg-surface-light dark:bg-surface-dark border border-[#e7d0d1] dark:border-[#3a2a2a] rounded-xl font-medium hover:border-primary transition-colors text-[#1b0e0e] dark:text-white">
                                        <span className="material-symbols-outlined">person_search</span>
                                        {t('requestTutor')}
                                    </button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-[#e7d0d1] dark:border-[#3a2a2a] flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-[#1b0e0e] dark:text-white">{stat.value}</p>
                                            <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? stat.labelAr : stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pending Sessions */}
                            {pendingSessions.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-500">hourglass_top</span>
                                        {isRTL ? 'طلبات في الانتظار' : 'Pending Requests'}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {pendingSessions.map(session => {
                                            const tutor = getTutor(session.tutorId);
                                            if (!tutor) return null;
                                            return (
                                                <div key={session.id} className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${tutor.image}")` }}></div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? tutor.nameAr : tutor.name}</h4>
                                                            <p className="text-sm text-amber-600 dark:text-amber-400">{session.subject} • {isRTL ? 'في انتظار الرد' : 'Awaiting response'}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setCancelModal(session)}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                            title={isRTL ? 'إلغاء' : 'Cancel'}
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">close</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Accepted Sessions */}
                            {acceptedSessions.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">chat</span>
                                        {isRTL ? 'جلساتي (اضغط للمحادثة)' : 'My Sessions (Click to Chat)'}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {acceptedSessions.map(session => {
                                            const tutor = getTutor(session.tutorId);
                                            if (!tutor) return null;
                                            const unread = (messages[session.tutorId] || []).length;
                                            return (
                                                <div
                                                    key={session.id}
                                                    onClick={() => setSelectedSession(session)}
                                                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedSession?.id === session.id
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-transparent bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 hover:border-primary/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${tutor.image}")` }}></div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? tutor.nameAr : tutor.name}</h4>
                                                                {unread > 0 && <span className="size-5 flex items-center justify-center bg-primary text-white text-xs rounded-full">{unread}</span>}
                                                            </div>
                                                            <p className="text-sm text-primary">{session.subject}</p>
                                                            <p className="text-xs text-[#5c4545] dark:text-[#d0c0c0]">{session.date} • {session.time}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setCancelModal(session); }}
                                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                                title={isRTL ? 'إلغاء' : 'Cancel'}
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                                            </button>
                                                            <span className="material-symbols-outlined text-primary">chat</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Filters & Tutors Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Filter Sidebar */}
                                <div className="lg:col-span-1">
                                    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] sticky top-6">
                                        <h3 className="font-bold text-[#1b0e0e] dark:text-white mb-4">{isRTL ? 'تصفية حسب المادة' : 'Filter by Subject'}</h3>
                                        <div className="space-y-2">
                                            {subjects.map((subject) => (
                                                <button
                                                    key={subject.id}
                                                    onClick={() => setSelectedSubject(subject.id)}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${selectedSubject === subject.id
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a]'
                                                        }`}
                                                >
                                                    <span>{isRTL ? subject.nameAr : subject.name}</span>
                                                    <span className="text-xs bg-[#f3e7e8] dark:bg-[#3a2a2a] px-2 py-1 rounded-full">
                                                        {subject.id === 'all'
                                                            ? tutors.length
                                                            : tutors.filter(t => t.department.toLowerCase().includes(subject.id.replace('-', ' '))).length}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                                            <h3 className="font-bold text-[#1b0e0e] dark:text-white mb-4">{isRTL ? 'التوفر' : 'Availability'}</h3>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={showAvailableOnly}
                                                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                                                    className="w-4 h-4 rounded border-[#e7d0d1] text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'متاح الآن' : 'Available Now'}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Tutors Grid */}
                                <div className="lg:col-span-3 space-y-4">
                                    <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white flex items-center justify-between">
                                        <span>{isRTL ? 'المعلمين المتاحين' : 'Available Tutors'}</span>
                                        <span className="text-sm font-normal text-[#5c4545] dark:text-[#d0c0c0]">{filteredTutors.length} {isRTL ? 'معلم' : 'tutors'}</span>
                                    </h3>
                                    {filteredTutors.length === 0 ? (
                                        <div className="text-center py-8 text-[#5c4545] dark:text-[#d0c0c0]">
                                            <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                                            <p>{isRTL ? 'لا توجد نتائج' : 'No tutors found'}</p>
                                        </div>
                                    ) : (
                                        filteredTutors.map(tutor => {
                                            const existingSession = getSessionWithTutor(tutor.id);
                                            const hasAcceptedSession = existingSession?.status === SessionStatus.ACCEPTED;
                                            const hasPendingSession = existingSession?.status === SessionStatus.PENDING;

                                            return (
                                                <div key={tutor.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-[#e7d0d1] dark:border-[#3a2a2a] hover:shadow-lg transition-all">
                                                    <div className="flex gap-5">
                                                        <div className="relative shrink-0">
                                                            <div className="size-16 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url("${tutor.image}")` }}></div>
                                                            {tutor.available && <div className="absolute -bottom-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-white dark:border-surface-dark"></div>}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <h4 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? tutor.nameAr : tutor.name}</h4>
                                                                    <p className="text-primary text-sm">{isRTL ? tutor.subjectAr : tutor.subject}</p>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-yellow-500">
                                                                    <span className="material-symbols-outlined icon-filled text-[16px]">star</span>
                                                                    <span className="font-bold text-[#1b0e0e] dark:text-white">{tutor.rating}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-3">
                                                                <span className="flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[16px]">apartment</span>
                                                                    {isRTL ? tutor.departmentAr : tutor.department}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                                    {tutor.sessions} {isRTL ? 'جلسة' : 'sessions'}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {hasAcceptedSession ? (
                                                                    <button
                                                                        onClick={() => setSelectedSession(existingSession)}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[16px]">chat</span>
                                                                        {isRTL ? 'فتح المحادثة' : 'Open Chat'}
                                                                    </button>
                                                                ) : hasPendingSession ? (
                                                                    <button disabled className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-sm font-medium cursor-not-allowed">
                                                                        <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                                                                        {isRTL ? 'في انتظار القبول' : 'Pending Approval'}
                                                                    </button>
                                                                ) : tutor.available ? (
                                                                    <button
                                                                        onClick={() => setRequestModal(tutor)}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover"
                                                                    >
                                                                        <span className="material-symbols-outlined text-[16px]">send</span>
                                                                        {isRTL ? 'طلب جلسة' : 'Request Session'}
                                                                    </button>
                                                                ) : (
                                                                    <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                                                                        {isRTL ? 'غير متاح' : 'Not Available'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Chat */}
                    {selectedSession && (
                        <div className={`fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-auto w-full lg:w-96 flex flex-col border-l border-[#e7d0d1] dark:border-[#3a2a2a] bg-surface-light dark:bg-surface-dark`}>
                            {/* Chat Header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg">
                                    <span className="material-symbols-outlined text-[#1b0e0e] dark:text-white">arrow_back</span>
                                </button>
                                <div className="relative">
                                    <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${getTutor(selectedSession.tutorId)?.image}")` }}></div>
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? getTutor(selectedSession.tutorId)?.nameAr : getTutor(selectedSession.tutorId)?.name}</h4>
                                    <p className="text-xs text-green-500 flex items-center gap-1">
                                        <span className="size-1.5 bg-green-500 rounded-full"></span>
                                        {isTyping ? (isRTL ? 'يكتب...' : 'Typing...') : (isRTL ? 'متصل الآن' : 'Online')}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedSession(null)} className="hidden lg:block p-2 hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-lg">
                                    <span className="material-symbols-outlined text-[#5c4545] dark:text-[#d0c0c0]">close</span>
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf8f8] dark:bg-[#1a1a1a]">
                                {(messages[selectedSession.tutorId] || []).length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                            <span className="material-symbols-outlined text-3xl text-primary">chat</span>
                                        </div>
                                        <h4 className="font-bold text-[#1b0e0e] dark:text-white mb-1">{isRTL ? 'ابدأ المحادثة' : 'Start Chatting'}</h4>
                                        <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0]">{isRTL ? 'أرسل رسالة للمعلم' : 'Send a message to your tutor'}</p>
                                    </div>
                                )}
                                {(messages[selectedSession.tutorId] || []).map(msg => (
                                    <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl overflow-hidden ${msg.senderId === currentUser.id
                                            ? 'bg-primary text-white rounded-br-md'
                                            : 'bg-surface-light dark:bg-surface-dark text-[#1b0e0e] dark:text-white rounded-bl-md border border-[#e7d0d1] dark:border-[#3a2a2a]'
                                            }`}>
                                            {msg.image && (
                                                <img src={msg.image} alt="Shared" className="w-full max-h-48 object-cover" />
                                            )}
                                            {msg.file && (
                                                <div className={`flex items-center gap-3 px-4 py-3 ${msg.senderId === currentUser.id ? '' : 'border-b border-[#e7d0d1] dark:border-[#3a2a2a]'}`}>
                                                    <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${msg.file.color}`}>
                                                        <span className="material-symbols-outlined">{msg.file.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${msg.senderId === currentUser.id ? 'text-white' : 'text-[#1b0e0e] dark:text-white'}`}>{msg.file.name}</p>
                                                        <p className={`text-xs ${msg.senderId === currentUser.id ? 'text-white/60' : 'text-[#998888]'}`}>{msg.file.size}</p>
                                                    </div>
                                                    <span className={`material-symbols-outlined text-[20px] ${msg.senderId === currentUser.id ? 'text-white/60' : 'text-[#998888]'}`}>download</span>
                                                </div>
                                            )}
                                            {msg.text && <p className="text-sm px-4 py-2">{msg.text}</p>}
                                            <div className={`flex items-center gap-1 px-4 pb-2 ${msg.senderId === currentUser.id ? 'justify-end' : ''}`}>
                                                <p className={`text-[10px] ${msg.senderId === currentUser.id ? 'text-white/70' : 'text-[#998888]'}`}>
                                                    {msg.timestamp ? formatMessageTime(msg) : msg.time}
                                                </p>
                                                {msg.senderId === currentUser.id && (
                                                    <span className={`material-symbols-outlined text-[12px] ${msg.seen ? 'text-blue-300' : 'text-white/50'}`}>
                                                        {msg.seen ? 'done_all' : 'done'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-surface-light dark:bg-surface-dark px-4 py-3 rounded-2xl rounded-bl-md border border-[#e7d0d1] dark:border-[#3a2a2a]">
                                            <div className="flex gap-1">
                                                <span className="size-2 bg-[#998888] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="size-2 bg-[#998888] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="size-2 bg-[#998888] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-[#e7d0d1] dark:border-[#3a2a2a]">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*,.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2.5 text-[#5c4545] dark:text-[#d0c0c0] hover:bg-[#f3e7e8] dark:hover:bg-[#3a2a2a] rounded-full transition-colors"
                                        title={isRTL ? 'إرفاق ملف' : 'Attach file'}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                    </button>
                                    <input
                                        type="text"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={isRTL ? 'اكتب رسالة...' : 'Type a message...'}
                                        className="flex-1 px-4 py-2.5 bg-[#f3e7e8] dark:bg-[#3a2a2a] text-[#1b0e0e] dark:text-white placeholder:text-[#998888] rounded-full border-none focus:ring-2 focus:ring-primary/20 text-sm"
                                    />
                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!chatMessage.trim()}
                                        className="p-2.5 bg-primary text-white rounded-full hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Request Session Modal */}
            {requestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setRequestModal(null)}></div>
                    <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-4">{isRTL ? 'طلب جلسة' : 'Request Session'}</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-14 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url("${requestModal.image}")` }}></div>
                            <div>
                                <h4 className="font-bold text-[#1b0e0e] dark:text-white">{isRTL ? requestModal.nameAr : requestModal.name}</h4>
                                <p className="text-primary text-sm">{isRTL ? requestModal.subjectAr : requestModal.subject}</p>
                            </div>
                        </div>
                        <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-6">
                            {isRTL
                                ? 'سيتم إرسال طلبك للمعلم. بمجرد قبوله، يمكنك بدء المحادثة للاتفاق على موقع ووقت اللقاء.'
                                : 'Your request will be sent to the tutor. Once accepted, you can start chatting to arrange the meeting location and time.'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setRequestModal(null)} className="flex-1 py-3 border border-[#e7d0d1] dark:border-[#3a2a2a] rounded-xl font-medium text-[#5c4545] dark:text-[#d0c0c0] hover:border-primary">
                                {isRTL ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button onClick={() => requestSession(requestModal.id)} className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover">
                                {isRTL ? 'إرسال الطلب' : 'Send Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Session Modal */}
            {cancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setCancelModal(null)}></div>
                    <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-[#1b0e0e] dark:text-white mb-4">{isRTL ? 'إلغاء الجلسة' : 'Cancel Session'}</h3>
                        <p className="text-sm text-[#5c4545] dark:text-[#d0c0c0] mb-6">
                            {isRTL
                                ? 'هل أنت متأكد من إلغاء هذه الجلسة؟ سيتم حذف جميع الرسائل المرتبطة بها.'
                                : 'Are you sure you want to cancel this session? All associated messages will be deleted.'}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setCancelModal(null)} className="flex-1 py-3 border border-[#e7d0d1] dark:border-[#3a2a2a] rounded-xl font-medium text-[#5c4545] dark:text-[#d0c0c0] hover:border-primary">
                                {isRTL ? 'الرجوع' : 'Go Back'}
                            </button>
                            <button onClick={() => cancelSession(cancelModal.id)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600">
                                {isRTL ? 'إلغاء الجلسة' : 'Cancel Session'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeerTutoring;
