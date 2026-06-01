import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';

import theme from './theme';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/Profile';
import StudentCandidates from './pages/student/Candidates';
import StudentElections from './pages/student/Elections';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCandidates from './pages/admin/ManageCandidates';
import ManageElections from './pages/admin/ManageElections';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Protected Portal */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/student/dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="candidates" element={<StudentCandidates />} />
                <Route path="elections" element={<StudentElections />} />
              </Route>

              {/* Admin Protected Portal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="candidates" element={<ManageCandidates />} />
                <Route path="elections" element={<ManageElections />} />
              </Route>

              {/* Catch All redirect to Landing Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
