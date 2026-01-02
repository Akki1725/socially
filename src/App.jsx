import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import ChatList from './pages/ChatList';
import ChatScreen from './pages/ChatScreen';
import FindPeople from './pages/FindPeople';
import Navbar from './components/Navbar';
import { getSocket } from './utils/socket';

function AppContent({ user, onLogin, onLogout, onUserUpdate }) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    if (!location.pathname.startsWith('/chat/')) {
      setActiveChatId(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setActiveChatId(null);
      return;
    }

    const socket = getSocket();
    
    const handleNewMessage = (data) => {
      const userIdStr = user.id || user._id;
      const participants = data.participants.map(p => p.toString());
      
      if (participants.includes(userIdStr)) {
        const messageSenderId = data.message.sender._id || data.message.sender;
        if (messageSenderId.toString() !== userIdStr) {
          const incomingChatId = data.chatId.toString();
          if (incomingChatId !== activeChatId) {
            setUnreadCount(prev => prev + 1);
          }
        }
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [user, activeChatId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} unreadCount={unreadCount} onMessagesOpen={() => setUnreadCount(0)} />
      <Routes>
        <Route
          path="/signup"
          element={user ? <Navigate to="/feed" /> : <SignUp onLogin={onLogin} />}
        />
        <Route
          path="/signin"
          element={user ? <Navigate to="/feed" /> : <SignIn onLogin={onLogin} />}
        />
        <Route
          path="/feed"
          element={<Feed user={user} />}
        />
        <Route
          path="/profile/:userId"
          element={<Profile user={user} onUserUpdate={onUserUpdate} />}
        />
        <Route
          path="/create"
          element={user ? <CreatePost user={user} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/chats"
          element={user ? <ChatList user={user} onOpen={() => setUnreadCount(0)} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/chat/:otherUserId"
          element={user ? <ChatScreen user={user} onChatLoad={(chatId) => { setActiveChatId(chatId); setUnreadCount(0); }} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/find-people"
          element={user ? <FindPeople user={user} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/"
          element={<Navigate to="/feed" />}
        />
      </Routes>
    </div>
  );
}

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
      <AppContent user={user} onLogin={handleLogin} onLogout={handleLogout} onUserUpdate={updateUser} />
    </Router>
  );
}

export default App;

