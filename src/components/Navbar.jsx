import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/feed" className="text-2xl font-bold text-gray-900">
            Socially
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/feed"
              className="text-gray-700 hover:text-gray-900"
            >
              Feed
            </Link>
            {user ? (
              <>
                <Link
                  to="/create"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm"
                >
                  Create
                </Link>
                <button
                  onClick={onLogout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
                <Link
                  to={`/profile/${user.id}`}
                  className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300 hover:opacity-80"
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-xs font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 font-medium">
                    {user.username}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

