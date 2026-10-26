import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import DashboardLayout from './components/common/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ProfilePage from './pages/student/ProfilePage';
import SkillsPage from './pages/student/SkillsPage';
import JobsPage from './pages/student/JobsPage';
import JobDetailsPage from './pages/student/JobDetailsPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import NotificationsPage from './pages/student/NotificationsPage';
import HelpSupportPage from './pages/student/HelpSupportPage';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import PostJobPage from './pages/company/PostJobPage';
import ManageJobsPage from './pages/company/ManageJobsPage';
import ApplicantsPage from './pages/company/ApplicantsPage';
import AdminSupportPage from './pages/company/AdminSupportPage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';

// Common
import SettingsPage from './pages/common/SettingsPage';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RootRedirect = () => {
  const { isAuthenticated, isCompany, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return isCompany ? <Navigate to="/company" replace /> : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Root Dispatcher */}
            <Route path="/" element={<RootRedirect />} />

            {/* Protected Portal Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Student Routes */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/support" element={<HelpSupportPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Company / Admin Routes */}
              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/company/profile" element={<CompanyProfilePage />} />
              <Route path="/company/post-job" element={<PostJobPage />} />
              <Route path="/company/manage-jobs" element={<ManageJobsPage />} />
              <Route path="/company/applicants" element={<ApplicantsPage />} />
              <Route path="/company/applications" element={<ApplicantsPage />} />
              <Route path="/company/notifications" element={<NotificationsPage />} />
              <Route path="/company/support" element={<AdminSupportPage />} />
              <Route path="/company/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}
