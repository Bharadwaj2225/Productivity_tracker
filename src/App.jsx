
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>TaskFlow Pro - Ultimate Productivity Tracker</title>
        <meta name="description" content="Boost your productivity with TaskFlow Pro - the ultimate task and time tracking application with analytics and reporting." />
      </Helmet>
      
      <div className="min-h-screen">
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
        <Toaster />
      </div>
    </>
  );
}

export default App;
