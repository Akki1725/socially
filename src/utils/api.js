const API_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const authAPI = {
  signup: async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sign up failed');
    }
    return response.json();
  },

  signin: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Sign in failed');
    }
    return response.json();
  }
};

export const userAPI = {
  getUser: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  updateProfilePicture: async (userId, profilePicture) => {
    const response = await fetch(`${API_URL}/users/${userId}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ profilePicture })
    });
    if (!response.ok) {
      throw new Error('Failed to update profile picture');
    }
    return response.json();
  },

  getUserPosts: async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  }
};

export const postAPI = {
  createPost: async (imageUrl, caption) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageUrl, caption })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create post');
    }
    return response.json();
  },

  getFeed: async () => {
    const response = await fetch(`${API_URL}/posts/feed`);
    if (!response.ok) {
      throw new Error('Failed to fetch feed');
    }
    return response.json();
  }
};

