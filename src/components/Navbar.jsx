import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/feed" className="text-2xl font-bold text-gray-900">
            Instagram
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/feed"
              className="text-gray-700 hover:text-gray-900"
            >
              Feed
            </Link>
            <Link
              to="/create"
              className="text-gray-700 hover:text-gray-900"
            >
              Create
            </Link>
            <Link
              to={`/profile/${user.id}`}
              className="text-gray-700 hover:text-gray-900"
            >
              Profile
            </Link>
            <button
              onClick={onLogout}
              className="text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

