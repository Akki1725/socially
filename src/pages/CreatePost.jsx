import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../utils/api';
import { uploadToCloudinary } from '../utils/cloudinary';

export default function CreatePost({ user }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(image);
      await postAPI.createPost(imageUrl, caption);
      navigate('/feed');
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100"
          />
          {image && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
            placeholder="Write a caption..."
          />
        </div>
        <button
          type="submit"
          disabled={loading || !image}
          className="w-full py-2 px-4 bg-accent text-white rounded-md hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50"
        >
          {loading ? 'Creating post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

