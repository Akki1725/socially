import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/signup"
            element={user ? <Navigate to="/feed" /> : <SignUp onLogin={handleLogin} />}
          />
          <Route
            path="/signin"
            element={user ? <Navigate to="/feed" /> : <SignIn onLogin={handleLogin} />}
          />
          <Route
            path="/feed"
            element={user ? <Feed user={user} /> : <Navigate to="/signin" />}
          />
          <Route
            path="/profile/:userId"
            element={user ? <Profile user={user} onUserUpdate={updateUser} /> : <Navigate to="/signin" />}
          />
          <Route
            path="/create"
            element={user ? <CreatePost user={user} /> : <Navigate to="/signin" />}
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/feed" : "/signin"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

