import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';

export default function FindPeople({ user }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      const data = await userAPI.getAllUsers();
      // Filter out current user
      const filteredUsers = data.filter(u => u._id !== user.id && u._id !== user._id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find People</h1>
      
      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>No other users found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((person) => (
            <div
              key={person._id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
            >
              {person.profilePicture ? (
                <img
                  src={person.profilePicture}
                  alt={person.username}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-lg font-medium">
                    {person.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {person.username}
                </h3>
              </div>
              <button
                onClick={() => handleMessage(person._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium text-sm whitespace-nowrap transition-colors"
              >
                Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

