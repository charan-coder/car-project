import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Components
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import VehicleList from './components/vehicles/VehicleList';
import BookingForm from './components/bookings/BookingForm';
import BookingList from './components/bookings/BookingList';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} user={user} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Dashboard user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/vehicles"
              element={
                isAuthenticated ? (
                  <VehicleList />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/bookings/new"
              element={
                isAuthenticated ? (
                  <BookingForm />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/bookings"
              element={
                isAuthenticated ? (
                  <BookingList />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                isAuthenticated && user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
