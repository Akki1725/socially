// Code generated using Cursor AI prompt
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chatAPI } from '../utils/api';
import { getSocket } from '../utils/socket';

export default function ChatList({ user, onOpen }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadChats();
    if (onOpen) {
      onOpen();
    }
  }, [user, onOpen]);

  useEffect(() => {
    if (!user) return;
    
    const socket = getSocket();
    
    socket.on('newMessage', (data) => {
      // Update chat list when new message arrives
      setChats(prevChats => {
        const chatIndex = prevChats.findIndex(
          chat => chat._id === data.chatId
        );
        
        if (chatIndex > -1) {
          // Update existing chat
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            lastMessage: {
              text: data.message.text,
              timestamp: data.message.timestamp,
              sender: data.message.sender._id
            },
            updatedAt: data.message.timestamp
          };
          // Move to top
          const [movedChat] = updatedChats.splice(chatIndex, 1);
          return [movedChat, ...updatedChats];
        } else {
          // New chat - reload list
          loadChats();
        }
        return prevChats;
      });
    });

    return () => {
      socket.off('newMessage');
    };
  }, [user]);

  const loadChats = async () => {
    try {
      const data = await chatAPI.getChats();
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Please sign in to view chats</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      
      {chats.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
          {chats.map((chat) => (
            <Link
              key={chat._id}
              to={`/chat/${chat.otherParticipant._id}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              {chat.otherParticipant.profilePicture ? (
                <img
                  src={chat.otherParticipant.profilePicture}
                  alt={chat.otherParticipant.username}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-lg font-medium">
                    {chat.otherParticipant.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {chat.otherParticipant.username}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                {chat.lastMessage ? (
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage.text}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No messages yet</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

