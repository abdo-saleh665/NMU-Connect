import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import ToastContainer from './components/Toast';
import NotificationToast from './components/NotificationToast';
import SocketNotificationBridge from './components/SocketNotificationBridge';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminAccounts from './pages/AdminAccounts';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyClasses from './pages/FacultyClasses';
import FacultyAppointments from './pages/FacultyAppointments';
import FacultyStudents from './pages/FacultyStudents';
import FacultyComplaints from './pages/FacultyComplaints';
import ComplaintsBoard from './pages/ComplaintsBoard';
import Appointment from './pages/Appointment';
import PeerTutoring from './pages/PeerTutoring';
import Events from './pages/Events';
import LostAndFound from './pages/LostAndFound';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <DarkModeProvider>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider>
                <NotificationProvider>
                  <BrowserRouter>
                    <ToastContainer />
                    <NotificationToast />
                    <SocketNotificationBridge />
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={
                        <PublicRoute>
                          <LoginPage />
                        </PublicRoute>
                      } />
                      <Route path="/login" element={
                        <PublicRoute>
                          <LoginPage />
                        </PublicRoute>
                      } />

                      {/* Student Routes */}
                      <Route path="/student" element={
                        <ProtectedRoute allowedRoles="student">
                          <StudentDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/complaints" element={
                        <ProtectedRoute allowedRoles="student">
                          <ComplaintsBoard />
                        </ProtectedRoute>
                      } />
                      <Route path="/appointment" element={
                        <ProtectedRoute allowedRoles="student">
                          <Appointment />
                        </ProtectedRoute>
                      } />
                      <Route path="/tutoring" element={
                        <ProtectedRoute allowedRoles="student">
                          <PeerTutoring />
                        </ProtectedRoute>
                      } />
                      <Route path="/events" element={
                        <ProtectedRoute allowedRoles="student">
                          <Events />
                        </ProtectedRoute>
                      } />
                      <Route path="/lost-found" element={
                        <ProtectedRoute allowedRoles="student">
                          <LostAndFound />
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute allowedRoles="student">
                          <SettingsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute allowedRoles="student">
                          <ProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="/chat" element={
                        <ProtectedRoute allowedRoles="student">
                          <ChatPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/chat/:conversationId" element={
                        <ProtectedRoute allowedRoles="student">
                          <ChatPage />
                        </ProtectedRoute>
                      } />

                      {/* Faculty Routes */}
                      <Route path="/faculty" element={
                        <ProtectedRoute allowedRoles="faculty">
                          <FacultyDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/faculty/classes" element={
                        <ProtectedRoute allowedRoles="faculty">
                          <FacultyClasses />
                        </ProtectedRoute>
                      } />
                      <Route path="/faculty/appointments" element={
                        <ProtectedRoute allowedRoles="faculty">
                          <FacultyAppointments />
                        </ProtectedRoute>
                      } />
                      <Route path="/faculty/students" element={
                        <ProtectedRoute allowedRoles="faculty">
                          <FacultyStudents />
                        </ProtectedRoute>
                      } />
                      <Route path="/faculty/complaints" element={
                        <ProtectedRoute allowedRoles="faculty">
                          <FacultyComplaints />
                        </ProtectedRoute>
                      } />
                      <Route path="/faculty/settings" element={
                        <ProtectedRoute allowedRoles="faculty">
                          <SettingsPage portalType="faculty" />
                        </ProtectedRoute>
                      } />
                      <Route path="/faculty/profile" element={
                        <ProtectedRoute allowedRoles="faculty">
                          <ProfilePage portalType="faculty" />
                        </ProtectedRoute>
                      } />
                      <Route path="/faculty/chat" element={
                        <ProtectedRoute allowedRoles="faculty">
                          <ChatPage portalType="faculty" />
                        </ProtectedRoute>
                      } />

                      {/* Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/accounts" element={
                        <ProtectedRoute allowedRoles="admin">
                          <AdminAccounts />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/settings" element={
                        <ProtectedRoute allowedRoles="admin">
                          <SettingsPage portalType="admin" />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/profile" element={
                        <ProtectedRoute allowedRoles="admin">
                          <ProfilePage portalType="admin" />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/chat" element={
                        <ProtectedRoute allowedRoles="admin">
                          <ChatPage portalType="admin" />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </BrowserRouter>
                </NotificationProvider>
              </ToastProvider>
            </SocketProvider>
          </AuthProvider>
        </DarkModeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;



