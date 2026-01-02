import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { postAPI } from '../utils/api';

export default function Feed({ user = null }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadFeed();
  }, [location.key]);

  const loadFeed = async () => {
    try {
      const data = await postAPI.getFeed();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Feed</h1>
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No posts yet. Be the first to create one!
        </div>
      ) : (
        <div className="space-y-8">
          {posts
            .filter((post) => post.userId && post.userId._id && post._id)
            .map((post) => (
              <div key={post._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <Link to={`/profile/${post.userId._id}`}>
                    {post.userId.profilePicture ? (
                      <img
                        src={post.userId.profilePicture}
                        alt={post.userId.username || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {(post.userId.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </Link>
                  <Link
                    to={`/profile/${post.userId._id}`}
                    className="font-semibold text-gray-900 hover:text-gray-700"
                  >
                    {post.userId.username || 'Unknown User'}
                  </Link>
                </div>
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'Post image'}
                  className="w-full object-cover"
                />
                {post.caption && (
                  <div className="p-4">
                    <p className="text-gray-900">
                      <span className="font-semibold mr-2">{post.userId.username || 'Unknown User'}</span>
                      {post.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

