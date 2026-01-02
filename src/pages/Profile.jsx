import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function Profile({ user: currentUser = null, onUserUpdate }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const isOwnProfile = currentUser && currentUser.id === userId;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const [userData, postsData] = await Promise.all([
        userAPI.getUser(userId),
        userAPI.getUserPosts(userId)
      ]);
      setProfileUser(userData);
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      const updatedUser = await userAPI.updateProfilePicture(userId, imageUrl);
      setProfileUser(updatedUser);
      if (isOwnProfile && onUserUpdate) {
        onUserUpdate(updatedUser);
      }
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      alert('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">User not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            {profileUser.profilePicture ? (
              <img
                src={profileUser.profilePicture}
                alt={profileUser.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-3xl font-medium">
                  {profileUser.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-accent text-white rounded-full p-2 cursor-pointer hover:bg-accent-700">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={uploading}
                  className="hidden"
                />
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </label>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{profileUser.username}</h1>
            <p className="text-gray-600 mb-4">{profileUser.email}</p>
            {isOwnProfile && (
              <div className="mb-4">
                <button
                  onClick={() => navigate('/create')}
                  className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-700 font-medium text-sm"
                >
                  Create Post
                </button>
              </div>
            )}
            <div className="text-gray-700">
              <span className="font-semibold">{posts.length}</span> posts
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white border border-gray-200 rounded-lg">
            No posts yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post._id}
                to="/feed"
                className="bg-white border border-gray-200 rounded-lg overflow-hidden aspect-square"
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

