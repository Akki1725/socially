import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { postAPI } from '../utils/api';
import { getSocket } from '../utils/socket';

export default function Feed({ user = null }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heartAnimations, setHeartAnimations] = useState({});
  const clickTimersRef = useRef({});
  const location = useLocation();

  useEffect(() => {
    loadFeed();
  }, [location.key]);

  useEffect(() => {
    const socket = getSocket();
    
    socket.on('postLiked', (data) => {
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post._id === data.postId) {
            return {
              ...post,
              likes: data.likes.map(likeId => ({ _id: likeId })),
              likesCount: data.likesCount
            };
          }
          return post;
        })
      );
    });

    return () => {
      socket.off('postLiked');
    };
  }, []);

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

  const handleDoubleClickLike = async (post) => {
    if (!user) {
      return;
    }

    const isLiked = post.likes && post.likes.some(like => {
      const likeId = typeof like === 'object' ? like._id : like;
      return likeId === user.id || likeId === user._id;
    });

    if (!isLiked) {
      try {
        const updatedPost = await postAPI.toggleLike(post._id);
        setPosts(posts.map(p => p._id === post._id ? updatedPost : p));
        
        // Show heart animation
        setHeartAnimations(prev => ({ ...prev, [post._id]: true }));
        setTimeout(() => {
          setHeartAnimations(prev => {
            const next = { ...prev };
            delete next[post._id];
            return next;
          });
        }, 1000);
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    }
  };

  const handleImageClick = (post) => {
    const postId = post._id;
    const timer = clickTimersRef.current[postId];

    if (timer) {
      clearTimeout(timer);
      delete clickTimersRef.current[postId];
      handleDoubleClickLike(post);
    } else {
      clickTimersRef.current[postId] = setTimeout(() => {
        delete clickTimersRef.current[postId];
      }, 300);
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
                <div className="relative flex items-center justify-center bg-gray-100">
                  <img
                    src={post.imageUrl}
                    alt={post.caption || 'Post image'}
                    className="w-full max-h-[70vh] md:max-h-[600px] object-cover cursor-pointer"
                    onClick={() => handleImageClick(post)}
                  />
                  {heartAnimations[post._id] && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg
                        className="w-20 h-20 text-white"
                        style={{ animation: 'heartFade 1s ease-out forwards' }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <button
                      onClick={async () => {
                        if (!user) {
                          alert('Sign in to like');
                          return;
                        }
                        try {
                          const updatedPost = await postAPI.toggleLike(post._id);
                          setPosts(posts.map(p => p._id === post._id ? updatedPost : p));
                        } catch (error) {
                          console.error('Failed to toggle like:', error);
                        }
                      }}
                      className="focus:outline-none"
                      title={!user ? 'Sign in to like' : ''}
                    >
                      {user && post.likes && post.likes.some(like => {
                        const likeId = typeof like === 'object' ? like._id : like;
                        return likeId === user.id || likeId === user._id;
                      }) ? (
                        <svg className="w-6 h-6 text-accent fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                    {(post.likes && post.likes.length > 0) || (post.likesCount && post.likesCount > 0) ? (
                      <span className="text-sm font-semibold text-gray-900">
                        {(post.likes?.length || post.likesCount || 0)} {(post.likes?.length || post.likesCount || 0) === 1 ? 'like' : 'likes'}
                      </span>
                    ) : null}
                  </div>
                  {post.caption && (
                    <p className="text-gray-900">
                      <span className="font-semibold mr-2">{post.userId.username || 'Unknown User'}</span>
                      {post.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

