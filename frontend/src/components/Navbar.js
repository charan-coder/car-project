import { Link } from 'react-router-dom';

function Navbar({ isAuthenticated, onLogout, user }) {
  return (
    <nav className="bg-blue shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">AutoService</span>
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <Link to="/vehicles" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  My Vehicles
                </Link>
                <Link to="/bookings" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                  My Bookings
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
