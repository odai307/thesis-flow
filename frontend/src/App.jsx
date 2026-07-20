import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import StudentDashboard from './pages/StudentDashboard';
import ThesisWorkspace from './pages/ThesisWorkspace';
import VersionHistory from './pages/VersionHistory';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ThesisReview from './pages/ThesisReview';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import UserManagement from './pages/UserManagement';
import DepartmentManagement from './pages/DepartmentManagement';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Routes>
      {/* Public / auth */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Authenticated (all wrapped in ProtectedRoute) */}

      {/* Student */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/thesis/:id/workspace"
        element={
          <ProtectedRoute>
            <ThesisWorkspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/thesis/:id/version-history"
        element={
          <ProtectedRoute>
            <VersionHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Supervisor */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute>
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:id"
        element={
          <ProtectedRoute>
            <ThesisReview />
          </ProtectedRoute>
        }
      />

      {/* Coordinator */}
      <Route
        path="/coordinator"
        element={
          <ProtectedRoute>
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <DepartmentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
