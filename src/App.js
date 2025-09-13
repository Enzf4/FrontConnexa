import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import GroupChat from './pages/GroupChat';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GroupsProvider } from './contexts/GroupsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <Container fluid className="py-4">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/groups" 
            element={user ? <Groups /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/groups/create" 
            element={user ? <CreateGroup /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/groups/:id" 
            element={user ? <GroupDetails /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/groups/:id/chat" 
            element={user ? <GroupChat /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notifications" 
            element={user ? <Notifications /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <GroupsProvider>
          <AppContent />
        </GroupsProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
